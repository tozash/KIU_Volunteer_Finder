import { Link } from 'react-router-dom'
import { dummyEvents } from '@/lib/dummyData'

const MyEvents = () => (
  <div className="p-4 max-w-screen-lg mx-auto">
    <h1 className="text-xl font-bold mb-2">My Events</h1>
    <ul className="space-y-4">
      {dummyEvents.map((event) => (
        <li key={event.id} className="border rounded p-4">
          <h2 className="font-semibold">{event.title}</h2>
          <p className="text-sm text-gray-500">
            {event.date} • {event.location}
          </p>
          <div className="mt-2 flex gap-2">
            <Link
              to={`/edit-event/${event.id}`}
              className="btn-primary px-2 py-1"
            >
              Manage Event
            </Link>
            <Link
              to={`/events/${event.id}/volunteers`}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              Manage Volunteers
            </Link>
          </div>
        </li>
      ))}
    </ul>
  </div>
)

export default MyEvents
