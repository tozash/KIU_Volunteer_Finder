
import { Link } from 'react-router-dom'
interface Event {
  id: number
  title: string
  date: string
  location: string
  imageUrl: string
  status: 'open' | 'closed'
}

type Props = {
  event: Event
}

const EventCard = ({ event }: Props) => (
  <Link
    to={`/events/${event.id}`}
    className="relative border rounded overflow-hidden shadow-sm block hover:bg-gray-50"
  >
    <img
      src={event.imageUrl}
      alt={event.title}
      className="w-full h-48 object-cover"
    />
    <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
      {event.status === 'open' ? 'Open' : 'Closed'}
    </span>
    <div className="p-4">
      <h3 className="font-semibold text-lg">{event.title}</h3>
      <p className="text-sm text-gray-500">
        {event.date} • {event.location}
      </p>
    </div>
  </Link>

)

export default EventCard
