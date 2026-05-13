import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import MenuBook from './components/MenuBook'
import Locatie from './components/Locatie'
import Contact from './components/Contact'
import './App.css'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <MenuBook />
        <Locatie />
        <Contact />
      </main>
    </>
  )
}
