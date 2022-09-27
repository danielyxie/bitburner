import { Bladeburner } from "../../Bladeburner/Bladeburner";
import { PlayerObject } from "./PlayerObject";

export function canAccessBladeburner(this: PlayerObject): boolean {
  return this.bitNodeN === 6 || this.bitNodeN === 7 || this.sourceFileLvl(6) > 0 || this.sourceFileLvl(7) > 0;
}

export function inBladeburner(this: PlayerObject): boolean {
  return Boolean(this.bladeburner);
}

export function startBladeburner(this: PlayerObject): void {
  this.bladeburner = new Bladeburner();
}
