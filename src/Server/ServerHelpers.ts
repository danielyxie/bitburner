import { GetServer, createUniqueRandomIp, ipExists } from "./AllServers";
import { Server, IConstructorParams } from "./Server";
import { BaseServer } from "./BaseServer";
import { calculateServerGrowth } from "./formulas/grow";

import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../Constants";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Programs } from "../Programs/Programs";
import { LiteratureNames } from "../Literature/data/LiteratureNames";

import { isValidNumber } from "../utils/helpers/isValidNumber";

/**
 * Constructs a new server, while also ensuring that the new server
 * does not have a duplicate hostname/ip.
 */
export function safetlyCreateUniqueServer(params: IConstructorParams): Server {
  let hostname: string = params.hostname.replace(/ /g, `-`);

  if (params.ip != null && ipExists(params.ip)) {
    params.ip = createUniqueRandomIp();
  }

  if (GetServer(hostname) != null) {
    hostname = `${hostname}-0`;

    // Use a for loop to ensure that we don't get suck in an infinite loop somehow
    for (let i = 0; i < 200; ++i) {
      hostname = hostname.replace(/-[0-9]+$/, `-${i}`);
      if (GetServer(hostname) == null) {
        break;
      }
    }
  }

  params.hostname = hostname;
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
export function numCycleForGrowth(server: Server, growth: number, p: IPlayer, cores = 1): number {
  let ajdGrowthRate = 1 + (CONSTANTS.ServerBaseGrowthRate - 1) / server.hackDifficulty;
  if (ajdGrowthRate > CONSTANTS.ServerMaxGrowthRate) {
    ajdGrowthRate = CONSTANTS.ServerMaxGrowthRate;
  }

  const serverGrowthPercentage = server.serverGrowth / 100;

  const coreBonus = 1 + (cores - 1) / 16;
  const cycles =
    Math.log(growth) /
    (Math.log(ajdGrowthRate) *
      p.hacking_grow_mult *
      serverGrowthPercentage *
      BitNodeMultipliers.ServerGrowthRate *
      coreBonus);

  return cycles;
}

//Applied server growth for a single server. Returns the percentage growth
export function processSingleServerGrowth(server: Server, threads: number, p: IPlayer, cores = 1): number {
  let serverGrowth = calculateServerGrowth(server, threads, p, cores);
  if (serverGrowth < 1) {
    console.warn("serverGrowth calculated to be less than 1");
    serverGrowth = 1;
  }

  if (server.moneyAvailable < 1) { //can grow a server reduced to $0
    server.moneyAvailable = 1;
  }
  const oldMoneyAvailable = server.moneyAvailable;
  //server.moneyAvailable += 1 * threads; // It can be grown even if it has no money
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
    let usedCycles = (server.moneyAvailable == 0 || oldMoneyAvailable == 0) ? 0 : numCycleForGrowth(server, server.moneyAvailable / oldMoneyAvailable, p, cores); //catch /0 case
    usedCycles = Math.min(Math.max(0, Math.ceil(usedCycles)), threads);
    server.fortify(2 * CONSTANTS.ServerFortifyAmount * usedCycles);
  }
  return (oldMoneyAvailable == 0) ? 0.0 : server.moneyAvailable / oldMoneyAvailable; //catch for case of 0/0
}

export function prestigeHomeComputer(player: IPlayer, homeComp: Server): void {
  const hasBitflume = homeComp.programs.includes(Programs.BitFlume.name);

  homeComp.programs.length = 0; //Remove programs
  homeComp.runningScripts = [];
  homeComp.serversOnNetwork = [];
  homeComp.isConnectedTo = true;
  homeComp.ramUsed = 0;
  homeComp.programs.push(Programs.NukeProgram.name);
  if (hasBitflume) {
    homeComp.programs.push(Programs.BitFlume.name);
  }

  //Update RAM usage on all scripts
  homeComp.scripts.forEach(function (script) {
    script.updateRamUsage(player, homeComp.scripts);
  });

  homeComp.messages.length = 0; //Remove .lit and .msg files
  homeComp.messages.push(LiteratureNames.HackersStartingHandbook);
}

// Returns the i-th server on the specified server's network
// A Server's serverOnNetwork property holds only the IPs. This function returns
// the actual Server object
export function getServerOnNetwork(server: BaseServer, i: number): BaseServer | null {
  if (i > server.serversOnNetwork.length) {
    console.error("Tried to get server on network that was out of range");
    return null;
  }

  return GetServer(server.serversOnNetwork[i]);
}

export function isBackdoorInstalled(server: BaseServer): boolean {
  if (server instanceof Server) {
    return server.backdoorInstalled;
  }
  return false;
}
