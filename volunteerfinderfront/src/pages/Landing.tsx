import { useState } from 'react'
import EventCard from '@/components/event/EventCard'
import CreateEventCard from '@/components/event/CreateEventCard'
import useDebounce from '@/lib/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api, type Event } from '@/lib/api'

const fetchEvents = async (search: string): Promise<Event[]> => {
  try {
    const events = await api.getEvents()
    if (search) {
      return events.filter(event => 
        event.org_title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase()) ||
        event.city.toLowerCase().includes(search.toLowerCase())
      )
    }
    return events
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
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
        {events.map((event: Event) => (
          <EventCard event={event} key={event.event_id} />
        ))}
        <CreateEventCard />
      </div>
    </div>
  )
}

export default Landing
