import { IPlayer } from "../PersonObjects/IPlayer";
import { IReviverValue } from "../utils/JSONReviver";

export abstract class Work {
  type: WorkType;
  singularity: boolean;

  constructor(type: WorkType, singularity: boolean) {
    this.type = type;
    this.singularity = singularity;
  }

  abstract process(player: IPlayer, cycles: number): boolean;
  abstract finish(player: IPlayer, cancelled: boolean): void;
  abstract toJSON(): IReviverValue;
}

export enum WorkType {
  CRIME = "CRIME",
  CLASS = "CLASS",
  CREATE_PROGRAM = "CREATE_PROGRAM",
  GRAFTING = "GRAFTING",
  FACTION = "FACTION",
}
