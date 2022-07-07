import { IPlayer } from "src/PersonObjects/IPlayer";
import { WorkType } from "src/utils/WorkType";

export abstract class Work {
  abstract type: WorkType;

  abstract process(player: IPlayer, cycles: number): boolean;
  abstract finish(player: IPlayer, cancelled: boolean): void;
}
