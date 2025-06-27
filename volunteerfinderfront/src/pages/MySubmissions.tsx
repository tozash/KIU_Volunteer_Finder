import { useEffect, useState } from 'react'
import { useToast } from '@/components/common/Toast'
import { useAuth } from '@/lib/useAuth'
import { api, type Application, type Event } from '@/lib/api'
import SubmissionCard from '@/components/event/SubmissionCard'

const MySubmissions = () => {
  const { user } = useAuth()
  const addToast = useToast()
  const [applications, setApplications] = useState<(Application & { event: Event })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) return
      try {
        const apps = await api.getMySubmissions(String(user.user_id))
        const withEvents = await Promise.all(
          apps.map(async (app) => ({
            ...app,
            event: await api.getEvent(app.event_id),
          }))
        )
        setApplications(withEvents)
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
      setApplications((applications) =>
        applications.map((app) =>
          app.application_id === id ? { ...app, status: 'canceled' } : app
        )
      )
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
      <div className="space-y-4">
        {applications.map((app) => (
          <SubmissionCard
            key={app.application_id}
            event={app.event}
            status={app.status}
            applicationId={app.application_id}
            onCancel={() => cancel(app.application_id)}
          />
        ))}
      </div>
    </div>
  )
}

export default MySubmissions
