import './index.css'
import NavBar from '@/components/common/NavBar'
import Footer from '@/components/common/Footer'
import Landing from '@/pages/Landing'

function App() {
  return (
    <>
      <NavBar />
      <main className="p-4">
        <Landing />
      </main>
      <Footer />
    </>
  )
}

export default App
