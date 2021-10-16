import { FragmentType } from "./FragmentType";

export const Fragments: Fragment[] = [];

export class Fragment {
  id: number;
  shape: boolean[][];
  type: FragmentType;
  power: number;
  limit: number;

  constructor(id: number, shape: boolean[][], type: FragmentType, power: number, limit: number) {
    this.id = id;
    this.shape = shape;
    this.type = type;
    this.power = power;
    this.limit = limit;
  }

  fullAt(x: number, y: number, rotation: number, debug = false): boolean {
    if (y < 0) return false;
    if (y >= this.height(rotation)) return false;
    if (x < 0) return false;
    if (x >= this.width(rotation)) return false;
    // start xy, modifier xy
    let [sx, sy, mx, my] = [0, 0, 1, 1];
    if (rotation === 1) {
      [sx, sy, mx, my] = [this.width(rotation) - 1, 0, -1, 1];
    } else if (rotation === 2) {
      [sx, sy, mx, my] = [this.width(rotation) - 1, this.height(rotation) - 1, -1, -1];
    } else if (rotation === 3) {
      [sx, sy, mx, my] = [0, this.height(rotation) - 1, 1, -1];
    }
    let [qx, qy] = [sx + mx * x, sy + my * y];
    if (rotation % 2 === 1) [qx, qy] = [qy, qx];
    if (debug) {
      console.log("q " + [qx, qy]);
    }
    return this.shape[qy][qx];
  }

  width(rotation: number): number {
    if (rotation % 2 === 0) return this.shape[0].length;
    return this.shape.length;
  }

  height(rotation: number): number {
    if (rotation % 2 === 0) return this.shape.length;
    return this.shape[0].length;
  }

  // List of direct neighboors of this fragment.
  neighboors(rotation: number): number[][] {
    const candidates: number[][] = [];

    const add = (x: number, y: number): void => {
      if (this.fullAt(x, y, rotation)) return;
      if (candidates.some((coord) => coord[0] === x && coord[1] === y)) return;
      candidates.push([x, y]);
    };
    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        // This cell is full, add all it's neighboors.
        if (!this.shape[y][x]) continue;
        add(x - 1, y);
        add(x + 1, y);
        add(x, y - 1);
        add(x, y + 1);
      }
    }
    const cells: number[][] = [];
    for (const candidate of candidates) {
      if (cells.some((cell) => cell[0] === candidate[0] && cell[1] === candidate[1])) continue;
      cells.push(candidate);
    }

    return cells;
  }

  copy(): Fragment {
    return new Fragment(
      this.id,
      this.shape.map((a) => a.slice()),
      this.type,
      this.power,
      this.limit,
    );
  }
}

export function FragmentById(id: number): Fragment | null {
  for (const fragment of Fragments) {
    if (fragment.id === id) return fragment;
  }
  return null;
}

(function () {
  const _ = false;
  const X = true;
  Fragments.push(
    new Fragment(
      0, // id
      [
        // shape
        [X, X, X],
        [_, _, X],
        [_, _, X],
      ],
      FragmentType.Hacking, // type
      1,
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      1, // id
      [
        // shape
        [_, X, _],
        [X, X, X],
        [_, X, _],
      ],
      FragmentType.Hacking, // type
      1,
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      5, // id
      [
        // shape
        [X, X],
      ],
      FragmentType.HackingSpeed, // type
      1.3,
      1, // limit
    ),
  );

  Fragments.push(
    new Fragment(
      6, // id
      [
        [X, _],
        [X, X],
      ], // shape
      FragmentType.HackingMoney, // type
      2, // power
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      7, // id
      [
        [X, X],
        [X, X],
      ], // shape
      FragmentType.HackingGrow, // type
      0.5, // power
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      8, // id
      [
        [X, X, X],
        [_, X, _],
        [X, X, X],
      ], // shape
      FragmentType.Hacking, // type
      1, // power
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      10, // id
      [
        [X, X],
        [_, X],
      ], // shape
      FragmentType.Strength, // type
      2, // power
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      12, // id
      [
        [_, X],
        [X, X],
      ], // shape
      FragmentType.Defense, // type
      2, // power
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      14, // id
      [
        [X, X],
        [X, _],
      ], // shape
      FragmentType.Dexterity, // type
      2, // power
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      16, // id
      [
        [X, _],
        [X, X],
      ], // shape
      FragmentType.Agility, // type
      2, // power
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      18, // id
      [
        [X, X],
        [X, _],
      ], // shape
      FragmentType.Charisma, // type
      3, // power
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      20, // id
      [
        [X, _, _],
        [X, X, _],
        [X, X, X],
      ], // shape
      FragmentType.HacknetMoney, // type
      1, // power
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      21, // id
      [
        [X, X],
        [_, X],
        [_, X],
      ], // shape
      FragmentType.HacknetCost, // type
      -1, // power
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      25, // id
      [
        [X, X, X],
        [_, X, _],
      ], // shape
      FragmentType.Rep, // type
      0.5, // power
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      27, // id
      [
        [X, _],
        [_, X],
      ], // shape
      FragmentType.WorkMoney, // type
      10, // power
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      28, // id
      [[X, X]], // shape
      FragmentType.Crime, // type
      2, // power
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      30, // id
      [
        [X, X, X],
        [X, X, X],
        [X, X, X],
      ], // shape
      FragmentType.Bladeburner, // type
      0.4, // power
      1, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      2, // id
      [
        // shape
        [X, X, X, X],
        [X, _, _, X],
        [X, _, _, X],
        [X, X, X, X],
      ],
      FragmentType.Booster, // type
      1.1, // power
      3, // limit
    ),
  );
  Fragments.push(
    new Fragment(
      31, // id
      [
        // shape
        [X],
        [X],
        [X],
        [X],
      ],
      FragmentType.Booster, // type
      1.1, // power
      3, // limit
    ),
  );
})();

export const NoneFragment = new Fragment(-2, [], FragmentType.None, 0, Infinity);
export const DeleteFragment = new Fragment(-2, [], FragmentType.Delete, 0, Infinity);
