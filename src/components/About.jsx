import { useEffect, useRef } from 'react'
import papegaaiImg from "../assets/'T Perron Korte Papegaai.webp"
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
      aria-labelledby="about-heading"
    >
      <div className="about-inner">

        <div className="about-text">
          <div className="about-accent" aria-hidden="true" style={{ '--i': 0 }} />
          <h2 id="about-heading" className="about-label" style={{ '--i': 1 }}>
            Over Ons
          </h2>
          <p className="about-pull" style={{ '--i': 2 }}>
            Wat begon als een droom.
          </p>
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
        </div>

        <div className="about-visual" aria-hidden="true">
          <img
            src={papegaaiImg}
            alt=""
            className="about-parrot"
            loading="lazy"
            style={{ '--i': 2 }}
          />
        </div>

      </div>
    </section>
  )
}
