import { useNavigate } from 'react-router-dom'
import type { Event, Application } from '@/lib/api'

interface Props {
  event: Event
  status: Application['status']
  applicationId: string
  onCancel: () => void
}

const SubmissionCard = ({ event, status, applicationId, onCancel }: Props) => {
  const navigate = useNavigate()
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

  const statusClasses: Record<Application['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-700',
    denied: 'bg-red-100 text-red-700',
    canceled: 'bg-gray-200 text-gray-600',
  }

  return (
    <article className="group relative flex flex-col sm:flex-row gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      <img
        src={event.image_url || '/placeholder-event.svg'}
        alt=""
        className="w-full sm:w-40 h-40 object-cover bg-gray-100"
        loading="lazy"
      />
      <div className="flex-1 p-4 space-y-2">
        <header className="flex items-start justify-between gap-2">
          <h3 className="flex-1 text-lg font-semibold leading-snug">
            {event.org_title}
          </h3>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${statusClasses[status]}`}
          >
            {status}
          </span>
        </header>
        <p className="text-sm text-gray-600">
          {formatDate(event.start_date)} · {event.city}
        </p>
        <p className="text-xs text-gray-400">Application ID {applicationId}</p>
      </div>
      <footer className="flex gap-3 p-4 pt-0 sm:p-4 sm:pt-4">
        <button
          onClick={() => navigate(`/events/${event.event_id}`)}
          className="btn-primary flex-1 sm:flex-none"
        >
          View Event
        </button>
        <button
          disabled={status !== 'pending'}
          onClick={onCancel}
          className="btn-secondary flex-1 sm:flex-none"
        >
          Cancel
        </button>
      </footer>
    </article>
  )
}

export default SubmissionCard
