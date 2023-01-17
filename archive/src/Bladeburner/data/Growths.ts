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
  Tracking: () => getRandomInt(5, 75) / 10,
  "Bounty Hunter": () => getRandomInt(5, 75) / 10,
  Retirement: () => getRandomInt(5, 75) / 10,
  Investigation: () => getRandomInt(10, 40) / 10,
  "Undercover Operation": () => getRandomInt(10, 40) / 10,
  "Sting Operation": () => getRandomInt(3, 40) / 10,
  Raid: () => getRandomInt(2, 40) / 10,
  "Stealth Retirement Operation": () => getRandomInt(1, 20) / 10,
  Assassination: () => getRandomInt(1, 20) / 10,
};
