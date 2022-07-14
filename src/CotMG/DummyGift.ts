import { ActiveFragment } from "./ActiveFragment";
import { IStaneksGift } from "./IStaneksGift";

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
  charge(): void {
    throw new Error("unimplemented for dummy gift");
  }
  process(): void {
    throw new Error("unimplemented for dummy gift");
  }
  effect(): number {
    throw new Error("unimplemented for dummy gift");
  }
  canPlace(): boolean {
    throw new Error("unimplemented for dummy gift");
  }
  place(): boolean {
    throw new Error("unimplemented for dummy gift");
  }
  findFragment(): ActiveFragment | undefined {
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
  delete(): boolean {
    throw new Error("unimplemented for dummy gift");
  }
  clear(): void {
    throw new Error("unimplemented for dummy gift");
  }
  count(): number {
    throw new Error("unimplemented for dummy gift");
  }
  inBonus(): boolean {
    throw new Error("unimplemented for dummy gift");
  }
  prestigeAugmentation(): void {
    throw new Error("unimplemented for dummy gift");
  }
  prestigeSourceFile(): void {
    throw new Error("unimplemented for dummy gift");
  }
}
