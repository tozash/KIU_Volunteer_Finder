import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import VolunteerCard from '@/components/event/VolunteerCard'
import { api, type Application, type Event } from '@/lib/api'
import { useToast } from '@/components/common/Toast'

const fetchApplications = async (eventId: string): Promise<Application[]> => {
  try {
    return await api.getVolunteersByEvent(eventId)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return []
  }
}

const Volunteers = () => {
  const { id } = useParams()
  const eventId = id!
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState<'name' | 'status'>('name')
  const addToast = useToast()
  const [questions, setQuestions] = useState<string[]>([])

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const event: Event = await api.getEvent(eventId)
        setQuestions(event.volunteer_form || [])
      } catch (e) {
        setQuestions([])
      }
    }
    fetchEvent()
  }, [eventId])

  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['applications', eventId],
    queryFn: () => fetchApplications(eventId),
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
