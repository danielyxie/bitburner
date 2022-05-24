import { IPlayer } from "../IPlayer";
import { Work } from "../Work/Work";

export function startWork(this: IPlayer, w: Work): void {
  this.currentWork = w;
}

export function cancelWork(this: IPlayer): void {
  if (!this.currentWork) return;
  this.currentWork.finish(this, true);
  this.currentWork = undefined;
}
