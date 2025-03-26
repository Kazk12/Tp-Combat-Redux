import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { completeUltimate, transformEren } from "../../features/fight/fightSlice";
import "./UltimateAnimation.css";
import ErenPostTransfo from "../../assets/Heros/ErenPostTransfo.gif";
import FireGif from "../../assets/effects/fire.gif";
import LightningGif from "../../assets/effects/lightning.gif";
import WindGif from "../../assets/effects/wind.gif";
import EnergyGif from "../../assets/effects/energy.gif";

function UltimateAnimation() {
  const dispatch = useDispatch();
  const showAnimation = useSelector(state => state.fight.showUltimateAnimation);
  const animationClass = useSelector(state => state.fight.currentUltimateAnimation);
  const player = useSelector(state => state.fight.currentUltimatePlayer);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [shake, setShake] = useState(false);
  
  useEffect(() => {
    if (showAnimation) {
      // Phase 1: Nom de l'attaque
      const phase1 = setTimeout(() => {
        setAnimationPhase(1);
      }, 500);
      
      // Phase 2: Démarrage de l'effet
      const phase2 = setTimeout(() => {
        setAnimationPhase(2);
      }, 1000);
      
      // Phase 3: Intensification
      const phase3 = setTimeout(() => {
        setAnimationPhase(3);
        setShake(true);
      }, 2000);
      
      // Phase 4: Climax
      const phase4 = setTimeout(() => {
        setAnimationPhase(4);
      }, 3000);
      
      // Fin de l'animation
      const animationTimer = setTimeout(() => {
        // Si c'est Eren, exécuter la transformation
        if (player && player.name === "Eren") {
          dispatch(transformEren());
        }
        
        dispatch(completeUltimate());
        setAnimationPhase(0);
        setShake(false);
      }, player && player.name === "Eren" ? 5000 : 4000); // Durée plus longue pour Eren
      
      return () => {
        clearTimeout(phase1);
        clearTimeout(phase2);
        clearTimeout(phase3);
        clearTimeout(phase4);
        clearTimeout(animationTimer);
      };
    }
  }, [showAnimation, dispatch, player]);
  
  if (!showAnimation || !player) return null;
  
  // Cri de guerre selon le personnage
  const getBattleCry = () => {
    switch(player.name) {
      case "Tsuna": return "X-BURNER FINAL !";
      case "Eren": return "JE VAIS TOUS VOUS ÉCRASER !";
      case "Boruto": return "RASENGAN SUPRÊME !";
      case "Isagi": return "DIRECT SHOOT !";
      default: return "ULTIMATE ATTACK!";
    }
  };
  
  // Obtenir l'effet spécifique pour chaque personnage
  const getEffectContent = () => {
    switch(player.name) {
      case "Tsuna":
        return (
          <div className="effect-container tsuna-effect">
            <div className="effect-background"></div>
            <img src={FireGif} alt="Flames" className="effect-gif" />
            {animationPhase >= 3 && <div className="tsuna-x-burner"></div>}
            {animationPhase >= 4 && <div className="effect-explosion"></div>}
            {animationPhase >= 4 && player.name !== "Eren" && 
              <div className="damage-display">{player.ultimate.damage}</div>
            }
          </div>
        );
      case "Eren":
        return (
          <div className="effect-container eren-effect">
            <div className="effect-background"></div>
            <img src={LightningGif} alt="Lightning" className="effect-gif" />
            {animationPhase >= 3 && <div className="eren-transformation"></div>}
            {animationPhase >= 4 && 
              <div className="eren-titan">
                <img src={ErenPostTransfo} alt="Titan Eren" className="titan-img" />
              </div>
            }
          </div>
        );
      case "Boruto":
        return (
          <div className="effect-container boruto-effect">
            <div className="effect-background"></div>
            <img src={WindGif} alt="Wind" className="effect-gif" />
            {animationPhase >= 3 && <div className="boruto-rasengan"></div>}
            {animationPhase >= 4 && <div className="effect-explosion blue"></div>}
            {animationPhase >= 4 && player.name !== "Eren" && 
              <div className="damage-display">{player.ultimate.damage}</div>
            }
          </div>
        );
      case "Isagi":
        return (
          <div className="effect-container isagi-effect">
            <div className="effect-background"></div>
            <img src={EnergyGif} alt="Energy" className="effect-gif" />
            {animationPhase >= 3 && <div className="isagi-trajectory"></div>}
            {animationPhase >= 4 && <div className="effect-explosion green"></div>}
            {animationPhase >= 4 && player.name !== "Eren" && 
              <div className="damage-display">{player.ultimate.damage}</div>
            }
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="ultimate-overlay">
      <div className={`ultimate-container ${shake ? 'shake' : ''}`}>
        {/* Nom de l'attaque */}
        {animationPhase >= 1 && (
          <div className="ultimate-name">
            <h1>{player.ultimate.name}</h1>
          </div>
        )}
        
        {/* Contenu de l'effet */}
        <div className="ultimate-content">
          {getEffectContent()}
        </div>
        
        {/* Cri de bataille */}
        {animationPhase >= 3 && (
          <div className="battle-cry">
            <span>{getBattleCry()}</span>
          </div>
        )}
        
        {/* Message spécial pour Eren */}
        {animationPhase >= 4 && player.name === "Eren" && (
          <div className="transformation-message">TRANSFORMATION COMPLÈTE!</div>
        )}
      </div>
    </div>
  );
}

export default UltimateAnimation;