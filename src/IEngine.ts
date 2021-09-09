/**
 * TypeScript interface for the game engine (engine.js), which can't be converted
 * to TypeScript at the moment
 */
export interface IEngine {
  hideAllContent: () => void;
  loadBladeburnerContent: () => void;
  loadFactionContent: () => void;
  loadFactionsContent: () => void;
  loadGangContent: () => void;
  loadInfiltrationContent: (name: string, difficulty: number, maxLevel: number) => void;
  loadLocationContent: () => void;
  loadMissionContent: () => void;
  loadResleevingContent: () => void;
  loadStockMarketContent: () => void;
  loadTerminalContent: () => void;
}
