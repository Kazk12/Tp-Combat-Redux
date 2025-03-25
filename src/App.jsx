import './App.css';
import Monster from './components/Monster/Monster';
import PlayerList from './components/PlayerList';
import GameLog from './components/GameLog/GameLog';
import UltimateAnimation from './components/UltimateAnimation/UltimateAnimation';

function App() {
  return (
    <div className="game-container">
      <h1 className="game-title">Royal Rumble <br/>-FrenchMonster VS ALL</h1>
      
      <div className="battle-arena">
        {/* Section supérieure contenant le monstre et le journal côte à côte */}
        <div className="monster-log-container">
          <div className="monster-section">
            <Monster />
          </div>
          
          <div className="log-section">
            <GameLog />
          </div>
        </div>
        
        {/* Section héros */}
        <div className="heroes-section">
          <PlayerList />
        </div>
      </div>
      
      {/* Composant d'animation des ultimes */}
      <UltimateAnimation />
    </div>
  );
}

export default App;