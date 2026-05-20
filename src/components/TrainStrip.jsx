import locomotiefGif from '../assets/train/train_v18.gif'
import car1Gif       from '../assets/train/carriage_v18_car1.gif'
import car2Gif       from '../assets/train/carriage_v18_car2.gif'
import car5Gif       from '../assets/train/carriage_v18_car5.gif'
import car9Gif       from '../assets/train/carriage_v18_car9.gif'
import railtrackImg  from '../assets/train/railtrack_v1.png'
import './TrainStrip.css'

export default function TrainStrip() {
  return (
    <div className="train-strip" aria-hidden="true">
      <div className="train-group">
        {/* Rijtuigen vooraan, locomotief achteraan (rijrichting rechts) */}
        <img src={car9Gif}       alt="" className="train-img" />
        <img src={car5Gif}       alt="" className="train-img" />
        <img src={car2Gif}       alt="" className="train-img" />
        <img src={car1Gif}       alt="" className="train-img" />
        <img src={locomotiefGif} alt="" className="train-img train-loco" />
      </div>
      <div
        className="train-track"
        style={{ backgroundImage: `url(${railtrackImg})` }}
      />
    </div>
  )
}
