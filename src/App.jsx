import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import './App.css'

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Naar inhoud</a>
      <Navbar />
      <main>
        <Hero />
        <About />
      </main>
    </>
  )
}
