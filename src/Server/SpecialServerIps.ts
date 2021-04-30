import { IMap }                     from "../types";
import { Reviver,
         Generic_toJSON,
         Generic_fromJSON }         from "../../utils/JSONReviver";

/* Holds IP of Special Servers */
export const SpecialServerNames: IMap<string> = {
    FulcrumSecretTechnologies:  "Fulcrum Secret Technologies Server",
    CyberSecServer:             "CyberSec Server",
    NiteSecServer:              "NiteSec Server",
    TheBlackHandServer:         "The Black Hand Server",
    BitRunnersServer:           "BitRunners Server",
    TheDarkArmyServer:          "The Dark Army Server",
    DaedalusServer:             "Daedalus Server",
    WorldDaemon:                "w0r1d_d43m0n",
}

export class SpecialServerIpsMap {
    // Initializes a SpecialServerIpsMap Object from a JSON save state
    static fromJSON(value: any): SpecialServerIpsMap {
        return Generic_fromJSON(SpecialServerIpsMap, value.data);
    }

    [key: string]: Function | string;

    constructor() {}

    addIp(name:string, ip: string) {
        this[name] = ip;
    }

    getIp(name: string): string {
        return this[name] as string;
    }

    // Serialize the current object to a JSON save state
    toJSON(): any {
        return Generic_toJSON("SpecialServerIpsMap", this);
    }
}

Reviver.constructors.SpecialServerIpsMap = SpecialServerIpsMap;

export let SpecialServerIps: SpecialServerIpsMap = new SpecialServerIpsMap();

export function prestigeSpecialServerIps() {
    for (const member in SpecialServerIps) {
        delete SpecialServerIps[member];
    }

    SpecialServerIps = new SpecialServerIpsMap();
}

export function loadSpecialServerIps(saveString: string) {
    SpecialServerIps = JSON.parse(saveString, Reviver);
}

export function initSpecialServerIps() {
    SpecialServerIps = new SpecialServerIpsMap();
}
