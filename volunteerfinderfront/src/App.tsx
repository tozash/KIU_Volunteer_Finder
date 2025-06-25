import './index.css'
import NavBar from '@/components/common/NavBar'
import Footer from '@/components/common/Footer'

function App() {
  return (
    <>
      <NavBar />
      <main className="p-4 text-center">
        <h1 className="text-2xl font-bold">Volunteer Finder</h1>
      </main>
      <Footer />
    </>
  )
}

export default App
