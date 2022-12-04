import { Faction } from "../Faction/Faction";
import { Location } from "../Locations/Location";

/**
 * The full-screen page the player is currently be on.
 * These are "simple" pages that don't require any extra parameters to
 * transition to. You can use setPage() with these.
 */
export enum SimplePage {
  ActiveScripts = "Active Scripts",
  Augmentations = "Augmentations",
  Bladeburner = "Bladeburner",
  City = "City",
  Corporation = "Corporation",
  CreateProgram = "Create Program",
  DevMenu = "Dev",
  Factions = "Factions",
  Gang = "Gang",
  Hacknet = "Hacknet",
  Milestones = "Milestones",
  Options = "Options",
  Grafting = "Grafting",
  Sleeves = "Sleeves",
  Stats = "Stats",
  StockMarket = "Stock Market",
  Terminal = "Terminal",
  Travel = "Travel",
  Tutorial = "Tutorial",
  Work = "Work",
  BladeburnerCinematic = "Bladeburner Cinematic",
  Loading = "Loading",
  StaneksGift = "Staneks Gift",
  Recovery = "Recovery",
  Achievements = "Achievements",
  ThemeBrowser = "Theme Browser",
}

/**
 * "Complex" pages that need a custom transition function.
 */
export enum ComplexPage {
  BitVerse = "BitVerse",
  Faction = "Faction",
  Infiltration = "Infiltration",
  Job = "Job",
  ScriptEditor = "Script Editor",
  Location = "Location",
  ImportSave = "Import Save",
}

// Using the same name as both type and object to mimic enum-like behavior.
// See https://stackoverflow.com/a/71255520/202091
export type Page = SimplePage | ComplexPage;
export const Page = { ...SimplePage, ...ComplexPage };

export interface ScriptEditorRouteOptions {
  vim: boolean;
}

/** The router keeps track of player navigation/routing within the game. */
export interface IRouter {
  isInitialized: boolean;
  page(): Page;
  allowRouting(value: boolean): void;
  toPage(page: SimplePage): void;
  toBitVerse(flume: boolean, quick: boolean): void;
  toFaction(faction: Faction, augPage?: boolean): void; // faction name
  toInfiltration(location: Location): void;
  toJob(location: Location): void;
  toScriptEditor(files?: Record<string, string>, options?: ScriptEditorRouteOptions): void;
  toLocation(location: Location): void;
  toImportSave(base64Save: string, automatic?: boolean): void;
}
