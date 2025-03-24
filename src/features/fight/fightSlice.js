import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    players: [
        { 
          name: "John", 
          pv: 100, 
          pvMax: 100, 
          mana: 30, 
          manaMax: 30, 
          id: 1,
          capacities: [
            { name: "Frappe", damage: 5, manaCost: 5, icon: "fa-fist-raised", color: "success" },
            { name: "Glaive", damage: 8, manaCost: 8, icon: "fa-khanda", color: "primary" },
            { name: "Méditation", damage: 0, manaCost: 0, icon: "fa-om", color: "info", effect: "mana" },
            { name: "Bombe", damage: 15, manaCost: 15, icon: "fa-bomb", color: "danger" }
          ]
        },
        { 
          name: "Jane", 
          pv: 100, 
          pvMax: 100, 
          mana: 30, 
          manaMax: 30, 
          id: 2,
          capacities: [
            { name: "Tir", damage: 6, manaCost: 4, icon: "fa-bullseye", color: "success" },
            { name: "Soin", damage: 0, manaCost: 8, icon: "fa-heart", color: "danger", effect: "heal" },
            { name: "Poison", damage: 3, manaCost: 10, icon: "fa-skull-crossbones", color: "warning", effect: "poison" },
            { name: "Pluie de flèches", damage: 12, manaCost: 12, icon: "fa-arrows-alt", color: "primary" }
          ]
        },
        { 
          name: "Jean", 
          pv: 100, 
          pvMax: 100, 
          mana: 30, 
          manaMax: 30, 
          id: 3,
          capacities: [
            { name: "Éclair", damage: 7, manaCost: 6, icon: "fa-bolt", color: "warning" },
            { name: "Boule de feu", damage: 10, manaCost: 10, icon: "fa-fire", color: "danger" },
            { name: "Armure", damage: 0, manaCost: 7, icon: "fa-shield-alt", color: "primary", effect: "shield" },
            { name: "Météore", damage: 20, manaCost: 20, icon: "fa-meteor", color: "dark" }
          ]
        },
        { 
          name: "Jill", 
          pv: 100, 
          pvMax: 100, 
          mana: 30, 
          manaMax: 30, 
          id: 4,
          capacities: [
            { name: "Coup", damage: 4, manaCost: 3, icon: "fa-hand-rock", color: "success" },
            { name: "Vol de vie", damage: 8, manaCost: 8, icon: "fa-exchange-alt", color: "danger", effect: "lifesteal" },
            { name: "Protection", damage: 0, manaCost: 5, icon: "fa-user-shield", color: "info", effect: "protect" },
            { name: "Folie", damage: 18, manaCost: 18, icon: "fa-skull", color: "dark" }
          ]
        }
      ],
  monster: {
    // Notre boss à combattre
    // Exemple: { name: "Dragon", pv: 200, pvMax: 200, strength: 15 }
    name: "Crypto",
    pv: 800,
    pvMax: 800
  },
};

export const fightSlice = createSlice({
  name: "fight",
  initialState,
  reducers: {
    hitMonster: (state, action) => {
      const { playerId, damage, manaCost } = action.payload;
      
      // Trouve le joueur par son ID
      const player = state.players.find(p => p.id === playerId);
      
      // Vérifie si le joueur a assez de mana
      if (player && player.mana >= manaCost) {
        // Réduit le mana du joueur
        player.mana -= manaCost;
        
        // Inflige les dégâts au monstre
        state.monster.pv = Math.max(0, state.monster.pv - damage);
      }
    },
  },
});

export const { hitMonster } = fightSlice.actions;

// Nous exportons le reducer généré automatiquement
export default fightSlice.reducer;