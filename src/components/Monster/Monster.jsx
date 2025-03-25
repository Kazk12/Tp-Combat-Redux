import './Monster.css';
import { useSelector } from "react-redux";
import ProgressBar from '../ProgressBar/ProgressBar';

function Monster() {
  const monster = useSelector((state) => state.fight.monster);
  const isMonsterTurn = useSelector((state) => state.fight.isMonsterTurn);
  
  return (
    <div className={`monster-card ${isMonsterTurn ? 'monster-attacking' : ''}`}>
      <h2>{monster.name}</h2>
      
      {isMonsterTurn && (
        <div className="monster-turn-message">
          <i className="fas fa-skull"></i> ATTAQUE!
        </div>
      )}
      
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
          style={{ maxHeight: "250px" }}
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