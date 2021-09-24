/**
 * TypeScript interface for the game engine (engine.js), which can't be converted
 * to TypeScript at the moment
 */
export interface IEngine {
  _lastUpdate: number;
  updateGame: (numCycles?: number) => void;
  Counters: {
    [key: string]: number | undefined;
    autoSaveCounter: number;
    updateSkillLevelsCounter: number;
    updateDisplays: number;
    updateDisplaysLong: number;
    updateActiveScriptsDisplay: number;
    createProgramNotifications: number;
    augmentationsNotifications: number;
    checkFactionInvitations: number;
    passiveFactionGrowth: number;
    messages: number;
    mechanicProcess: number;
    contractGeneration: number;
  };
  decrementAllCounters: (numCycles?: number) => void;
  checkCounters: () => void;
  load: (saveString: string) => void;
  start: () => void;
}
