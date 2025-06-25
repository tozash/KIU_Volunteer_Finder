import './index.css'
import NavBar from '@/components/common/NavBar'
import Footer from '@/components/common/Footer'
import Landing from '@/pages/Landing'
import { AuthProvider } from '@/lib/useAuth'

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <main className="p-4">
        <Landing />
      </main>
      <Footer />
    </AuthProvider>
  )
}

export default App
