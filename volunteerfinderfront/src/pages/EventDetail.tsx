import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import ApplicationModal from '@/components/event/ApplicationModal'
import { dummyEvents, Event } from '@/lib/dummyData'

const fetchEvent = async (id: number): Promise<Event | undefined> => {
  return dummyEvents.find((e) => e.id === id)
}

const renderMarkdown = (md: string) => {
  const escaped = md.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  const withItalic = withBold.replace(/\*(.+?)\*/g, '<em>$1</em>')
  return withItalic
    .split(/\n{2,}/)
    .map((p) => `<p>${p}</p>`) // naive paragraphs
    .join('')
}

const EventDetail = () => {
  const { id } = useParams()
  const eventId = Number(id)
  const [open, setOpen] = useState(false)
  const { data: event } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId),
  })

  if (!event) return <div>Event not found</div>

  return (
    <div>
      <img
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-64 object-cover"
      />
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-1">{event.title}</h1>
        <p className="text-gray-500 mb-4">
          {event.date} • {event.location}
        </p>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(event.description) }}
        />
        {event.status === 'open' && (
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setOpen(true)}
          >
            Register as Volunteer
          </button>
        )}
        <ApplicationModal
          open={open}
          onClose={() => setOpen(false)}
          eventId={event.id}
          questions={event.questions}
        />
        <Link
          to={`/edit-event/${event.id}`}
          className="inline-block mt-4 text-blue-600"
        >
          Edit Event
        </Link>
      </div>
    </div>
  )
}

export default EventDetail
