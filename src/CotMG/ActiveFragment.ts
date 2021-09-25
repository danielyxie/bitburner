import { Fragment, FragmentById } from "./Fragment";
import { FragmentType } from "./FragmentType";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../utils/JSONReviver";

const noCharge = [FragmentType.None, FragmentType.Delete, FragmentType.Booster, FragmentType.Cooling];

export interface IActiveFragmentParams {
  x: number;
  y: number;
  fragment: Fragment;
}

export class ActiveFragment {
  id: number;
  charge: number;
  heat: number;
  x: number;
  y: number;

  constructor(params?: IActiveFragmentParams) {
    if (params) {
      this.id = params.fragment.id;
      this.x = params.x;
      this.y = params.y;
      this.charge = 1;
      if (noCharge.includes(params.fragment.type)) this.charge = 0;
      this.heat = 1;
    } else {
      this.id = -1;
      this.x = -1;
      this.y = -1;
      this.charge = -1;
      this.heat = -1;
    }
  }

  collide(other: ActiveFragment): boolean {
    const thisFragment = this.fragment();
    const otherFragment = other.fragment();
    // These 2 variables converts 'this' local coordinates to world to other local.
    const dx: number = other.x - this.x;
    const dy: number = other.y - this.y;
    for (let j = 0; j < thisFragment.shape.length; j++) {
      for (let i = 0; i < thisFragment.shape[j].length; i++) {
        if (thisFragment.fullAt(i, j) && otherFragment.fullAt(i - dx, j - dy)) return true;
      }
    }

    return false;
  }

  fragment(): Fragment {
    const fragment = FragmentById(this.id);
    if (fragment === null) throw "ActiveFragment id refers to unknown Fragment.";
    return fragment;
  }

  fullAt(worldX: number, worldY: number): boolean {
    return this.fragment().fullAt(worldX - this.x, worldY - this.y);
  }

  neighboors(): number[][] {
    return this.fragment()
      .neighboors()
      .map((cell) => [this.x + cell[0], this.y + cell[1]]);
  }

  copy(): ActiveFragment {
    // We have to do a round trip because the constructor.
    const fragment = FragmentById(this.id);
    if (fragment === null) throw "ActiveFragment id refers to unknown Fragment.";
    const c = new ActiveFragment({ x: this.x, y: this.y, fragment: fragment });
    c.charge = this.charge;
    c.heat = this.heat;
    return c;
  }

  /**
   * Serialize an active fragment to a JSON save state.
   */
  toJSON(): any {
    return Generic_toJSON("ActiveFragment", this);
  }

  /**
   * Initializes an acive fragment from a JSON save state
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): ActiveFragment {
    return Generic_fromJSON(ActiveFragment, value.data);
  }
}

Reviver.constructors.ActiveFragment = ActiveFragment;
