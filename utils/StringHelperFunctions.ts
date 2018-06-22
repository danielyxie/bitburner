import {dialogBoxCreate} from "./DialogBox.js";

//Netburner String helper functions

//Searches for every occurence of searchStr within str and returns an array of the indices of
//all these occurences
function getIndicesOf(searchStr: string, str: string, caseSensitive: boolean): number[] {
    let searchStrLen: number = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    let startIndex: number = 0;
    let index: number = 0;
    let indices: number[] = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

//Replaces the character at an index with a new character
function replaceAt(base: string, index: number, character: string): string {
    return base.substr(0, index) + character + base.substr(index+character.length);
}

//Converts a date representing time in milliseconds to a string with the format
//      H hours M minutes and S seconds
// e.g. 10000 -> "0 hours 0 minutes and 10 seconds"
//      120000 -> "0 0 hours 2 minutes and 0 seconds"
function convertTimeMsToTimeElapsedString(time: number): string {
    //Convert ms to seconds, since we only have second-level precision
    time = Math.floor(time / 1000);

    let days = Math.floor(time / 86400);
    time %= 86400;

    let hours = Math.floor(time / 3600);
    time %= 3600;

    let minutes = Math.floor(time / 60);
    time %= 60;

    let seconds: number = time;

    let res = "";
    if (days) {res += days + " days ";}
    if (hours) {res += hours + " hours ";}
    if (minutes) {res += minutes + " minutes ";}
    res += seconds + " seconds ";
    return res;
}

//Finds the longest common starting substring in a set of strings
function longestCommonStart(strings: string[]): string {
    if (!containsAllStrings(strings)) {return "";}
    if (strings.length == 0) {return "";}

    let A: string[] = strings.concat().sort();
    let a1: string = A[0];
    let a2: string = A[A.length-1];
    let L: number = a1.length;
    let i: number = 0;
    while(i<L && a1.charAt(i).toLowerCase() === a2.charAt(i).toLowerCase()) i++;
    return a1.substring(0, i);
}


//Returns whether a variable is a string
function isString(str: any): boolean {
    return (typeof str === 'string' || str instanceof String);
}

//Returns whether an array contains entirely of string objects
function containsAllStrings(arr: string[]): boolean {
    return arr.every(isString);
}

//Formats a number with commas and a specific number of decimal digits
function formatNumber(num: number, numFractionDigits: number): string {
    return num.toLocaleString(undefined, {
        minimumFractionDigits: numFractionDigits,
        maximumFractionDigits: numFractionDigits
    });
}

//Count the number of times a substring occurs in a string
function numOccurrences(text: string, subString: string): number {
    text += "";
    subString += "";
    if (subString.length <= 0) return (text.length + 1);

    let n: number = 0;
    let pos: number = 0;
    let step: number = subString.length;

    while (true) {
        pos = text.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

//Counters the number of Netscript operators in a string
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
        dialogBoxCreate("ERROR in counting number of operators in script. This is a bug, please report to game developer", false);
        return 0;
    }
    return total;
}

//Checks if a string contains HTML elements
function isHTML(str: string): boolean {
    var a = document.createElement('div');
    a.innerHTML = str;
    for (var c = a.childNodes, i = c.length; i--; ) {
        if (c[i].nodeType == 1) return true;
    }
    return false;
}

//Generates a random alphanumeric string with N characters
function generateRandomString(n: number): string {
    var str = "",
        chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < n; i++)
        str += chars.charAt(Math.floor(Math.random() * chars.length));

    return str;
}

export {getIndicesOf, convertTimeMsToTimeElapsedString, longestCommonStart,
        isString, containsAllStrings, formatNumber,
        numOccurrences, numNetscriptOperators, isHTML, generateRandomString, replaceAt};
