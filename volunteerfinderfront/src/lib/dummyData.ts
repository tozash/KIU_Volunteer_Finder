export interface Event {
  id: number
  title: string
  date: string
  location: string
  imageUrl: string
  status: 'open' | 'closed'
  description: string
  questions: string[]
}

export const dummyEvents: Event[] = [
  {
    id: 1,
    title: 'Community Clean-up',
    date: '2025-07-01',
    location: 'City Park',
    imageUrl: 'https://placehold.co/600x400',
    status: 'open',
    description: 'Help us **clean** the park!\nBring gloves and water.',
    questions: ['Why do you want to join?', 'Have you volunteered before?'],
  },
]

export interface Application {
  id: number
  eventId: number
  name: string
  status: 'pending' | 'accepted' | 'denied' | 'canceled'
}

export const dummyApplications: Application[] = [
  { id: 1, eventId: 1, name: 'Alice', status: 'pending' },
  { id: 2, eventId: 1, name: 'Bob', status: 'accepted' },
  { id: 3, eventId: 1, name: 'Carol', status: 'denied' },
]

export const currentUserName = 'Alice'
