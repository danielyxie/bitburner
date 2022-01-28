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

/**
 * Replacement function for the above function that accounts for the +$1/thread functionality of grow
 * with parameters that are the same (for compatibility), but functionality is slightly different.
 * This function can ONLY be used to calculate the threads needed for a given server in its current state,
 * and so wouldn't be appropriate to use for formulas.exe or ns.growthAnalyze (as those are meant to
 * provide theoretical scenaarios, or inverse hack respectively). Players COULD use this function with a
 * custom server object with the correct moneyAvailable and moneyMax amounts, combined with a multplier
 * correctly calculated to bring the server to a new moneyAvailable (ie, pasing in moneyAvailable 300 and x2
 * when you want the number of threads required to grow that particular server from 300 to 600), and this
 * function would pass back the correct number of threads. But the key thing is that it doesn't just
 * inverse/undo a hack (since the amount hacked from/to matters, not just the multiplier).
 * The above is also a rather unnecessarily obtuse way of thinking about it for a formulas.exe type of
 * application, so another function with different parameters is provided for that case below this one.
 * Instead this function is meant to hand-off from the old numCycleForGrowth function to the new one
 * where used internally for pro-rating or the like. Where you have applied a grow and want to determine
 * how many htreads were needed for THAT SPECIFIC grow case using a multiplier.
 * Idealy, this function, and the original function above will be depreciated to use the methodology
 * and inputs of the new function below this one. Even for internal cases (it's actually easier to do so).
 * @param server - Server being grown
 * @param growth - How much the server is being grown by, in DECIMAL form (e.g. 1.5 rather than 50)
 * @param p - Reference to Player object
 * @returns Number of "growth cycles" needed
 */
export function numCycleForGrowthTransition(server: Server, growth: number, p: IPlayer, cores = 1): number {
  return numCycleForGrowthCorrected(server, server.moneyAvailable * growth, server.moneyAvailable, p, cores);
}

/**
 * This function calculates the number of threads needed to grow a server from one $amount to a the same or higher $amount
 * (ie, how many threads to grow this server from $200 to $600 for example). Used primarily for a formulas (or possibly growthAnalyze)
 * type of application. It lets you "theorycraft" and easily ask what-if type questions. It's also the one that implements the
 * main thread calculation algorith, and so is the fuinction all helper functions should call.
 * It protects the inputs (so putting in INFINITY for targetMoney will use moneyMax, putting in a nagitive for start will use 0, etc.)
 * @param server - Server being grown
 * @param targetMoney - How much you want the server grown TO (not by), for instance, to grow from 200 to 600, input 600
 * @param startMoney - How much you are growing the server from, for instance, to grow from 200 to 600, input 200
 * @param p - Reference to Player object
 * @returns Number of "growth cycles" needed
 */
export function numCycleForGrowthCorrected(server: Server, targetMoney: number, startMoney: number, p: IPlayer, cores = 1): number {
 	if (startMoney == server.moneyMax) { return 0; } //no growth possible, no threads needed
	if (startMoney < 0) { startMoney = 0; } // servers "can't" have less than 0 dollars on them
	if (targetMoney > server.moneyMax) { targetMoney = server.moneyMax; } // can't grow a server to more than its moneyMax

	const growthMultiplier = Math.max(1.0, Math.min(targetMoney, targetMoney / startMoney)); //need a starting point, this is worst case grow multiplier

	const adjGrowthRate = (1 + (CONSTANTS.ServerBaseGrowthRate - 1) / server.hackDifficulty); // adj exponential base for security
	const exponentialBase = Math.min(adjGrowthRate, CONSTANTS.ServerMaxGrowthRate); //cap growth rate

	const serverGrowthPercentage = server.serverGrowth / 100.0;
	const coreMultiplier = 1 + ((cores -1) / 16);
	const threadMultiplier = serverGrowthPercentage * p.hacking_grow_mult * coreMultiplier * BitNodeMultipliers.ServerGrowthRate; //total of all grow thread multipliers

	let cycles = Math.log(growthMultiplier) / Math.log(exponentialBase) / threadMultiplier; //this is the completely naive cycle amt and is always >= the real cycles required
	let cycleAdjust = 0.5 * cycles;

	let overGrowth = 0;
	while (cycleAdjust > 0.5) { //go until we get an overage of less than $1 or we're adjusting by less than half a thread
		overGrowth = (startMoney + cycles) * Math.pow(exponentialBase, cycles * threadMultiplier) - targetMoney;
		if (overGrowth < 0) { cycles += cycleAdjust; }
		else if (overGrowth > 1) { cycles -= cycleAdjust; }
		else { break; } //we're over by less than $1, return cycles
		cycleAdjust *= 0.5; //basic 50% partition search
	}

	cycles = Math.ceil(cycles);
  //might be worth doing some checks here +/- 1 thread just to make sure we didn't quit too early
	return cycles;
}

/**
 * This function calculates the number of threads needed to grow a server based on a pre-hack money and hackAmt
 * (ie, if you're hacking a server with $1e6 moneyAvail for 60%, this function will tell you how many threads to regrow it
 * PROBABLY the best replacement for the current ns.growthAnalyze
 * @param server - Server being grown
 * @param hackAmt - the amount hacked (total, not per thread) - as a decimal (like 0.60 for hacking 60% of available money)
 * @param prehackMoney - how much money the server had before being hacked (like 200000 for hacking a server that had $200000 on it at time of hacking)
 * @param p - Reference to Player object
 * @returns Number of "growth cycles" needed to reverse the described hack
 */
server: Server, targetMoney: number, startMoney: number, p: IPlayer, cores = 1): number
export function numCycleForGrowthByHackAmt(server, hackAmt: number, prehackMoney: number, p: IPlayer, cores = 1) {
	if (prehackMoney > server.moneyMax) { preHackAmt = server.moneyMax; }
	const posthackAmt = Math.floor(prehackMoney * Math.min(1, Math.max(0, (1 - hackAmt))));
	return numCycleForGrowthCorrected(server, preHackAmt, posthackAmt, player, difficulty, cores, capGrowMult);
}

//Applied server growth for a single server. Returns the percentage growth
export function processSingleServerGrowth(server: Server, threads: number, p: IPlayer, cores = 1): number {
  let serverGrowth = calculateServerGrowth(server, threads, p, cores);
  if (serverGrowth < 1) {
    console.warn("serverGrowth calculated to be less than 1");
    serverGrowth = 1;
  }

  const oldMoneyAvailable = server.moneyAvailable;
  server.moneyAvailable += 1 * threads; // It can be grown even if it has no money
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
    let usedCycles = numCycleForGrowth(server, server.moneyAvailable / oldMoneyAvailable, p, cores);
    usedCycles = Math.min(Math.max(0, Math.ceil(usedCycles)), threads);
    server.fortify(2 * CONSTANTS.ServerFortifyAmount * usedCycles);
  }
  return server.moneyAvailable / oldMoneyAvailable;
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
