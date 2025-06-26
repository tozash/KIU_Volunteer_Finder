import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/components/common/Toast'

import { api, type Application, type Event } from '@/lib/api'

const fetchMyApplications = async (): Promise<Application[]> => {
  try {
    const applications = await api.getApplications()
    // For now, filter by a dummy user ID - in a real app this would come from auth context
    const dummyUserId = 'dummy-user-id'
    return applications.filter(app => app.user_id === dummyUserId)
  } catch (error) {
    console.error('Error fetching applications:', error)
    return []
  }
}

const fetchEvent = async (eventId: string): Promise<Event> => {
  return api.getEvent(eventId)
}

const MySubmissions = () => {
  const addToast = useToast()

  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['my-applications'],
    queryFn: fetchMyApplications,
  })

  const cancel = async (id: string) => {
    try {
      await api.updateApplicationStatus(id, 'canceled')
      addToast('Application canceled')
      // Refetch applications to get updated data
      window.location.reload()
    } catch (error) {
      console.error('Error canceling application:', error)
      addToast('Failed to cancel application. Please try again.')
    }
  }

  if (isLoading) {
    return <div className="p-4 max-w-screen-lg mx-auto">Loading your submissions...</div>
  }

  if (error) {
    return <div className="p-4 max-w-screen-lg mx-auto text-red-600">Error loading submissions. Please try again later.</div>
  }

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-xl font-bold mb-2">My Submissions</h1>
      <ul className="space-y-4">
        {applications.map((app) => (
          <li key={app.application_id} className="border rounded p-4">
            <h2 className="font-semibold">Application {app.application_id}</h2>
            <p className="text-sm text-gray-500">Status: {app.status}</p>
            <p className="text-sm text-gray-500">Event ID: {app.event_id}</p>
            <div className="mt-2 flex gap-2">
              <Link
                to={`/events/${app.event_id}`}
                className="btn-primary px-2 py-1"
              >
                View Event
              </Link>
              {app.status !== 'canceled' && (
                <button
                  onClick={() => cancel(app.application_id)}
                  className="px-2 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MySubmissions
