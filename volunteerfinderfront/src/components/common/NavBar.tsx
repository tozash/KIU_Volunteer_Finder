import { useState } from 'react'

const NavBar = () => {
  const [open, setOpen] = useState(false)
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="font-bold">Logo</div>
      <input
        type="text"
        placeholder="Search events"
        className="border p-1 rounded md:w-1/3"
      />
      <div className="relative">
        <button
          aria-label="Account menu"
          className="px-2 py-1 border rounded"
          onClick={() => setOpen(!open)}
        >
          Account
        </button>
        {open && (
          <ul className="absolute right-0 mt-2 w-40 border rounded bg-white text-black shadow">
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
          </ul>
        )}
      </div>
    </nav>
  )
}

export default NavBar
