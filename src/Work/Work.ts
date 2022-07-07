import { IPlayer } from "src/PersonObjects/IPlayer";

export abstract class Work {
  abstract type: WorkType;

  abstract process(player: IPlayer, cycles: number): boolean;
  abstract finish(player: IPlayer, cancelled: boolean): void;
}

export enum WorkType {
  CRIME = "CRIME",
  CLASS = "CLASS",
}
