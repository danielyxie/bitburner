import { IPlayer } from "../IPlayer";

export enum WorkType {
  CreateProgram = 0,
}

export abstract class Work {
  type: WorkType;
  cyclesWorked = 0;

  constructor(type: WorkType) {
    this.type = type;
  }

  work(p: IPlayer, cycles: number): boolean {
    this.cyclesWorked += cycles;
    return false;
  }
  abstract finish(p: IPlayer, cancelled: boolean): string;
}
