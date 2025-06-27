import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'

import ApplicationModal from '@/components/event/ApplicationModal'
import { api, type Event } from '@/lib/api'

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
  const eventId = String(id!)
  const [open, setOpen] = useState(false)
  
  // Fixed: Use the proper API call instead of hardcoded fetch
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => api.getEvent(eventId),
  })

  if (isLoading) {
    return <div className="text-center p-8">Loading event...</div>
  }

  if (error || !event) {
    return <div className="text-center p-8 text-red-600">Event not found</div>
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Determine status based on dates
  const getStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (now < start) return 'open'
    if (now > end) return 'closed'
    return 'open'
  }

  const status = getStatus(event.start_date, event.end_date)

  return (
    <div>
      <img
        src={event.image_url}
        alt={event.org_title}
        className="w-full h-64 object-cover"
      />
      <div className="max-w-screen-lg mx-auto p-4">
        <h1 className="text-2xl font-bold mb-1">{event.org_title}</h1>
        <p className="text-gray-500 mb-4">
          {formatDate(event.start_date)} • {event.city}, {event.region}, {event.country}
        </p>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(event.description) }}
        />
        {status === 'open' && (
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
          eventId={event.event_id}
          questions={event.volunteer_form}
        />
        <Link
          to={`/edit-event/${event.event_id}`}
          className="inline-block mt-4 text-blue-600"
        >
          Edit Event
        </Link>
        <Link
          to={`/events/${event.event_id}/volunteers`}
          className="inline-block mt-4 ml-4 text-green-600"
        >
          View Volunteers
        </Link>
      </div>
    </div>
  )
}

export default EventDetail