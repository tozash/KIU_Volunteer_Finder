import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import Landing from '../Landing'

const queryClient = new QueryClient()

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

it('renders events from API', async () => {
  render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>,
    { wrapper },
  )

  await waitFor(() => {
    expect(screen.getByText(/Community Clean-up/i)).toBeInTheDocument()
  })
})
