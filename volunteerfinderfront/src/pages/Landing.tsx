
import { useState } from 'react'
import EventCard from '@/components/event/EventCard'
import useDebounce from '@/lib/useDebounce'
import type { Event } from '@/lib/dummyData'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'



const fetchEvents = async (search: string): Promise<Event[]> => {
  const res = await fetch(`/events?search=${encodeURIComponent(search)}`)
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
    <div className="p-4 max-w-screen-lg mx-auto">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search events"
        aria-label="Search events"
        className="border p-2 rounded w-full md:w-1/2 mb-4"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event: Event) => (
          <Link to={`/events/${event.id}`} key={event.id}>
            <EventCard event={event} />
          </Link>
        ))}
        <Link
          to="/create-event"
          className="flex items-center justify-center border-2 border-dashed rounded p-4 cursor-pointer hover:bg-gray-50"
        >
          <span className="text-blue-600 font-medium">+ Create Event</span>
        </Link>
      </div>
    </div>
  )
}

export default Landing
