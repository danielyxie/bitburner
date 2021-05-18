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
export function printAliases(): void {
    for (const name in Aliases) {
        if (Aliases.hasOwnProperty(name)) {
            post("alias " + name + "=" + Aliases[name]);
        }
    }
    for (const name in GlobalAliases) {
        if (GlobalAliases.hasOwnProperty(name)) {
            post("global alias " + name + "=" + GlobalAliases[name]);
        }
    }
}

// Returns true if successful, false otherwise
export function parseAliasDeclaration(dec: string, global = false): boolean {
    const re = /^([_|\w|!|%|,|@]+)="(.+)"$/;
    const matches = dec.match(re);
    if (matches == null || matches.length != 3) {return false;}
    if (global){
        addGlobalAlias(matches[1],matches[2]);
    } else {
        addAlias(matches[1], matches[2]);
    }
    return true;
}

function addAlias(name: string, value: string): void {
    if (name in GlobalAliases) {
        delete GlobalAliases[name];
    }
    Aliases[name] = value.trim();
}

function addGlobalAlias(name: string, value: string): void {
    if (name in Aliases){
        delete Aliases[name];
    }
    GlobalAliases[name] = value.trim();
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
    if (commandArray.length > 0){
        // For the alias and unalias commands, dont substite
        if (commandArray[0] === "unalias" || commandArray[0] === "alias") { return commandArray.join(" "); }

        let somethingSubstituted = true;
        let depth = 0;

        while(somethingSubstituted && depth < 10){
            depth++;
            somethingSubstituted = false
            const alias = getAlias(commandArray[0])?.split(" ");
            if (alias != null) {
                somethingSubstituted = true
                commandArray.splice(0, 1, ...alias);
                //commandArray[0] = alias;
            }
            for (let i = 0; i < commandArray.length; ++i) {
                const alias = getGlobalAlias(commandArray[i])?.split(" ");
                if (alias != null) {
                    somethingSubstituted = true
                    commandArray.splice(i, 1, ...alias);
                    i += alias.length - 1;
                    //commandArray[i] = alias;
                }
            }
        }
    }
    return commandArray.join(" ");
}
