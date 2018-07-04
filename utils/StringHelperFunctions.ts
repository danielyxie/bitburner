import { EqualityFunc } from "../src/types";
import { dialogBoxCreate } from "./DialogBox";
import { isString } from "./helpers/isString";

// Netburner String helper functions

// Replaces the character at an index with a new character
function replaceAt(base: string, index: number, character: string): string {
    return base.substr(0, index) + character + base.substr(index + character.length);
}

/*
Converts a date representing time in milliseconds to a string with the format H hours M minutes and S seconds
e.g.    10000 -> "0 hours 0 minutes and 10 seconds"
        120000 -> "0 0 hours 2 minutes and 0 seconds"
*/
function convertTimeMsToTimeElapsedString(time: number): string {
    const millisecondsPerSecond: number = 1000;
    const secondPerMinute: number = 60;
    const minutesPerHours: number = 60;
    const secondPerHours: number = secondPerMinute * minutesPerHours;
    const hoursPerDays: number = 24;
    const secondPerDay: number = secondPerHours * hoursPerDays;

    // Convert ms to seconds, since we only have second-level precision
    const totalSeconds: number = Math.floor(time / millisecondsPerSecond);

    const days: number = Math.floor(totalSeconds / secondPerDay);
    const secTruncDays: number = totalSeconds % secondPerDay;

    const hours: number = Math.floor(secTruncDays / secondPerHours);
    const secTruncHours: number = secTruncDays % secondPerHours;

    const minutes: number = Math.floor(secTruncHours / secondPerMinute);
    const secTruncMinutes: number = secTruncHours % secondPerMinute;

    const seconds: number = secTruncMinutes;

    let res: string = "";
    if (days > 0) {res += `${days} days `; }
    if (hours > 0) {res += `${hours} hours `; }
    if (minutes > 0) {res += `${minutes} minutes `; }
    res += `${seconds} seconds `;

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
    let i: number = 0;
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

// Count the number of times a substring occurs in a string
function numOccurrences(text: string, subString: string): number {
    const input: string = `${text}`;
    const search: string = `${subString}`;
    if (search.length <= 0) { return (input.length + 1); }

    let n: number = 0;
    let pos: number = 0;
    const step: number = search.length;

    while (true) {
        pos = input.indexOf(search, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else { break; }
    }

    return n;
}

// Counters the number of Netscript operators in a string
function numNetscriptOperators(text: string): number {
    const total: number = numOccurrences(text, "+") +
        numOccurrences(text, "-") +
        numOccurrences(text, "*") +
        numOccurrences(text, "/") +
        numOccurrences(text, "%") +
        numOccurrences(text, "&&") +
        numOccurrences(text, "||") +
        numOccurrences(text, "<") +
        numOccurrences(text, ">") +
        numOccurrences(text, "<=") +
        numOccurrences(text, ">=") +
        numOccurrences(text, "==") +
        numOccurrences(text, "!=");
    if (isNaN(total)) {
        // tslint:disable-next-line:max-line-length
        const message: string = "ERROR in counting number of operators in script. This is a bug, please report to game developer";
        dialogBoxCreate(message, false);

        return 0;
    }

    return total;
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
    let str: string = "";
    const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i: number = 0; i < n; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}

export {convertTimeMsToTimeElapsedString, longestCommonStart,
        containsAllStrings, formatNumber,
        numOccurrences, numNetscriptOperators, isHTML, generateRandomString, replaceAt};
