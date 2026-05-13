import interiorImg from '../assets/Foto_interieur.jpg'
import fullLogoImg from '../assets/VolledigLogo.png'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero-section">
      <img src={interiorImg} alt="" className="hero-image" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <img src={fullLogoImg} alt="'t Peronneke" className="hero-logo" />
        <span className="hero-welkom">Welkom in</span>
        <span className="hero-name">'t Peronneke</span>
      </div>
    </section>
  )
}
