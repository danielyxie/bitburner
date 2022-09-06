import { Work } from "../../Work/Work";
import { IPlayer } from "../IPlayer";

export function start(this: IPlayer, w: Work): void {
  if (this.currentWork !== null) {
    this.currentWork.finish(true);
  }
  this.currentWork = w;
}
export function process(this: IPlayer, cycles = 1): void {
  if (this.currentWork === null) return;
  const finished = this.currentWork.process(cycles);
  if (finished) {
    this.finishWork(false);
  }
}
export function finish(this: IPlayer, cancelled: boolean): void {
  if (this.currentWork === null) return;
  this.currentWork.finish(cancelled);
  this.currentWork = null;
  this.focus = false;
}
