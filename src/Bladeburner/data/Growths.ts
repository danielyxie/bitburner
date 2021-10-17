import { getRandomInt } from "../../utils/helpers/getRandomInt";

export const Growths: {
  [key: string]: (() => number) | undefined;
  ["Tracking"]: () => number;
  ["Bounty Hunter"]: () => number;
  ["Retirement"]: () => number;
  ["Investigation"]: () => number;
  ["Undercover Operation"]: () => number;
  ["Sting Operation"]: () => number;
  ["Raid"]: () => number;
  ["Stealth Retirement Operation"]: () => number;
  ["Assassination"]: () => number;
} = {
  Tracking: () => getRandomInt(5, 75) / 20,
  "Bounty Hunter": () => getRandomInt(5, 75) / 20,
  Retirement: () => getRandomInt(5, 75) / 20,
  Investigation: () => getRandomInt(10, 40) / 20,
  "Undercover Operation": () => getRandomInt(10, 40) / 20,
  "Sting Operation": () => getRandomInt(3, 40) / 20,
  Raid: () => getRandomInt(2, 40) / 20,
  "Stealth Retirement Operation": () => getRandomInt(1, 20) / 20,
  Assassination: () => getRandomInt(1, 20) / 20,
};
