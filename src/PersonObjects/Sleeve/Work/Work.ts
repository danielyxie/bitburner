import { Player } from "@player";
import { IReviverValue } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { applyWorkStatsExp, WorkStats } from "../../../Work/WorkStats";
import { SleeveTask } from "src/ScriptEditor/NetscriptDefinitions";

export const applySleeveGains = (sleeve: Sleeve, shockedStats: WorkStats, mult = 1): void => {
  applyWorkStatsExp(sleeve, shockedStats, mult);
  Player.gainMoney(shockedStats.money * mult, "sleeves");
  const sync = sleeve.syncBonus();
  // The receiving sleeves and the player do not apply their xp multipliers from augs (avoid double dipping xp mults)
  applyWorkStatsExp(Player, shockedStats, mult * sync);
  // Sleeves apply their own shock bonus to the XP they receive, even though it is also shocked by the working sleeve
  Player.sleeves.forEach((s) => s !== sleeve && applyWorkStatsExp(s, shockedStats, mult * sync * s.shockBonus()));
};

export abstract class Work {
  type: WorkType;

  constructor(type: WorkType) {
    this.type = type;
  }

  abstract process(sleeve: Sleeve, cycles: number): void;
  abstract APICopy(): SleeveTask;
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
