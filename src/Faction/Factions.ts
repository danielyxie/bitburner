/**
 * Initialization and manipulation of the Factions object, which stores data
 * about all Factions in the game
 */
import { Faction } from "./Faction";
import { FactionInfos } from "./FactionInfo";

import { IMap } from "../types";

import { Reviver } from "../../utils/JSONReviver";

export let Factions: IMap<Faction> = {};

export function loadFactions(saveString: string): void {
  Factions = JSON.parse(saveString, Reviver);
}

export function AddToFactions(faction: Faction): void {
  const name: string = faction.name;
  Factions[name] = faction;
}

export function factionExists(name: string): boolean {
  return Factions.hasOwnProperty(name);
}

export function initFactions(): void {
  for (const name in FactionInfos) {
    resetFaction(new Faction(name));
  }
}

//Resets a faction during (re-)initialization. Saves the favor in the new
//Faction object and deletes the old Faction Object from "Factions". Then
//reinserts the new Faction object
export function resetFaction(newFactionObject: Faction): void {
  if (!(newFactionObject instanceof Faction)) {
    throw new Error("Invalid argument 'newFactionObject' passed into resetFaction()");
  }
  const factionName: string = newFactionObject.name;
  if (factionExists(factionName)) {
    newFactionObject.favor = Factions[factionName].favor;
    delete Factions[factionName];
  }
  AddToFactions(newFactionObject);
}
