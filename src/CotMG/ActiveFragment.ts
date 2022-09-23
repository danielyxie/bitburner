import { Fragment, FragmentById } from "./Fragment";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../utils/JSONReviver";

export interface IActiveFragmentParams {
  x: number;
  y: number;
  rotation: number;
  fragment: Fragment;
}

export class ActiveFragment {
  id: number;
  highestCharge: number;
  numCharge: number;
  rotation: number;
  x: number;
  y: number;

  constructor(params?: IActiveFragmentParams) {
    if (params) {
      this.id = params.fragment.id;
      this.x = params.x;
      this.y = params.y;
      this.highestCharge = 0;
      this.numCharge = 0;
      this.rotation = params.rotation;
    } else {
      this.id = -1;
      this.x = -1;
      this.y = -1;
      this.highestCharge = 0;
      this.numCharge = 0;
      this.rotation = 0;
    }
  }

  collide(other: ActiveFragment): boolean {
    const thisFragment = this.fragment();
    const otherFragment = other.fragment();
    // These 2 variables converts 'this' local coordinates to world to other local.
    const dx: number = other.x - this.x;
    const dy: number = other.y - this.y;
    const fragSize = Math.max(thisFragment.shape.length, thisFragment.shape[0].length);
    for (let j = 0; j < fragSize; j++) {
      for (let i = 0; i < fragSize; i++) {
        if (thisFragment.fullAt(i, j, this.rotation) && otherFragment.fullAt(i - dx, j - dy, other.rotation))
          return true;
      }
    }

    return false;
  }

  fragment(): Fragment {
    const fragment = FragmentById(this.id);
    if (fragment === null) throw new Error("ActiveFragment id refers to unknown Fragment.");
    return fragment;
  }

  fullAt(worldX: number, worldY: number): boolean {
    return this.fragment().fullAt(worldX - this.x, worldY - this.y, this.rotation);
  }

  neighbors(): number[][] {
    return this.fragment()
      .neighbors(this.rotation)
      .map((cell) => [this.x + cell[0], this.y + cell[1]]);
  }

  copy(): ActiveFragment {
    return Object.assign({}, this);
  }

  /**
   * Serialize an active fragment to a JSON save state.
   */
  toJSON(): IReviverValue {
    return Generic_toJSON("ActiveFragment", this);
  }

  /**
   * Initializes an acive fragment from a JSON save state
   */
  static fromJSON(value: IReviverValue): ActiveFragment {
    return Generic_fromJSON(ActiveFragment, value.data);
  }
}

Reviver.constructors.ActiveFragment = ActiveFragment;
