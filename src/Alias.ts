import { IMap } from "./types";
import { post } from "./ui/postToTerminal";

export let Aliases: IMap<string> = {};
export let GlobalAliases: IMap<string> = {};

export function loadAliases(saveString: string): void {
    if (saveString === "") {
        Aliases = {};
    } else {
        Aliases = JSON.parse(saveString);
    }
}

export function loadGlobalAliases(saveString: string): void {
    if (saveString === "") {
        GlobalAliases = {};
    } else {
        GlobalAliases = JSON.parse(saveString);
    }
}

// Prints all aliases to terminal
export function printAliases(): string {
    let result = []
    for (const name in Aliases) {
        if (Aliases.hasOwnProperty(name)) {
            result.push("alias " + name + "=" + Aliases[name]);
        }
    }
    for (const name in GlobalAliases) {
        if (GlobalAliases.hasOwnProperty(name)) {
            result.push("global alias " + name + "=" + GlobalAliases[name]);
        }
    }
    return result.join("\n");
}

// Returns true if successful, false otherwise
export function parseAliasDeclaration(dec: string, global: boolean= false) {
    const re = /((^[^"<>/\\|?*: ][^"<>/\\|?*:]*[^"<>/\\|?*:. ])|(^[^"<>/\\|?*:. ]))=(".+")$/;
    const matches = dec.match(re);
    if (matches == null) {return false; }
    // values:
    // 0 : full expression
    // 1 : alias name
    // 2 : alias name if more than 1 character
    // 3 : alias name if only 1 character
    // 4 : command string
    if (global) {
        addGlobalAlias(matches[1], matches[4]);
    } else {
        addAlias(matches[1], matches[4]);
    }
    return true;
}

function addAlias(name: string, value: string): void {
    if (name in GlobalAliases) {
        delete GlobalAliases[name];
    }
    Aliases[name] = value;
}

function addGlobalAlias(name: string, value: string): void {
    if (name in Aliases) {
        delete Aliases[name];
    }
    GlobalAliases[name] = value;
}

function getAlias(name: string): string | null {
    if (Aliases.hasOwnProperty(name)) {
        return Aliases[name];
    }

    return null;
}

function getGlobalAlias(name: string): string | null {
    if (GlobalAliases.hasOwnProperty(name)) {
        return GlobalAliases[name];
    }
    return null;
}

export function removeAlias(name: string): boolean {
    if (Aliases.hasOwnProperty(name)) {
        delete Aliases[name];
        return true;
    }

    if (GlobalAliases.hasOwnProperty(name)) {
        delete GlobalAliases[name];
        return true;
    }

    return false;
}

/**
 * Returns the original string with any aliases substituted in.
 * Aliases are only applied to "whole words", one level deep
 */
export function substituteAliases(origCommand: string): string {
    const commandArray = origCommand.split(" ");
    if (commandArray.length > 0) {
        // For the unalias command, dont substite
        if (commandArray[0] === "unalias") { return commandArray.join(" "); }

        const alias = getAlias(commandArray[0]);
        if (alias != null) {
            commandArray[0] = alias;
        } else {
            const alias = getGlobalAlias(commandArray[0]);
            if (alias != null) {
                commandArray[0] = alias;
            }
        }
        for (let i = 0; i < commandArray.length; ++i) {
            const alias = getGlobalAlias(commandArray[i]);
            if (alias != null) {
                commandArray[i] = alias;
            }
        }
    }
    return commandArray.join(" ");
}

export function resetAliases(){
    Aliases = {}
}

export function resetGlobalAliases(){
    GlobalAliases = {}
}

export function resetAllAliases(){
    resetAliases();
    resetGlobalAliases();
}

