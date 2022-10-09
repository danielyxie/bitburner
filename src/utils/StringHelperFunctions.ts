import { Settings } from "../Settings/Settings";
import { isString } from "./helpers/isString";

/*
Converts a date representing time in milliseconds to a string with the format H hours M minutes and S seconds
e.g.    10000 -> "10 seconds"
        120000 -> "2 minutes and 0 seconds"
*/
function convertTimeMsToTimeElapsedString(time: number, showMilli = false): string {
  time = Math.floor(time);
  const millisecondsPerSecond = 1000;
  const secondPerMinute = 60;
  const minutesPerHours = 60;
  const secondPerHours: number = secondPerMinute * minutesPerHours;
  const hoursPerDays = 24;
  const secondPerDay: number = secondPerHours * hoursPerDays;

  // Convert ms to seconds, since we only have second-level precision
  const totalSeconds: number = Math.floor(time / millisecondsPerSecond);

  const days: number = Math.floor(totalSeconds / secondPerDay);
  const secTruncDays: number = totalSeconds % secondPerDay;

  const hours: number = Math.floor(secTruncDays / secondPerHours);
  const secTruncHours: number = secTruncDays % secondPerHours;

  const minutes: number = Math.floor(secTruncHours / secondPerMinute);
  const secTruncMinutes: number = secTruncHours % secondPerMinute;

  const milliTruncSec: string = (() => {
    let str = `${time % millisecondsPerSecond}`;
    while (str.length < 3) str = "0" + str;
    return str;
  })();

  const seconds: string = showMilli ? `${secTruncMinutes}.${milliTruncSec}` : `${secTruncMinutes}`;

  let res = "";
  if (days > 0) {
    res += `${days} day${days === 1 ? "" : "s"} `;
  }
  if (hours > 0 || (Settings.ShowMiddleNullTimeUnit && res != "")) {
    res += `${hours} hour${hours === 1 ? "" : "s"} `;
  }
  if (minutes > 0 || (Settings.ShowMiddleNullTimeUnit && res != "")) {
    res += `${minutes} minute${minutes === 1 ? "" : "s"} `;
  }
  res += `${seconds} second${!showMilli && secTruncMinutes === 1 ? "" : "s"}`;

  return res;
}

// Finds the longest common starting substring in a set of strings
function longestCommonStart(strings: string[]): string {
  if (!containsAllStrings(strings)) {
    return "";
  }
  if (strings.length === 0) {
    return "";
  }

  const A: string[] = strings.concat().sort();
  const a1: string = A[0];
  const a2: string = A[A.length - 1];
  const L: number = a1.length;
  let i = 0;
  const areEqualCaseInsensitive = (a: string, b: string) => a.toUpperCase() === b.toUpperCase();
  while (i < L && areEqualCaseInsensitive(a1.charAt(i), a2.charAt(i))) {
    i++;
  }

  return a1.substring(0, i);
}

// Returns whether an array contains entirely of string objects
function containsAllStrings(arr: string[]): boolean {
  return arr.every(isString);
}

// Formats a number with commas and a specific number of decimal digits
function formatNumber(num: number, numFractionDigits = 0): string {
  return num.toLocaleString(undefined, {
    maximumFractionDigits: numFractionDigits,
    minimumFractionDigits: numFractionDigits,
  });
}

// Generates a random alphanumeric string with N characters
function generateRandomString(n: number): string {
  let str = "";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < n; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
}

/**
 * Hashes the input string. This is a fast hash, so NOT good for cryptography.
 * This has been ripped off here: https://stackoverflow.com/a/52171480
 * @param str The string that is to be hashed
 * @param seed A seed to randomize the result
 * @returns An hexadecimal string representation of the hashed input
 */
function cyrb53(str: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

function capitalizeFirstLetter(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function capitalizeEachWord(s: string): string {
  return s
    .split(" ")
    .map((word) => capitalizeFirstLetter(word))
    .join(" ");
}

export {
  convertTimeMsToTimeElapsedString,
  longestCommonStart,
  containsAllStrings,
  formatNumber,
  generateRandomString,
  cyrb53,
  capitalizeFirstLetter,
  capitalizeEachWord,
};
