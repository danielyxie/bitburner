import { IPlayer } from "../../IPlayer";
import { IReviverValue } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";

export abstract class Work {
  type: WorkType;

  constructor(type: WorkType) {
    this.type = type;
  }

  abstract process(player: IPlayer, sleeve: Sleeve, cycles: number): number;
  abstract APICopy(): Record<string, unknown>;
  abstract toJSON(): IReviverValue;
  finish(_player: IPlayer): void {
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
