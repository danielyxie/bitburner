// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jest, describe, expect, test } from '@jest/globals'

import { NetscriptFunctions } from "../../src/NetscriptFunctions";
import { getRamCost, RamCostConstants } from "../../src/Netscript/RamCostGenerator";
import { Environment } from "../../src/Netscript/Environment";
import { RunningScript } from "../../src/Script/RunningScript";
import { Script } from "../../src/Script/Script";
import { SourceFileFlags } from "../../src/SourceFile/SourceFileFlags";

jest.mock(`!!raw-loader!../NetscriptDefinitions.d.ts`, () => '', {
  virtual: true,
});

const ScriptBaseCost = RamCostConstants.ScriptBaseRamCost;

describe("Netscript Dynamic RAM Calculation/Generation Tests", function () {
  // Creates a mock RunningScript object
  async function createRunningScript(code) {
    const script = new Script();
    script.code = code;
    await script.updateRamUsage([]);

    const runningScript = new RunningScript(script);

    return runningScript;
  }

  // Tests numeric equality, allowing for floating point imprecision
  function testEquality(val, expected) {
    expect(val).toBeGreaterThanOrEqual(expected - 100 * Number.EPSILON);
    expect(val).toBeLessThanOrEqual(expected + 100 * Number.EPSILON);
  }

  // Runs a Netscript function and properly catches it if it returns promise
  function runPotentiallyAsyncFunction(fn) {
    const res = fn();
    if (res instanceof Promise) {
      res.catch(() => undefined);
    }
  }

  /**
   * Tests that:
   *      1. A function has non-zero RAM cost
   *      2. Running the function properly updates the MockWorkerScript's dynamic RAM calculation
   *      3. Running multiple calls of the function does not result in additional RAM cost
   * @param {string[]} fnDesc - describes the name of the function being tested,
   *                            including the namespace(s). e.g. ["gang", "getMemberNames"]
   */
  async function testNonzeroDynamicRamCost(fnDesc) {
    if (!Array.isArray(fnDesc)) {
      throw new Error("Non-array passed to testNonzeroDynamicRamCost()");
    }
    const expected = getRamCost(...fnDesc);
    expect(expected).toBeGreaterThan(0);

    const code = `${fnDesc.join(".")}();`;

    const runningScript = await createRunningScript(code);

    // We don't need a real WorkerScript
    const workerScript = {
      args: [],
      code: code,
      dynamicLoadedFns: {},
      dynamicRamUsage: RamCostConstants.ScriptBaseRamCost,
      env: new Environment(null),
      ramUsage: runningScript.ramUsage,
      scriptRef: runningScript,
    };
    workerScript.env.vars = NetscriptFunctions(workerScript);

    // Run the function through the workerscript's args
    const scope = workerScript.env.vars;
    let curr = scope[fnDesc[0]];
    for (let i = 1; i < fnDesc.length; ++i) {
      if (curr == null) {
        throw new Error(`Invalid function specified: [${fnDesc}]`);
      }

      if (typeof curr === "function") {
        break;
      }

      curr = curr[fnDesc[i]];
    }

    if (typeof curr === "function") {
      // We use a try/catch because the function will probably fail since the game isn't
      // actually initialized. Call the fn multiple times to test that repeated calls
      // do not incur extra RAM costs.
      try {
        runPotentiallyAsyncFunction(curr);
        runPotentiallyAsyncFunction(curr);
        runPotentiallyAsyncFunction(curr);
      } catch (e) {}
    } else {
      throw new Error(`Invalid function specified: [${fnDesc}]`);
    }

    const fnName = fnDesc[fnDesc.length - 1];
    testEquality(workerScript.dynamicRamUsage - ScriptBaseCost, expected);
    testEquality(workerScript.dynamicRamUsage, runningScript.ramUsage);
    expect(workerScript.dynamicLoadedFns).toHaveProperty(fnName);
  }

  /**
   * Tests that:
   *      1. A function has zero RAM cost
   *      2. Running the function does NOT update the MockWorkerScript's dynamic RAM calculation
   *      3. Running multiple calls of the function does not result in dynamic RAM calculation
   * @param {string[]} fnDesc - describes the name of the function being tested,
   *                            including the namespace(s). e.g. ["gang", "getMemberNames"]
   */
  async function testZeroDynamicRamCost(fnDesc, skipRun = false) {
    if (!Array.isArray(fnDesc)) {
      throw new Error("Non-array passed to testZeroDynamicRamCost()");
    }
    const expected = getRamCost(...fnDesc);
    expect(expected).toEqual(0);
    if (skipRun) return;

    const code = `${fnDesc.join(".")}();`;

    const runningScript = await createRunningScript(code);

    // We don't need a real WorkerScript
    const workerScript = {
      args: [],
      code: code,
      dynamicLoadedFns: {},
      dynamicRamUsage: RamCostConstants.ScriptBaseRamCost,
      env: new Environment(null),
      ramUsage: runningScript.ramUsage,
      scriptRef: runningScript,
    };
    workerScript.env.vars = NetscriptFunctions(workerScript);

    // Run the function through the workerscript's args
    const scope = workerScript.env.vars;
    let curr = scope[fnDesc[0]];
    for (let i = 1; i < fnDesc.length; ++i) {
      if (curr == null) {
        throw new Error(`Invalid function specified: [${fnDesc}]`);
      }

      if (typeof curr === "function") {
        break;
      }

      curr = curr[fnDesc[i]];
    }

    if (typeof curr === "function") {
      // We use a try/catch because the function will probably fail since the game isn't
      // actually initialized. Call the fn multiple times to test that repeated calls
      // do not incur extra RAM costs.
      try {
        runPotentiallyAsyncFunction(curr);
        runPotentiallyAsyncFunction(curr);
        runPotentiallyAsyncFunction(curr);
      } catch (e) {}
    } else {
      throw new Error(`Invalid function specified: [${fnDesc}]`);
    }

    testEquality(workerScript.dynamicRamUsage, ScriptBaseCost);
    testEquality(workerScript.dynamicRamUsage, runningScript.ramUsage);
  }

  beforeEach(function () {
    for (let i = 0; i < SourceFileFlags.length; ++i) {
      SourceFileFlags[i] = 3;
    }
  });

  describe("Basic Functions", function () {
    it("hack()", async function () {
      const f = ["hack"];
      await testNonzeroDynamicRamCost(f);
    });

    it("grow()", async function () {
      const f = ["grow"];
      await testNonzeroDynamicRamCost(f);
    });

    it("weaken()", async function () {
      const f = ["weaken"];
      await testNonzeroDynamicRamCost(f);
    });

    it("hackAnalyzeThreads()", async function () {
      const f = ["hackAnalyzeThreads"];
      await testNonzeroDynamicRamCost(f);
    });

    it("hackAnalyze()", async function () {
      const f = ["hackAnalyze"];
      await testNonzeroDynamicRamCost(f);
    });

    it("hackAnalyzeChance()", async function () {
      const f = ["hackAnalyzeChance"];
      await testNonzeroDynamicRamCost(f);
    });

    it("growthAnalyze()", async function () {
      const f = ["growthAnalyze"];
      await testNonzeroDynamicRamCost(f);
    });

    it("sleep()", async function () {
      const f = ["sleep"];
      await testZeroDynamicRamCost(f);
    });

    it("print()", async function () {
      const f = ["print"];
      await testZeroDynamicRamCost(f);
    });

    it("tprint()", async function () {
      const f = ["tprint"];
      await testZeroDynamicRamCost(f);
    });

    it("clearLog()", async function () {
      const f = ["clearLog"];
      await testZeroDynamicRamCost(f);
    });

    it("disableLog()", async function () {
      const f = ["disableLog"];
      await testZeroDynamicRamCost(f);
    });

    it("enableLog()", async function () {
      const f = ["enableLog"];
      await testZeroDynamicRamCost(f);
    });

    it("isLogEnabled()", async function () {
      const f = ["isLogEnabled"];
      await testZeroDynamicRamCost(f);
    });

    it("getScriptLogs()", async function () {
      const f = ["getScriptLogs"];
      await testZeroDynamicRamCost(f);
    });

    it("scan()", async function () {
      const f = ["scan"];
      await testNonzeroDynamicRamCost(f);
    });

    it("nuke()", async function () {
      const f = ["nuke"];
      await testNonzeroDynamicRamCost(f);
    });

    it("brutessh()", async function () {
      const f = ["brutessh"];
      await testNonzeroDynamicRamCost(f);
    });

    it("ftpcrack()", async function () {
      const f = ["ftpcrack"];
      await testNonzeroDynamicRamCost(f);
    });

    it("relaysmtp()", async function () {
      const f = ["relaysmtp"];
      await testNonzeroDynamicRamCost(f);
    });

    it("httpworm()", async function () {
      const f = ["httpworm"];
      await testNonzeroDynamicRamCost(f);
    });

    it("sqlinject()", async function () {
      const f = ["sqlinject"];
      await testNonzeroDynamicRamCost(f);
    });

    it("run()", async function () {
      const f = ["run"];
      await testNonzeroDynamicRamCost(f);
    });

    it("exec()", async function () {
      const f = ["exec"];
      jest.spyOn(console, 'log').mockImplementation(() => {}); // eslint-disable-line
      await testNonzeroDynamicRamCost(f);
    });

    it("spawn()", async function () {
      const f = ["spawn"];
      await testNonzeroDynamicRamCost(f);
    });

    it("kill()", async function () {
      const f = ["kill"];
      await testNonzeroDynamicRamCost(f);
    });

    it("killall()", async function () {
      const f = ["killall"];
      await testNonzeroDynamicRamCost(f);
    });

    it("exit()", async function () {
      const f = ["exit"];
      await testZeroDynamicRamCost(f, true);
    });

    it("scp()", async function () {
      const f = ["scp"];
      await testNonzeroDynamicRamCost(f);
    });

    it("ls()", async function () {
      const f = ["ls"];
      await testNonzeroDynamicRamCost(f);
    });

    it("ps()", async function () {
      const f = ["ps"];
      await testNonzeroDynamicRamCost(f);
    });

    it("hasRootAccess()", async function () {
      const f = ["hasRootAccess"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getHostname()", async function () {
      const f = ["getHostname"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getHackingLevel()", async function () {
      const f = ["getHackingLevel"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getHackingMultipliers()", async function () {
      const f = ["getHackingMultipliers"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getHacknetMultipliers()", async function () {
      const f = ["getHacknetMultipliers"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getServerMoneyAvailable()", async function () {
      const f = ["getServerMoneyAvailable"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getServerMaxMoney()", async function () {
      const f = ["getServerMaxMoney"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getServerGrowth()", async function () {
      const f = ["getServerGrowth"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getServerSecurityLevel()", async function () {
      const f = ["getServerSecurityLevel"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getServerBaseSecurityLevel()", async function () {
      const f = ["getServerBaseSecurityLevel"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getServerMinSecurityLevel()", async function () {
      const f = ["getServerMinSecurityLevel"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getServerRequiredHackingLevel()", async function () {
      const f = ["getServerRequiredHackingLevel"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getServerNumPortsRequired()", async function () {
      const f = ["getServerNumPortsRequired"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getServerRam()", async function () {
      const f = ["getServerRam"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getServerMaxRam()", async function () {
      const f = ["getServerMaxRam"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getServerUsedRam()", async function () {
      const f = ["getServerUsedRam"];
      await testNonzeroDynamicRamCost(f);
    });

    it("serverExists()", async function () {
      const f = ["serverExists"];
      await testNonzeroDynamicRamCost(f);
    });

    it("fileExists()", async function () {
      const f = ["fileExists"];
      await testNonzeroDynamicRamCost(f);
    });

    it("isRunning()", async function () {
      const f = ["isRunning"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getPurchasedServerCost()", async function () {
      const f = ["getPurchasedServerCost"];
      await testNonzeroDynamicRamCost(f);
    });

    it("purchaseServer()", async function () {
      const f = ["purchaseServer"];
      await testNonzeroDynamicRamCost(f);
    });

    it("deleteServer()", async function () {
      const f = ["deleteServer"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getPurchasedServers()", async function () {
      const f = ["getPurchasedServers"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getPurchasedServerLimit()", async function () {
      const f = ["getPurchasedServerLimit"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getPurchasedServerMaxRam()", async function () {
      const f = ["getPurchasedServerMaxRam"];
      await testNonzeroDynamicRamCost(f);
    });

    it("write()", async function () {
      const f = ["write"];
      await testZeroDynamicRamCost(f);
    });

    it("tryWritePort()", async function () {
      const f = ["tryWritePort"];
      await testZeroDynamicRamCost(f);
    });

    it("read()", async function () {
      const f = ["read"];
      await testZeroDynamicRamCost(f);
    });

    it("peek()", async function () {
      const f = ["peek"];
      await testZeroDynamicRamCost(f);
    });

    it("clear()", async function () {
      const f = ["clear"];
      await testZeroDynamicRamCost(f);
    });

    it("getPortHandle()", async function () {
      const f = ["getPortHandle"];
      await testZeroDynamicRamCost(f);
    });

    it("rm()", async function () {
      const f = ["rm"];
      await testNonzeroDynamicRamCost(f);
    });

    it("scriptRunning()", async function () {
      const f = ["scriptRunning"];
      await testNonzeroDynamicRamCost(f);
    });

    it("scriptKill()", async function () {
      const f = ["scriptKill"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getScriptName()", async function () {
      const f = ["getScriptName"];
      await testZeroDynamicRamCost(f);
    });

    it("getScriptRam()", async function () {
      const f = ["getScriptRam"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getHackTime()", async function () {
      const f = ["getHackTime"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getGrowTime()", async function () {
      const f = ["getGrowTime"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getWeakenTime()", async function () {
      const f = ["getWeakenTime"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getScriptIncome()", async function () {
      const f = ["getScriptIncome"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getScriptExpGain()", async function () {
      const f = ["getScriptExpGain"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getRunningScript()", async function () {
      const f = ["getRunningScript"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getTimeSinceLastAug()", async function () {
      const f = ["getTimeSinceLastAug"];
      await testNonzeroDynamicRamCost(f);
    });

    it("sprintf()", async function () {
      const f = ["sprintf"];
      await testZeroDynamicRamCost(f);
    });

    it("vsprintf()", async function () {
      const f = ["vsprintf"];
      await testZeroDynamicRamCost(f);
    });

    it("nFormat()", async function () {
      const f = ["nFormat"];
      await testZeroDynamicRamCost(f);
    });

    it("prompt()", async function () {
      const f = ["prompt"];
      await testZeroDynamicRamCost(f);
    });

    it("wget()", async function () {
      const f = ["wget"];
      await testZeroDynamicRamCost(f);
    });

    it("getFavorToDonate()", async function () {
      const f = ["getFavorToDonate"];
      await testNonzeroDynamicRamCost(f);
    });
  });

  describe("Advanced Functions", function () {
    it("getBitNodeMultipliers()", async function () {
      const f = ["getBitNodeMultipliers"];
      await testNonzeroDynamicRamCost(f);
    });
  });

  describe("TIX API", function () {
    it("stock.getSymbols()", async function () {
      const f = ["stock", "getSymbols"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.getPrice()", async function () {
      const f = ["stock", "getPrice"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.getBidPrice()", async function () {
      const f = ["stock", "getBidPrice"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.getBidPrice()", async function () {
      const f = ["stock", "getBidPrice"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.getPosition()", async function () {
      const f = ["stock", "getPosition"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.getMaxShares()", async function () {
      const f = ["stock", "getMaxShares"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.buy()", async function () {
      const f = ["stock", "buy"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.sell()", async function () {
      const f = ["stock", "sell"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.short()", async function () {
      const f = ["stock", "short"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.sellShort()", async function () {
      const f = ["stock", "sellShort"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.placeOrder()", async function () {
      const f = ["stock", "placeOrder"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.cancelOrder()", async function () {
      const f = ["stock", "cancelOrder"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.getOrders()", async function () {
      const f = ["stock", "getOrders"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.getVolatility()", async function () {
      const f = ["stock", "getVolatility"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.getForecast()", async function () {
      const f = ["stock", "getForecast"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.purchase4SMarketData()", async function () {
      const f = ["stock", "purchase4SMarketData"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stock.purchase4SMarketDataTixApi()", async function () {
      const f = ["stock", "purchase4SMarketDataTixApi"];
      await testNonzeroDynamicRamCost(f);
    });
  });

  describe("Singularity Functions", function () {
    it("universityCourse()", async function () {
      const f = ["universityCourse"];
      await testNonzeroDynamicRamCost(f);
    });

    it("gymWorkout()", async function () {
      const f = ["gymWorkout"];
      await testNonzeroDynamicRamCost(f);
    });

    it("travelToCity()", async function () {
      const f = ["travelToCity"];
      await testNonzeroDynamicRamCost(f);
    });

    it("purchaseTor()", async function () {
      const f = ["purchaseTor"];
      await testNonzeroDynamicRamCost(f);
    });

    it("purchaseProgram()", async function () {
      const f = ["purchaseProgram"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getStats()", async function () {
      const f = ["getStats"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getCharacterInformation()", async function () {
      const f = ["getCharacterInformation"];
      await testNonzeroDynamicRamCost(f);
    });

    it("isBusy()", async function () {
      const f = ["isBusy"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stopAction()", async function () {
      const f = ["stopAction"];
      await testNonzeroDynamicRamCost(f);
    });

    it("upgradeHomeRam()", async function () {
      const f = ["upgradeHomeRam"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getUpgradeHomeRamCost()", async function () {
      const f = ["getUpgradeHomeRamCost"];
      await testNonzeroDynamicRamCost(f);
    });

    it("workForCompany()", async function () {
      const f = ["workForCompany"];
      await testNonzeroDynamicRamCost(f);
    });

    it("applyToCompany()", async function () {
      const f = ["applyToCompany"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getCompanyRep()", async function () {
      const f = ["getCompanyRep"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getCompanyFavor()", async function () {
      const f = ["getCompanyFavor"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getCompanyFavorGain()", async function () {
      const f = ["getCompanyFavorGain"];
      await testNonzeroDynamicRamCost(f);
    });

    it("checkFactionInvitations()", async function () {
      const f = ["checkFactionInvitations"];
      await testNonzeroDynamicRamCost(f);
    });

    it("joinFaction()", async function () {
      const f = ["joinFaction"];
      await testNonzeroDynamicRamCost(f);
    });

    it("workForFaction()", async function () {
      const f = ["workForFaction"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getFactionRep()", async function () {
      const f = ["getFactionRep"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getFactionFavor()", async function () {
      const f = ["getFactionFavor"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getFactionFavorGain()", async function () {
      const f = ["getFactionFavorGain"];
      await testNonzeroDynamicRamCost(f);
    });

    it("donateToFaction()", async function () {
      const f = ["donateToFaction"];
      await testNonzeroDynamicRamCost(f);
    });

    it("createProgram()", async function () {
      const f = ["createProgram"];
      await testNonzeroDynamicRamCost(f);
    });

    it("commitCrime()", async function () {
      const f = ["commitCrime"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getCrimeChance()", async function () {
      const f = ["getCrimeChance"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getOwnedAugmentations()", async function () {
      const f = ["getOwnedAugmentations"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getOwnedSourceFiles()", async function () {
      const f = ["getOwnedSourceFiles"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getAugmentationsFromFaction()", async function () {
      const f = ["getAugmentationsFromFaction"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getAugmentationCost()", async function () {
      const f = ["getAugmentationCost"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getAugmentationPrereq()", async function () {
      const f = ["getAugmentationPrereq"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getAugmentationPrice()", async function () {
      const f = ["getAugmentationPrice"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getAugmentationRepReq()", async function () {
      const f = ["getAugmentationRepReq"];
      await testNonzeroDynamicRamCost(f);
    });

    it("purchaseAugmentation()", async function () {
      const f = ["purchaseAugmentation"];
      await testNonzeroDynamicRamCost(f);
    });

    it("installAugmentations()", async function () {
      const f = ["installAugmentations"];
      await testNonzeroDynamicRamCost(f);
    });
  });

  describe("Bladeburner API", function () {
    it("getContractNames()", async function () {
      const f = ["bladeburner", "getContractNames"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getOperationNames()", async function () {
      const f = ["bladeburner", "getOperationNames"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getBlackOpNames()", async function () {
      const f = ["bladeburner", "getBlackOpNames"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getGeneralActionNames()", async function () {
      const f = ["bladeburner", "getGeneralActionNames"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getSkillNames()", async function () {
      const f = ["bladeburner", "getSkillNames"];
      await testNonzeroDynamicRamCost(f);
    });

    it("startAction()", async function () {
      const f = ["bladeburner", "startAction"];
      await testNonzeroDynamicRamCost(f);
    });

    it("stopBladeburnerAction()", async function () {
      const f = ["bladeburner", "stopBladeburnerAction"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getCurrentAction()", async function () {
      const f = ["bladeburner", "getCurrentAction"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getActionTime()", async function () {
      const f = ["bladeburner", "getActionTime"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getActionEstimatedSuccessChance()", async function () {
      const f = ["bladeburner", "getActionEstimatedSuccessChance"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getActionRepGain()", async function () {
      const f = ["bladeburner", "getActionRepGain"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getActionCountRemaining()", async function () {
      const f = ["bladeburner", "getActionCountRemaining"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getActionMaxLevel()", async function () {
      const f = ["bladeburner", "getActionMaxLevel"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getActionCurrentLevel()", async function () {
      const f = ["bladeburner", "getActionCurrentLevel"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getActionAutolevel()", async function () {
      const f = ["bladeburner", "getActionAutolevel"];
      await testNonzeroDynamicRamCost(f);
    });

    it("setActionAutolevel()", async function () {
      const f = ["bladeburner", "setActionAutolevel"];
      await testNonzeroDynamicRamCost(f);
    });

    it("setActionLevel()", async function () {
      const f = ["bladeburner", "setActionLevel"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getRank()", async function () {
      const f = ["bladeburner", "getRank"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getBlackOpRank()", async function () {
      const f = ["bladeburner", "getBlackOpRank"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getSkillPoints()", async function () {
      const f = ["bladeburner", "getSkillPoints"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getSkillLevel()", async function () {
      const f = ["bladeburner", "getSkillLevel"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getSkillUpgradeCost()", async function () {
      const f = ["bladeburner", "getSkillUpgradeCost"];
      await testNonzeroDynamicRamCost(f);
    });

    it("upgradeSkill()", async function () {
      const f = ["bladeburner", "upgradeSkill"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getTeamSize()", async function () {
      const f = ["bladeburner", "getTeamSize"];
      await testNonzeroDynamicRamCost(f);
    });

    it("setTeamSize()", async function () {
      const f = ["bladeburner", "setTeamSize"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getCityEstimatedPopulation()", async function () {
      const f = ["bladeburner", "getCityEstimatedPopulation"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getCityChaos()", async function () {
      const f = ["bladeburner", "getCityChaos"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getCity()", async function () {
      const f = ["bladeburner", "getCity"];
      await testNonzeroDynamicRamCost(f);
    });

    it("switchCity()", async function () {
      const f = ["bladeburner", "switchCity"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getStamina()", async function () {
      const f = ["bladeburner", "getStamina"];
      await testNonzeroDynamicRamCost(f);
    });

    it("joinBladeburnerFaction()", async function () {
      const f = ["bladeburner", "joinBladeburnerFaction"];
      await testNonzeroDynamicRamCost(f);
    });

    it("joinBladeburnerDivision()", async function () {
      const f = ["bladeburner", "joinBladeburnerDivision"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getBonusTime()", async function () {
      const f = ["bladeburner", "getBonusTime"];
      await testZeroDynamicRamCost(f);
    });
  });

  describe("Gang API", function () {
    it("getMemberNames()", async function () {
      const f = ["gang", "getMemberNames"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getGangInformation()", async function () {
      const f = ["gang", "getGangInformation"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getOtherGangInformation()", async function () {
      const f = ["gang", "getOtherGangInformation"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getMemberInformation()", async function () {
      const f = ["gang", "getMemberInformation"];
      await testNonzeroDynamicRamCost(f);
    });

    it("canRecruitMember()", async function () {
      const f = ["gang", "canRecruitMember"];
      await testNonzeroDynamicRamCost(f);
    });

    it("recruitMember()", async function () {
      const f = ["gang", "recruitMember"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getTaskNames()", async function () {
      const f = ["gang", "getTaskNames"];
      await testNonzeroDynamicRamCost(f);
    });

    it("setMemberTask()", async function () {
      const f = ["gang", "setMemberTask"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getEquipmentNames()", async function () {
      const f = ["gang", "getEquipmentNames"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getEquipmentCost()", async function () {
      const f = ["gang", "getEquipmentCost"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getEquipmentType()", async function () {
      const f = ["gang", "getEquipmentType"];
      await testNonzeroDynamicRamCost(f);
    });

    it("purchaseEquipment()", async function () {
      const f = ["gang", "purchaseEquipment"];
      await testNonzeroDynamicRamCost(f);
    });

    it("ascendMember()", async function () {
      const f = ["gang", "ascendMember"];
      await testNonzeroDynamicRamCost(f);
    });

    it("setTerritoryWarfare()", async function () {
      const f = ["gang", "setTerritoryWarfare"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getChanceToWinClash()", async function () {
      const f = ["gang", "getChanceToWinClash"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getBonusTime()", async function () {
      const f = ["gang", "getBonusTime"];
      await testZeroDynamicRamCost(f);
    });
  });

  describe("Coding Contract API", function () {
    it("attempt()", async function () {
      const f = ["codingcontract", "attempt"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getContractType()", async function () {
      const f = ["codingcontract", "getContractType"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getDescription()", async function () {
      const f = ["codingcontract", "getDescription"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getData()", async function () {
      const f = ["codingcontract", "getData"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getNumTriesRemaining()", async function () {
      const f = ["codingcontract", "getNumTriesRemaining"];
      await testNonzeroDynamicRamCost(f);
    });
  });

  describe("Sleeve API", function () {
    it("getNumSleeves()", async function () {
      const f = ["sleeve", "getNumSleeves"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getSleeveStats()", async function () {
      const f = ["sleeve", "getSleeveStats"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getInformation()", async function () {
      const f = ["sleeve", "getInformation"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getTask()", async function () {
      const f = ["sleeve", "getTask"];
      await testNonzeroDynamicRamCost(f);
    });

    it("setToShockRecovery()", async function () {
      const f = ["sleeve", "setToShockRecovery"];
      await testNonzeroDynamicRamCost(f);
    });

    it("setToSynchronize()", async function () {
      const f = ["sleeve", "setToSynchronize"];
      await testNonzeroDynamicRamCost(f);
    });

    it("setToCommitCrime()", async function () {
      const f = ["sleeve", "setToCommitCrime"];
      await testNonzeroDynamicRamCost(f);
    });

    it("setToFactionWork()", async function () {
      const f = ["sleeve", "setToFactionWork"];
      await testNonzeroDynamicRamCost(f);
    });

    it("setToCompanyWork()", async function () {
      const f = ["sleeve", "setToCompanyWork"];
      await testNonzeroDynamicRamCost(f);
    });

    it("setToUniversityCourse()", async function () {
      const f = ["sleeve", "setToUniversityCourse"];
      await testNonzeroDynamicRamCost(f);
    });

    it("setToGymWorkout()", async function () {
      const f = ["sleeve", "setToGymWorkout"];
      await testNonzeroDynamicRamCost(f);
    });

    it("travel()", async function () {
      const f = ["sleeve", "travel"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getSleeveAugmentations()", async function () {
      const f = ["sleeve", "getSleeveAugmentations"];
      await testNonzeroDynamicRamCost(f);
    });

    it("getSleevePurchasableAugs()", async function () {
      const f = ["sleeve", "getSleevePurchasableAugs"];
      await testNonzeroDynamicRamCost(f);
    });

    it("purchaseSleeveAug()", async function () {
      const f = ["sleeve", "purchaseSleeveAug"];
      await testNonzeroDynamicRamCost(f);
    });
  });
});
