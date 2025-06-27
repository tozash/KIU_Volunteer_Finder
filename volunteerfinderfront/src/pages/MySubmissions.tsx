import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '@/components/common/Toast'
import { useAuth } from '@/lib/useAuth'
import { api, type Application } from '@/lib/api'

const MySubmissions = () => {
  const { user } = useAuth()
  const addToast = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) return;
      try {
        const apps = await api.getMySubmissions(String(user.user_id))
        setApplications(apps)
      } catch (err) {
        setError('Failed to load submissions')
      } finally {
        setLoading(false)
      }
    }
    fetchSubmissions()
  }, [user])

  const cancel = async (id: string) => {
    try {
      await api.updateApplicationStatus(id, 'canceled')
      addToast('Application canceled')
      setApplications(applications => applications.map(app =>
        app.application_id === id ? { ...app, status: 'canceled' } : app
      ))
    } catch (error) {
      addToast('Failed to cancel application. Please try again.')
    }
  }

  if (loading) {
    return <div className="p-4 max-w-screen-lg mx-auto">Loading your submissions...</div>
  }

  if (error) {
    return <div className="p-4 max-w-screen-lg mx-auto text-red-600">{error}</div>
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
