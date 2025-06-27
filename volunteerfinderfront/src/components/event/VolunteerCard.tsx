import type { Application } from '@/lib/api'

interface Props {
  application: Application
  onStatusChange?: (id: string, status: 'accepted' | 'denied' | 'canceled') => void
  questions?: string[]
}

const VolunteerCard = ({ application, onStatusChange, questions }: Props) => (
  <div className="border rounded p-4 flex justify-between items-center">
    <div>
      <h3 className="font-semibold">Application {application.application_id}</h3>
      <p className="text-sm text-gray-500">Status: {application.status}</p>
      <p className="text-sm text-gray-500">User ID: {application.user_id}</p>
      {questions && application.answers && application.answers.length > 0 && (
        <div className="mt-2">
          <h4 className="font-semibold text-sm mb-1">Answers:</h4>
          <ul className="list-disc pl-5">
            {questions.map((q, idx) => (
              <li key={idx}>
                <span className="font-medium">{q}:</span> {application.answers[idx] || <span className="text-gray-400">(no answer)</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    <div className="flex gap-2">
      {application.status === 'pending' && (
        <>
          <button
            onClick={() => onStatusChange?.(application.application_id, 'accepted')}
            className="px-2 py-1 bg-support text-white rounded"
          >
            Accept
          </button>
          <button
            onClick={() => onStatusChange?.(application.application_id, 'denied')}
            className="px-2 py-1 bg-accent text-white rounded"
          >
            Deny
          </button>
        </>
      )}
      {application.status !== 'canceled' && (
        <button
          onClick={() => onStatusChange?.(application.application_id, 'canceled')}
          className="px-2 py-1 bg-gray-300 rounded"
        >
          Cancel
        </button>
      )}
    </div>
  </div>
)

export default VolunteerCard
