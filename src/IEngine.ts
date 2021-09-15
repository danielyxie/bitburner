/**
 * TypeScript interface for the game engine (engine.js), which can't be converted
 * to TypeScript at the moment
 */
export interface IEngine {
  indexedDb: any;
  _lastUpdate: number;
  hideAllContent: () => void;
  loadTerminalContent: () => void;
  loadScriptEditorContent: (filename?: string, code?: string) => void;
  loadActiveScriptsContent: () => void;
  loadCreateProgramContent: () => void;
  loadCharacterContent: () => void;
  loadFactionsContent: () => void;
  loadAugmentationsContent: () => void;
  loadHacknetNodesContent: () => void;
  loadSleevesContent: () => void;
  loadLocationContent: () => void;
  loadTravelContent: () => void;
  loadJobContent: () => void;
  loadStockMarketContent: () => void;
  loadBladeburnerContent: () => void;
  loadCorporationContent: () => void;
  loadGangContent: () => void;
  loadMilestonesContent: () => void;
  loadTutorialContent: () => void;
  loadDevMenuContent: () => void;
  loadFactionContent: () => void;
  loadInfiltrationContent: (name: string, difficulty: number, maxLevel: number) => void;
  loadMissionContent: () => void;
  loadResleevingContent: () => void;
  loadGameOptionsContent: () => void;
}
