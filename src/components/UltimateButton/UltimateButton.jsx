import { useDispatch, useSelector } from "react-redux";
import { useUltimate } from "../../features/fight/fightSlice";
import "./UltimateButton.css";

function UltimateButton({ player }) {
  const dispatch = useDispatch();
  
  // Sélectionner l'état actuel du joueur et du tour
  const currentPlayer = useSelector(state => 
    state.fight.players.find(p => p.id === player.id)
  );
  
  const currentTurn = useSelector(state => state.fight.currentTurn);
  const isMonsterTurn = useSelector(state => state.fight.isMonsterTurn);
  
  // Vérifier si c'est le tour de ce joueur
  const isPlayerTurn = currentPlayer.canPlay && currentTurn === player.id;
  
  // Vérifier si le joueur peut utiliser son ultime
  const canUseUltimate = currentPlayer.isUltimateReady && 
                         currentPlayer.mana >= currentPlayer.ultimate.manaCost && 
                         isPlayerTurn && 
                         !isMonsterTurn;
  
  // Déterminer le style du bouton
  let buttonClass = "ultimate-button";
  
  if (currentPlayer.isUltimateReady) {
    buttonClass += " ultimate-ready";
  } else {
    buttonClass += " ultimate-charging";
  }
  
  if (!isPlayerTurn || isMonsterTurn) {
    buttonClass += " ultimate-disabled";
  }
  
  if (currentPlayer.mana < currentPlayer.ultimate.manaCost) {
    buttonClass += " ultimate-no-mana";
  }
  
  // Calculer la progression de charge
  const chargeProgress = Math.min(100, (currentPlayer.ultimateCharge * 100 / currentPlayer.ultimateMaxCharge));
  
  // Activer l'ultime
  const activateUltimate = () => {
    if (canUseUltimate) {
      dispatch(useUltimate({ playerId: player.id }));
    }
  };
  
  return (
    <div className="ultimate-container">
      <button 
        className={buttonClass}
        onClick={activateUltimate}
        disabled={!canUseUltimate}
        title={currentPlayer.ultimate.description}
      >
        <div className="ultimate-content">
          <div className="ultimate-icon">
            <i className="fas fa-meteor"></i>
          </div>
          <div className="ultimate-details">
            <span className="ultimate-name">{currentPlayer.ultimate.name}</span>
            <div className="ultimate-stats">
              <span className="ultimate-damage">
                <i className="fas fa-bolt"></i> {currentPlayer.ultimate.damage}
              </span>
              <span className="ultimate-cost">
                <i className="fas fa-fire-alt"></i> {currentPlayer.ultimate.manaCost}
              </span>
            </div>
          </div>
        </div>
        
        {!currentPlayer.isUltimateReady && (
          <div className="ultimate-progress-container">
            <div 
              className="ultimate-progress" 
              style={{ width: `${chargeProgress}%` }}
            ></div>
            <span className="ultimate-progress-text">
              {currentPlayer.ultimateCharge}/{currentPlayer.ultimateMaxCharge}
            </span>
          </div>
        )}
        
        {currentPlayer.isUltimateReady && (
          <div className="ultimate-ready-indicator">
            <i className="fas fa-star"></i> PRÊT <i className="fas fa-star"></i>
          </div>
        )}
      </button>
    </div>
  );
}

export default UltimateButton;