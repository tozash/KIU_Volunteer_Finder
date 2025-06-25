import NavBar from '@/components/common/NavBar'
import Footer from '@/components/common/Footer'
import { Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import EventDetail from '@/pages/EventDetail'
import CreateEvent from '@/pages/CreateEvent'
import EditEvent from '@/pages/EditEvent'
import MyEvents from '@/pages/MyEvents'
import Volunteers from '@/pages/Volunteers'
import MySubmissions from '@/pages/MySubmissions'


function App() {
  return (
    <>
      <NavBar />
      <main className="p-4 max-w-screen-xl mx-auto">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route
            path="/events/:id/volunteers"
            element={<Volunteers />}
          />
          <Route path="/my-submissions" element={<MySubmissions />} />
        </Routes>
      </main>
      <Footer />
    </>

  )
}

export default App
