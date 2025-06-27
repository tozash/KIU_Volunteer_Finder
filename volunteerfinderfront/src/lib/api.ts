const API_BASE_URL = '/api'

// Types
export interface Event {
  event_id: string
  user_id: string
  image_url: string
  start_date: string
  end_date: string
  description: string
  volunteer_form: string[]
  category: string
  org_title: string
  country: string
  region: string
  city: string
  created_at?: string
  updated_at?: string
}

export interface Application {
  application_id: string
  user_id: string
  event_id: string
  answers: string[]
  status: 'pending' | 'accepted' | 'denied' | 'canceled'
  created_at?: string
  updated_at?: string
}

export interface User {
  user_id: string
  name: string
  surname: string
  email: string
  dob: string
  sex: string
  created_at?: string
  updated_at?: string
}

// API Functions
export const api = {
  // Events
  async getEvents(userId?: string): Promise<Event[]> {
    let url = `${API_BASE_URL}/events/load`;
    if (userId) {
      url += `?user_id=${encodeURIComponent(userId)}`;
    }
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch events')
    return response.json()
  },

  async getEvent(id: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/load?entity_id=${id}`)
    if (!response.ok) throw new Error('Failed to fetch event')
    return response.json()
  },

  async createEvent(eventData: Omit<Event, 'event_id' | 'created_at' | 'updated_at'>): Promise<{ entity_id: string }> {
    const response = await fetch(`${API_BASE_URL}/events/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    })
    if (!response.ok) throw new Error('Failed to create event')
    return response.json()
  },

  // Applications
  async getApplications(): Promise<Application[]> {
    const response = await fetch(`${API_BASE_URL}/applications/load`)
    if (!response.ok) throw new Error('Failed to fetch applications')
    return response.json()
  },

  async getApplication(id: string): Promise<Application> {
    const response = await fetch(`${API_BASE_URL}/applications/load?entity_id=${id}`)
    if (!response.ok) throw new Error('Failed to fetch application')
    return response.json()
  },

  async createApplication(applicationData: {
    user_id: string
    event_id: string
    answers: string[]
  }): Promise<{ entity_id: string }> {
    const response = await fetch(`${API_BASE_URL}/applications/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    })
    if (!response.ok) throw new Error('Failed to create application')
    return response.json()
  },

  async updateApplicationStatus(applicationId: string, status: Application['status']): Promise<{ entity_id: string }> {
    const response = await fetch(`${API_BASE_URL}/applications/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        application_id: applicationId,
        updated_application_status: status
      })
    })
    if (!response.ok) throw new Error('Failed to update application status')
    return response.json()
  },

  // Users
  async getUser(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/load?entity_id=${id}`)
    if (!response.ok) throw new Error('Failed to fetch user')
    return response.json()
  },

  async getRandomUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/random`)
    if (!response.ok) throw new Error('Failed to fetch random user')
    return response.json()
  }
} 