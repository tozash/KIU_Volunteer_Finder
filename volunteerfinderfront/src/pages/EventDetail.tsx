import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import ApplicationModal from '@/components/event/ApplicationModal'
import { api, type Event } from '@/lib/api'
import { useAuth } from '@/lib/useAuth'

const clsx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(' ')

const icons = {
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s7-7.5 7-12a7 7 0 10-14 0c0 4.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </>
  ),
  handheart: (
    <>
      <path d="M9 11l3-3 3 3" />
      <path d="M12 8v8" />
      <path d="M5 15h14" />
    </>
  ),
} as const

type IconName = keyof typeof icons

const Icon = ({ name, className }: { name: IconName; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {icons[name]}
  </svg>
)

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: IconName
  label: string
  value: string | number
}) => (
  <div className="flex items-start gap-3 text-sm">
    <Icon name={icon} className="w-5 h-5 text-primary mt-0.5" />
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  </div>
)

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

  const { user } = useAuth()
  const navigate = useNavigate()
  const isCreator = user && String(user.user_id) === String(event.user_id)

  const onRegister = () => setOpen(true)
  const onEdit = () => navigate(`/edit-event/${event.event_id}`)
  const onViewVolunteers = () => navigate(`/events/${event.event_id}/volunteers`)

  return (
    <main className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative w-full h-64 md:h-80">
        <img
          src={event.image_url || '/placeholder-event.svg'}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* hero overlay */}
        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-end px-4 pb-6 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            {event.org_title}
            <span
              className={clsx(
                'px-2 py-0.5 text-[11px] font-semibold rounded-full uppercase tracking-wide',
                status === 'open' && 'bg-[#006C67]',
                status === 'full' && 'bg-[#FF6B6B]',
                status === 'closed' && 'bg-gray-500',
              )}
            >
              {status}
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-200">
            {formatDate(event.start_date)} · {event.city}, {event.region}, {event.country}
          </p>
        </div>
      </section>

      {/* ── BODY ─────────────────────────────────────── */}
      <section className="flex-1 w-full max-w-7xl mx-auto px-4 py-10 grid gap-10 lg:grid-cols-[2fr,1fr]">
        {/* LEFT column — description */}
        <article className="prose prose-slate max-w-none">
          <h2 className="sr-only">Description</h2>
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(event.description) }} />
        </article>

        {/* RIGHT column — info card */}
        <aside className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold">Event info</h3>

            <InfoRow icon="calendar" label="Date" value={formatDate(event.start_date)} />
            <InfoRow icon="map-pin" label="Location" value={`${event.city}, ${event.region}, ${event.country}`} />

            <button
              className="btn-primary w-full text-lg flex items-center justify-center gap-2"
              disabled={status !== 'open'}
              onClick={onRegister}
            >
              <Icon name="handheart" className="w-5 h-5" /> Register as Volunteer
            </button>
          </div>

          {isCreator && (
            <div className="flex flex-col gap-3">
              <button onClick={onEdit} className="btn-secondary">Edit Event</button>
              <button onClick={onViewVolunteers} className="btn-tertiary">View Volunteers</button>
            </div>
          )}
        </aside>
      </section>

      <ApplicationModal
        open={open}
        onClose={() => setOpen(false)}
        eventId={event.event_id}
        questions={event.volunteer_form}
      />
    </main>
  )
}

export default EventDetail