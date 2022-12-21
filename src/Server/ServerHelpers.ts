import { GetServer, createUniqueRandomIp, ipExists } from "./AllServers";
import { Server, IConstructorParams } from "./Server";
import { BaseServer } from "./BaseServer";
import { calculateServerGrowth } from "./formulas/grow";

import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../Constants";
import { Player } from "@player";
import { Programs } from "../Programs/Programs";
import { LiteratureNames } from "../Literature/data/LiteratureNames";

import { isValidNumber } from "../utils/helpers/isValidNumber";

/**
 * Constructs a new server, while also ensuring that the new server
 * does not have a duplicate hostname/ip.
 */
export function safelyCreateUniqueServer(params: IConstructorParams): Server {
  let hostname: string = params.hostname.replace(/ /g, `-`);

  if (params.ip != null && ipExists(params.ip)) {
    params.ip = createUniqueRandomIp();
  }

  if (GetServer(hostname) != null) {
    if (hostname.slice(-2) != `-0`) {
      hostname = `${hostname}-0`;
    }

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
export function numCycleForGrowth(server: Server, growth: number, cores = 1): number {
  let ajdGrowthRate = 1 + (CONSTANTS.ServerBaseGrowthRate - 1) / server.hackDifficulty;
  if (ajdGrowthRate > CONSTANTS.ServerMaxGrowthRate) {
    ajdGrowthRate = CONSTANTS.ServerMaxGrowthRate;
  }

  const serverGrowthPercentage = server.serverGrowth / 100;

  const coreBonus = 1 + (cores - 1) / 16;
  const cycles =
    Math.log(growth) /
    (Math.log(ajdGrowthRate) *
      Player.mults.hacking_grow *
      serverGrowthPercentage *
      BitNodeMultipliers.ServerGrowthRate *
      coreBonus);

  return cycles;
}

/**
 * This function calculates the number of threads needed to grow a server from one $amount to a higher $amount
 * (ie, how many threads to grow this server from $200 to $600 for example). Used primarily for a formulas (or possibly growthAnalyze)
 * type of application. It lets you "theorycraft" and easily ask what-if type questions. It's also the one that implements the
 * main thread calculation algorithm, and so is the function all helper functions should call.
 * It protects the inputs (so putting in INFINITY for targetMoney will use moneyMax, putting in a negative for start will use 0, etc.)
 * @param server - Server being grown
 * @param targetMoney - How much you want the server grown TO (not by), for instance, to grow from 200 to 600, input 600
 * @param startMoney - How much you are growing the server from, for instance, to grow from 200 to 600, input 200
 * @param cores - Number of cores on the host performing grow
 * @returns Number of "growth cycles" needed
 */
export function numCycleForGrowthCorrected(server: Server, targetMoney: number, startMoney: number, cores = 1): number {
  if (startMoney < 0) {
    startMoney = 0;
  } // servers "can't" have less than 0 dollars on them
  if (targetMoney > server.moneyMax) {
    targetMoney = server.moneyMax;
  } // can't grow a server to more than its moneyMax
  if (targetMoney <= startMoney) {
    return 0;
  } // no growth --> no threads

  // exponential base adjusted by security
  const adjGrowthRate = 1 + (CONSTANTS.ServerBaseGrowthRate - 1) / server.hackDifficulty;
  const exponentialBase = Math.min(adjGrowthRate, CONSTANTS.ServerMaxGrowthRate); // cap growth rate

  // total of all grow thread multipliers
  const serverGrowthPercentage = server.serverGrowth / 100.0;
  const coreMultiplier = 1 + (cores - 1) / 16;
  const threadMultiplier =
    serverGrowthPercentage * Player.mults.hacking_grow * coreMultiplier * BitNodeMultipliers.ServerGrowthRate;

  /* To understand what is done below we need to do some math. I hope the explanation is clear enough.
   * First of, the names will be shortened for ease of manipulation:
   * n:= targetMoney (n for new), o:= startMoney (o for old), b:= exponentialBase, t:= threadMultiplier, c:= cycles/threads
   * c is what we are trying to compute.
   *
   * After growing, the money on a server is n = (o + c) * b^(c*t)
   * c appears in an exponent and outside it, this is usually solved using the productLog/lambert's W special function
   * this function will be noted W in the following
   * The idea behind lambert's W function is W(x)*exp(W(x)) = x, or in other words, solving for y, y*exp(y) = x, as a function of x
   * This function is provided in some advanced math library but we will compute it ourself here.
   *
   * Let's get back to solving the equation. It cannot be rewrote using W immediately because the base of the exponentiation is b
   * b^(c*t) = exp(ln(b)*c*t) (this is how a^b is defined on reals, it matches the definition on integers)
   * so n = (o + c) * exp(ln(b)*c*t) , W still cannot be used directly. We want to eliminate the other terms in 'o + c' and 'ln(b)*c*t'.
   *
   * A change of variable will do. The idea is to add an equation introducing a new variable (w here) in the form c = f(w) (for some f)
   * With this equation we will eliminate all references to c, then solve for w and plug the result in the new equation to get c.
   * The change of variable performed here should get rid of the unwanted terms mentioned above, c = w/(ln(b)*t) - o should help.
   * This change of variable is allowed because whatever the value of c is, there is a value of w such that this equation holds:
   * w = (c + o)*ln(b)*t  (see how we used the terms we wanted to eliminate in order to build this variable change)
   *
   * We get n = (o + w/(ln(b)*t) - o) * exp(ln(b)*(w/(ln(b)*t) - o)*t) [ = w/(ln(b)*t) * exp(w - ln(b)*o*t) ]
   * The change of variable exposed exp(w - o*ln(b)*t), we can rewrite that with exp(a - b) = exp(a)/exp(b) to isolate 'w*exp(w)'
   * n = w/(ln(b)*t) * exp(w)/exp(ln(b)*o*t) [ = w*exp(w) / (ln(b) * t * b^(o*t)) ]
   * Almost there, we just need to cancel the denominator on the right side of the equation:
   * n * ln(b) * t * b^(o*t) = w*exp(w), Thus w = W(n * ln(b) * t * b^(o*t))
   * Finally we invert the variable change: c = W(n * ln(b) * t * b^(o*t))/(ln(b)*t) - o
   *
   * There is still an issue left: b^(o*t) doesn't fit inside a double precision float
   * because the typical amount of money on servers is around 10^6~10^9
   * We need to get an approximation of W without computing the power when o is huge
   * Thankfully an approximation giving ~30% error uses log immediately so we will use
   * W(n * ln(b) * t * b^(o*t)) ~= log(n * ln(b) * t * b^(o*t)) = log(n * ln(b) * t) + log(exp(ln(b) * o * t))
   * = log(n * ln(b) * t) + ln(b) * o * t
   * (thanks to Drak for the grow formula, f4113nb34st and Wolfram Alpha for the rewrite, dwRchyngqxs for the explanation)
   */
  const x = threadMultiplier * Math.log(exponentialBase);
  const y = startMoney * x + Math.log(targetMoney * x);
  /* Code for the approximation of lambert's W function is adapted from
   * https://git.savannah.gnu.org/cgit/gsl.git/tree/specfunc/lambert.c
   * using the articles [1] https://doi.org/10.1007/BF02124750 (algorithm above)
   * and [2] https://doi.org/10.1145/361952.361970 (initial approximation when x < 2.5)
   */
  let w;
  if (y < Math.log(2.5)) {
    /* exp(y) can be safely computed without overflow.
     * The relative error on the result is better when exp(y) < 2.5
     * using Padé rational fraction approximation [2](5)
     */
    const ey = Math.exp(y);
    w = (ey + (4 / 3) * ey * ey) / (1 + (7 / 3) * ey + (5 / 6) * ey * ey);
  } else {
    /* obtain initial approximation from rough asymptotic [1](4.18)
     * w = y [- log y when 0 <= y]
     */
    w = y;
    if (y > 0) w -= Math.log(y);
  }
  let cycles = w / x - startMoney;

  /* Iterative refinement, the goal is to correct c until |(o + c) * b^(c*t) - n| < 1
   * or the correction on the approximation is less than 1
   * The Newton-Raphson method will be used, this method is a classic to find roots of functions
   * (given f, find c such that f(c) = 0).
   *
   * The idea of this method is to take the horizontal position at which the horizontal axis
   * intersects with of the tangent of the function's curve as the next approximation.
   * It is equivalent to treating the curve as a line (it is called a first order approximation)
   * If the current approximation is c then the new approximated value is c - f(c)/f'(c)
   * (where f' is the derivative of f).
   *
   * In our case f(c) = (o + c) * b^(c*t) - n, f'(c) = d((o + c) * b^(c*t) - n)/dc
   * = (ln(b)*t * (c + o) + 1) * b^(c*t)
   * And the update step is c[new] = c[old] - ((o + c) * b^(c*t) - n)/((ln(b)*t * (o + c) + 1) * b^(c*t))
   *
   * The main question to ask when using this method is "does it converges?"
   * (are the approximations getting better?), if it does then it does quickly.
   * DOES IT CONVERGES? In the present case it does. The reason why doesn't help explaining the algorithm.
   * If you are interested then check out the wikipedia page.
   */
  let bt = exponentialBase ** threadMultiplier;
  if (bt == Infinity) bt = 1e300;

  let corr = Infinity;
  // Two sided error because we do not want to get stuck if the error stays on the wrong side
  do {
    // c should be above 0 so Halley's method can't be used, we have to stick to Newton-Raphson
    const bct = bt ** cycles;
    const opc = startMoney + cycles;
    const diff = opc * bct - targetMoney;
    corr = diff / (opc * x + 1.0) / bct;
    cycles -= corr;
  } while (Math.abs(corr) >= 1);
  /* c is now within +/- 1 of the exact result.
   * We want the ceiling of the exact result, so the floor if the approximation is above,
   * the ceiling if the approximation is in the same unit as the exact result,
   * and the ceiling + 1 if the approximation is below.
   */
  const fca = Math.floor(cycles);
  if (targetMoney <= (startMoney + fca) * Math.pow(exponentialBase, fca * threadMultiplier)) {
    return fca;
  }
  const cca = Math.ceil(cycles);
  if (targetMoney <= (startMoney + cca) * Math.pow(exponentialBase, cca * threadMultiplier)) {
    return cca;
  }
  return cca + 1;
}

//Applied server growth for a single server. Returns the percentage growth
export function processSingleServerGrowth(server: Server, threads: number, cores = 1): number {
  let serverGrowth = calculateServerGrowth(server, threads, Player, cores);
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
    let usedCycles = numCycleForGrowthCorrected(server, server.moneyAvailable, oldMoneyAvailable, cores);
    // Growing increases server security twice as much as hacking
    usedCycles = Math.min(Math.max(0, Math.ceil(usedCycles)), threads);
    server.fortify(2 * CONSTANTS.ServerFortifyAmount * usedCycles);
  }
  return server.moneyAvailable / oldMoneyAvailable;
}

export function prestigeHomeComputer(homeComp: Server): void {
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
    script.updateRamUsage(homeComp.scripts);
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
