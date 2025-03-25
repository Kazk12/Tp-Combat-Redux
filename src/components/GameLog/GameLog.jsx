import { useSelector } from "react-redux";
import "./GameLog.css";

function GameLog() {
  const gameLog = useSelector(state => state.fight.gameLog);
  const roundNumber = useSelector(state => state.fight.roundNumber);
  
  return (
    <div className="game-log-container">
      <div className="game-log-header">
        <h3>Journal de Combat <span className="round-badge">Round {roundNumber}</span></h3>
      </div>
      <div className="game-log-entries">
        {gameLog.slice(0, 7).map((entry, index) => (
          <div 
            key={index} 
            className={`log-entry ${index === 0 ? 'latest-entry' : ''}`}
          >
            {index === 0 && <i className="fas fa-chevron-right log-icon"></i>}
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameLog;