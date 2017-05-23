/* Alias.js */
Aliases = {};

//Print all aliases to terminal
function printAliases() {
    for (var name in Aliases) {
        if (Aliases.hasOwnProperty(name)) {
            post("alias " + name + "=" + Aliases[name]);
        }
    }
}

//True if successful, false otherwise
function parseAliasDeclaration(dec) {
    var re = /([^=]+)="(.+)"/;
    var matches = dec.match(re);
    if (matches == null || matches.length != 3) {return false;}
    addAlias(matches[1], matches[2]);
    return true;
}

function addAlias(name, value) {
    Aliases[name] = value;
}

function getAlias(name) {
    if (Aliases.hasOwnProperty(name)) {
        return Aliases[name];
    }
    return null;
}

//Returns the original string with any aliases substituted in
//Aliases only applied to "whole words", one level deep
function substituteAliases(origCommand) {
    var commandArray = origCommand.split(" ");
    for (var i = 0; i < commandArray.length; ++i) {
        var alias = getAlias(commandArray[i]);
        if (alias != null) {
            commandArray[i] = alias;
        }
    }
    return commandArray.join(" ");
}