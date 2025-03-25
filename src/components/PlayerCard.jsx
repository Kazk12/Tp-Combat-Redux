import ButtonCapacity from "./ButtonCapacity/ButtonCapacity";
import UltimateButton from "./UltimateButton/UltimateButton";
import ProgressBar from "./ProgressBar/ProgressBar";
import "./PlayerCard.css";
import { useDispatch, useSelector } from "react-redux";
import { skipTurn } from "../features/fight/fightSlice";

function PlayerCard({ player }) {
  const dispatch = useDispatch();
  const currentPlayer = useSelector(state => 
    state.fight.players.find(p => p.id === player.id)
  );
  const isMonsterTurn = useSelector(state => state.fight.isMonsterTurn);
  
  // Vérifier si c'est le tour de ce joueur
  const isPlayerTurn = currentPlayer.canPlay && !isMonsterTurn;
  
  const handleSkipTurn = () => {
    if (isPlayerTurn) {
      dispatch(skipTurn({ playerId: player.id }));
    }
  };
  
  return (
    <div className={`card ${isPlayerTurn ? 'active-player-card' : ''}`} id={`joueur${player.id}`}>
      <div className="card-body text-center">
        <h5 className="card-title">
          {player.name}
          {isPlayerTurn && <span className="player-turn-badge"><i className="fas fa-play"></i></span>}
        </h5>
        
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
        
        {/* Bouton d'ultime */}
        <UltimateButton player={player} />
        
        {/* Bouton passer tour */}
        {isPlayerTurn && (
          <button 
            className="skip-turn-btn" 
            onClick={handleSkipTurn}
            title="Passer son tour (+3 ki)"
          >
            <i className="fas fa-forward"></i> Passer tour
          </button>
        )}
      </div>
    </div>
  );
}

export default PlayerCard;