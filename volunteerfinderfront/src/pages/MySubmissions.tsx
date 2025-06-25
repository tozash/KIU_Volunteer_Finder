import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '@/components/common/Toast'

import { dummyApplications, dummyEvents, currentUserName } from '@/lib/dummyData'

const MySubmissions = () => {
  const [apps, setApps] = useState(
    dummyApplications.filter((a) => a.name === currentUserName),
  )
  const addToast = useToast()

  const cancel = (id: number) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'canceled' } : a)),
    )
    addToast('Application canceled')
  }

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-xl font-bold mb-2">My Submissions</h1>
      <ul className="space-y-4">
        {apps.map((app) => {
          const event = dummyEvents.find((e) => e.id === app.eventId)
          return (
            <li key={app.id} className="border rounded p-4">
              <h2 className="font-semibold">{event?.title}</h2>
              <p className="text-sm text-gray-500">Status: {app.status}</p>
              <div className="mt-2 flex gap-2">
                <Link
                  to={`/events/${app.eventId}`}
                  className="px-2 py-1 bg-blue-600 text-white rounded"
                >
                  View Event
                </Link>
                {app.status !== 'canceled' && (
                  <button
                    onClick={() => cancel(app.id)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default MySubmissions
