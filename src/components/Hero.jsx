import interiorImg from '../assets/Foto_interieur.webp'
import TrainStrip from './TrainStrip'
import './Hero.css'

export default function Hero() {
  return (
    <section id="main-content" className="hero" aria-label="Welkom bij 't Perroneke">
      <img
        src={interiorImg}
        alt=""
        className="hero-bg"
        fetchPriority="high"
      />
      <div className="hero-overlay" />

      <div className="hero-train">
        <TrainStrip />
      </div>

      <div className="hero-content">
        <p className="hero-eyebrow">Koffiebar &amp; eethuis · Schendelbeke</p>
        <h1 className="hero-headline">Welkom in 'T Perroneke</h1>
        <p className="hero-subline">Koffie, eten en rust naast het spoor</p>
        <a href="#over-ons" className="hero-cta">
          Ontdek 't Perron
        </a>
      </div>
    </section>
  )
}
