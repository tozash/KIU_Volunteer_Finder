import { ChangeEvent } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  className?: string
}

const SearchInput = ({ value, onChange, onSubmit, className = '' }: Props) => (
  <div className={`relative ${className}`}>
    <input
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSubmit?.()
      }}
      placeholder="Search volunteer events…"
      aria-label="Search volunteer events"
      className="w-96 h-10 pl-3 pr-10 border border-gray-300 rounded-lg outline-none"
    />
    <svg
      className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 7.65a7.5 7.5 0 010 10.6z" />
    </svg>
  </div>
)

export default SearchInput
