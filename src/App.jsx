import './App.css';
import Monster from './components/Monster/Monster';
import PlayerList from './components/PlayerList';

function App() {
  return (
    <div className="game-container">
      <h1 className="game-title">Royal Rumble <br/>-FrenchMonster VS ALL</h1>
      
      <div className="battle-arena">
        {/* Section monstre */}
        <div className="monster-section">
          <Monster />
        </div>
        
        {/* Section héros */}
        <div className="heroes-section">
          <PlayerList />
        </div>
      </div>
    </div>
  );
}

export default App;