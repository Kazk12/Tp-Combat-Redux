import { createSlice } from "@reduxjs/toolkit";
import Tsuna from "../../assets/Heros/Tsuna.jpg";
import AOT from "../../assets/Heros/AOT.webp";
import Boruto from "../../assets/Heros/Boruto.webp";
import Isagi from "../../assets/Heros/Isagi.jpg";
import Gotaga from "../../assets/Heros/Gota.webp";

const initialState = {
    players: [
        { 
          name: "Tsuna",
          image: Tsuna, 
          pv: 100, 
          pvMax: 100, 
          mana: 30, 
          manaMax: 30, 
          id: 1,
          isOnCooldown: false,
          canPlay: true, // Nouveau: indique si le joueur peut jouer
          capacities: [
            { name: "Frappe", damage: 5, manaCost: 5, icon: "fa-fist-raised", color: "success" },
            { name: "Glaive", damage: 8, manaCost: 8, icon: "fa-khanda", color: "primary" },
            { name: "Méditation", damage: 0, manaCost: 0, icon: "fa-om", color: "info", effect: "mana" },
            { name: "Bombe", damage: 15, manaCost: 15, icon: "fa-bomb", color: "danger" }
          ]
        },
        // ... autres joueurs avec canPlay: false
        { 
          name: "Eren", 
          image: AOT, 
          pv: 100, 
          pvMax: 100, 
          mana: 30, 
          manaMax: 30, 
          id: 2,
          isOnCooldown: false,
          canPlay: false, // seul joueur 1 peut jouer au début
          capacities: [
            { name: "Tir", damage: 6, manaCost: 4, icon: "fa-bullseye", color: "success" },
            { name: "Soin", damage: 0, manaCost: 8, icon: "fa-heart", color: "danger", effect: "heal" },
            { name: "Poison", damage: 3, manaCost: 10, icon: "fa-skull-crossbones", color: "warning", effect: "poison" },
            { name: "Pluie de flèches", damage: 12, manaCost: 12, icon: "fa-arrows-alt", color: "primary" }
          ]
        },
        { 
          name: "Boruto", 
          image: Boruto, 
          pv: 100, 
          pvMax: 100, 
          mana: 30, 
          manaMax: 30, 
          id: 3,
          isOnCooldown: false,
          canPlay: false,
          capacities: [
            { name: "Éclair", damage: 7, manaCost: 6, icon: "fa-bolt", color: "warning" },
            { name: "Boule de feu", damage: 10, manaCost: 10, icon: "fa-fire", color: "danger" },
            { name: "Armure", damage: 0, manaCost: 7, icon: "fa-shield-alt", color: "primary", effect: "shield" },
            { name: "Météore", damage: 20, manaCost: 20, icon: "fa-meteor", color: "dark" }
          ]
        },
        { 
          name: "Isagi",
          image: Isagi,  
          pv: 100, 
          pvMax: 100, 
          mana: 30, 
          manaMax: 30, 
          id: 4,
          isOnCooldown: false,
          canPlay: false,
          capacities: [
            { name: "Coup", damage: 4, manaCost: 3, icon: "fa-hand-rock", color: "success" },
            { name: "Vol de vie", damage: 8, manaCost: 8, icon: "fa-exchange-alt", color: "danger", effect: "lifesteal" },
            { name: "Protection", damage: 0, manaCost: 5, icon: "fa-user-shield", color: "info", effect: "protect" },
            { name: "Folie", damage: 18, manaCost: 18, icon: "fa-skull", color: "dark" }
          ]
        }
      ],
  monster: {
    name: "French Monster",
    pv: 2500,
    pvMax: 2500,
    image: Gotaga,
    strength: 20,
    isAttacking: false // Nouvel état pour indiquer si le monstre attaque
  },
  currentTurn: 1, // ID du joueur dont c'est le tour (1-4)
  lastAttackMissed: false,
  roundNumber: 1, // Numéro du round actuel
  gameLog: ["Le combat commence !"], // Journal des actions
  isMonsterTurn: false, // Indique si c'est au tour du monstre
};

