import {Reviver, Generic_toJSON,
        Generic_fromJSON}                       from "../utils/JSONReviver";

/* Holds IP of Special Servers */
let SpecialServerNames = {
    FulcrumSecretTechnologies:  "Fulcrum Secret Technologies Server",
    CyberSecServer:             "CyberSec Server",
    NiteSecServer:              "NiteSec Server",
    TheBlackHandServer:         "The Black Hand Server",
    BitRunnersServer:           "BitRunners Server",
    TheDarkArmyServer:          "The Dark Army Server",
    DaedalusServer:             "Daedalus Server",
    WorldDaemon:                "w0r1d_d43m0n",
}
function SpecialServerIpsMap() {}

SpecialServerIpsMap.prototype.addIp = function(name, ip) {
    this[name] = ip;
}

SpecialServerIpsMap.prototype.toJSON = function() {
    return Generic_toJSON("SpecialServerIpsMap", this);
}

SpecialServerIpsMap.fromJSON = function(value) {
    return Generic_fromJSON(SpecialServerIpsMap, value.data);
}

Reviver.constructors.SpecialServerIpsMap = SpecialServerIpsMap;

let SpecialServerIps = new SpecialServerIpsMap();

function prestigeSpecialServerIps() {
    for (var member in SpecialServerIps) {
        delete SpecialServerIps[member];
    }
    SpecialServerIps = null;
    SpecialServerIps = new SpecialServerIpsMap();
}

function loadSpecialServerIps(saveString) {
    SpecialServerIps = JSON.parse(saveString, Reviver);
}

function initSpecialServerIps() {
    SpecialServerIps = new SpecialServerIpsMap();
}

export {SpecialServerNames, SpecialServerIps, SpecialServerIpsMap, loadSpecialServerIps,
        prestigeSpecialServerIps, initSpecialServerIps};
