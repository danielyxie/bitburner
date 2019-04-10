import {
    post
} from "../ui/postToTerminal";

import {
    containsAllStrings,
    longestCommonStart
} from "../../utils/StringHelperFunctions";

/**
 * Implements tab completion for the Terminal
 *
 * @param command {string} Terminal command, excluding the last incomplete argument
 * @param arg {string} Last argument that is being completed
 * @param allPossibilities {string[]} All values that `arg` can complete to
 */
export function tabCompletion(command: string, arg: string, allPossibilities: string[]): void {
    if (!(allPossibilities.constructor === Array)) { return; }
    if (!containsAllStrings(allPossibilities)) { return; }

    // Remove all options in allPossibilities that do not match the current string
    // that we are attempting to autocomplete
    if (arg === "") {
        for (let i = allPossibilities.length-1; i >= 0; --i) {
            if (!allPossibilities[i].toLowerCase().startsWith(command.toLowerCase())) {
                allPossibilities.splice(i, 1);
            }
        }
    } else {
        for (let i = allPossibilities.length-1; i >= 0; --i) {
            if (!allPossibilities[i].toLowerCase().startsWith(arg.toLowerCase())) {
                allPossibilities.splice(i, 1);
            }
        }
    }

    const textBoxElem = document.getElementById("terminal-input-text-box");
    if (textBoxElem == null) {
        console.warn(`Couldn't find terminal input DOM element (id=terminal-input-text-box) when trying to autocomplete`);
        return;
    }
    const textBox = <HTMLInputElement>textBoxElem;

    const oldValue = textBox.value;
    const semiColonIndex = oldValue.lastIndexOf(";");

    let val = "";
    if (allPossibilities.length === 0) {
        return;
    } else if (allPossibilities.length === 1) {
        if (arg === "") {
            //Autocomplete command
            val = allPossibilities[0] + " ";
        } else {
            val = command + " " + allPossibilities[0];
        }

        if (semiColonIndex === -1) {
            // No semicolon, so replace the whole command
            textBox.value = val;
        } else {
            // Replace only after the last semicolon
            textBox.value = textBox.value.slice(0, semiColonIndex + 1) + " " + val;
        }

        textBox.focus();
    } else {
        const longestStartSubstr = longestCommonStart(allPossibilities);
        /**
         * If the longest common starting substring of remaining possibilities is the same
         * as whatevers already in terminal, just list all possible options. Otherwise,
         * change the input in the terminal to the longest common starting substr
         */
        let allOptionsStr = "";
        for (let i = 0; i < allPossibilities.length; ++i) {
            allOptionsStr += allPossibilities[i];
            allOptionsStr += "   ";
        }
        if (arg === "") {
            if (longestStartSubstr === command) {
                post("> " + command);
                post(allOptionsStr);
            } else {
                if (semiColonIndex === -1) {
                    // No semicolon, so replace the whole command
                    textBox.value = longestStartSubstr;
                } else {
                    // Replace only after the last semicolon
                    textBox.value = `${textBox.value.slice(0, semiColonIndex + 1)} ${longestStartSubstr}`;
                }

                textBox.focus();
            }
        } else {
            if (longestStartSubstr === arg) {
                // List all possible options
                post("> " + command + " " + arg);
                post(allOptionsStr);
            } else {
                if (semiColonIndex == -1) {
                    // No semicolon, so replace the whole command
                    textBox.value = `${command} ${longestStartSubstr}`;
                } else {
                    // Replace only after the last semicolon
                    textBox.value = `${textBox.value.slice(0, semiColonIndex + 1)} ${command} ${longestStartSubstr}`;
                }

                textBox.focus();
            }
        }

    }
}
