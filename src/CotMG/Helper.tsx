import { Reviver } from "../utils/JSONReviver";

import type { IStaneksGift } from "./IStaneksGift";
import { StaneksGift } from "./StaneksGift";

export let staneksGift: IStaneksGift = new StaneksGift();

export function loadStaneksGift(saveString: string): void {
  if (saveString) {
    staneksGift = JSON.parse(saveString, Reviver);
  } else {
    staneksGift = new StaneksGift();
  }
}

export function zeros(dimensions: number[]): any {
  const array = [];

  for (let i = 0; i < dimensions[0]; ++i) {
    array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
  }

  return array;
}

export function calculateGrid(gift: IStaneksGift): number[][] {
  const newgrid = zeros([gift.width(), gift.height()]) as unknown as number[][];
  for (let i = 0; i < gift.width(); i++) {
    for (let j = 0; j < gift.height(); j++) {
      const fragment = gift.fragmentAt(i, j);
      if (!fragment) continue;
      newgrid[i][j] = 1;
    }
  }

  return newgrid;
}
