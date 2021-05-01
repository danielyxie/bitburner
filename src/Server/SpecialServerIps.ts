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
    // eslint-disable-next-line @typescript-eslint/ban-types
    [key: string]: Function | string;

    addIp(name:string, ip: string): void {
        this[name] = ip;
    }

    getIp(name: string): string {
        return this[name] as string;
    }

    // Serialize the current object to a JSON save state
    toJSON(): any {
        return Generic_toJSON("SpecialServerIpsMap", this);
    }

    // Initializes a SpecialServerIpsMap Object from a JSON save state
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static fromJSON(value: any): SpecialServerIpsMap {
        return Generic_fromJSON(SpecialServerIpsMap, value.data);
    }
}

Reviver.constructors.SpecialServerIpsMap = SpecialServerIpsMap;

export let SpecialServerIps: SpecialServerIpsMap = new SpecialServerIpsMap();

export function prestigeSpecialServerIps(): void {
    for (const member in SpecialServerIps) {
        delete SpecialServerIps[member];
    }

    SpecialServerIps = new SpecialServerIpsMap();
}

export function loadSpecialServerIps(saveString: string): void {
    SpecialServerIps = JSON.parse(saveString, Reviver);
}

export function initSpecialServerIps(): void {
    SpecialServerIps = new SpecialServerIpsMap();
}
