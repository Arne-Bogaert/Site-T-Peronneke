import trainGif     from '../assets/train/train_v18.gif'
import car1Gif      from '../assets/train/carriage_v18_car1.gif'
import car2Gif      from '../assets/train/carriage_v18_car2.gif'
import car5Gif      from '../assets/train/carriage_v18_car5.gif'
import car9Gif      from '../assets/train/carriage_v18_car9.gif'
import railtrackImg from '../assets/train/railtrack_v1.png'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="train-container">
          <div className="train-group">
            <img src={car5Gif} alt="" className="pixel carriage" />
            <img src={car2Gif} alt="" className="pixel carriage" />
            <img src={car9Gif} alt="" className="pixel carriage" />
            <img src={car1Gif} alt="" className="pixel carriage" />
            <img src={trainGif} alt="" className="pixel locomotive" />
          </div>
          <div
            className="railtrack"
            style={{ backgroundImage: `url(${railtrackImg})` }}
          />
        </div>
      </div>

      <div className="navbar-links">
        <a href="#over-ons">Over ons</a>
        <a href="#menu">Menu</a>
        <a href="#locatie">Locatie</a>
        <a href="#contact">Contact</a>
        <a href="#reservaties">Reservaties</a>
      </div>
    </nav>
  )
}
