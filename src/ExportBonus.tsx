import { Factions } from "./Faction/Factions";
import type { IPlayer } from "./PersonObjects/IPlayer";

export let LastExportBonus = 0;

const bonusTimer = 24 * 60 * 60 * 1000; // 24h
export function canGetBonus(): boolean {
  const now = new Date().getTime();
  return now - LastExportBonus > bonusTimer;
}

export function onExport(p: IPlayer): void {
  if (!canGetBonus()) return;
  for (const facName of p.factions) {
    Factions[facName].favor++;
  }
  LastExportBonus = new Date().getTime();
}

export function setLastExportBonus(unixTime: number): void {
  LastExportBonus = unixTime;
}
