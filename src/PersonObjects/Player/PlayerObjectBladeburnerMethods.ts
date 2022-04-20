import { Bladeburner } from "../../Bladeburner/Bladeburner";
import { IPlayer } from "../IPlayer";

export function canAccessBladeburner(this: IPlayer): boolean {
  if (this.bitNodeN === 8) {
    return false;
  }

  return this.bitNodeN === 6 || this.bitNodeN === 7 || this.sourceFileLvl(6) > 0 || this.sourceFileLvl(7) > 0;
}

export function inBladeburner(this: IPlayer): boolean {
  if (this.bladeburner == null) {
    return false;
  }
  return this.bladeburner instanceof Bladeburner;
}

export function startBladeburner(this: IPlayer): void {
  this.bladeburner = new Bladeburner(this);
}
