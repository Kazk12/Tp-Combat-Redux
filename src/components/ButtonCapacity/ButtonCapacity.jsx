import { useDispatch, useSelector } from "react-redux";
import { hitMonster, monsterAttack, resetLastAttackMissed } from "../../features/fight/fightSlice";
import "./ButtonCapacity.css";
import { useEffect, useState } from "react";

function ButtonCapacity({ player, capacity }) {
  const dispatch = useDispatch();
  const [showMissMessage, setShowMissMessage] = useState(false);
  
  // Sélectionner l'état actuel du joueur, du tour et du monstre
  const currentPlayer = useSelector(state => 
    state.fight.players.find(p => p.id === player.id)
  );
  
  const currentTurn = useSelector(state => state.fight.currentTurn);
  const isMonsterTurn = useSelector(state => state.fight.isMonsterTurn);
  const lastAttackMissed = useSelector(state => state.fight.lastAttackMissed);
  
  // Vérifier si c'est le tour de ce joueur
  const isPlayerTurn = currentPlayer.canPlay && currentTurn === player.id;
  
  // Vérifier si le joueur a assez de mana
  const hasEnoughMana = currentPlayer.mana >= capacity.manaCost;
  
  // Calculer le mana manquant
  const missingMana = capacity.manaCost - currentPlayer.mana;
  
  // Effet pour gérer l'attaque du monstre
  useEffect(() => {
    if (isMonsterTurn) {
      // Délai avant l'attaque du monstre
      const monsterTimer = setTimeout(() => {
        dispatch(monsterAttack());
      }, 1500);
      
      return () => clearTimeout(monsterTimer);
    }
  }, [isMonsterTurn, dispatch]);
  
  // Effet pour gérer l'affichage du message quand le monstre rate
  useEffect(() => {
    if (lastAttackMissed) {
      setShowMissMessage(true);
      
      // On cache le message après 2 secondes
      const timer = setTimeout(() => {
        setShowMissMessage(false);
        dispatch(resetLastAttackMissed());
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [lastAttackMissed, dispatch]);
  
  const activateCapacity = () => {
    if (!isPlayerTurn) return; // Ne rien faire si ce n'est pas le tour du joueur
    
    // L'attaque du joueur
    dispatch(hitMonster({
      playerId: player.id,
      damage: capacity.damage,
      manaCost: capacity.manaCost
    }));
  };

  // Déterminer les classes du bouton
  let buttonClass = `btn btn-${capacity.color}`;
  
  // Désactivé si ce n'est pas le tour du joueur, si le joueur n'a pas assez de mana
  // ou si c'est au tour du monstre
  const isDisabled = !isPlayerTurn || !hasEnoughMana || isMonsterTurn;
  
  // Styles différents selon la situation
  if (!isPlayerTurn) {
    buttonClass += ' btn-disabled';
  } else if (!hasEnoughMana) {
    buttonClass += ' btn-low-mana';
  } else if (isMonsterTurn) {
    buttonClass += ' btn-disabled';
  }
  
  // Ajouter une classe spéciale si c'est le tour de ce joueur
  if (isPlayerTurn) {
    buttonClass += ' player-turn';
  }

  return (
    <div className="capacity-container">
      {showMissMessage && (
        <div className="miss-message">
          Esquivé !
        </div>
      )}
      
      {/* Afficher l'indicateur de tour */}
      {isPlayerTurn && (
        <div className="turn-indicator">
          <i className="fas fa-chevron-right"></i> À toi !
        </div>
      )}
      
      {/* Afficher le badge de mana manquant si nécessaire */}
      {!hasEnoughMana && isPlayerTurn && (
        <div className="mana-required">
          <i className="fas fa-fire-alt"></i> {missingMana}
        </div>
      )}
      
      <button
        type="button"
        onClick={activateCapacity}
        className={buttonClass}
        disabled={isDisabled}
        title={!hasEnoughMana ? `Besoin de ${missingMana} ki supplémentaire` : ""}
      >
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
      </button>
    </div>
  );
}

export default ButtonCapacity;