import { createSlice } from "@reduxjs/toolkit";
import Tsuna from "../../assets/Heros/Tsuna.gif";
import AOT from "../../assets/Heros/AOT.webp";
import Boruto from "../../assets/Heros/Boruto.webp";
import Isagi from "../../assets/Heros/Isagi.jpg";
import Gotaga from "../../assets/Heros/Gota.gif";

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
          canPlay: true,
          ultimateCharge: 0, // Compteur pour l'ultime
          ultimateMaxCharge: 2, // Nombre de tours nécessaires
          isUltimateReady: false, // Indique si l'ultime est prêt
          ultimate: {
            name: "Percée du Point Zéro",
            damage: 50,
            manaCost: 20,
            description: "Libère toute la puissance des flammes de dernière volonté",
            animationClass: "tsuna-ultimate"
          },
          capacities: [
            { name: "X-Burner", damage: 8, manaCost: 5, icon: "fa-fire", color: "danger" },
            { name: "Mode Hyper", damage: 12, manaCost: 10, icon: "fa-tachometer-alt", color: "warning" },
            { name: "Flamme Régénératrice", damage: 0, manaCost: 7, icon: "fa-heart", color: "info", effect: "heal" },
            { name: "Point Zéro", damage: 20, manaCost: 15, icon: "fa-snowflake", color: "primary" }
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
          canPlay: false,
          ultimateCharge: 0,
          ultimateMaxCharge: 3,
          isUltimateReady: false,
          ultimate: {
            name: "Assaut du Titan",
            damage: 60,
            manaCost: 25,
            description: "Se transforme en Titan et écrase l'ennemi",
            animationClass: "eren-ultimate"
          },
          capacities: [
            { name: "Frappe Titanique", damage: 10, manaCost: 6, icon: "fa-fist-raised", color: "danger" },
            { name: "Rage du Titan", damage: 15, manaCost: 12, icon: "fa-skull", color: "dark" },
            { name: "Rugissement", damage: 7, manaCost: 5, icon: "fa-volume-up", color: "warning" },
            { name: "Transformation", damage: 18, manaCost: 15, icon: "fa-bolt", color: "primary" }
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
          ultimateCharge: 0,
          ultimateMaxCharge: 2,
          isUltimateReady: false,
          ultimate: {
            name: "Rasengan Suprême",
            damage: 45,
            manaCost: 20,
            description: "Concentre un immense Rasengan et le propulse sur l'ennemi",
            animationClass: "boruto-ultimate"
          },
          capacities: [
            { name: "Rasengan", damage: 8, manaCost: 6, icon: "fa-compact-disc", color: "primary" },
            { name: "Multi-Clones", damage: 12, manaCost: 8, icon: "fa-clone", color: "success" },
            { name: "Karma", damage: 16, manaCost: 12, icon: "fa-yin-yang", color: "dark" },
            { name: "Éclair Shinobi", damage: 10, manaCost: 7, icon: "fa-bolt", color: "warning" }
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
          ultimateCharge: 0,
          ultimateMaxCharge: 1,
          isUltimateReady: false,
          ultimate: {
            name: "Tir Direct Parfait",
            damage: 40,
            manaCost: 18,
            description: "Un tir parfaitement calculé qui ne peut être arrêté",
            animationClass: "isagi-ultimate"
          },
          capacities: [
            { name: "Tir Direct", damage: 7, manaCost: 4, icon: "fa-futbol", color: "success" },
            { name: "Vision Spatiale", damage: 10, manaCost: 6, icon: "fa-eye", color: "info" },
            { name: "Frappe Ego", damage: 14, manaCost: 10, icon: "fa-crown", color: "warning" },
            { name: "Tir Dévié", damage: 16, manaCost: 12, icon: "fa-random", color: "danger" }
          ]
        }
      ],
  monster: {
    name: "French Monster",
    pv: 2500,
    pvMax: 2500,
    image: Gotaga,
    strength: 20,
    isAttacking: false
  },
  currentTurn: 1,
  lastAttackMissed: false,
  roundNumber: 1,
  gameLog: ["Le combat commence !"],
  isMonsterTurn: false,
  showUltimateAnimation: false, // Indique si l'animation d'ultime est visible
  currentUltimateAnimation: null, // Classe CSS pour l'animation actuelle
  currentUltimatePlayer: null, // Joueur qui lance l'ultime actuellement
};

