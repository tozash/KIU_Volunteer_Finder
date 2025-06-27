import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SearchInput from '@/components/common/SearchInput'
import EventCard from '@/components/event/EventCard'
import CreateEventCard from '@/components/event/CreateEventCard'
import useDebounce from '@/lib/useDebounce'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api, type Event } from '@/lib/api'

const fetchEvents = async (): Promise<Event[]> => {
  const res = await fetch(`/api/events/loadMany`)//this mistake was done on purpose
  return res.json()
}

const Landing = () => {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('q') ?? '')
  const [category, setCategory] = useState(params.get('category') ?? '')
  const debounced = useDebounce(search, 300)

  useEffect(() => {
    const p = new URLSearchParams(params)
    if (debounced) p.set('q', debounced)
    else p.delete('q')
    if (category) p.set('category', category)
    else p.delete('category')
    setParams(p, { replace: true })
  }, [debounced, category])

  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events', debounced, category],
    queryFn: () => fetchEvents(),
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
      <section className="py-10 text-center space-y-2">
        <h1 className="text-3xl font-bold">Volunteer opportunities, simplified.</h1>
        <p className="text-gray-600">Find, join and create volunteer events near you.</p>
        <div className="hidden lg:flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            className="w-full max-w-lg mx-auto"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-primary w-full sm:w-48"
          >
            <option value="">All categories</option>
            <option value="Community">Community</option>
            <option value="Animals">Animals</option>
            <option value="Education">Education</option>
            <option value="Environment">Environment</option>
            <option value="Health">Health</option>
          </select>
        </div>
      </section>
      <CreateEventCard />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      
        {Array.isArray(events) && events.length > 0 ? (
          events.map((event: Event) => (
            <EventCard event={event} key={event.event_id} />
          ))
        ) : (
          <div className="col-span-full bg-white p-8 rounded-xl text-center shadow">
            <p className="mb-2">No events found.</p>
            <p>
              Try adjusting your filters or{' '}
              <Link to="/create-event" className="text-primary hover:underline">
                post a new event
              </Link>
              .
            </p>
          </div>
        )}
        
      </div>
    </div>
  )
}

export default Landing
