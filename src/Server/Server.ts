// Class representing a single hackable Server
import { BaseServer } from "./BaseServer";

import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";

import { createRandomIp } from "../../utils/IPAddress";
import { Generic_fromJSON,
         Generic_toJSON,
         Reviver } from "../../utils/JSONReviver";
import { createRandomString } from "../utils/helpers/createRandomString";

import { SERVERS_INITIALIZED } from "./AllServers";

export interface IConstructorParams {
    adminRights?: boolean;
    hackDifficulty?: number;
    hostname: string;
    ip?: string;
    isConnectedTo?: boolean;
    maxRam?: number;
    moneyAvailable?: number;
    numOpenPortsRequired?: number;
    organizationName?: string;
    purchasedByPlayer?: boolean;
    requiredHackingSkill?: number;
    serverGrowth?: number;
}

export class Server extends BaseServer {
    // Initializes a Server Object from a JSON save state
    static fromJSON(value: any): Server {
        const server: Server = Generic_fromJSON(Server, value.data);

        // Filesystem of this server was reverted to JSON, we rebuild the fs from it.
        // console.log(`Loading server ${server.hostname} files: ${JSON.stringify(server.volJSON)}`);

        server.restoreFileSystem(server.volJSON);

        if (SERVERS_INITIALIZED) { server.scripts.forEach((script) => script.updateRamUsage()); }
        // now that the file system has been restored we can update the scripts.
        return server;
    }


    constructor(params: IConstructorParams= {hostname: "", ip: createRandomIp() }) {
        super(params);

        // "hacknet-node-X" hostnames are reserved for Hacknet Servers
        if (this.hostname.startsWith("hacknet-node-")) {
            this.hostname = createRandomString(10);
        }


    }

    /**
     * Ensures that the server's difficulty (server security) doesn't get too high
     */
    capDifficulty(): void {
        if (this.hackDifficulty < this.minDifficulty) {this.hackDifficulty = this.minDifficulty; }
        if (this.hackDifficulty < 1) {this.hackDifficulty = 1; }

        // Place some arbitrarily limit that realistically should never happen unless someone is
        // screwing around with the game
        if (this.hackDifficulty > 1000000) {this.hackDifficulty = 1000000; }
    }

    /**
     * Change this server's minimum security
     * @param n - Value by which to increase/decrease the server's minimum security
     * @param perc - Whether it should be changed by a percentage, or a flat value
     */
    changeMinimumSecurity(n: number, perc: boolean= false): void {
        if (perc) {
            this.minDifficulty *= n;
        } else {
            this.minDifficulty += n;
        }

        // Server security cannot go below 1
        this.minDifficulty = Math.max(1, this.minDifficulty);
    }

    /**
     * Change this server's maximum money
     * @param n - Value by which to change the server's maximum money
     * @param perc - Whether it should be changed by a percentage, or a flat value
     */
    changeMaximumMoney(n: number, perc: boolean= false): void {
        if (perc) {
            this.moneyMax *= n;
        } else {
            this.moneyMax += n;
        }
    }

    /**
     * Strengthens a server's security level (difficulty) by the specified amount
     */
    fortify(amt: number): void {
        this.hackDifficulty += amt;
        this.capDifficulty();
    }

    /**
     * Lowers the server's security level (difficulty) by the specified amount)
     */
    weaken(amt: number): void {
        this.hackDifficulty -= (amt * BitNodeMultipliers.ServerWeakenRate);
        this.capDifficulty();
    }

    /**
     * Serialize the current object to a JSON save state
     */
    toJSON(): any {
        // we changes the volume to its JSON conterpart for serialization.
        this.volJSON = this.vol.toJSON();
        return Generic_toJSON("Server", this);
    }
}

Reviver.constructors.Server = Server;