export const fightSlice = createSlice({
  name: "fight",
  initialState,
  reducers: {
    // Action pour attaquer le monstre pendant le tour d'un joueur
    hitMonster: (state, action) => {
      const { playerId, damage, manaCost, effect } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      
      if (player && player.mana >= manaCost && player.canPlay) {
        // Réduit le mana
        player.mana -= manaCost;
        
        // Traiter les effets spéciaux
        if (effect === "heal") {
          // Soigne le joueur
          const healAmount = 15;
          player.pv = Math.min(player.pvMax, player.pv + healAmount);
          state.gameLog.unshift(`${player.name} utilise ${action.payload.capacityName || "une capacité de soin"} et récupère ${healAmount} PV !`);
        } else {
          // Inflige les dégâts au monstre
          state.monster.pv = Math.max(0, state.monster.pv - damage);
          
          // Message selon le personnage
          let attackMessage = "";
          switch(player.name) {
            case "Tsuna":
              attackMessage = `${player.name} libère ses flammes de dernière volonté et inflige ${damage} dégâts !`;
              break;
            case "Eren":
              attackMessage = `${player.name} attaque férocement et inflige ${damage} dégâts !`;
              break;
            case "Boruto":
              attackMessage = `${player.name} utilise ses techniques ninja et inflige ${damage} dégâts !`;
              break;
            case "Isagi":
              attackMessage = `${player.name} calcule la trajectoire parfaite et inflige ${damage} dégâts !`;
              break;
            default:
              attackMessage = `${player.name} utilise une capacité et inflige ${damage} dégâts !`;
          }
          
          state.gameLog.unshift(attackMessage);
        }
        
        // Activer le cooldown
        player.isOnCooldown = true;
        player.canPlay = false;
        
        // Incrémenter la charge de l'ultime si pas encore prêt
        if (!player.isUltimateReady) {
          player.ultimateCharge += 1;
          
          // Vérifier si l'ultime est prêt
          if (player.ultimateCharge >= player.ultimateMaxCharge) {
            player.isUltimateReady = true;
            state.gameLog.unshift(`🔥 L'ultime de ${player.name} est prêt à être utilisé !`);
          } else {
            const remaining = player.ultimateMaxCharge - player.ultimateCharge;
            state.gameLog.unshift(`Charge ultime de ${player.name}: ${player.ultimateCharge}/${player.ultimateMaxCharge} (encore ${remaining} tour${remaining > 1 ? 's' : ''})`);
          }
        }
        
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
    
    // Action pour utiliser un ultime
    useUltimate: (state, action) => {
      const { playerId } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      
      if (player && player.isUltimateReady && player.mana >= player.ultimate.manaCost && player.canPlay) {
        // Réduit le mana
        player.mana -= player.ultimate.manaCost;
        
        // Afficher l'animation de l'ultime
        state.showUltimateAnimation = true;
        state.currentUltimateAnimation = player.ultimate.animationClass;
        state.currentUltimatePlayer = player;
        
        // Message spécial pour l'ultime
        let ultimateMessage = "";
        switch(player.name) {
          case "Tsuna":
            ultimateMessage = `🔥🔥 ${player.name} libère son ultime "${player.ultimate.name}" et déchaîne la puissance du Ciel ! 🔥🔥`;
            break;
          case "Eren":
            ultimateMessage = `🔥🔥 ${player.name} utilise son ultime "${player.ultimate.name}" et se transforme en Titan d'attaque ! 🔥🔥`;
            break;
          case "Boruto":
            ultimateMessage = `🔥🔥 ${player.name} concentre son chakra et lance son ultime "${player.ultimate.name}" ! 🔥🔥`;
            break;
          case "Isagi":
            ultimateMessage = `🔥🔥 ${player.name} calcule le mouvement parfait et exécute son ultime "${player.ultimate.name}" ! 🔥🔥`;
            break;
          default:
            ultimateMessage = `🔥🔥 ${player.name} lance son attaque ultime "${player.ultimate.name}" ! 🔥🔥`;
        }
        
        state.gameLog.unshift(ultimateMessage);
        
        // Les dégâts seront appliqués après l'animation via l'action completeUltimate
        
        // Réinitialiser l'état de l'ultime
        player.isUltimateReady = false;
        player.ultimateCharge = 0;
        
        // Désactiver le joueur en attendant la fin de l'animation
        player.isOnCooldown = true;
        player.canPlay = false;
      }
    },
    
    // Action appelée après la fin de l'animation d'ultime
    completeUltimate: (state) => {
      if (state.currentUltimatePlayer) {
        const player = state.currentUltimatePlayer;
        
        // Appliquer les dégâts de l'ultime
        state.monster.pv = Math.max(0, state.monster.pv - player.ultimate.damage);
        
        // Message pour les dégâts
        state.gameLog.unshift(`L'ultime de ${player.name} inflige ${player.ultimate.damage} dégâts massifs au monstre !`);
        
        // Réinitialiser l'animation
        state.showUltimateAnimation = false;
        state.currentUltimateAnimation = null;
        state.currentUltimatePlayer = null;
        
        // Passer au joueur suivant
        const nextPlayerId = player.id % 4 + 1;
        state.currentTurn = nextPlayerId;
        
        // Vérifier si tous les joueurs ont joué
        if (player.id === 4) {
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
          
          // Messages d'attaque variés
          const attackMessages = [
            `Le monstre attaque ${targetPlayer.name} et inflige ${damage} dégâts !`,
            `Le monstre frappe ${targetPlayer.name} de plein fouet pour ${damage} dégâts !`,
            `${targetPlayer.name} subit ${damage} dégâts d'une attaque violente !`,
            `Le monstre charge ${targetPlayer.name} et cause ${damage} dégâts !`
          ];
          
          const randomMessage = attackMessages[Math.floor(Math.random() * attackMessages.length)];
          state.gameLog.unshift(randomMessage);
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
        
        // Messages personnalisés pour passer le tour
        const skipMessages = [
          `${player.name} reprend son souffle et récupère 3 ki.`,
          `${player.name} se concentre et restaure 3 ki.`,
          `${player.name} économise son énergie (+3 ki).`,
          `${player.name} passe son tour et récupère 3 ki.`
        ];
        
        const randomMessage = skipMessages[Math.floor(Math.random() * skipMessages.length)];
        state.gameLog.unshift(randomMessage);
        
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
  hitMonster, 
  monsterAttack, 
  skipTurn, 
  resetLastAttackMissed,
  useUltimate,
  completeUltimate,
  resetGame 
} = fightSlice.actions;

export default fightSlice.reducer;