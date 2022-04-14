import type { ActiveFragment } from "./ActiveFragment";
import type { IStaneksGift } from "./IStaneksGift";

export class DummyGift implements IStaneksGift {
  storedCycles = 0;
  fragments: ActiveFragment[] = [];
  _width: number;
  _height: number;

  constructor(width: number, height: number, fragments: ActiveFragment[]) {
    this.fragments = fragments;
    this._width = width;
    this._height = height;
  }

  width(): number {
    return this._width;
  }
  height(): number {
    return this._height;
  }
  charge(): any {
    throw new Error("unimplemented for dummy gift");
  }
  process(): any {
    throw new Error("unimplemented for dummy gift");
  }
  effect(): any {
    throw new Error("unimplemented for dummy gift");
  }
  canPlace(): any {
    throw new Error("unimplemented for dummy gift");
  }
  place(): any {
    throw new Error("unimplemented for dummy gift");
  }
  findFragment(): any {
    throw new Error("unimplemented for dummy gift");
  }
  fragmentAt(worldX: number, worldY: number): ActiveFragment | undefined {
    for (const aFrag of this.fragments) {
      if (aFrag.fullAt(worldX, worldY)) {
        return aFrag;
      }
    }

    return undefined;
  }
  delete(): any {
    throw new Error("unimplemented for dummy gift");
  }
  clear(): any {
    throw new Error("unimplemented for dummy gift");
  }
  count(): any {
    throw new Error("unimplemented for dummy gift");
  }
  inBonus(): any {
    throw new Error("unimplemented for dummy gift");
  }
  prestigeAugmentation(): any {
    throw new Error("unimplemented for dummy gift");
  }
  prestigeSourceFile(): any {
    throw new Error("unimplemented for dummy gift");
  }
}
