import { IPlayer } from "src/PersonObjects/IPlayer";

export abstract class Work {
  type: WorkType;

  constructor(type: WorkType) {
    this.type = type;
  }

  abstract process(player: IPlayer, cycles: number): boolean;
  abstract finish(player: IPlayer, cancelled: boolean): void;
  abstract toJSON(): any;
}

export enum WorkType {
  CRIME = "CRIME",
  CLASS = "CLASS",
  CREATE_PROGRAM = "CREATE_PROGRAM",
  GRAFTING = "GRAFTING",
}
