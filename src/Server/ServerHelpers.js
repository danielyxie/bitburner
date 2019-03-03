import { BitNodeMultipliers }                   from "./BitNode/BitNodeMultipliers";
import { CodingContract,
         ContractTypes }                        from "./CodingContracts";
import { CONSTANTS }                            from "./Constants";
import { Script,
         isScriptFilename }                     from "./Script";
import { Player }                               from "./Player";
import { Programs }                             from "./Programs/Programs";
import { SpecialServerIps }                     from "./SpecialServerIps";
import { TextFile }                             from "./TextFile";
import { getRandomInt }                         from "../utils/helpers/getRandomInt";
import { serverMetadata }                       from "./data/servers";
import { Reviver,
         Generic_toJSON,
         Generic_fromJSON}                      from "../utils/JSONReviver";
import {isValidIPAddress}                       from "../utils/helpers/isValidIPAddress";

// Returns the number of cycles needed to grow the specified server by the
// specified amount. 'growth' parameter is in decimal form, not percentage
export function numCycleForGrowth(server, growth) {
    let ajdGrowthRate = 1 + (CONSTANTS.ServerBaseGrowthRate - 1) / server.hackDifficulty;
    if(ajdGrowthRate > CONSTANTS.ServerMaxGrowthRate) {
        ajdGrowthRate = CONSTANTS.ServerMaxGrowthRate;
    }

    const serverGrowthPercentage = server.serverGrowth / 100;

    const cycles = Math.log(growth)/(Math.log(ajdGrowthRate)*Player.hacking_grow_mult*serverGrowthPercentage);
    return cycles;
}

//Applied server growth for a single server. Returns the percentage growth
export function processSingleServerGrowth(server, numCycles) {
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
    var serverGrowth = Math.pow(adjGrowthRate, numServerGrowthCyclesAdjusted * Player.hacking_grow_mult);
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
        let usedCycles = numCycleForGrowth(server, server.moneyAvailable / oldMoneyAvailable);
        usedCycles = Math.max(0, usedCycles);
        server.fortify(2 * CONSTANTS.ServerFortifyAmount * Math.ceil(usedCycles));
    }
    return server.moneyAvailable / oldMoneyAvailable;
}

export function prestigeHomeComputer(homeComp) {
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

function SizeOfAllServers() {
    var size = 0, key;
    for (key in AllServers) {
        if (AllServers.hasOwnProperty(key)) size++;
    }
    return size;
}

//Returns server object with corresponding hostname
//    Relatively slow, would rather not use this a lot
export function GetServerByHostname(hostname) {
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
export function getServer(s) {
    if (!isValidIPAddress(s)) {
        return GetServerByHostname(s);
    }
    if(AllServers[s] !== undefined) {
        return AllServers[s];
    }
    return null;
}
