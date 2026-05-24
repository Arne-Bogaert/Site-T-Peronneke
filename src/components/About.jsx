import { useEffect, useRef } from 'react'
import eddySabrinaImg from "../assets/Eddy en Sabrina.webp"
import './About.css'

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('about--visible')
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
      id="over-ons"
      className="about"
      ref={sectionRef}
      aria-label="Over ons"
    >
      <div className="about-inner">

        <div className="about-text">
          <div className="about-accent" aria-hidden="true" style={{ '--i': 0 }} />
          <p className="about-label" aria-hidden="true" style={{ '--i': 1 }}>
            Over Ons
          </p>
          <h2 className="about-pull" style={{ '--i': 2 }}>
            Wat begon als een droom.
          </h2>
          <p className="about-body" style={{ '--i': 3 }}>
            Eddy en Sabrina openden in 2023 met veel enthousiasme de deuren van
            't Peronneke, een gezellige eethuis &amp; koffiebar aan het station
            van Schendelbeke. Wat begon als een droom, groeide snel uit tot een
            vaste stek voor buurtbewoners en passanten die op zoek zijn naar een
            heerlijk bord eten, een goede kop koffie en een warm welkom.
          </p>
          <p className="about-body" style={{ '--i': 4 }}>
            Bij Eddy en Sabrina staat gastvrijheid voorop. Of je nu aanschuift
            voor een uitgebreid ontbijt, een snelle lunch of gewoon een tasje om
            bij te kletsen, hier voel je je meteen thuis.
          </p>
          <a
            href="https://maps.google.com/?q=Moenebroeckstraat+12,+9506+Schendelbeke"
            target="_blank"
            rel="noopener noreferrer"
            className="about-reviews"
            style={{ '--i': 5 }}
            aria-label="Bekijk onze reviews op Google Maps (opent in nieuw venster)"
          >
            <span className="about-reviews-stars" aria-hidden="true">★★★★★</span>
            Bekijk reviews op Google
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <div className="about-visual">
          <img
            src={eddySabrinaImg}
            alt="Eddy en Sabrina"
            className="about-photo"
            loading="lazy"
            style={{ '--i': 2 }}
          />
        </div>

      </div>
    </section>
  )
}
