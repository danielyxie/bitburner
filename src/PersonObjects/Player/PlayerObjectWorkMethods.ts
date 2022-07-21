import { Work } from "../../Work/Work";
import { IPlayer } from "../IPlayer";

export function start(this: IPlayer, w: Work): void {
  if (this.currentWork !== null) {
    this.currentWork.finish(this, true);
  }
  this.currentWork = w;
}
export function process(this: IPlayer, cycles = 1): void {
  if (this.currentWork === null) return;
  const finished = this.currentWork.process(this, cycles);
  if (finished) {
    this.finishWork(false);
  }
}
export function finish(this: IPlayer, cancelled: boolean): void {
  if (this.currentWork === null) return;
  this.currentWork.finish(this, cancelled);
  this.currentWork = null;
}
