import { useState } from 'react'
import EventCard from '@/components/event/EventCard'
import CreateEventCard from '@/components/event/CreateEventCard'
import useDebounce from '@/lib/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api, type Event } from '@/lib/api'

const fetchEvents = async (search: string): Promise<Event[]> => {
  const res = await fetch(`/api/events/loadManya`)//this mistake was done on purpose
  return res.json()
}

const Landing = () => {
  const [params] = useSearchParams()
  const search = params.get('search') ?? ''
  const debounced = useDebounce(search, 300)

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events', debounced],
    queryFn: () => fetchEvents(debounced),
  })

  if (isLoading) {
    return (
      <div className="px-8 py-16 max-w-screen-xl mx-auto">
        <div className="text-center">Loading events...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-8 py-16 max-w-screen-xl mx-auto">
        <div className="text-center text-red-600">Error loading events. Please try again later.</div>
      </div>
    )
  }

  return (
    <div className="px-8 py-16 max-w-screen-xl mx-auto flex flex-col gap-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.isArray(events) && events.map((event: Event) => (
          <EventCard event={event} key={event.event_id} />
        ))}
        <CreateEventCard />
      </div>
    </div>
  )
}

export default Landing
