import type { Application } from '@/lib/dummyData'

interface Props {
  application: Application
  onStatusChange?: (id: number, status: 'accepted' | 'denied' | 'canceled') => void
}

const VolunteerCard = ({ application, onStatusChange }: Props) => (
  <div className="border rounded p-4 flex justify-between items-center">
    <div>
      <h3 className="font-semibold">{application.name}</h3>
      <p className="text-sm text-gray-500">Status: {application.status}</p>
    </div>
    <div className="flex gap-2">
      {application.status === 'pending' && (
        <>
          <button
            onClick={() => onStatusChange?.(application.id, 'accepted')}
            className="px-2 py-1 bg-support text-white rounded"
          >
            Accept
          </button>
          <button
            onClick={() => onStatusChange?.(application.id, 'denied')}
            className="px-2 py-1 bg-accent text-white rounded"
          >
            Deny
          </button>
        </>
      )}
      {application.status !== 'canceled' && (
        <button
          onClick={() => onStatusChange?.(application.id, 'canceled')}
          className="px-2 py-1 bg-gray-300 rounded"
        >
          Cancel
        </button>
      )}
    </div>
  </div>
)

export default VolunteerCard
