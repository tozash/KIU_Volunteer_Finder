import { cloneElement, useEffect, useRef } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  trigger: React.ReactElement<any>
  children: React.ReactNode
}

const DropdownMenu = ({ open, onClose, trigger, children }: Props) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [onClose])

  return (
    <div className="relative inline-block text-left">
      {cloneElement(trigger, { 'aria-expanded': open })}
      {open && (
        <div ref={menuRef} className="dropdown-menu" role="menu">
          {children}
        </div>
      )}
    </div>
  )
}

export default DropdownMenu
