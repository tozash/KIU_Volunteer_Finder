import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import VolunteerCard from '@/components/event/VolunteerCard'
import { api, type Application, type Event } from '@/lib/api'
import { useToast } from '@/components/common/Toast'

const fetchApplications = async (applicationIds: string[]): Promise<Application[]> => {
  try {
    const applications: Application[] = []
    
    for (const appId of applicationIds) {
      try {
        const application = await api.loadApplication(appId)
        applications.push(application)
      } catch (error) {
        console.error(`Error loading application ${appId}:`, error)
        // Continue with other applications even if one fails
      }
    }
    
    return applications
  } catch (error) {
    console.error('Error fetching applications:', error)
    return []
  }
}

const Volunteers = () => {
  const { id } = useParams()
  const entityId = id!
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState<'name' | 'status'>('name')
  const addToast = useToast()
  const queryClient = useQueryClient()
  
  // State for questions and application IDs
  const [questions, setQuestions] = useState<string[]>([])
  const [applicationIds, setApplicationIds] = useState<string[]>([])

  // Fetch event data to get questions and application IDs
  useEffect(() => {
    const fetchEvent = async () => {
      if (!entityId) return;
      try {
        console.log('🔍 Fetching event with entityId:', entityId)
        const event: Event = await api.getEvent(entityId)
        console.log('📊 Event data received:', event)
        console.log('❓ Event volunteer_form:', event.volunteer_form)
        console.log('📝 Event keys:', Object.keys(event))
        
        // Set questions from event volunteer form
        setQuestions(event.volunteer_form || [])
        
        // Extract application IDs from the event
        const appIds = event.applications || []
        console.log('📋 Application IDs found:', appIds)
        console.log('📊 Number of applications:', appIds.length)
        setApplicationIds(appIds)
      } catch (e) {
        console.error('❌ Error fetching event:', e)
        console.log('🔧 EntityId that failed:', entityId)
        setQuestions([])
        setApplicationIds([])
      }
    }
    fetchEvent()
  }, [entityId])

  // Fetch applications using React Query
  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['applications', applicationIds],
    queryFn: () => fetchApplications(applicationIds),
    enabled: applicationIds.length > 0, // Only run query if we have application IDs
  })

  // Update application status
  const updateStatus = async (
    appId: string,
    status: 'accepted' | 'denied' | 'canceled',
  ) => {
    try {
      await api.updateApplicationStatus(appId, status)
      addToast(`Application ${status}`)
      
      // Invalidate and refetch the applications query
      queryClient.invalidateQueries(['applications', applications])
    } catch (error) {
      console.error('Error updating application status:', error)
      addToast('Failed to update status. Please try again.')
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 max-w-screen-lg mx-auto">
        <div className="text-center">Loading volunteers...</div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 max-w-screen-lg mx-auto text-red-600">
        <div className="text-center">Error loading volunteers. Please try again later.</div>
      </div>
    )
  }

  // No applications state
  if (applications.length === 0 && applicationIds.length === 0) {
    return (
      <div className="p-4 max-w-screen-lg mx-auto">
        <h1 className="text-xl font-bold mb-2">Volunteers</h1>
        <div className="text-center text-gray-500 py-8">
          No volunteer applications found for this event.
        </div>
      </div>
    )
  }

  // Filter applications by status
  const filtered = applications.filter(
    (a) => statusFilter === 'all' || a.status === statusFilter,
  )

  // Sort applications
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'name') {
      // Sort by application ID since we don't have names
      return a.application_id.localeCompare(b.application_id)
    }
    // Sort by status
    return a.status.localeCompare(b.status)
  })

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Volunteers</h1>
        <div className="text-sm text-gray-600">
          {applications.length} total applications
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-primary w-40"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="denied">Denied</option>
          <option value="canceled">Canceled</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'name' | 'status')}
          className="input-primary w-40"
        >
          <option value="name">Sort by ID</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Applications List */}
      {sorted.length > 0 ? (
        <div className="space-y-3">
          {sorted.map((app) => (
            <VolunteerCard
              key={app.application_id}
              application={app}
              questions={questions}
              onStatusChange={updateStatus}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          No applications match the current filter.
        </div>
      )}
    </div>
  )
}

export default Volunteers