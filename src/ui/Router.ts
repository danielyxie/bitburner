import { Faction } from "../Faction/Faction";
import { Location } from "../Locations/Location";

/**
 * The full-screen page the player is currently be on.
 * These pages are mutually exclusive.
 */
export enum Page {
  ActiveScripts,
  Augmentations,
  BitVerse,
  Bladeburner,
  City,
  Corporation,
  CreateProgram,
  ScriptEditor,
  DevMenu,
  Faction,
  Factions,
  Gang,
  Hacknet,
  Infiltration,
  Job,
  Milestones,
  Options,
  Resleeves,
  Sleeves,
  Stats,
  StockMarket,
  Terminal,
  Travel,
  Tutorial,
  Work,
  BladeburnerCinematic,
  Location,
  Loading,
  StaneksGift,
  Recovery,
}

export interface ScriptEditorRouteOptions {
  vim: boolean;
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
  page(): Page;
  toActiveScripts(): void;
  toAugmentations(): void;
  toBitVerse(flume: boolean, quick: boolean): void;
  toBladeburner(): void;
  toStats(): void;
  toCity(): void; // travel ? city ?
  toCorporation(): void;
  toCreateProgram(): void;
  toDevMenu(): void;
  toFaction(faction?: Faction): void; // faction name
  toFactions(): void;
  toGameOptions(): void;
  toGang(): void;
  toHacknetNodes(): void;
  toInfiltration(location: Location): void;
  toJob(): void;
  toMilestones(): void;
  toResleeves(): void;
  toScriptEditor(filename?: string, code?: string, options?: ScriptEditorRouteOptions): void;
  toSleeves(): void;
  toStockMarket(): void;
  toTerminal(): void;
  toTravel(): void;
  toTutorial(): void;
  toWork(): void;
  toBladeburnerCinematic(): void;
  toLocation(location: Location): void;
  toStaneksGift(): void;
}
