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
}

export enum WorkType {
  COMPANY = "COMPANY",
  FACTION = "FACTION",
  CRIME = "CRIME",
  CLASS = "CLASS",
  RECOVERY = "RECOVERY",
  SYNCHRO = "SYNCHRO",
  BLADEBURNER_GENERAL = "BLADEBURNER_GENERAL",
  INFILTRATE = "INFILTRATE",
  BLADEBURNER_SUPPORT = "SUPPORT",
  BLADEBURNER_CONTRACTS = "CONTRACTS",
}
