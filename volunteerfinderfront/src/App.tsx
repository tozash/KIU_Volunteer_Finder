import NavBar from '@/components/common/NavBar'
import Footer from '@/components/common/Footer'
import { Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import EventDetail from '@/pages/EventDetail'
import CreateEvent from '@/pages/CreateEvent'

function App() {
  return (
    <>
      <NavBar />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/create-event" element={<CreateEvent />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App