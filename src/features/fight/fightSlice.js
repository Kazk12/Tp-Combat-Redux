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
          capacities: [
            { name: "Frappe", damage: 5, manaCost: 5, icon: "fa-fist-raised", color: "success" },
            { name: "Glaive", damage: 8, manaCost: 8, icon: "fa-khanda", color: "primary" },
            { name: "Méditation", damage: 0, manaCost: 0, icon: "fa-om", color: "info", effect: "mana" },
            { name: "Bombe", damage: 15, manaCost: 15, icon: "fa-bomb", color: "danger" }
          ]
        },
        { 
          name: "Eren", 
          image: AOT, 
          pv: 100, 
          pvMax: 100, 
          mana: 30, 
          manaMax: 30, 
          id: 2,
          isOnCooldown: false,
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
    name: "French Monster",
    pv: 2500,
    pvMax: 2500,
    image : Gotaga,
    strength: 20
  },
  lastAttackMissed: false,
};

export const fightSlice = createSlice({
  name: "fight",
  initialState,
  reducers: {
    hitMonster: (state, action) => {
      const { playerId, damage, manaCost } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      
      if (player && player.mana >= manaCost && !player.isOnCooldown) {
        // Réduit le mana
        player.mana -= manaCost;
        
        // Inflige les dégâts au monstre
        state.monster.pv = Math.max(0, state.monster.pv - damage);
        
        // Active le cooldown
        player.isOnCooldown = true;
      }
    },
    hitBack: (state, action) => {
      const { playerId } = action.payload;
      const damage = state.monster.strength;
      const player = state.players.find(p => p.id === playerId);
      
      if (player) {
        // 20% de chance que le monstre rate son attaque
        const monsterMisses = Math.random() < 0.2;
        
        if (monsterMisses) {
          // Le monstre a raté son attaque
          state.lastAttackMissed = true;
          console.log("Le monstre a raté son attaque !");
        } else {
          // Le monstre touche sa cible
          const monsterDamage = Math.floor(Math.random() * damage) + 5; // 5-15 dégâts
          player.pv = Math.max(0, player.pv - monsterDamage);
          state.lastAttackMissed = false;
        }
      }
    },
    resetCooldown: (state, action) => {
      const { playerId } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      
      if (player) {
        player.isOnCooldown = false;
      }
    },
    resetLastAttackMissed: (state) => {
      state.lastAttackMissed = false;
    },
  }
});

export const { hitMonster, hitBack, resetCooldown, resetLastAttackMissed } = fightSlice.actions;

export default fightSlice.reducer;