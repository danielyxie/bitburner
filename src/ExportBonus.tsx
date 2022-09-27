import { Factions } from "./Faction/Factions";
import { Player } from "./Player";

export let LastExportBonus = 0;

const bonusTimer = 24 * 60 * 60 * 1000; // 24h
export function canGetBonus(): boolean {
  const now = new Date().getTime();
  return now - LastExportBonus > bonusTimer;
}

export function onExport(): void {
  if (!canGetBonus()) return;
  for (const facName of Player.factions) {
    Factions[facName].favor++;
  }
  LastExportBonus = new Date().getTime();
}

export function setLastExportBonus(unixTime: number): void {
  LastExportBonus = unixTime;
}
