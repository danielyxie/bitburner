import { Reviver } from "../utils/JSONReviver";

import { IStaneksGift } from "./IStaneksGift";
import { StaneksGift } from "./StaneksGift";

export let staneksGift: IStaneksGift = new StaneksGift();

export function loadStaneksGift(saveString: string): void {
  if (saveString) {
    staneksGift = JSON.parse(saveString, Reviver);
  } else {
    staneksGift = new StaneksGift();
  }
}
