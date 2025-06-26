# Frontend-Backend Connection Setup

This guide explains how to connect the frontend and backend of the KIU Volunteer Finder application.

## Backend Setup

1. **Install CORS dependency** (run in backend directory):
   ```bash
   cd backend
   npm install @fastify/cors
   ```

2. **Start the backend server**:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3000`

## Frontend Setup

1. **Start the frontend development server**:
   ```bash
   cd volunteerfinderfront
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## Connection Details

### API Configuration
- **Backend API Base URL**: `http://localhost:3000/api`
- **Frontend Proxy**: Configured in `vite.config.ts` to proxy `/api` requests to `http://localhost:3000`
- **CORS**: Enabled on backend to allow requests from `http://localhost:5173`

### API Endpoints

#### Events
- `GET /api/events/load` - Get all events
- `GET /api/events/load?entity_id={id}` - Get specific event
- `POST /api/events/create` - Create new event

#### Applications
- `GET /api/applications/load` - Get all applications
- `GET /api/applications/load?entity_id={id}` - Get specific application
- `POST /api/applications/create` - Create new application
- `POST /api/applications/update` - Update application status

#### Users
- `GET /api/users/load?entity_id={id}` - Get specific user
- `GET /api/users/random` - Get random user

#### Auth
- `POST /api/auth/login` - Log in a user
- `POST /api/auth/register` - Register a new user

### Data Structure Changes

The frontend has been updated to work with the backend's data structure:

#### Event Structure (Backend)
```typescript
interface Event {
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
```

#### Application Structure (Backend)
```typescript
interface Application {
  application_id: string
  user_id: string
  event_id: string
  answers: string[]
  status: 'pending' | 'accepted' | 'denied' | 'canceled'
  created_at?: string
  updated_at?: string
}
```

## Key Changes Made

1. **Added CORS support** to backend (`@fastify/cors`)
2. **Created API service** (`src/lib/api.ts`) for frontend-backend communication
3. **Updated Vite config** with proxy configuration
4. **Updated components** to use real API instead of mock data:
   - Landing page (events listing)
   - EventDetail page
   - Volunteers page
   - MySubmissions page
   - ApplicationModal
   - EventCard
   - VolunteerCard

## Troubleshooting

### PowerShell Execution Policy Issue
If you encounter PowerShell execution policy errors, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Conflicts
- Backend: Make sure port 3000 is available
- Frontend: Make sure port 5173 is available

### CORS Issues
- Ensure the backend is running before starting the frontend
- Check that CORS is properly configured in `backend/src/index.ts`

## Testing the Connection

1. Start both servers
2. Navigate to `http://localhost:5173`
3. Check the browser's developer tools Network tab to see API requests
4. Verify that events are loading from the backend instead of mock data

## Next Steps

- Add error handling and loading states
- Implement real-time updates using WebSockets
- Add data validation and sanitization
