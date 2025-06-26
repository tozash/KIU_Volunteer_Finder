import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MySubmissions from '../MySubmissions'

it('shows applications for current user', () => {
  render(
    <MemoryRouter>
      <MySubmissions />
    </MemoryRouter>,
  )
  expect(screen.getByText(/My Submissions/i)).toBeInTheDocument()
  expect(screen.getByText(/Community Clean-up/i)).toBeInTheDocument()
})
