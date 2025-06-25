import './index.css'
import NavBar from '@/components/common/NavBar'
import Footer from '@/components/common/Footer'
import Landing from '@/pages/Landing'
import EventDetail from '@/pages/EventDetail'
import CreateEvent from '@/pages/CreateEvent'
import EditEvent from '@/pages/EditEvent'
import { AuthProvider } from '@/lib/useAuth'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
