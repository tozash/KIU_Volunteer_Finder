import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import type { Event } from '@/lib/api'
import { useAuth } from '@/lib/useAuth'

const MyEvents = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      try {
        const allEvents = await api.getEvents(String(user.id))
        setEvents(allEvents)
      } catch (err) {
        setError('Failed to load events')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [user])

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-xl font-bold mb-2">My Events</h1>
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event.event_id} className="border rounded p-4">
            <h2 className="font-semibold">{event.org_title || event.category}</h2>
            <p className="text-sm text-gray-500">
              {event.start_date} • {event.city}
            </p>
            <div className="mt-2 flex gap-2">
              <Link
                to={`/edit-event/${event.event_id}`}
                className="btn-primary px-2 py-1"
              >
                Manage Event
              </Link>
              <Link
                to={`/events/${event.event_id}/volunteers`}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                Manage Volunteers
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MyEvents
