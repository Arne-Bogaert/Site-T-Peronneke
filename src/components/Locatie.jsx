import { useEffect, useRef } from 'react'
import './Locatie.css'

const MAPS_URL = 'https://maps.google.com/?q=Moenebroeckstraat+12,+9506+Schendelbeke'
const MAPS_EMBED = 'https://maps.google.com/maps?q=Moenebroeckstraat+12,+9506+Schendelbeke,+Belgium&output=embed&hl=nl&z=15'

const HOURS = [
  { dag: 'Ma – Wo',  tijd: 'Gesloten',       gesloten: true,  openMin: null,  closeMin: null  },
  { dag: 'Do – Za',  tijd: '09:00 – 20:00',  gesloten: false, openMin: 540,   closeMin: 1200  },
  { dag: 'Zondag',   tijd: '09:00 – 18:00',  gesloten: false, openMin: 540,   closeMin: 1080  },
]

function getTodayStatus() {
  const now  = new Date()
  const day  = now.getDay() // 0=zo, 1=ma, ..., 6=za
  const mins = now.getHours() * 60 + now.getMinutes()

  let rowIndex
  if (day >= 1 && day <= 3)      rowIndex = 0 // ma-wo
  else if (day >= 4 && day <= 6) rowIndex = 1 // do-za
  else                            rowIndex = 2 // zo

  const row = HOURS[rowIndex]
  const isOpen = !row.gesloten && mins >= row.openMin && mins < row.closeMin
  return { rowIndex, isOpen }
}

export default function Locatie({ mapsConsent = false }) {
  const sectionRef = useRef(null)
  const { rowIndex: todayRow, isOpen } = getTodayStatus()

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('locatie--visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="locatie"
      className="locatie"
      ref={sectionRef}
      aria-label="Locatie en openingsuren"
    >
      <div className="locatie-inner">

        <div className="locatie-info">
          <div className="locatie-accent" aria-hidden="true" style={{ '--i': 0 }} />
          <p className="locatie-label" aria-hidden="true" style={{ '--i': 1 }}>
            Locatie &amp; Openingsuren
          </p>
          <h2 className="locatie-title" style={{ '--i': 2 }}>
            Hier vind je ons.
          </h2>

          <address className="locatie-adres" style={{ '--i': 3 }}>
            <span className="locatie-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <span>
              Moenebroeckstraat 12<br />
              9506 Schendelbeke
            </span>
          </address>

          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="locatie-directions"
            style={{ '--i': 4 }}
            aria-label="Routebeschrijving (opent in nieuw venster)"
          >
            Routebeschrijving
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>

          <div className="locatie-divider" style={{ '--i': 5 }} aria-hidden="true" />

          <div className="locatie-uren" style={{ '--i': 5 }}>
            <h3 className="locatie-uren-hd">
              <span className="locatie-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </span>
              <span>Openingsuren</span>
              <span className={`locatie-nu${isOpen ? ' locatie-nu--open' : ' locatie-nu--gesloten'}`}>
                {isOpen ? 'Nu open' : 'Nu gesloten'}
              </span>
            </h3>
            <dl className="locatie-uren-lijst">
              {HOURS.map(({ dag, tijd, gesloten }, index) => (
                <div
                  key={dag}
                  className={`locatie-uren-rij${gesloten ? ' is-gesloten' : ' is-open'}${index === todayRow ? ' is-vandaag' : ''}`}
                >
                  <dt>
                    {dag}
                    {index === todayRow && (
                      <span className="locatie-vandaag-badge" aria-label="vandaag">Vandaag</span>
                    )}
                  </dt>
                  <dd>{tijd}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="locatie-kaart" style={{ '--i': 2 }}>
          {mapsConsent ? (
            <div className="locatie-kaart-media">
              <iframe
                title="Locatie 't Perroneke — Moenebroeckstraat 12, Schendelbeke"
                src={MAPS_EMBED}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="locatie-kaart-fallback"
                aria-label="Bekijk locatie op Google Maps (opent in nieuw venster)"
              >
                Bekijk op Google Maps
              </a>
            </div>
          ) : (
            <div className="locatie-kaart-consent">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true" className="locatie-consent-icon">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="locatie-consent-title">Kaart via Google Maps</p>
              <p className="locatie-consent-text">
                Je hebt Google Maps-cookies geweigerd.
                Herlaad de pagina en accepteer cookies om de kaart te zien.
              </p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="locatie-consent-btn"
                aria-label="Bekijk locatie op Google Maps (opent in nieuw venster)"
              >
                Bekijk op Google Maps
              </a>
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="locatie-consent-link"
              >
                Google Privacybeleid
              </a>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
