import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type GamePhase = "intro" | "playing" | "paused";
export type InteractionType = "none" | "library" | "exercise" | "conversation" | "temptation";

export interface PlayerStats {
  dopamine: number; // 0-100, affects health and willpower
  health: number; // 0-100, determined by dopamine
  confidence: number; // 0-100, determined by health
  money: number; // earnings from helping others
  debt: number; // starting debt to overcome
}

export interface PlayerPosition {
  x: number;
  y: number;
}

export interface NPC {
  id: string;
  type: "addict" | "clean";
  x: number;
  y: number;
  message?: string;
}

export interface Building {
  id: string;
  type: "library" | "gym" | "home";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Interaction {
  type: InteractionType;
  target?: NPC | Building;
  isActive: boolean;
}

interface SomaGameState {
  phase: GamePhase;
  stats: PlayerStats;
  position: PlayerPosition;
  npcs: NPC[];
  buildings: Building[];
  interaction: Interaction;
  booksRead: string[];
  conversationCount: number;
  
  // Timers and progress
  walkingTime: number; // tracks time spent walking
  lastDopamineIncrease: number;
  
  // Actions
  initializeWorld: (npcs: NPC[], buildings: Building[]) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  updatePosition: (x: number, y: number) => void;
  updateStats: (stats: Partial<PlayerStats>) => void;
  incrementWalkingTime: (delta: number) => void;
  startInteraction: (type: InteractionType, target?: NPC | Building) => void;
  endInteraction: () => void;
  readBook: (bookId: string) => void;
  completeExercise: () => void;
  completeConversation: (npcId: string) => void;
  resistTemptation: (success: boolean) => void;
  calculateDerivedStats: () => void;
}

export const useSomaGame = create<SomaGameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "intro",
    stats: {
      dopamine: 15, // Start low - struggling state
      health: 30,
      confidence: 20,
      money: 0,
      debt: 1000,
    },
    position: { x: 0, y: 0 },
    npcs: [],
    buildings: [],
    interaction: {
      type: "none",
      isActive: false,
    },
    booksRead: [],
    conversationCount: 0,
    walkingTime: 0,
    lastDopamineIncrease: 0,
    
    initializeWorld: (npcs: NPC[], buildings: Building[]) => {
      set({ npcs, buildings });
      console.log(`World initialized: ${npcs.length} NPCs, ${buildings.length} buildings`);
    },
    
    startGame: () => {
      set({ phase: "playing" });
      console.log("Game started - Chapter 1: Build Yourself");
    },
    
    pauseGame: () => {
      set({ phase: "paused" });
    },
    
    resumeGame: () => {
      set({ phase: "playing" });
    },
    
    updatePosition: (x: number, y: number) => {
      set({ position: { x, y } });
    },
    
    updateStats: (newStats: Partial<PlayerStats>) => {
      set((state) => ({
        stats: { ...state.stats, ...newStats }
      }));
      // Recalculate derived stats
      get().calculateDerivedStats();
    },
    
    incrementWalkingTime: (delta: number) => {
      const state = get();
      const newWalkingTime = state.walkingTime + delta;
      
      // Every 2 seconds of walking increases dopamine slightly
      if (newWalkingTime - state.lastDopamineIncrease > 2) {
        const currentDopamine = state.stats.dopamine;
        const increase = Math.min(1, 100 - currentDopamine); // Don't exceed 100
        
        set({
          walkingTime: newWalkingTime,
          lastDopamineIncrease: newWalkingTime,
        });
        
        get().updateStats({ dopamine: currentDopamine + increase });
        console.log(`Walking increased dopamine: ${currentDopamine} -> ${currentDopamine + increase}`);
      } else {
        set({ walkingTime: newWalkingTime });
      }
    },
    
    startInteraction: (type: InteractionType, target?: NPC | Building) => {
      set({
        interaction: {
          type,
          target,
          isActive: true,
        }
      });
      console.log(`Started interaction: ${type}`);
    },
    
    endInteraction: () => {
      set({
        interaction: {
          type: "none",
          isActive: false,
        }
      });
    },
    
    readBook: (bookId: string) => {
      const state = get();
      if (state.booksRead.includes(bookId)) {
        console.log("Already read this book");
        return;
      }
      
      // Reading a book requires dopamine (attention span) but rewards more
      if (state.stats.dopamine < 10) {
        console.log("Not enough dopamine to focus on reading");
        return;
      }
      
      set({
        booksRead: [...state.booksRead, bookId]
      });
      
      // Books significantly boost dopamine and provide knowledge
      get().updateStats({
        dopamine: Math.min(100, state.stats.dopamine + 15),
      });
      
      console.log(`Book read: ${bookId}. Total books: ${state.booksRead.length + 1}`);
    },
    
    completeExercise: () => {
      const state = get();
      
      // Exercise boosts dopamine and health
      get().updateStats({
        dopamine: Math.min(100, state.stats.dopamine + 10),
        health: Math.min(100, state.stats.health + 5),
      });
      
      console.log("Exercise completed - dopamine and health improved");
    },
    
    completeConversation: (npcId: string) => {
      const state = get();
      
      // Requires high enough dopamine for attention span
      if (state.stats.dopamine < 20) {
        console.log("Not enough dopamine to maintain conversation");
        return;
      }
      
      set({
        conversationCount: state.conversationCount + 1,
      });
      
      // Conversations improve dopamine and earn money through helping
      get().updateStats({
        dopamine: Math.min(100, state.stats.dopamine + 8),
        money: state.stats.money + 50, // Earn money by helping others
      });
      
      console.log(`Conversation completed. Earned $50. Total: $${state.stats.money + 50}`);
    },
    
    resistTemptation: (success: boolean) => {
      const state = get();
      
      if (!success) {
        // Failed to resist - severe penalty
        console.log("Failed to resist temptation - relapse!");
        get().updateStats({
          dopamine: Math.max(0, state.stats.dopamine - 30),
          money: Math.max(0, state.stats.money - 100),
        });
      } else {
        // Successfully resisted - small reward
        console.log("Successfully resisted temptation!");
        get().updateStats({
          dopamine: Math.min(100, state.stats.dopamine + 5),
        });
      }
    },
    
    calculateDerivedStats: () => {
      set((state) => {
        // Health is determined by dopamine (60% weight) and previous health (40% weight)
        const targetHealth = state.stats.dopamine * 0.8; // dopamine affects health
        const newHealth = state.stats.health * 0.6 + targetHealth * 0.4;
        
        // Confidence is determined by health (70% weight) and previous confidence (30% weight)
        const targetConfidence = newHealth * 0.9; // health affects confidence
        const newConfidence = state.stats.confidence * 0.7 + targetConfidence * 0.3;
        
        return {
          stats: {
            ...state.stats,
            health: Math.min(100, Math.max(0, newHealth)),
            confidence: Math.min(100, Math.max(0, newConfidence)),
          }
        };
      });
    },
  }))
);
