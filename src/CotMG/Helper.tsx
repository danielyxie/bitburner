import { Reviver } from "../utils/JSONReviver";
import { BaseGift } from "./BaseGift";

import { StaneksGift } from "./StaneksGift";

export let staneksGift = new StaneksGift();

export function loadStaneksGift(saveString: string): void {
  if (saveString) {
    staneksGift = JSON.parse(saveString, Reviver);
  } else {
    staneksGift = new StaneksGift();
  }
}

export function zeros(width: number, height: number): number[][] {
  const array = [];

  for (let i = 0; i < width; ++i) {
    array.push(Array(height).fill(0));
  }

  return array;
}

export function calculateGrid(gift: BaseGift): number[][] {
  const newgrid = zeros(gift.width(), gift.height()) as unknown as number[][];
  for (let i = 0; i < gift.width(); i++) {
    for (let j = 0; j < gift.height(); j++) {
      const fragment = gift.fragmentAt(i, j);
      if (!fragment) continue;
      newgrid[i][j] = 1;
    }
  }

  return newgrid;
}
