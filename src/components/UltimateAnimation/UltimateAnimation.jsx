import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { completeUltimate } from "../../features/fight/fightSlice";
import "./UltimateAnimation.css";

function UltimateAnimation() {
  const dispatch = useDispatch();
  const showAnimation = useSelector(state => state.fight.showUltimateAnimation);
  const animationClass = useSelector(state => state.fight.currentUltimateAnimation);
  const player = useSelector(state => state.fight.currentUltimatePlayer);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [shake, setShake] = useState(false);
  const containerRef = useRef(null);
  
  // Gestion du cycle d'animation
  useEffect(() => {
    if (showAnimation) {
      // Introduction (éclair & texte)
      const phase1 = setTimeout(() => setAnimationPhase(1), 300);
      
      // Entrée du personnage avec pose
      const phase2 = setTimeout(() => setAnimationPhase(2), 1000);
      
      // Préparation de l'attaque (charge d'énergie)
      const phase3 = setTimeout(() => {
        setAnimationPhase(3);
        // Effet de vibration pendant la charge
        setShake(true);
      }, 1700);
      
      // Lancement de l'attaque
      const phase4 = setTimeout(() => {
        setAnimationPhase(4);
        setShake(false);
      }, 2500);
      
      // Impact final
      const phase5 = setTimeout(() => {
        setAnimationPhase(5);
        // Effet de vibration de l'impact
        setShake(true);
      }, 3000);
      
      // Fin de l'animation
      const animationTimer = setTimeout(() => {
        dispatch(completeUltimate());
        setAnimationPhase(0);
        setShake(false);
      }, 4200);
      
      return () => {
        clearTimeout(phase1);
        clearTimeout(phase2);
        clearTimeout(phase3);
        clearTimeout(phase4);
        clearTimeout(phase5);
        clearTimeout(animationTimer);
      };
    }
  }, [showAnimation, dispatch]);
  
  if (!showAnimation || !player) return null;
  
  // Texte personnalisé pour chaque personnage
  const getUltimateBattleCry = () => {
    switch(player.name) {
      case "Tsuna":
        return "POINT ZÉRO PERCÉE !";
      case "Eren":
        return "JE VAIS TOUS VOUS TUER !";
      case "Boruto":
        return "DISPARAIS DANS MON RASENGAN !";
      case "Isagi":
        return "JE VOIS TOUT LE TERRAIN !";
      default:
        return "ULTIMATE ATTACK!";
    }
  };
  
  // Déterminer les effets spécifiques selon le personnage
  const getCharacterSpecificEffects = () => {
    switch(player.name) {
      case "Tsuna":
        return (
          <>
            {/* Arrière-plan de flammes */}
            <div className="ultimate-environment tsuna-environment">
              <div className="tsuna-flame-bg"></div>
              <div className="tsuna-flame-radial"></div>
            </div>
            
            {/* Éléments d'animation par phase */}
            {animationPhase >= 2 && <div className="tsuna-aura"></div>}
            {animationPhase >= 3 && <div className="tsuna-flame-charge"></div>}
            {animationPhase >= 3 && <div className="tsuna-gloves-glow"></div>}
            {animationPhase >= 4 && (
              <>
                <div className="tsuna-x-beam"></div>
                <div className="tsuna-fire-trail"></div>
              </>
            )}
            {animationPhase >= 5 && <div className="tsuna-explosion"></div>}
          </>
        );
        
      case "Eren":
        return (
          <>
            {/* Arrière-plan apocalyptique */}
            <div className="ultimate-environment eren-environment">
              <div className="eren-sky"></div>
              <div className="eren-ruins"></div>
            </div>
            
            {/* Éléments d'animation par phase */}
            {animationPhase >= 2 && <div className="eren-transform-lightning"></div>}
            {animationPhase >= 3 && (
              <>
                <div className="eren-titan-silhouette"></div>
                <div className="eren-steam-effect"></div>
              </>
            )}
            {animationPhase >= 4 && <div className="eren-titan-roar"></div>}
            {animationPhase >= 5 && (
              <>
                <div className="eren-titan-fist"></div>
                <div className="eren-ground-shatter"></div>
              </>
            )}
          </>
        );
        
      case "Boruto":
        return (
          <>
            {/* Arrière-plan ninja */}
            <div className="ultimate-environment boruto-environment">
              <div className="boruto-chakra-flow"></div>
              <div className="boruto-wind-spiral"></div>
            </div>
            
            {/* Éléments d'animation par phase */}
            {animationPhase >= 2 && <div className="boruto-chakra-aura"></div>}
            {animationPhase >= 3 && (
              <>
                <div className="boruto-shadow-clones"></div>
                <div className="boruto-rasengan-form"></div>
              </>
            )}
            {animationPhase >= 4 && <div className="boruto-dash-lines"></div>}
            {animationPhase >= 5 && <div className="boruto-rasengan-impact"></div>}
          </>
        );
        
      case "Isagi":
        return (
          <>
            {/* Arrière-plan terrain de football */}
            <div className="ultimate-environment isagi-environment">
              <div className="isagi-field"></div>
              <div className="isagi-crowd"></div>
            </div>
            
            {/* Éléments d'animation par phase */}
            {animationPhase >= 2 && <div className="isagi-focus-lines"></div>}
            {animationPhase >= 3 && (
              <>
                <div className="isagi-trajectory-calculations"></div>
                <div className="isagi-spatial-awareness"></div>
              </>
            )}
            {animationPhase >= 4 && <div className="isagi-ball-spin"></div>}
            {animationPhase >= 5 && <div className="isagi-goal-explosion"></div>}
          </>
        );
        
      default:
        return null;
    }
  };
  
  // Classes dynamiques pour l'animation
  const containerClasses = `
    ultimate-animation-container 
    ${animationClass} 
    phase-${animationPhase}
    ${shake ? 'screen-shake' : ''}
  `;
  
  return (
    <div className="ultimate-animation-overlay">
      <div 
        ref={containerRef}
        className={containerClasses}
      >
        {/* Flash initial */}
        <div className="ultimate-initial-flash"></div>
        
        {/* Fond dynamique */}
        <div className="ultimate-dynamic-background">
          <div className="ultimate-particles"></div>
          <div className="ultimate-energy-waves"></div>
        </div>
        
        {/* Environnement spécifique au personnage */}
        {getCharacterSpecificEffects()}
        
        {/* Contenu principal */}
        <div className="ultimate-animation-content">
          {/* Intro du nom de l'attaque */}
          {animationPhase >= 1 && (
            <div className="ultimate-intro">
              <div className="ultimate-name-plate">
                <h2 className="ultimate-technique-name">{player.ultimate.name}</h2>
                <div className="ultimate-name-glow"></div>
              </div>
              
              <div className="ultimate-intro-effects">
                <div className="ultimate-intro-slash-left"></div>
                <div className="ultimate-intro-slash-right"></div>
                <div className="ultimate-intro-burst"></div>
              </div>
            </div>
          )}
          
          {/* Personnage */}
          {animationPhase >= 2 && (
            <div className={`ultimate-character phase-${animationPhase}`}>
              <div className="ultimate-character-pose">
                <img src={player.image} alt={player.name} className="character-image" />
                <div className="character-shadow"></div>
              </div>
            </div>
          )}
          
          {/* Cri de bataille */}
          {animationPhase >= 3 && (
            <div className="ultimate-battle-cry">
              <span>{getUltimateBattleCry()}</span>
            </div>
          )}
          
          {/* Effets de vitesse/mouvement */}
          {animationPhase >= 4 && (
            <div className="ultimate-action-lines">
              <div className="speed-line-1"></div>
              <div className="speed-line-2"></div>
              <div className="speed-line-3"></div>
              <div className="speed-line-focus"></div>
            </div>
          )}
          
          {/* Impact et dégâts */}
          {animationPhase >= 5 && (
            <div className="ultimate-impact-sequence">
              <div className="ultimate-impact-flash"></div>
              <div className="ultimate-impact-shockwave"></div>
              
              <div className="ultimate-damage-counter">
                <span className="damage-number">{player.ultimate.damage}</span>
                <span className="damage-label">DÉGÂTS CRITIQUES</span>
                <div className="damage-effect-burst"></div>
              </div>
            </div>
          )}
          
          {/* Effets manga */}
          <div className="ultimate-manga-effects">
            <div className="manga-lines"></div>
            <div className="manga-dots"></div>
            <div className="manga-focus-shadows"></div>
          </div>
          
          {/* Vignettes manga (pour effet bande dessinée) */}
          <div className={`ultimate-manga-panels phase-${animationPhase}`}>
            {animationPhase >= 3 && <div className="manga-panel panel-1"></div>}
            {animationPhase >= 4 && <div className="manga-panel panel-2"></div>}
            {animationPhase >= 5 && <div className="manga-panel panel-3"></div>}
          </div>
        </div>
        
        {/* Flash final */}
        {animationPhase >= 5 && <div className="ultimate-final-flash"></div>}
      </div>
    </div>
  );
}

export default UltimateAnimation;