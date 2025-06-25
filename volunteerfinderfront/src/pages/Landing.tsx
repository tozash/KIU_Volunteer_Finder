import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import EventCard from '@/components/event/EventCard'
import useDebounce from '@/lib/useDebounce'

interface Event {
  id: number
  title: string
  date: string
  location: string
  imageUrl: string
  status: 'open' | 'closed'
}

const fetchEvents = async (search: string): Promise<Event[]> => {
  const res = await fetch(`/events?search=${encodeURIComponent(search)}`)
  if (!res.ok) throw new Error('Failed to fetch events')
  return res.json()
}

const Landing = () => {
  const [search, setSearch] = useState('')
  const debounced = useDebounce(search, 300)

  const { data: events = [] } = useQuery({
    queryKey: ['events', debounced],
    queryFn: () => fetchEvents(debounced),
  })

  return (
    <div className="p-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search events"
        aria-label="Search events"
        className="border p-2 rounded w-full md:w-1/2 mb-4"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        <div className="flex items-center justify-center border-2 border-dashed rounded p-4 cursor-pointer hover:bg-gray-50">
          <span className="text-blue-600 font-medium">+ Create Event</span>
        </div>
      </div>
    </div>
  )
}

export default Landing
