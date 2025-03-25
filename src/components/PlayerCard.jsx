import ButtonCapacity from "./ButtonCapacity/ButtonCapacity";
import ProgressBar from "./ProgressBar/ProgressBar";
import "./PlayerCard.css";

function PlayerCard({ player }) {
  return (
    <div className="card" id={`joueur${player.id}`}>
      <div className="card-body text-center">
        <h5 className="card-title">{player.name}</h5>
        
        <div className="player-image-container">
          <img 
            src={player.image} 
            alt={`${player.name}`} 
            className="player-image" 
          />
        </div>
        
        <div className="player-health-bar">
          <ProgressBar
            pv={player.pv}
            pvMax={player.pvMax}
            faType="fa-heart"
            barName=" : pv "
            bgType="bg-danger"
          />
        </div>
        
        <div className="player-mana-bar">
          <ProgressBar
            pv={player.mana}
            pvMax={player.manaMax}
            faType="fa-fire-alt"
            barName=" : ki "
            bgType="bg-primary"
          />
        </div>

        <div className="player-abilities">
          {player.capacities.map((capacity, index) => (
            <ButtonCapacity 
              key={index} 
              player={player} 
              capacity={capacity} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;