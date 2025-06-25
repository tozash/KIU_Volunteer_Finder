import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthModal from '@/components/common/AuthModal'
import { useAuth } from '@/lib/useAuth'

const NavBar = () => {
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const { user, logout } = useAuth()
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <Link to="/" className="font-bold" aria-label="Home">
        Logo
      </Link>
      <input
        type="text"
        placeholder="Search events"
        className="border p-1 rounded md:w-1/3"
      />
      <div className="relative">
        {user ? (
          <>
            <button
              aria-label="Account menu"
              className="px-2 py-1 border rounded"
              onClick={() => setOpen(!open)}
            >
              {user.name}
            </button>
            {open && (
              <ul className="absolute right-0 mt-2 w-40 border rounded bg-white text-black shadow">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                >
                  Logout
                </li>
              </ul>
            )}
          </>
        ) : (
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setAuthOpen(true)}
          >
            Login
          </button>
        )}
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    </nav>
  )
}

export default NavBar
