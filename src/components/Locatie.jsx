import './Locatie.css'

export default function Locatie() {
  return (
    <section id="locatie" className="locatie-section">
      <div className="locatie-inner">

        <div className="locatie-heading">
          <span className="locatie-ornament">✦</span>
          <h2 className="locatie-title">Locatie</h2>
          <span className="locatie-ornament">✦</span>
        </div>

        <div className="locatie-map-wrap">
          <iframe
            title="Locatie 't Peronneke"
            src="https://maps.google.com/maps?q=Moenebroeckstraat+12,+9506+Schendelbeke&output=embed&z=16"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="locatie-details">
          <div className="locatie-address">
            <svg className="locatie-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21C12 21 5 13.5 5 9a7 7 0 0 1 14 0c0 4.5-7 12-7 12z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            <div>
              <p className="locatie-street">Moenebroeckstraat 12</p>
              <p className="locatie-city">9506 Schendelbeke</p>
            </div>
          </div>

          <span className="locatie-sep">·</span>

          <div className="locatie-transport">
            <svg className="locatie-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="11" rx="2"/>
              <path d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>
              <circle cx="7.5" cy="15.5" r="1.5"/>
              <circle cx="16.5" cy="15.5" r="1.5"/>
              <path d="M7.5 17.5v1.5M16.5 17.5v1.5"/>
            </svg>
            <p className="locatie-note">Aan het station van Schendelbeke</p>
          </div>
        </div>

      </div>
    </section>
  )
}
