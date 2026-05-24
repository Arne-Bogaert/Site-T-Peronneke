import { useEffect } from 'react'
import './CookieBanner.css'

export default function CookieBanner({ onAccept, onDecline }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onDecline() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onDecline])

  return (
    <div className="cookie-banner" role="region" aria-label="Cookiemelding">
      <div className="cookie-banner-inner">
        <div className="cookie-banner-text">
          <p className="cookie-banner-title">Cookies</p>
          <p className="cookie-banner-body">
            We gebruiken Google Maps voor de interactieve kaart.
            Google plaatst daarbij cookies. Accepteer je dit?
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button className="cookie-btn cookie-btn--decline" onClick={onDecline}>
            Weigeren
          </button>
          <button className="cookie-btn cookie-btn--accept" onClick={onAccept}>
            Accepteren
          </button>
        </div>
      </div>
    </div>
  )
}
