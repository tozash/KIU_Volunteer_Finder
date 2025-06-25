
import { Link } from 'react-router-dom'
interface Event {
  id: number
  title: string
  date: string
  location: string
  imageUrl: string
  status: 'open' | 'closed' | 'full'
}

type Props = {
  event: Event
}

const statusClasses = {
  open: 'bg-primary',
  closed: 'bg-gray-400',
  full: 'bg-accent',
} as const

const EventCard = ({ event }: Props) => (
  <Link
    to={`/events/${event.id}`}
    className="block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
  >
    <div className="relative overflow-hidden">
      <img
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-40 object-cover rounded-t-2xl transition-transform duration-200 hover:scale-105"
      />
      <span
        className={`absolute top-2 left-2 text-xs text-white px-2 py-1 rounded ${statusClasses[event.status]}`}
      >
        {event.status === 'open'
          ? 'Open'
          : event.status === 'closed'
            ? 'Closed'
            : 'Full'}
      </span>
    </div>
    <div className="p-4">
      <h4 className="font-semibold text-lg line-clamp-2">{event.title}</h4>
      <div className="mt-1 text-sm">
        <span className="font-medium">{event.date}</span>
        <span className="block font-normal">{event.location}</span>
      </div>
    </div>
  </Link>
)

export default EventCard
