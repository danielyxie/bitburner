import { ActiveFragment } from "./ActiveFragment";

export class BaseGift {
  fragments: ActiveFragment[];
  _width?: number;
  _height?: number;

  constructor(width?: number, height?: number, fragments: ActiveFragment[] = []) {
    this.fragments = fragments;
    this._width = width;
    this._height = height;
  }

  width(): number {
    return this._width || 4;
  }
  height(): number {
    return this._height || 4;
  }
  fragmentAt(worldX: number, worldY: number): ActiveFragment | undefined {
    for (const aFrag of this.fragments) {
      if (aFrag.fullAt(worldX, worldY)) {
        return aFrag;
      }
    }

    return undefined;
  }
}
