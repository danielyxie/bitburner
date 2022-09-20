import { Bladeburner } from "../../Bladeburner/Bladeburner";
import { PlayerObject } from "./PlayerObject";

export function canAccessBladeburner(this: PlayerObject): boolean {
  return this.bitNodeN === 6 || this.bitNodeN === 7 || this.sourceFileLvl(6) > 0 || this.sourceFileLvl(7) > 0;
}

export function inBladeburner(this: PlayerObject): boolean {
  if (this.bladeburner == null) {
    return false;
  }
  return this.bladeburner instanceof Bladeburner;
}

export function startBladeburner(this: PlayerObject): void {
  this.bladeburner = new Bladeburner();
}
