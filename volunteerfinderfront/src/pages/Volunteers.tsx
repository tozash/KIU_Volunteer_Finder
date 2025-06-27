import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

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
  const [questions, setQuestions] = useState<string[]>([])

  const [applicationIds, setApplicationIds] = useState<string[]>([])

  useEffect(() => {
    const fetchEvent = async () => {
      if (!entityId) return;
      try {
        console.log('🔍 Fetching event with entityId:', entityId)
        const event: Event = await api.getEvent(entityId)
        console.log('📊 Event data received:', event)
        console.log('❓ Event volunteer_form:', event.volunteer_form)
        console.log('📝 Event keys:', Object.keys(event))
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

  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['applications', applicationIds],
    queryFn: () => fetchApplications(applicationIds),
    enabled: applicationIds.length > 0, // Only run query if we have application IDs
  })

  const updateStatus = async (
    appId: string,
    status: 'accepted' | 'denied' | 'canceled',
  ) => {
    try {
      await api.updateApplicationStatus(appId, status)
      addToast(`Marked as ${status}`)
      // Refetch applications to get updated data
      window.location.reload()
    } catch (error) {
      console.error('Error updating application status:', error)
      addToast('Failed to update status. Please try again.')
    }
  }

  if (isLoading) {
    return <div className="p-4 max-w-screen-lg mx-auto">Loading volunteers...</div>
  }

  if (error) {
    return <div className="p-4 max-w-screen-lg mx-auto text-red-600">Error loading volunteers. Please try again later.</div>
  }

  const filtered = applications.filter(
    (a) => statusFilter === 'all' || a.status === statusFilter,
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'name') {
      // Since we don't have name in the API response, we'll sort by ID
      return a.application_id.localeCompare(b.application_id)
    }
    return a.status.localeCompare(b.status)
  })

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-xl font-bold mb-2">Volunteers</h1>
      <div className="flex gap-2 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-primary w-40"
        >
          <option value="all">All</option>
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
      <div className="space-y-2">
        {sorted.map((app) => (
          <VolunteerCard
            key={app.application_id}
            application={app}
            questions={questions}
            onStatusChange={updateStatus}
          />
        ))}
      </div>
    </div>
  )
}

export default Volunteers