export const fightSlice = createSlice({
  name: "fight",
  initialState,
  reducers: {
    // Action pour attaquer le monstre pendant le tour d'un joueur
    hitMonster: (state, action) => {
      const { playerId, damage, manaCost } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      
      if (player && player.mana >= manaCost && player.canPlay) {
        // Réduit le mana
        player.mana -= manaCost;
        
        // Inflige les dégâts au monstre
        state.monster.pv = Math.max(0, state.monster.pv - damage);
        
        // Ajouter au journal
        state.gameLog.unshift(`${player.name} utilise une capacité et inflige ${damage} dégâts !`);
        
        // Activer le cooldown
        player.isOnCooldown = true;
        player.canPlay = false;
        
        // Passer au joueur suivant
        const nextPlayerId = playerId % 4 + 1;
        state.currentTurn = nextPlayerId;
        
        // Vérifier si tous les joueurs ont joué
        if (playerId === 4) {
          // Si oui, c'est au tour du monstre
          state.isMonsterTurn = true;
          state.gameLog.unshift(`Fin du round ${state.roundNumber}. Le monstre prépare son attaque...`);
        } else {
          // Activer le joueur suivant
          const nextPlayer = state.players.find(p => p.id === nextPlayerId);
          if (nextPlayer) {
            nextPlayer.canPlay = true;
          }
        }
      }
    },
    
    // Action pour le contre du monstre (supprimée car remplacée par monsterAttack)
    
    // Nouvelle action pour l'attaque du monstre à la fin du round
    monsterAttack: (state) => {
      if (state.isMonsterTurn) {
        // Le monstre attaque
        state.monster.isAttacking = true;
        
        // Sélectionner un joueur aléatoirement
        const alivePlayers = state.players.filter(p => p.pv > 0);
        if (alivePlayers.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * alivePlayers.length);
        const targetPlayer = alivePlayers[randomIndex];
        
        // 20% de chance que le monstre rate son attaque
        const monsterMisses = Math.random() < 0.2;
        
        if (monsterMisses) {
          // Le monstre a raté son attaque
          state.lastAttackMissed = true;
          state.gameLog.unshift(`Le monstre tente d'attaquer ${targetPlayer.name} mais rate son coup !`);
        } else {
          // Le monstre touche sa cible
          const damage = Math.floor(Math.random() * state.monster.strength) + 10; // 10-30 dégâts
          targetPlayer.pv = Math.max(0, targetPlayer.pv - damage);
          state.gameLog.unshift(`Le monstre attaque ${targetPlayer.name} et inflige ${damage} dégâts !`);
        }
        
        // Fin du tour du monstre
        state.monster.isAttacking = false;
        state.isMonsterTurn = false;
        
        // Préparer le prochain round
        state.roundNumber += 1;
        
        // Réinitialiser tous les joueurs pour le prochain round
        state.players.forEach(player => {
          player.isOnCooldown = false;
          player.canPlay = player.id === 1; // Seul le joueur 1 peut jouer au début
        });
        
        // Mettre à jour le tour
        state.currentTurn = 1;
        
        state.gameLog.unshift(`Début du round ${state.roundNumber} !`);
      }
    },
    
    // Action pour passer le tour d'un joueur
    skipTurn: (state, action) => {
      const { playerId } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      
      if (player && player.canPlay) {
        player.canPlay = false;
        state.gameLog.unshift(`${player.name} passe son tour.`);
        
        // Récupérer un peu de mana en passant
        player.mana = Math.min(player.manaMax, player.mana + 3);
        
        // Passer au joueur suivant
        const nextPlayerId = playerId % 4 + 1;
        state.currentTurn = nextPlayerId;
        
        // Vérifier si tous les joueurs ont joué
        if (playerId === 4) {
          // Si oui, c'est au tour du monstre
          state.isMonsterTurn = true;
          state.gameLog.unshift(`Fin du round ${state.roundNumber}. Le monstre prépare son attaque...`);
        } else {
          // Activer le joueur suivant
          const nextPlayer = state.players.find(p => p.id === nextPlayerId);
          if (nextPlayer) {
            nextPlayer.canPlay = true;
          }
        }
      }
    },
    
    // Réinitialiser l'état lastAttackMissed
    resetLastAttackMissed: (state) => {
      state.lastAttackMissed = false;
    },
    
    // Réinitialiser le jeu
    resetGame: (state) => {
      return initialState;
    }
  }
});


export const { 
  hitBack,
  hitMonster, 
  monsterAttack, 
  skipTurn, 
  resetLastAttackMissed, 
  resetGame 
} = fightSlice.actions;

export default fightSlice.reducer;