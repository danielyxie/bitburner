import { EqualityFunc } from "../src/types";
import { isString } from "./helpers/isString";

// Netburner String helper functions

// Replaces the character at an index with a new character
function replaceAt(base: string, index: number, character: string): string {
    return base.substr(0, index) + character + base.substr(index + character.length);
}

/*
Converts a date representing time in milliseconds to a string with the format H hours M minutes and S seconds
e.g.    10000 -> "10 seconds"
        120000 -> "2 minutes and 0 seconds"
*/
function convertTimeMsToTimeElapsedString(time: number, showMilli=false): string {
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
        while(str.length < 3) str = "0"+str;
        return str;
    })()

    const seconds: string = showMilli ? `${secTruncMinutes}.${milliTruncSec}` : `${secTruncMinutes}`;

    let res = "";
    if (days > 0) {res += `${days} days `; }
    if (hours > 0) {res += `${hours} hours `; }
    if (minutes > 0) {res += `${minutes} minutes `; }
    res += `${seconds} seconds`;

    return res;
}

// Finds the longest common starting substring in a set of strings
function longestCommonStart(strings: string[]): string {
    if (!containsAllStrings(strings)) {return ""; }
    if (strings.length === 0) {return ""; }

    const A: string[] = strings.concat()
        .sort();
    const a1: string = A[0];
    const a2: string = A[A.length - 1];
    const L: number = a1.length;
    let i = 0;
    const areEqualCaseInsensitive: EqualityFunc<string> = (a: string, b: string) => a.toUpperCase() === b.toUpperCase();
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
function formatNumber(num: number, numFractionDigits: number): string {
    return num.toLocaleString(undefined, {
        maximumFractionDigits: numFractionDigits,
        minimumFractionDigits: numFractionDigits,
    });
}

// Checks if a string contains HTML elements
function isHTML(str: string): boolean {
    const element: HTMLDivElement = document.createElement("div");
    element.innerHTML = str;
    const c: NodeListOf<Node & ChildNode> = element.childNodes;
    for (let i: number = c.length - 1; i >= 0; i--) {
        if (c[i].nodeType === 1) {
            return true;
        }
    }

    return false;
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

export {convertTimeMsToTimeElapsedString, longestCommonStart,
        containsAllStrings, formatNumber,
        isHTML, generateRandomString, replaceAt};
