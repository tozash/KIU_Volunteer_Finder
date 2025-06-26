import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthModal from '@/components/common/AuthModal'
import { useAuth } from '@/lib/useAuth'

const CreateEventCard = () => {
  const { user } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  const content = (
    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-2xl hover:bg-[#F5F5F5] cursor-pointer transition-colors">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-primary"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 5a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H6a1 1 0 110-2h5V6a1 1 0 011-1z" />
      </svg>
      <span className="mt-2 text-neutralDark">Create New Event</span>
    </div>
  )

  return (
    <>
      {user ? (
        <Link to="/create-event">{content}</Link>
      ) : (
        <button type="button" onClick={() => setAuthOpen(true)}>{content}</button>
      )}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}

export default CreateEventCard
