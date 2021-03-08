import {
    AllServers,
    createUniqueRandomIp,
    ipExists,
} from "./AllServers";
import { Server, IConstructorParams } from "./Server";

import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../Constants";
import { HacknetServer } from "../Hacknet/HacknetServer";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Programs } from "../Programs/Programs";

import { isValidNumber } from "../utils/helpers/isValidNumber";
import { isValidIPAddress } from "../../utils/helpers/isValidIPAddress";

/**
 * Constructs a new server, while also ensuring that the new server
 * does not have a duplicate hostname/ip.
 */
export function safetlyCreateUniqueServer(params: IConstructorParams): Server {
    if (params.ip != null && ipExists(params.ip)) {
        params.ip = createUniqueRandomIp();
    }

    if (GetServerByHostname(params.hostname) != null) {
        // Use a for loop to ensure that we don't get suck in an infinite loop somehow
        let hostname: string = params.hostname;
        for (let i = 0; i < 200; ++i) {
            hostname = `${params.hostname}-${i}`;
            if (GetServerByHostname(hostname) == null) { break; }
        }
        params.hostname = hostname;
    }

    return new Server(params);
}

/**
 * Returns the number of "growth cycles" needed to grow the specified server by the
 * specified amount.
 * @param server - Server being grown
 * @param growth - How much the server is being grown by, in DECIMAL form (e.g. 1.5 rather than 50)
 * @param p - Reference to Player object
 * @returns Number of "growth cycles" needed
 */
export function numCycleForGrowth(server: Server, growth: number, p: IPlayer) {
    let ajdGrowthRate = 1 + (CONSTANTS.ServerBaseGrowthRate - 1) / server.hackDifficulty;
    if (ajdGrowthRate > CONSTANTS.ServerMaxGrowthRate) {
        ajdGrowthRate = CONSTANTS.ServerMaxGrowthRate;
    }

    const serverGrowthPercentage = server.serverGrowth / 100;

    const cycles = Math.log(growth)/(Math.log(ajdGrowthRate) * p.hacking_grow_mult * serverGrowthPercentage * BitNodeMultipliers.ServerGrowthRate);

    return cycles;
}

//Applied server growth for a single server. Returns the percentage growth
export function processSingleServerGrowth(server: Server, numCycles: number, p: IPlayer) {
    //Server growth processed once every 450 game cycles
    const numServerGrowthCycles = Math.max(Math.floor(numCycles / 450), 0);

    //Get adjusted growth rate, which accounts for server security
    const growthRate = CONSTANTS.ServerBaseGrowthRate;
    var adjGrowthRate = 1 + (growthRate - 1) / server.hackDifficulty;
    if (adjGrowthRate > CONSTANTS.ServerMaxGrowthRate) {adjGrowthRate = CONSTANTS.ServerMaxGrowthRate;}

    //Calculate adjusted server growth rate based on parameters
    const serverGrowthPercentage = server.serverGrowth / 100;
    const numServerGrowthCyclesAdjusted = numServerGrowthCycles * serverGrowthPercentage * BitNodeMultipliers.ServerGrowthRate;

    //Apply serverGrowth for the calculated number of growth cycles
    let serverGrowth = Math.pow(adjGrowthRate, numServerGrowthCyclesAdjusted * p.hacking_grow_mult);
    if (serverGrowth < 1) {
        console.warn("serverGrowth calculated to be less than 1");
        serverGrowth = 1;
    }

    const oldMoneyAvailable = server.moneyAvailable;
    server.moneyAvailable *= serverGrowth;

    // in case of data corruption
    if (isValidNumber(server.moneyMax) && isNaN(server.moneyAvailable)) {
        server.moneyAvailable = server.moneyMax;
    }

    // cap at max
    if (isValidNumber(server.moneyMax) && server.moneyAvailable > server.moneyMax) {
        server.moneyAvailable = server.moneyMax;
    }

    // if there was any growth at all, increase security
    if (oldMoneyAvailable !== server.moneyAvailable) {
        //Growing increases server security twice as much as hacking
        let usedCycles = numCycleForGrowth(server, server.moneyAvailable / oldMoneyAvailable, p);
        usedCycles = Math.max(0, usedCycles);
        server.fortify(2 * CONSTANTS.ServerFortifyAmount * Math.ceil(usedCycles));
    }
    return server.moneyAvailable / oldMoneyAvailable;
}

export function prestigeHomeComputer(homeComp: Server) {
    const hasBitflume = homeComp.programs.includes(Programs.BitFlume.name);

    homeComp.programs.length = 0; //Remove programs
    homeComp.runningScripts = [];
    homeComp.serversOnNetwork = [];
    homeComp.isConnectedTo = true;
    homeComp.ramUsed = 0;
    homeComp.programs.push(Programs.NukeProgram.name);
    if (hasBitflume) { homeComp.programs.push(Programs.BitFlume.name); }

    //Update RAM usage on all scripts
    homeComp.scripts.forEach(function(script) {
        script.updateRamUsage(homeComp.scripts);
    });

    homeComp.messages.length = 0; //Remove .lit and .msg files
    homeComp.messages.push("hackers-starting-handbook.lit");
}

//Returns server object with corresponding hostname
//    Relatively slow, would rather not use this a lot
export function GetServerByHostname(hostname: string): Server | HacknetServer | null {
    for (var ip in AllServers) {
        if (AllServers.hasOwnProperty(ip)) {
            if (AllServers[ip].hostname == hostname) {
                return AllServers[ip];
            }
        }
    }

    return null;
}

//Get server by IP or hostname. Returns null if invalid
export function getServer(s: string): Server | HacknetServer | null {
    if (!isValidIPAddress(s)) {
        return GetServerByHostname(s);
    }
    if (AllServers[s] !== undefined) {
        return AllServers[s];
    }

    return null;
}

// Returns the i-th server on the specified server's network
// A Server's serverOnNetwork property holds only the IPs. This function returns
// the actual Server object
export function getServerOnNetwork(server: Server, i: number) {
    if (i > server.serversOnNetwork.length) {
        console.error("Tried to get server on network that was out of range");
        return;
    }

    return AllServers[server.serversOnNetwork[i]];
}
