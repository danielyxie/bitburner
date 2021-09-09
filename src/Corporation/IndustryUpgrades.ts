import { IMap } from "../types";

export type IndustryUpgrade = [number, number, number, number, string, string];

// Industry upgrades
// The data structure is an array with the following format:
//  [index in array, base price, price mult, benefit mult (if applicable), name, desc]
export const IndustryUpgrades: IMap<IndustryUpgrade> = {
  "0": [0, 500e3, 1, 1.05, "Coffee", "Provide your employees with coffee, increasing their energy by 5%."],
  "1": [
    1,
    1e9,
    1.06,
    1.03,
    "AdVert.Inc",
    "Hire AdVert.Inc to advertise your company. Each level of " +
      "this upgrade grants your company a static increase of 3 and 1 to its awareness and " +
      "popularity, respectively. It will then increase your company's awareness by 1%, and its popularity " +
      "by a random percentage between 1% and 3%. These effects are increased by other upgrades " +
      "that increase the power of your advertising.",
  ],
};
