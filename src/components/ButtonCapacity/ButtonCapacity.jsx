import { useDispatch, useSelector } from "react-redux";
import { hitBack, hitMonster, resetCooldown, resetLastAttackMissed } from "../../features/fight/fightSlice";
import "./ButtonCapacity.css";
import { useEffect, useState } from "react";

function ButtonCapacity({ player, capacity }) {
  const dispatch = useDispatch();
  const [showMissMessage, setShowMissMessage] = useState(false);
  
  // Sélectionner l'état actuel du joueur et l'état du dernier coup manqué
  const currentPlayer = useSelector(state => 
    state.fight.players.find(p => p.id === player.id)
  );
  
  // On récupère lastAttackMissed du state global
  const lastAttackMissed = useSelector(state => state.fight.lastAttackMissed);
  
  // Vérifier si le joueur a assez de mana
  const hasEnoughMana = currentPlayer.mana >= capacity.manaCost;
  
  // Calculer le mana manquant
  const missingMana = capacity.manaCost - currentPlayer.mana;
  
  // Effet pour gérer l'affichage du message quand le monstre rate
  useEffect(() => {
    if (lastAttackMissed && currentPlayer.isOnCooldown) {
      setShowMissMessage(true);
      
      // On cache le message après 2 secondes
      const timer = setTimeout(() => {
        setShowMissMessage(false);
        // Réinitialiser l'état lastAttackMissed dans Redux
        dispatch(resetLastAttackMissed());
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [lastAttackMissed, currentPlayer.isOnCooldown, dispatch]);
  
  const activateCapacity = () => {
    // L'attaque du joueur
    dispatch(hitMonster({
      playerId: player.id,
      damage: capacity.damage,
      manaCost: capacity.manaCost
    }));
    
    console.log(`🗡️ ${player.name} utilise ${capacity.name} !`);

    // Délai avant l'attaque du monstre (1 seconde)
    setTimeout(() => {
      dispatch(hitBack({
        playerId: player.id
      }));
      
      // Après l'attaque du monstre, attendre encore avant de réactiver le bouton
      setTimeout(() => {
        dispatch(resetCooldown({
          playerId: player.id
        }));
      }, 500); // 0.5 seconde après la riposte
      
    }, 1000); // 1 seconde après l'attaque du joueur
  };

  // Déterminer la classe supplémentaire pour le bouton
  let buttonClass = `btn btn-${capacity.color}`;
  if (currentPlayer.isOnCooldown) {
    buttonClass += ' btn-disabled btn-fighting';
  } else if (!hasEnoughMana) {
    buttonClass += ' btn-low-mana';
  }

  return (
    <div className="capacity-container">
      {showMissMessage && (
        <div className="miss-message">
          Esquivé !
        </div>
      )}
      
      {/* Afficher le badge de mana manquant si nécessaire */}
      {!hasEnoughMana && !currentPlayer.isOnCooldown && (
        <div className="mana-required">
          <i className="fas fa-fire-alt"></i> {missingMana}
        </div>
      )}
      
      <button
        type="button"
        onClick={activateCapacity}
        className={buttonClass}
        disabled={!hasEnoughMana || currentPlayer.isOnCooldown}
        title={!hasEnoughMana ? `Besoin de ${missingMana} ki supplémentaire` : ""}
      >
        {currentPlayer.isOnCooldown ? (
          <span>Combat...</span>
        ) : (
          <div className="btn-content">
            <span className="capacity-name">{capacity.name}</span>
            
            {capacity.damage > 0 && (
              <span className="damage-icon">
                <i className={`fas ${capacity.icon}`}></i>
                {capacity.damage}
              </span>
            )}
            
            <span className="mana-icon">
              <i className="fas fa-fire-alt"></i>
              {capacity.manaCost}
            </span>
          </div>
        )}
      </button>
    </div>
  );
}

export default ButtonCapacity;