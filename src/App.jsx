import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import TrainStrip from './components/TrainStrip'
import Menu from './components/Menu'
import Locatie from './components/Locatie'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import './App.css'

export default function App() {
  const [mapsConsent, setMapsConsent] = useState(
    () => localStorage.getItem('maps-consent') === '1'
  )
  const [bannerVisible, setBannerVisible] = useState(
    () => localStorage.getItem('maps-consent') === null
  )

  const handleAccept = () => {
    localStorage.setItem('maps-consent', '1')
    setMapsConsent(true)
    setBannerVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('maps-consent', '0')
    setBannerVisible(false)
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Naar inhoud</a>
      <Navbar />
      <main>
        <Hero />
        <About />
        <TrainStrip noTrack />
        <Menu />
        <Locatie mapsConsent={mapsConsent} />
        <Contact />
      </main>
      <Footer />
      {bannerVisible && (
        <CookieBanner onAccept={handleAccept} onDecline={handleDecline} />
      )}
    </>
  )
}
