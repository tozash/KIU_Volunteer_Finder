
import { useState } from 'react'
import EventCard from '@/components/event/EventCard'
import CreateEventCard from '@/components/event/CreateEventCard'
import useDebounce from '@/lib/useDebounce'
import type { Event } from '@/lib/dummyData'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'



const fetchEvents = async (search: string): Promise<Event[]> => {
  const res = await fetch(`/events?search=${encodeURIComponent(search)}`)
  return res.json()
}

const Landing = () => {
  const [params] = useSearchParams()
  const search = params.get('search') ?? ''
  const debounced = useDebounce(search, 300)

  const { data: events = [] } = useQuery({
    queryKey: ['events', debounced],
    queryFn: () => fetchEvents(debounced),
  })


  return (
    <div className="px-8 py-16 max-w-screen-xl mx-auto flex flex-col gap-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event: Event) => (
          <EventCard event={event} key={event.id} />
        ))}
        <CreateEventCard />
      </div>
    </div>
  )
}

export default Landing
