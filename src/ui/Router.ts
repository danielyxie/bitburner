import { Faction } from "../Faction/Faction";
/**
 * The full-screen page the player is currently be on.
 * These pages are mutually exclusive.
 */
export enum Page {
  ActiveScripts,
  Augmentations,
  Bladeburner,
  Stats,
  City,
  Corporation,
  CreateProgram,
  DevMenu,
  Faction,
  Factions,
  Options,
  Gang,
  Hacknet,
  Job,
  Milestones,
  Resleeves,
  CreateScript,
  Sleeves,
  StockMarket,
  Terminal,
  Travel,
  Tutorial,
}

/**
 * This class keeps track of player navigation/routing within the game.
 */
export interface IRouter {
  // toCinematicText(): void;
  // toInfiltration(): void;
  // toMission(): void;
  // toRedPill(): void;
  // toworkInProgress(): void;
  toActiveScripts(): void;
  toAugmentations(): void;
  toBladeburner(): void;
  toCharacterInfo(): void;
  toCorporation(): void;
  toCreateProgram(): void;
  toDevMenu(): void;
  toFaction(faction: Faction): void; // faction name
  toFactions(): void;
  toGameOptions(): void;
  toGang(): void;
  toHacknetNodes(): void;
  toCity(): void; // travel ? city ?
  toJob(): void;
  toMilestones(): void;
  toResleeves(): void;
  toScriptEditor(filename?: string, code?: string): void;
  toSleeves(): void;
  toStockMarket(): void;
  toTerminal(): void;
  toTravel(): void;
  toTutorial(): void;
}
