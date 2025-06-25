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
