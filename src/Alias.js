import {post}                   from "./ui/postToTerminal";

let Aliases = {};
let GlobalAliases = {};

function loadAliases(saveString) {
    if (saveString === "") {
        Aliases = {};
    } else {
        Aliases = JSON.parse(saveString);
    }
}

function loadGlobalAliases(saveString) {
    if (saveString === "") {
        GlobalAliases = {};
    } else {
        GlobalAliases = JSON.parse(saveString);
    }
}

//Print all aliases to terminal
function printAliases() {
    for (var name in Aliases) {
        if (Aliases.hasOwnProperty(name)) {
            post("alias " + name + "=" + Aliases[name]);
        }
    }
    for (var name in GlobalAliases) {
        if (GlobalAliases.hasOwnProperty(name)) {
            post("global alias " + name + "=" + GlobalAliases[name]);
        }
    }
}

//True if successful, false otherwise
function parseAliasDeclaration(dec,global=false) {
    var re = /^([_|\w|!|%|,|@]+)="(.+)"$/;
    var matches = dec.match(re);
    if (matches == null || matches.length != 3) {return false;}
    if (global){
        addGlobalAlias(matches[1],matches[2]);
    } else {
        addAlias(matches[1], matches[2]);
    }
    return true;
}

function addAlias(name, value) {
    if (name in GlobalAliases){
        delete GlobalAliases[name];
    }
    Aliases[name] = value;
}

function addGlobalAlias(name, value) {
    if (name in Aliases){
        delete Aliases[name];
    }
    GlobalAliases[name] = value;
}

function getAlias(name) {
    if (Aliases.hasOwnProperty(name)) {
        return Aliases[name];
    }
    return null;
}

function getGlobalAlias(name) {
    if (GlobalAliases.hasOwnProperty(name)) {
        return GlobalAliases[name];
    }
    return null;
}

function removeAlias(name) {
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

//Returns the original string with any aliases substituted in
//Aliases only applied to "whole words", one level deep
function substituteAliases(origCommand) {
    var commandArray = origCommand.split(" ");
    if (commandArray.length > 0){
        // For the unalias command, dont substite
        if (commandArray[0] === "unalias") { return commandArray.join(" "); }

        var alias = getAlias(commandArray[0]);
        if (alias != null) {
            commandArray[0] = alias;
        } else {
            var alias = getGlobalAlias(commandArray[0]);
            if (alias != null) {
                commandArray[0] = alias;
            }
        }
        for (var i = 0; i < commandArray.length; ++i) {
            var alias = getGlobalAlias(commandArray[i]);
            if (alias != null) {
                commandArray[i] = alias;
            }
        }
    }
    return commandArray.join(" ");
}

export {Aliases, GlobalAliases, printAliases, parseAliasDeclaration,
        removeAlias, substituteAliases, loadAliases, loadGlobalAliases};
