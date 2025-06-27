import { Link } from 'react-router-dom'

interface Event {
  event_id: string
  org_title: string
  start_date: string
  end_date: string
  city: string
  region: string
  country: string
  image_url: string
  description: string
  category: string
  volunteer_form: string[]
  // hits: number
}

type Props = {
  event: Event
}

const EventCard = ({ event }: Props) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Determine status based on dates (simplified logic)
  const getStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (now < start) return 'open'
    if (now > end) return 'closed'
    return 'open'
  }

  const status = getStatus(event.start_date, event.end_date)
  const statusClasses = {
    open: 'bg-primary text-white',
    closed: 'bg-gray-400 text-white',
    full: 'bg-accent text-white',
  } as const

  return (
    <Link
      to={`/events/${event.event_id}`}
      className="group block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <img
          src={event.image_url}
          alt={event.org_title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <span
          className={`absolute top-2 left-2 ${statusClasses[status]} text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide`}
        >
          {status === 'open' ? 'OPEN' : status === 'closed' ? 'CLOSED' : 'FULL'}
        </span>
      </div>
      <div className="p-4">

        <h4 className="font-semibold text-xl line-clamp-2">{event.org_title}</h4>
        <div className="mt-1 text-sm">
          <span className="font-medium">{formatDate(event.start_date)}</span>
          <span className="block font-normal">{event.city}, {event.region}, {event.country}</span>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
