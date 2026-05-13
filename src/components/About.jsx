import parrotImg from '../assets/EnkelPapegaai.png'
import './About.css'

export default function About() {
  return (
    <section id="over-ons" className="about-section">
      <div className="about-inner">
        <div className="about-logo-medallion">
          <img src={parrotImg} alt="'t Peronneke" className="about-logo" />
        </div>

        <div className="about-heading">
          <span className="about-ornament">✦</span>
          <h2 className="about-title">Over Ons</h2>
          <span className="about-ornament">✦</span>
        </div>

        <p className="about-text">
          Eddy en Sabrina openden in 2023 met veel enthousiasme de deuren van{' '}
          <em>'t Peronneke</em>, een gezellige eethuis &amp; koffiebar aan het
          station van Schendelbeke. Wat begon als een droom, groeide snel uit
          tot een vaste stek voor buurtbewoners en passanten die op zoek zijn
          naar een heerlijk bord eten, een goede kop koffie en een warm welkom.
        </p>

        <p className="about-text">
          Bij Eddy en Sabrina staat gastvrijheid voorop. Of je nu aanschuift
          voor een uitgebreid ontbijt, een snelle lunch of gewoon een tasje om
          bij te kletsen, hier voel je je meteen thuis.
        </p>
      </div>
    </section>
  )
}
