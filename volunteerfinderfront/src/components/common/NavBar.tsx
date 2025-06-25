import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import AuthModal from '@/components/common/AuthModal'
import { useAuth } from '@/lib/useAuth'
import useDebounce from '@/lib/useDebounce'
import SearchInput from './SearchInput'
import DropdownMenu from './DropdownMenu'

const NavBar = () => {
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const { user, logout } = useAuth()
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('search') ?? '')
  const debounced = useDebounce(search, 300)

  // update url param when debounced search changes
  useEffect(() => {
    const p = new URLSearchParams(params)
    if (debounced) p.set('search', debounced)
    else p.delete('search')
    setParams(p, { replace: true })
  }, [debounced])

  return (
    <nav
      className="flex items-center justify-between h-18 px-8 border-b border-grayBorder bg-neutralLight"
      role="navigation"
      aria-label="main navigation"
    >
      <Link to="/" aria-label="Home" className="flex items-center">
        <div className="w-10 h-10 bg-gray-300 rounded" />
      </Link>
      <SearchInput
        value={search}
        onChange={setSearch}
        className="hidden sm:block"
      />
      <div className="ml-auto">
        {user ? (
          <DropdownMenu
            open={open}
            onClose={() => setOpen(false)}
            trigger={
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutralLight"
                onClick={() => setOpen(!open)}
              >
                <div className="w-8 h-8 rounded-full bg-primary text-neutralLight flex items-center justify-center text-sm font-medium">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:block text-neutralDark font-medium">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            }
          >
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => logout()}
            >
              Logout
            </button>
          </DropdownMenu>
        ) : (
          <button
            className="px-4 py-2 bg-primary text-neutralLight rounded-lg font-semibold uppercase text-sm"
            onClick={() => setAuthOpen(true)}
            aria-label="Login / Register"
          >
            Login / Register
          </button>
        )}
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    </nav>
  )
}

export default NavBar
