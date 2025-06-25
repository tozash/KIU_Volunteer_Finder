import { useState } from 'react'
import { useParams } from 'react-router-dom'

import VolunteerCard from '@/components/event/VolunteerCard'
import { dummyApplications } from '@/lib/dummyData'
import { useToast } from '@/components/common/Toast'

const Volunteers = () => {
  const { id } = useParams()
  const eventId = Number(id)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState<'name' | 'status'>('name')
  const addToast = useToast()
  const [apps, setApps] = useState(
    dummyApplications.filter((a) => a.eventId === eventId),
  )

  const updateStatus = (
    appId: number,
    status: 'accepted' | 'denied' | 'canceled',
  ) => {
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a)),
    )
    addToast(`Marked as ${status}`)
  }

  const filtered = apps.filter(
    (a) => statusFilter === 'all' || a.status === statusFilter,
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name)
    return a.status.localeCompare(b.status)
  })

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-xl font-bold mb-2">Volunteers</h1>
      <div className="flex gap-2 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="denied">Denied</option>
          <option value="canceled">Canceled</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'name' | 'status')}
          className="border p-1 rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>
      <div className="space-y-2">
        {sorted.map((app) => (
          <VolunteerCard
            key={app.id}
            application={app}
            onStatusChange={updateStatus}
          />
        ))}
      </div>
    </div>
  )
}

export default Volunteers
