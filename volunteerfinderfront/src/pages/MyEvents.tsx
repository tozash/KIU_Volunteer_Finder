import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { Event } from '@/lib/api'
import MyEventCard from '@/components/event/MyEventCard'
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
        const allEvents = await api.getEvents(String(user.user_id))
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
      <div className="space-y-4">
        {events.map((event) => (
          <MyEventCard key={event.event_id} event={event} />
        ))}
      </div>
    </div>
  )
}

export default MyEvents
