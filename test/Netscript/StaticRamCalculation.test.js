import {
  getRamCost,
  RamCostConstants,
} from "../../src/Netscript/RamCostGenerator";
import { calculateRamUsage } from "../../src/Script/RamCalculations";

const ScriptBaseCost = RamCostConstants.ScriptBaseRamCost;
const HacknetNamespaceCost = RamCostConstants.ScriptHacknetNodesRamCost;

describe("Netscript Static RAM Calculation/Generation Tests", function () {
  // Tests numeric equality, allowing for floating point imprecision
  function testEquality(val, expected) {
    expect(val).toBeGreaterThanOrEqual(expected - 100 * Number.EPSILON);
    expect(val).toBeLessThanOrEqual(expected + 100 * Number.EPSILON);
  }

  /**
   * Tests that:
   *      1. A function has non-zero RAM cost
   *      2. The calculator and the generator result in equal values
   *      3. Running multiple calls of the function does not result in additional RAM cost
   * @param {string[]} fnDesc - describes the name of the function being tested,
   *                            including the namespace(s). e.g. ["gang", "getMemberNames"]
   */
  async function expectNonZeroRamCost(fnDesc) {
    if (!Array.isArray(fnDesc)) {
      expect.fail("Non-array passed to expectNonZeroRamCost()");
    }
    const expected = getRamCost(...fnDesc);
    expect(expected).toBeGreaterThan(0);

    const code = fnDesc.join(".") + "(); ";

    const calculated = await calculateRamUsage(code, []);
    testEquality(calculated, expected + ScriptBaseCost);

    const multipleCallsCode = code.repeat(3);
    const multipleCallsCalculated = await calculateRamUsage(
      multipleCallsCode,
      [],
    );
    expect(multipleCallsCalculated).toEqual(calculated);
  }

  /**
   * Tests that:
   *      1. A function has zero RAM cost
   *      2. The calculator and the generator result in equal values
   *      3. Running multiple calls of the function does not result in additional RAM cost
   * @param {string[]} fnDesc - describes the name of the function being tested,
   *                            including the namespace(s). e.g. ["gang", "getMemberNames"]
   */
  async function expectZeroRamCost(fnDesc) {
    if (!Array.isArray(fnDesc)) {
      expect.fail("Non-array passed to expectZeroRamCost()");
    }
    const expected = getRamCost(...fnDesc);
    expect(expected).toEqual(0);

    const code = fnDesc.join(".") + "(); ";

    const calculated = await calculateRamUsage(code, []);
    testEquality(calculated, ScriptBaseCost);

    const multipleCallsCalculated = await calculateRamUsage(code, []);
    expect(multipleCallsCalculated).toEqual(ScriptBaseCost);
  }

  describe("Basic Functions", function () {
    it("hack()", async function () {
      const f = ["hack"];
      await expectNonZeroRamCost(f);
    });

    it("grow()", async function () {
      const f = ["grow"];
      await expectNonZeroRamCost(f);
    });

    it("weaken()", async function () {
      const f = ["weaken"];
      await expectNonZeroRamCost(f);
    });

    it("hackAnalyzeThreads()", async function () {
      const f = ["hackAnalyzeThreads"];
      await expectNonZeroRamCost(f);
    });

    it("hackAnalyzePercent()", async function () {
      const f = ["hackAnalyzePercent"];
      await expectNonZeroRamCost(f);
    });

    it("hackChance()", async function () {
      const f = ["hackChance"];
      await expectNonZeroRamCost(f);
    });

    it("growthAnalyze()", async function () {
      const f = ["growthAnalyze"];
      await expectNonZeroRamCost(f);
    });

    it("sleep()", async function () {
      const f = ["sleep"];
      await expectZeroRamCost(f);
    });

    it("print()", async function () {
      const f = ["print"];
      await expectZeroRamCost(f);
    });

    it("tprint()", async function () {
      const f = ["tprint"];
      await expectZeroRamCost(f);
    });

    it("clearLog()", async function () {
      const f = ["clearLog"];
      await expectZeroRamCost(f);
    });

    it("disableLog()", async function () {
      const f = ["disableLog"];
      await expectZeroRamCost(f);
    });

    it("enableLog()", async function () {
      const f = ["enableLog"];
      await expectZeroRamCost(f);
    });

    it("isLogEnabled()", async function () {
      const f = ["isLogEnabled"];
      await expectZeroRamCost(f);
    });

    it("getScriptLogs()", async function () {
      const f = ["getScriptLogs"];
      await expectZeroRamCost(f);
    });

    it("scan()", async function () {
      const f = ["scan"];
      await expectNonZeroRamCost(f);
    });

    it("nuke()", async function () {
      const f = ["nuke"];
      await expectNonZeroRamCost(f);
    });

    it("brutessh()", async function () {
      const f = ["brutessh"];
      await expectNonZeroRamCost(f);
    });

    it("ftpcrack()", async function () {
      const f = ["ftpcrack"];
      await expectNonZeroRamCost(f);
    });

    it("relaysmtp()", async function () {
      const f = ["relaysmtp"];
      await expectNonZeroRamCost(f);
    });

    it("httpworm()", async function () {
      const f = ["httpworm"];
      await expectNonZeroRamCost(f);
    });

    it("sqlinject()", async function () {
      const f = ["sqlinject"];
      await expectNonZeroRamCost(f);
    });

    it("run()", async function () {
      const f = ["run"];
      await expectNonZeroRamCost(f);
    });

    it("exec()", async function () {
      const f = ["exec"];
      await expectNonZeroRamCost(f);
    });

    it("spawn()", async function () {
      const f = ["spawn"];
      await expectNonZeroRamCost(f);
    });

    it("kill()", async function () {
      const f = ["kill"];
      await expectNonZeroRamCost(f);
    });

    it("killall()", async function () {
      const f = ["killall"];
      await expectNonZeroRamCost(f);
    });

    it("exit()", async function () {
      const f = ["exit"];
      await expectZeroRamCost(f);
    });

    it("scp()", async function () {
      const f = ["scp"];
      await expectNonZeroRamCost(f);
    });

    it("ls()", async function () {
      const f = ["ls"];
      await expectNonZeroRamCost(f);
    });

    it("ps()", async function () {
      const f = ["ps"];
      await expectNonZeroRamCost(f);
    });

    it("hasRootAccess()", async function () {
      const f = ["hasRootAccess"];
      await expectNonZeroRamCost(f);
    });

    it("getHostname()", async function () {
      const f = ["getHostname"];
      await expectNonZeroRamCost(f);
    });

    it("getHackingLevel()", async function () {
      const f = ["getHackingLevel"];
      await expectNonZeroRamCost(f);
    });

    it("getHackingMultipliers()", async function () {
      const f = ["getHackingMultipliers"];
      await expectNonZeroRamCost(f);
    });

    it("getHacknetMultipliers()", async function () {
      const f = ["getHacknetMultipliers"];
      await expectNonZeroRamCost(f);
    });

    it("getServerMoneyAvailable()", async function () {
      const f = ["getServerMoneyAvailable"];
      await expectNonZeroRamCost(f);
    });

    it("getServerMaxMoney()", async function () {
      const f = ["getServerMaxMoney"];
      await expectNonZeroRamCost(f);
    });

    it("getServerGrowth()", async function () {
      const f = ["getServerGrowth"];
      await expectNonZeroRamCost(f);
    });

    it("getServerSecurityLevel()", async function () {
      const f = ["getServerSecurityLevel"];
      await expectNonZeroRamCost(f);
    });

    it("getServerBaseSecurityLevel()", async function () {
      const f = ["getServerBaseSecurityLevel"];
      await expectNonZeroRamCost(f);
    });

    it("getServerMinSecurityLevel()", async function () {
      const f = ["getServerMinSecurityLevel"];
      await expectNonZeroRamCost(f);
    });

    it("getServerRequiredHackingLevel()", async function () {
      const f = ["getServerRequiredHackingLevel"];
      await expectNonZeroRamCost(f);
    });

    it("getServerNumPortsRequired()", async function () {
      const f = ["getServerNumPortsRequired"];
      await expectNonZeroRamCost(f);
    });

    it("getServerRam()", async function () {
      const f = ["getServerRam"];
      await expectNonZeroRamCost(f);
    });

    it("getServerMaxRam()", async function () {
      const f = ["getServerMaxRam"];
      await expectNonZeroRamCost(f);
    });

    it("getServerUsedRam()", async function () {
      const f = ["getServerUsedRam"];
      await expectNonZeroRamCost(f);
    });

    it("serverExists()", async function () {
      const f = ["serverExists"];
      await expectNonZeroRamCost(f);
    });

    it("fileExists()", async function () {
      const f = ["fileExists"];
      await expectNonZeroRamCost(f);
    });

    it("isRunning()", async function () {
      const f = ["isRunning"];
      await expectNonZeroRamCost(f);
    });

    it("getPurchasedServerCost()", async function () {
      const f = ["getPurchasedServerCost"];
      await expectNonZeroRamCost(f);
    });

    it("purchaseServer()", async function () {
      const f = ["purchaseServer"];
      await expectNonZeroRamCost(f);
    });

    it("deleteServer()", async function () {
      const f = ["deleteServer"];
      await expectNonZeroRamCost(f);
    });

    it("getPurchasedServers()", async function () {
      const f = ["getPurchasedServers"];
      await expectNonZeroRamCost(f);
    });

    it("getPurchasedServerLimit()", async function () {
      const f = ["getPurchasedServerLimit"];
      await expectNonZeroRamCost(f);
    });

    it("getPurchasedServerMaxRam()", async function () {
      const f = ["getPurchasedServerMaxRam"];
      await expectNonZeroRamCost(f);
    });

    it("write()", async function () {
      const f = ["write"];
      await expectNonZeroRamCost(f);
    });

    it("tryWrite()", async function () {
      const f = ["tryWrite"];
      await expectNonZeroRamCost(f);
    });

    it("read()", async function () {
      const f = ["read"];
      await expectNonZeroRamCost(f);
    });

    it("peek()", async function () {
      const f = ["peek"];
      await expectNonZeroRamCost(f);
    });

    it("clear()", async function () {
      const f = ["clear"];
      await expectNonZeroRamCost(f);
    });

    it("getPortHandle()", async function () {
      const f = ["getPortHandle"];
      await expectNonZeroRamCost(f);
    });

    it("rm()", async function () {
      const f = ["rm"];
      await expectNonZeroRamCost(f);
    });

    it("scriptRunning()", async function () {
      const f = ["scriptRunning"];
      await expectNonZeroRamCost(f);
    });

    it("scriptKill()", async function () {
      const f = ["scriptKill"];
      await expectNonZeroRamCost(f);
    });

    it("getScriptName()", async function () {
      const f = ["getScriptName"];
      await expectZeroRamCost(f);
    });

    it("getScriptRam()", async function () {
      const f = ["getScriptRam"];
      await expectNonZeroRamCost(f);
    });

    it("getHackTime()", async function () {
      const f = ["getHackTime"];
      await expectNonZeroRamCost(f);
    });

    it("getGrowTime()", async function () {
      const f = ["getGrowTime"];
      await expectNonZeroRamCost(f);
    });

    it("getWeakenTime()", async function () {
      const f = ["getWeakenTime"];
      await expectNonZeroRamCost(f);
    });

    it("getScriptIncome()", async function () {
      const f = ["getScriptIncome"];
      await expectNonZeroRamCost(f);
    });

    it("getScriptExpGain()", async function () {
      const f = ["getScriptExpGain"];
      await expectNonZeroRamCost(f);
    });

    it("getRunningScript()", async function () {
      const f = ["getRunningScript"];
      await expectNonZeroRamCost(f);
    });

    it("getTimeSinceLastAug()", async function () {
      const f = ["getTimeSinceLastAug"];
      await expectNonZeroRamCost(f);
    });

    it("sprintf()", async function () {
      const f = ["sprintf"];
      await expectZeroRamCost(f);
    });

    it("vsprintf()", async function () {
      const f = ["vsprintf"];
      await expectZeroRamCost(f);
    });

    it("nFormat()", async function () {
      const f = ["nFormat"];
      await expectZeroRamCost(f);
    });

    it("prompt()", async function () {
      const f = ["prompt"];
      await expectZeroRamCost(f);
    });

    it("wget()", async function () {
      const f = ["wget"];
      await expectZeroRamCost(f);
    });

    it("getFavorToDonate()", async function () {
      const f = ["getFavorToDonate"];
      await expectNonZeroRamCost(f);
    });
  });

  describe("Advanced Functions", function () {
    it("getBitNodeMultipliers()", async function () {
      const f = ["getBitNodeMultipliers"];
      await expectNonZeroRamCost(f);
    });
  });

  describe("Hacknet Node API", function () {
    // The Hacknet Node API RAM cost is a bit different because
    // it's just a one-time cost to access the 'hacknet' namespace.
    // Otherwise, all functions cost 0 RAM
    const apiFunctions = [
      "numNodes",
      "purchaseNode",
      "getPurchaseNodeCost",
      "getNodeStats",
      "upgradeLevel",
      "upgradeRam",
      "upgradeCore",
      "upgradeCache",
      "getLevelUpgradeCost",
      "getRamUpgradeCost",
      "getCoreUpgradeCost",
      "getCacheUpgradeCost",
      "numHashes",
      "hashCost",
      "spendHashes",
    ];
    it("should have zero RAM cost for all functions", function () {
      for (const fn of apiFunctions) {
        expect(getRamCost("hacknet", fn)).toEqual(0);
      }
    });

    it("should incur a one time cost of for accesing the namespace", async function () {
      let code = "";
      for (const fn of apiFunctions) {
        code += "hacknet." + fn + "(); ";
      }

      const calculated = await calculateRamUsage(code, []);
      testEquality(calculated, ScriptBaseCost + HacknetNamespaceCost);
    });
  });

  describe("TIX API", function () {
    it("getStockSymbols()", async function () {
      const f = ["getStockSymbols"];
      await expectNonZeroRamCost(f);
    });

    it("getStockPrice()", async function () {
      const f = ["getStockPrice"];
      await expectNonZeroRamCost(f);
    });

    it("getStockAskPrice()", async function () {
      const f = ["getStockAskPrice"];
      await expectNonZeroRamCost(f);
    });

    it("getStockBidPrice()", async function () {
      const f = ["getStockBidPrice"];
      await expectNonZeroRamCost(f);
    });

    it("getStockPosition()", async function () {
      const f = ["getStockPosition"];
      await expectNonZeroRamCost(f);
    });

    it("getStockMaxShares()", async function () {
      const f = ["getStockMaxShares"];
      await expectNonZeroRamCost(f);
    });

    it("getStockPurchaseCost()", async function () {
      const f = ["getStockPurchaseCost"];
      await expectNonZeroRamCost(f);
    });

    it("getStockSaleGain()", async function () {
      const f = ["getStockSaleGain"];
      await expectNonZeroRamCost(f);
    });

    it("buyStock()", async function () {
      const f = ["buyStock"];
      await expectNonZeroRamCost(f);
    });

    it("sellStock()", async function () {
      const f = ["sellStock"];
      await expectNonZeroRamCost(f);
    });

    it("shortStock()", async function () {
      const f = ["shortStock"];
      await expectNonZeroRamCost(f);
    });

    it("sellShort()", async function () {
      const f = ["sellShort"];
      await expectNonZeroRamCost(f);
    });

    it("placeOrder()", async function () {
      const f = ["placeOrder"];
      await expectNonZeroRamCost(f);
    });

    it("cancelOrder()", async function () {
      const f = ["cancelOrder"];
      await expectNonZeroRamCost(f);
    });

    it("getOrders()", async function () {
      const f = ["getOrders"];
      await expectNonZeroRamCost(f);
    });

    it("getStockVolatility()", async function () {
      const f = ["getStockVolatility"];
      await expectNonZeroRamCost(f);
    });

    it("getStockForecast()", async function () {
      const f = ["getStockForecast"];
      await expectNonZeroRamCost(f);
    });

    it("purchase4SMarketData()", async function () {
      const f = ["purchase4SMarketData"];
      await expectNonZeroRamCost(f);
    });

    it("purchase4SMarketDataTixApi()", async function () {
      const f = ["purchase4SMarketDataTixApi"];
      await expectNonZeroRamCost(f);
    });
  });

  describe("Singularity Functions", function () {
    it("universityCourse()", async function () {
      const f = ["universityCourse"];
      await expectNonZeroRamCost(f);
    });

    it("gymWorkout()", async function () {
      const f = ["gymWorkout"];
      await expectNonZeroRamCost(f);
    });

    it("travelToCity()", async function () {
      const f = ["travelToCity"];
      await expectNonZeroRamCost(f);
    });

    it("purchaseTor()", async function () {
      const f = ["purchaseTor"];
      await expectNonZeroRamCost(f);
    });

    it("purchaseProgram()", async function () {
      const f = ["purchaseProgram"];
      await expectNonZeroRamCost(f);
    });

    it("getStats()", async function () {
      const f = ["getStats"];
      await expectNonZeroRamCost(f);
    });

    it("getCharacterInformation()", async function () {
      const f = ["getCharacterInformation"];
      await expectNonZeroRamCost(f);
    });

    it("isBusy()", async function () {
      const f = ["isBusy"];
      await expectNonZeroRamCost(f);
    });

    it("stopAction()", async function () {
      const f = ["stopAction"];
      await expectNonZeroRamCost(f);
    });

    it("upgradeHomeRam()", async function () {
      const f = ["upgradeHomeRam"];
      await expectNonZeroRamCost(f);
    });

    it("getUpgradeHomeRamCost()", async function () {
      const f = ["getUpgradeHomeRamCost"];
      await expectNonZeroRamCost(f);
    });

    it("workForCompany()", async function () {
      const f = ["workForCompany"];
      await expectNonZeroRamCost(f);
    });

    it("applyToCompany()", async function () {
      const f = ["applyToCompany"];
      await expectNonZeroRamCost(f);
    });

    it("getCompanyRep()", async function () {
      const f = ["getCompanyRep"];
      await expectNonZeroRamCost(f);
    });

    it("getCompanyFavor()", async function () {
      const f = ["getCompanyFavor"];
      await expectNonZeroRamCost(f);
    });

    it("getCompanyFavorGain()", async function () {
      const f = ["getCompanyFavorGain"];
      await expectNonZeroRamCost(f);
    });

    it("checkFactionInvitations()", async function () {
      const f = ["checkFactionInvitations"];
      await expectNonZeroRamCost(f);
    });

    it("joinFaction()", async function () {
      const f = ["joinFaction"];
      await expectNonZeroRamCost(f);
    });

    it("workForFaction()", async function () {
      const f = ["workForFaction"];
      await expectNonZeroRamCost(f);
    });

    it("getFactionRep()", async function () {
      const f = ["getFactionRep"];
      await expectNonZeroRamCost(f);
    });

    it("getFactionFavor()", async function () {
      const f = ["getFactionFavor"];
      await expectNonZeroRamCost(f);
    });

    it("getFactionFavorGain()", async function () {
      const f = ["getFactionFavorGain"];
      await expectNonZeroRamCost(f);
    });

    it("donateToFaction()", async function () {
      const f = ["donateToFaction"];
      await expectNonZeroRamCost(f);
    });

    it("createProgram()", async function () {
      const f = ["createProgram"];
      await expectNonZeroRamCost(f);
    });

    it("commitCrime()", async function () {
      const f = ["commitCrime"];
      await expectNonZeroRamCost(f);
    });

    it("getCrimeChance()", async function () {
      const f = ["getCrimeChance"];
      await expectNonZeroRamCost(f);
    });

    it("getOwnedAugmentations()", async function () {
      const f = ["getOwnedAugmentations"];
      await expectNonZeroRamCost(f);
    });

    it("getOwnedSourceFiles()", async function () {
      const f = ["getOwnedSourceFiles"];
      await expectNonZeroRamCost(f);
    });

    it("getAugmentationsFromFaction()", async function () {
      const f = ["getAugmentationsFromFaction"];
      await expectNonZeroRamCost(f);
    });

    it("getAugmentationCost()", async function () {
      const f = ["getAugmentationCost"];
      await expectNonZeroRamCost(f);
    });

    it("getAugmentationPrereq()", async function () {
      const f = ["getAugmentationPrereq"];
      await expectNonZeroRamCost(f);
    });

    it("getAugmentationPrice()", async function () {
      const f = ["getAugmentationPrice"];
      await expectNonZeroRamCost(f);
    });

    it("getAugmentationRepReq()", async function () {
      const f = ["getAugmentationRepReq"];
      await expectNonZeroRamCost(f);
    });

    it("purchaseAugmentation()", async function () {
      const f = ["purchaseAugmentation"];
      await expectNonZeroRamCost(f);
    });

    it("installAugmentations()", async function () {
      const f = ["installAugmentations"];
      await expectNonZeroRamCost(f);
    });
  });

  describe("Bladeburner API", function () {
    it("getContractNames()", async function () {
      const f = ["bladeburner", "getContractNames"];
      await expectNonZeroRamCost(f);
    });

    it("getOperationNames()", async function () {
      const f = ["bladeburner", "getOperationNames"];
      await expectNonZeroRamCost(f);
    });

    it("getBlackOpNames()", async function () {
      const f = ["bladeburner", "getBlackOpNames"];
      await expectNonZeroRamCost(f);
    });

    it("getGeneralActionNames()", async function () {
      const f = ["bladeburner", "getGeneralActionNames"];
      await expectNonZeroRamCost(f);
    });

    it("getSkillNames()", async function () {
      const f = ["bladeburner", "getSkillNames"];
      await expectNonZeroRamCost(f);
    });

    it("startAction()", async function () {
      const f = ["bladeburner", "startAction"];
      await expectNonZeroRamCost(f);
    });

    it("stopBladeburnerAction()", async function () {
      const f = ["bladeburner", "stopBladeburnerAction"];
      await expectNonZeroRamCost(f);
    });

    it("getCurrentAction()", async function () {
      const f = ["bladeburner", "getCurrentAction"];
      await expectNonZeroRamCost(f);
    });

    it("getActionTime()", async function () {
      const f = ["bladeburner", "getActionTime"];
      await expectNonZeroRamCost(f);
    });

    it("getActionEstimatedSuccessChance()", async function () {
      const f = ["bladeburner", "getActionEstimatedSuccessChance"];
      await expectNonZeroRamCost(f);
    });

    it("getActionRepGain()", async function () {
      const f = ["bladeburner", "getActionRepGain"];
      await expectNonZeroRamCost(f);
    });

    it("getActionCountRemaining()", async function () {
      const f = ["bladeburner", "getActionCountRemaining"];
      await expectNonZeroRamCost(f);
    });

    it("getActionMaxLevel()", async function () {
      const f = ["bladeburner", "getActionMaxLevel"];
      await expectNonZeroRamCost(f);
    });

    it("getActionCurrentLevel()", async function () {
      const f = ["bladeburner", "getActionCurrentLevel"];
      await expectNonZeroRamCost(f);
    });

    it("getActionAutolevel()", async function () {
      const f = ["bladeburner", "getActionAutolevel"];
      await expectNonZeroRamCost(f);
    });

    it("setActionAutolevel()", async function () {
      const f = ["bladeburner", "setActionAutolevel"];
      await expectNonZeroRamCost(f);
    });

    it("setActionLevel()", async function () {
      const f = ["bladeburner", "setActionLevel"];
      await expectNonZeroRamCost(f);
    });

    it("getRank()", async function () {
      const f = ["bladeburner", "getRank"];
      await expectNonZeroRamCost(f);
    });

    it("getBlackOpRank()", async function () {
      const f = ["bladeburner", "getBlackOpRank"];
      await expectNonZeroRamCost(f);
    });

    it("getSkillPoints()", async function () {
      const f = ["bladeburner", "getSkillPoints"];
      await expectNonZeroRamCost(f);
    });

    it("getSkillLevel()", async function () {
      const f = ["bladeburner", "getSkillLevel"];
      await expectNonZeroRamCost(f);
    });

    it("getSkillUpgradeCost()", async function () {
      const f = ["bladeburner", "getSkillUpgradeCost"];
      await expectNonZeroRamCost(f);
    });

    it("upgradeSkill()", async function () {
      const f = ["bladeburner", "upgradeSkill"];
      await expectNonZeroRamCost(f);
    });

    it("getTeamSize()", async function () {
      const f = ["bladeburner", "getTeamSize"];
      await expectNonZeroRamCost(f);
    });

    it("setTeamSize()", async function () {
      const f = ["bladeburner", "setTeamSize"];
      await expectNonZeroRamCost(f);
    });

    it("getCityEstimatedPopulation()", async function () {
      const f = ["bladeburner", "getCityEstimatedPopulation"];
      await expectNonZeroRamCost(f);
    });

    it("getCityEstimatedCommunities()", async function () {
      const f = ["bladeburner", "getCityEstimatedCommunities"];
      await expectNonZeroRamCost(f);
    });

    it("getCityChaos()", async function () {
      const f = ["bladeburner", "getCityChaos"];
      await expectNonZeroRamCost(f);
    });

    it("getCity()", async function () {
      const f = ["bladeburner", "getCity"];
      await expectNonZeroRamCost(f);
    });

    it("switchCity()", async function () {
      const f = ["bladeburner", "switchCity"];
      await expectNonZeroRamCost(f);
    });

    it("getStamina()", async function () {
      const f = ["bladeburner", "getStamina"];
      await expectNonZeroRamCost(f);
    });

    it("joinBladeburnerFaction()", async function () {
      const f = ["bladeburner", "joinBladeburnerFaction"];
      await expectNonZeroRamCost(f);
    });

    it("joinBladeburnerDivision()", async function () {
      const f = ["bladeburner", "joinBladeburnerDivision"];
      await expectNonZeroRamCost(f);
    });

    it("getBonusTime()", async function () {
      const f = ["bladeburner", "getBonusTime"];
      await expectZeroRamCost(f);
    });
  });

  describe("Gang API", function () {
    it("getMemberNames()", async function () {
      const f = ["gang", "getMemberNames"];
      await expectNonZeroRamCost(f);
    });

    it("getGangInformation()", async function () {
      const f = ["gang", "getGangInformation"];
      await expectNonZeroRamCost(f);
    });

    it("getOtherGangInformation()", async function () {
      const f = ["gang", "getOtherGangInformation"];
      await expectNonZeroRamCost(f);
    });

    it("getMemberInformation()", async function () {
      const f = ["gang", "getMemberInformation"];
      await expectNonZeroRamCost(f);
    });

    it("canRecruitMember()", async function () {
      const f = ["gang", "canRecruitMember"];
      await expectNonZeroRamCost(f);
    });

    it("recruitMember()", async function () {
      const f = ["gang", "recruitMember"];
      await expectNonZeroRamCost(f);
    });

    it("getTaskNames()", async function () {
      const f = ["gang", "getTaskNames"];
      await expectNonZeroRamCost(f);
    });

    it("setMemberTask()", async function () {
      const f = ["gang", "setMemberTask"];
      await expectNonZeroRamCost(f);
    });

    it("getEquipmentNames()", async function () {
      const f = ["gang", "getEquipmentNames"];
      await expectNonZeroRamCost(f);
    });

    it("getEquipmentCost()", async function () {
      const f = ["gang", "getEquipmentCost"];
      await expectNonZeroRamCost(f);
    });

    it("getEquipmentType()", async function () {
      const f = ["gang", "getEquipmentType"];
      await expectNonZeroRamCost(f);
    });

    it("purchaseEquipment()", async function () {
      const f = ["gang", "purchaseEquipment"];
      await expectNonZeroRamCost(f);
    });

    it("ascendMember()", async function () {
      const f = ["gang", "ascendMember"];
      await expectNonZeroRamCost(f);
    });

    it("setTerritoryWarfare()", async function () {
      const f = ["gang", "setTerritoryWarfare"];
      await expectNonZeroRamCost(f);
    });

    it("getChanceToWinClash()", async function () {
      const f = ["gang", "getChanceToWinClash"];
      await expectNonZeroRamCost(f);
    });

    it("getBonusTime()", async function () {
      const f = ["gang", "getBonusTime"];
      await expectZeroRamCost(f);
    });
  });

  describe("Coding Contract API", function () {
    it("attempt()", async function () {
      const f = ["codingcontract", "attempt"];
      await expectNonZeroRamCost(f);
    });

    it("getContractType()", async function () {
      const f = ["codingcontract", "getContractType"];
      await expectNonZeroRamCost(f);
    });

    it("getDescription()", async function () {
      const f = ["codingcontract", "getDescription"];
      await expectNonZeroRamCost(f);
    });

    it("getData()", async function () {
      const f = ["codingcontract", "getData"];
      await expectNonZeroRamCost(f);
    });

    it("getNumTriesRemaining()", async function () {
      const f = ["codingcontract", "getNumTriesRemaining"];
      await expectNonZeroRamCost(f);
    });
  });

  describe("Sleeve API", function () {
    it("getNumSleeves()", async function () {
      const f = ["sleeve", "getNumSleeves"];
      await expectNonZeroRamCost(f);
    });

    it("getSleeveStats()", async function () {
      const f = ["sleeve", "getSleeveStats"];
      await expectNonZeroRamCost(f);
    });

    it("getInformation()", async function () {
      const f = ["sleeve", "getInformation"];
      await expectNonZeroRamCost(f);
    });

    it("getTask()", async function () {
      const f = ["sleeve", "getTask"];
      await expectNonZeroRamCost(f);
    });

    it("setToShockRecovery()", async function () {
      const f = ["sleeve", "setToShockRecovery"];
      await expectNonZeroRamCost(f);
    });

    it("setToSynchronize()", async function () {
      const f = ["sleeve", "setToSynchronize"];
      await expectNonZeroRamCost(f);
    });

    it("setToCommitCrime()", async function () {
      const f = ["sleeve", "setToCommitCrime"];
      await expectNonZeroRamCost(f);
    });

    it("setToFactionWork()", async function () {
      const f = ["sleeve", "setToFactionWork"];
      await expectNonZeroRamCost(f);
    });

    it("setToCompanyWork()", async function () {
      const f = ["sleeve", "setToCompanyWork"];
      await expectNonZeroRamCost(f);
    });

    it("setToUniversityCourse()", async function () {
      const f = ["sleeve", "setToUniversityCourse"];
      await expectNonZeroRamCost(f);
    });

    it("setToGymWorkout()", async function () {
      const f = ["sleeve", "setToGymWorkout"];
      await expectNonZeroRamCost(f);
    });

    it("travel()", async function () {
      const f = ["sleeve", "travel"];
      await expectNonZeroRamCost(f);
    });

    it("getSleeveAugmentations()", async function () {
      const f = ["sleeve", "getSleeveAugmentations"];
      await expectNonZeroRamCost(f);
    });

    it("getSleevePurchasableAugs()", async function () {
      const f = ["sleeve", "getSleevePurchasableAugs"];
      await expectNonZeroRamCost(f);
    });

    it("purchaseSleeveAug()", async function () {
      const f = ["sleeve", "purchaseSleeveAug"];
      await expectNonZeroRamCost(f);
    });
  });
});
