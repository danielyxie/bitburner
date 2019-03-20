import { AllServers }                           from "./AllServers";
import { Server }                               from "./Server";

import { BitNodeMultipliers }                   from "../BitNode/BitNodeMultipliers";
import { CONSTANTS }                            from "../Constants";
import { IPlayer }                              from "../PersonObjects/IPlayer";
import { Programs }                             from "../Programs/Programs";

import {isValidIPAddress}                       from "../../utils/helpers/isValidIPAddress";

// Returns the number of cycles needed to grow the specified server by the
// specified amount. 'growth' parameter is in decimal form, not percentage
export function numCycleForGrowth(server: Server, growth: number, p: IPlayer) {
    let ajdGrowthRate = 1 + (CONSTANTS.ServerBaseGrowthRate - 1) / server.hackDifficulty;
    if(ajdGrowthRate > CONSTANTS.ServerMaxGrowthRate) {
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
        console.log("WARN: serverGrowth calculated to be less than 1");
        serverGrowth = 1;
    }

    const oldMoneyAvailable = server.moneyAvailable;
    server.moneyAvailable *= serverGrowth;

    // in case of data corruption
    if (server.moneyMax && isNaN(server.moneyAvailable)) {
        server.moneyAvailable = server.moneyMax;
    }

    // cap at max
    if (server.moneyMax && server.moneyAvailable > server.moneyMax) {
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
        script.updateRamUsage();
    });

    homeComp.messages.length = 0; //Remove .lit and .msg files
    homeComp.messages.push("hackers-starting-handbook.lit");
}

//Returns server object with corresponding hostname
//    Relatively slow, would rather not use this a lot
export function GetServerByHostname(hostname: string): Server | null {
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
export function getServer(s: string): Server | null {
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
