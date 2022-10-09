import { Player } from "@player";
import { IReviverValue } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { applyWorkStats, applyWorkStatsExp, scaleWorkStats, WorkStats } from "../../../Work/WorkStats";

export const applySleeveGains = (sleeve: Sleeve, rawStats: WorkStats, cycles = 1): void => {
  const shockedStats = scaleWorkStats(rawStats, sleeve.shockBonus(), rawStats.money > 0);
  applyWorkStatsExp(sleeve, shockedStats, cycles);
  const syncStats = scaleWorkStats(shockedStats, sleeve.syncBonus(), rawStats.money > 0);
  applyWorkStats(Player, syncStats, cycles, "sleeves");
  Player.sleeves.filter((s) => s !== sleeve).forEach((s) => applyWorkStatsExp(s, syncStats, cycles));
};

export abstract class Work {
  type: WorkType;

  constructor(type: WorkType) {
    this.type = type;
  }

  abstract process(sleeve: Sleeve, cycles: number): number;
  abstract APICopy(): Record<string, unknown>;
  abstract toJSON(): IReviverValue;
  finish(): void {
    /* left for children to implement */
  }
}

export enum WorkType {
  COMPANY = "COMPANY",
  FACTION = "FACTION",
  CRIME = "CRIME",
  CLASS = "CLASS",
  RECOVERY = "RECOVERY",
  SYNCHRO = "SYNCHRO",
  BLADEBURNER = "BLADEBURNER",
  INFILTRATE = "INFILTRATE",
  SUPPORT = "SUPPORT",
}
