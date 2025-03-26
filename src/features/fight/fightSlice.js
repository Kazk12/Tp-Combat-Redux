import { createSlice } from "@reduxjs/toolkit";
import Tsuna from "../../assets/Heros/Tsuna.gif";
import AOT from "../../assets/Heros/AOT.webp";
import ErenPostTransfo from "../../assets/Heros/ErenPostTransfo.gif"; // Image pour Eren transformé
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
          ultimateCharge: 0,
          ultimateMaxCharge: 2,
          isUltimateReady: false,
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
          isTransformed: false, // Nouvel attribut pour indiquer si Eren est transformé
          ultimate: {
            name: "Assaut du Titan",
            damage: 0, // Pas de dégâts directs, c'est une transformation
            manaCost: 0,
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
    pv: 100,
    pvMax: 100,
    image: Gotaga,
    strength: 50,
    isAttacking: false
  },
  currentTurn: 1,
  lastAttackMissed: false,
  roundNumber: 1,
  gameLog: ["Le combat commence !"],
  isMonsterTurn: false,
  showUltimateAnimation: false,
  currentUltimateAnimation: null,
  currentUltimatePlayer: null,
};

export const fightSlice = createSlice({
  name: "fight",
  initialState,
  reducers: {
    // Action pour attaquer le monstre pendant le tour d'un joueur
    hitMonster: (state, action) => {
      const { playerId, damage, manaCost, effect, capacityName } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      
      // Vérifier que le joueur est vivant et peut jouer
      if (player && player.pv > 0 && player.mana >= manaCost && player.canPlay) {
        // Réduit le mana
        player.mana -= manaCost;
        
        // Traiter les effets spéciaux
        if (effect === "heal") {
          // Soigne le joueur
          const healAmount = 15;
          player.pv = Math.min(player.pvMax, player.pv + healAmount);
          state.gameLog.unshift(`${player.name} utilise ${capacityName || "une capacité de soin"} et récupère ${healAmount} PV !`);
        } else {
          // Calculer les dégâts (bonus pour Eren transformé)
          let finalDamage = damage;
          if (player.name === "Eren" && player.isTransformed) {
            finalDamage = Math.floor(damage * 1.5); // 50% de bonus de dégâts
            state.gameLog.unshift(`Le pouvoir du Titan augmente les dégâts de ${damage} à ${finalDamage} !`);
          }
          
          // Inflige les dégâts au monstre
          state.monster.pv = Math.max(0, state.monster.pv - finalDamage);
          
          // Message selon le personnage
          let attackMessage = "";
          switch(player.name) {
            case "Tsuna":
              attackMessage = `${player.name} libère ses flammes de dernière volonté et inflige ${finalDamage} dégâts !`;
              break;
            case "Eren":
              if (player.isTransformed) {
                attackMessage = `Le Titan d'Attaque écrase le monstre et inflige ${finalDamage} dégâts !`;
              } else {
                attackMessage = `${player.name} attaque férocement et inflige ${finalDamage} dégâts !`;
              }
              break;
            case "Boruto":
              attackMessage = `${player.name} utilise ses techniques ninja et inflige ${finalDamage} dégâts !`;
              break;
            case "Isagi":
              attackMessage = `${player.name} calcule la trajectoire parfaite et inflige ${finalDamage} dégâts !`;
              break;
            default:
              attackMessage = `${player.name} utilise une capacité et inflige ${finalDamage} dégâts !`;
          }
          
          state.gameLog.unshift(attackMessage);
          
          // Vérifier si le monstre est vaincu
          if (state.monster.pv <= 0) {
            state.gameLog.unshift(`🎉 VICTOIRE ! Le ${state.monster.name} a été vaincu !`);
            return;
          }
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
        passTurnToNextPlayer(state, playerId);
      }
    },
    
    // Action pour utiliser un ultime
    useUltimate: (state, action) => {
      const { playerId } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      
      // Vérifier que le joueur est vivant et peut utiliser son ultime
      if (player && player.pv > 0 && player.isUltimateReady && player.mana >= player.ultimate.manaCost && player.canPlay) {
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
        
        // Réinitialiser l'état de l'ultime
        player.isUltimateReady = false;
        player.ultimateCharge = 0;
        
        // Désactiver le joueur en attendant la fin de l'animation
        player.isOnCooldown = true;
        player.canPlay = false;
      }
    },
    
    // Action pour transformer Eren
    transformEren: (state) => {
      const eren = state.players.find(p => p.name === "Eren");
      if (eren) {
        // Changer l'image d'Eren pour sa forme Titan
        eren.image = ErenPostTransfo;
        
        // Marquer qu'Eren est transformé
        eren.isTransformed = true;
        
        // Donner un bonus statistique après la transformation
        eren.pvMax += 50;
        eren.pv += 50;
        eren.manaMax += 20;
        eren.mana += 20;
        
        // Message de transformation
        state.gameLog.unshift("🔄 Eren s'est transformé en Titan d'attaque ! Sa puissance a augmenté (+50 PV, +20 Mana) !");
      }
    },
    
    // Action appelée après la fin de l'animation d'ultime
    completeUltimate: (state) => {
      if (state.currentUltimatePlayer) {
        const player = state.currentUltimatePlayer;
        
        // Pour Eren, pas de dégâts directs, c'est une transformation
        if (player.name === "Eren") {
          // Pas de dégâts à appliquer
          state.gameLog.unshift(`La transformation d'Eren en Titan est complète. Sa puissance au combat est décuplée !`);
        } else {
          // Appliquer les dégâts de l'ultime pour les autres personnages
          state.monster.pv = Math.max(0, state.monster.pv - player.ultimate.damage);
          state.gameLog.unshift(`L'ultime de ${player.name} inflige ${player.ultimate.damage} dégâts massifs au monstre !`);
        }
        
        // Vérifier si le monstre est vaincu
        if (state.monster.pv <= 0) {
          state.gameLog.unshift(`🎉 VICTOIRE ! Le ${state.monster.name} a été vaincu !`);
          
          // Réinitialiser l'animation
          state.showUltimateAnimation = false;
          state.currentUltimateAnimation = null;
          state.currentUltimatePlayer = null;
          return;
        }
        
        // Réinitialiser l'animation
        state.showUltimateAnimation = false;
        state.currentUltimateAnimation = null;
        state.currentUltimatePlayer = null;
        
        // Passer au joueur suivant
        passTurnToNextPlayer(state, player.id);
      }
    },
    
    // Nouvelle action pour l'attaque du monstre à la fin du round
    monsterAttack: (state) => {
      if (state.isMonsterTurn) {
        // Vérifier s'il reste des joueurs vivants
        const alivePlayers = state.players.filter(p => p.pv > 0);
        
        if (alivePlayers.length === 0) {
          // Game over si tous les joueurs sont morts
          state.gameLog.unshift("💀 GAME OVER ! Tous les héros ont été vaincus...");
          state.isMonsterTurn = false;  // Éviter la boucle infinie
          return;
        }
        
        // Le monstre attaque
        state.monster.isAttacking = true;
        
        // Sélectionner un joueur vivant aléatoirement
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
          
          // Réduction des dégâts pour Eren transformé
          let finalDamage = damage;
          if (targetPlayer.name === "Eren" && targetPlayer.isTransformed) {
            finalDamage = Math.floor(damage * 0.7); // 30% de résistance aux dégâts
            state.gameLog.unshift(`L'armure du Titan réduit les dégâts de ${damage} à ${finalDamage} !`);
          }
          
          targetPlayer.pv = Math.max(0, targetPlayer.pv - finalDamage);
          
          // Messages d'attaque variés
          const attackMessages = [
            `Le monstre attaque ${targetPlayer.name} et inflige ${finalDamage} dégâts !`,
            `Le monstre frappe ${targetPlayer.name} de plein fouet pour ${finalDamage} dégâts !`,
            `${targetPlayer.name} subit ${finalDamage} dégâts d'une attaque violente !`,
            `Le monstre charge ${targetPlayer.name} et cause ${finalDamage} dégâts !`
          ];
          
          const randomMessage = attackMessages[Math.floor(Math.random() * attackMessages.length)];
          state.gameLog.unshift(randomMessage);
          
          // Message si le joueur est mort
          if (targetPlayer.pv <= 0) {
            state.gameLog.unshift(`💀 ${targetPlayer.name} a été vaincu !`);
          }
        }
        
        // Fin du tour du monstre
        state.monster.isAttacking = false;
        state.isMonsterTurn = false;
        
        // Préparer le prochain round
        state.roundNumber += 1;
        
        // Vérifier s'il reste des joueurs vivants
        const remainingAlivePlayers = state.players.filter(p => p.pv > 0);
        if (remainingAlivePlayers.length === 0) {
          state.gameLog.unshift("💀 GAME OVER ! Tous les héros ont été vaincus...");
          return;
        }
        
        // Réinitialiser tous les joueurs pour le prochain round
        state.players.forEach(player => {
          player.isOnCooldown = false;
          player.canPlay = false; // Tous désactivés par défaut
        });
        
        // Trouver le premier joueur vivant et l'activer
        let firstAlivePlayerFound = false;
        for (let i = 1; i <= 4; i++) {
          const player = state.players.find(p => p.id === i);
          if (player && player.pv > 0) {
            player.canPlay = true;
            state.currentTurn = i;
            firstAlivePlayerFound = true;
            break;
          }
        }
        
        // Mise à jour sécurisée du tour
        if (!firstAlivePlayerFound) {
          // Cas improbable mais gérons-le quand même
          state.gameLog.unshift("💀 GAME OVER ! Tous les héros ont été vaincus...");
          return;
        }
        
        state.gameLog.unshift(`Début du round ${state.roundNumber} !`);
      }
    },
    
    // Action pour passer le tour d'un joueur
    skipTurn: (state, action) => {
      const { playerId } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      
      if (player && player.pv > 0 && player.canPlay) {
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
        passTurnToNextPlayer(state, playerId);
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

// Fonction helper pour passer au prochain joueur vivant - version corrigée
function findAndActivateNextAlivePlayer(state, currentPlayerIndex) {
  // Convertir l'index 0-3 en ID 1-4
  const currentPlayerId = currentPlayerIndex + 1;
  
  // Parcourir tous les joueurs à partir du joueur actuel
  for (let i = 1; i <= 4; i++) {
    // Cette formule garantit que nous parcourons dans l'ordre correct
    const nextPlayerId = ((currentPlayerId + i - 1) % 4) + 1;
    const nextPlayer = state.players.find(p => p.id === nextPlayerId);
    
    if (nextPlayer && nextPlayer.pv > 0) {
      nextPlayer.canPlay = true;
      state.currentTurn = nextPlayerId;
      return true;
    }
  }
  
  // Si aucun joueur vivant n'est trouvé
  return false;
}

// Fonction helper pour passer au joueur suivant ou au monstre - version corrigée
function passTurnToNextPlayer(state, playerId) {
  // Vérifier s'il reste des joueurs vivants
  const alivePlayers = state.players.filter(p => p.pv > 0);
  if (alivePlayers.length === 0) {
    state.gameLog.unshift("💀 GAME OVER ! Tous les héros ont été vaincus...");
    return;
  }
  
  const currentPlayerIndex = playerId - 1;
  
  // Cas spécial: si c'était le dernier joueur (ID 4) ou si aucun joueur après celui-ci n'est vivant
  let allNextPlayersDead = true;
  for (let i = playerId + 1; i <= 4; i++) {
    const checkPlayer = state.players.find(p => p.id === i);
    if (checkPlayer && checkPlayer.pv > 0) {
      allNextPlayersDead = false;
      break;
    }
  }
  
  if (playerId === 4 || allNextPlayersDead) {
    state.isMonsterTurn = true;
    state.gameLog.unshift(`Fin du round ${state.roundNumber}. Le monstre prépare son attaque...`);
    return;
  }
  
  // Sinon, chercher le prochain joueur vivant
  findAndActivateNextAlivePlayer(state, currentPlayerIndex);
}

export const { 
  hitMonster, 
  monsterAttack, 
  skipTurn, 
  resetLastAttackMissed,
  useUltimate,
  completeUltimate,
  transformEren,
  resetGame 
} = fightSlice.actions;

export default fightSlice.reducer;