import './Monster.css';
import { useSelector } from "react-redux";
import ProgressBar from '../ProgressBar/ProgressBar';

function Monster() {
  const monster = useSelector((state) => state.fight.monster);
  
  return (
    <div className="monster-card">
      <h2>{monster.name}</h2>
      
      {/* Utilisation du composant ProgressBar */}
      <div className="monster-progress-container">
        <ProgressBar
          pv={monster.pv}
          pvMax={monster.pvMax}
          faType="fa-heart"
          barName=" : pv "
          bgType="bg-danger"
        />
      </div>
      
      <div className="monster-image-container">
        <img
          src={monster.image}
          className="monster-image"
          alt={monster.name}
          style={{ maxHeight: "250px" }} // Ajouter un style inline pour contrôler la hauteur max
        />
      </div>
      
      <div className="monster-status">
        <div className="monster-status-item">
          <i className="fas fa-fist-raised"></i> {monster.strength}
        </div>
        <div className="monster-status-item">
          <i className="fas fa-shield-alt"></i> Défense
        </div>
      </div>
    </div>
  );
}

export default Monster;