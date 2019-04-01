/**
 * TypeScript interface for the game engine (engine.js), which can't be converted
 * to TypeScript at the moment
 */
export interface IEngine {
    loadBladeburnerContent: () => void;
    loadInfiltrationContent: () => void;
    loadResleevingContent: () => void;
    loadStockMarketContent: () => void;
}
