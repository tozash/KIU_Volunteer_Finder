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
    open: 'badge-Open',
    closed: 'badge-Closed',
    full: 'badge-Full',
  } as const

  return (
    <Link
      to={`/events/${event.event_id}`}
      className="block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative overflow-hidden">
        <img
          src={event.image_url}
          alt={event.org_title}
          className="w-full h-40 object-cover rounded-t-2xl transition-transform duration-200 hover:scale-105"
        />
        <span className={`absolute top-2 left-2 ${statusClasses[status]}`}>
          {status === 'open' ? 'Open' : status === 'closed' ? 'Closed' : 'Full'}
        </span>
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-xl line-clamp-2">{event.org_title}</h4>
        <div className="mt-1 text-sm">
          <span className="font-medium">{formatDate(event.start_date)}</span>
          <span className="block font-normal">{event.city}, {event.region}</span>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
