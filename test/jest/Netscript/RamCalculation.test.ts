import { Player } from "../../../src/Player";
import { NetscriptFunctions } from "../../../src/NetscriptFunctions";
import { RamCosts, getRamCost, RamCostConstants } from "../../../src/Netscript/RamCostGenerator";
import { Environment } from "../../../src/Netscript/Environment";
import { RunningScript } from "../../../src/Script/RunningScript";
import { Script } from "../../../src/Script/Script";
import { WorkerScript } from "../../../src/Netscript/WorkerScript";
import { calculateRamUsage } from "../../../src/Script/RamCalculations";

describe("Netscript RAM Calculation/Generation Tests", function () {
  Player.sourceFiles[0] = { n: 4, lvl: 3 };
  // For simulating costs of singularity functions.
  const ScriptBaseCost = RamCostConstants.ScriptBaseRamCost;
  const script = new Script();
  /** Creates a RunningScript object which calculates static ram usage */
  function createRunningScript(code: string) {
    script.code = code;
    script.updateRamUsage([]);
    const runningScript = new RunningScript(script);
    return runningScript;
  }

  type potentiallyAsyncFunction = (arg?: unknown) => { catch?: potentiallyAsyncFunction };
  /** Runs a Netscript function and properly catches an error even if it returns promise. */
  function tryFunction(fn: potentiallyAsyncFunction) {
    try {
      fn()?.catch?.(() => undefined);
    } catch {}
  }

  let runningScript = createRunningScript("");
  //Since it is expensive to create a workerscript and wrap the ns API, this is done once
  const workerScript = {
    args: [] as string[],
    code: "",
    delay: null,
    dynamicLoadedFns: {},
    dynamicRamUsage: RamCostConstants.ScriptBaseRamCost,
    env: new Environment(),
    ramUsage: runningScript.ramUsage,
    scriptRef: runningScript,
  };
  const ns = NetscriptFunctions(workerScript as WorkerScript);

  function dynamicCheck(fnPath: string[], expectedRamCost: number, extraLayerCost = 0) {
    const code = `${fnPath.join(".")}();\n`.repeat(3);
    const fnName = fnPath[fnPath.length - 1];

    // update our existing WorkerScript
    runningScript = createRunningScript(code);
    workerScript.code = code;
    workerScript.scriptRef = runningScript;
    workerScript.ramUsage = workerScript.scriptRef.ramUsage;
    workerScript.dynamicRamUsage = ScriptBaseCost;
    workerScript.env = new Environment();
    workerScript.dynamicLoadedFns = {};
    workerScript.env.vars = ns;

    // Run the function through the workerscript's args
    const fn = fnPath.reduce((prev, curr) => prev[curr], ns as any);

    if (typeof fn === "function") {
      tryFunction(fn);
      tryFunction(fn);
      tryFunction(fn);
    } else {
      throw new Error(`Invalid function specified: [${fnPath.toString()}]`);
    }

    expect(workerScript.dynamicLoadedFns).toHaveProperty(fnName);
    expect(workerScript.dynamicRamUsage - ScriptBaseCost).toBeCloseTo(expectedRamCost, 5);
    expect(workerScript.dynamicRamUsage).toBeCloseTo(runningScript.ramUsage - extraLayerCost, 5);
  }

  function testFunctionExpectZero(fnPath: string[], extraLayerCost = 0) {
    const wholeFn = `${fnPath.join(".")}()`;
    describe(wholeFn, () => {
      it("Zero Ram Static Check", () => {
        const ramCost = getRamCost(...fnPath);
        expect(ramCost).toEqual(0);
        const code = wholeFn;
        const staticCost = calculateRamUsage(code, []).cost;
        expect(staticCost).toEqual(ScriptBaseCost + extraLayerCost);
      });
      it("Zero Ram Dynamic check", () => dynamicCheck(fnPath, 0, extraLayerCost));
    });
  }

  function testFunctionExpectNonzero(fnPath: string[], extraLayerCost = 0) {
    const wholeFn = `${fnPath.join(".")}()`;
    const ramCost = getRamCost(...fnPath);
    describe(wholeFn, () => {
      it("Static Check", () => {
        expect(ramCost).toBeGreaterThan(0);
        const code = wholeFn;
        const staticCost = calculateRamUsage(code, []).cost;
        expect(staticCost).toBeCloseTo(ramCost + ScriptBaseCost + extraLayerCost, 5);
      });
      it("Dynamic Check", () => dynamicCheck(fnPath, ramCost, extraLayerCost));
    });
  }

  //input type for testSingularityFunctions
  type singularityData = { fnPath: string[]; baseCost: number };

  function testSingularityFunctions(data: singularityData[]) {
    const sf4 = Player.sourceFiles[0];
    data.forEach(({ fnPath, baseCost }) => {
      const wholeFn = `${fnPath.join(".")}()`;
      describe(wholeFn, () => {
        it("SF4.3", () => {
          sf4.lvl = 3;
          const ramCost = getRamCost(...fnPath);
          expect(ramCost).toEqual(baseCost);
          const code = wholeFn;
          const staticCost = calculateRamUsage(code, []).cost;
          expect(staticCost).toBeCloseTo(ramCost + ScriptBaseCost);
          dynamicCheck(fnPath, baseCost);
        });
        it("SF4.2", () => {
          sf4.lvl = 2;
          const ramCost = getRamCost(...fnPath);
          expect(ramCost).toBeCloseTo(baseCost * 4, 5);
          const code = wholeFn;
          const staticCost = calculateRamUsage(code, []).cost;
          expect(staticCost).toBeCloseTo(ramCost + ScriptBaseCost);
          dynamicCheck(fnPath, ramCost);
        });
        it("SF4.1", () => {
          sf4.lvl = 1;
          const ramCost = getRamCost(...fnPath);
          expect(ramCost).toBeCloseTo(baseCost * 16, 5);
          const code = wholeFn;
          const staticCost = calculateRamUsage(code, []).cost;
          expect(staticCost).toBeCloseTo(ramCost + ScriptBaseCost);
          dynamicCheck(fnPath, ramCost);
        });
      });
    });
  }

  type NSLayer = {
    [key: string]: NSLayer | unknown[] | (() => unknown);
  };
  type RamLayer = {
    [key: string]: RamLayer | number | (() => number);
  };
  function testLayer(nsLayer: NSLayer, ramLayer: RamLayer, path: string[], extraLayerCost = 0) {
    const zeroCostFunctions = Object.entries(nsLayer)
      .filter(([key, val]) => ramLayer[key] === 0 && typeof val === "function")
      .map(([key]) => [...path, key]);
    zeroCostFunctions.forEach((fn) => testFunctionExpectZero(fn, extraLayerCost));

    const nonzeroCostFunctions = Object.entries(nsLayer)
      .filter(([key, val]) => ramLayer[key] > 0 && typeof val === "function")
      .map(([key]) => [...path, key]);
    nonzeroCostFunctions.forEach((fn) => testFunctionExpectNonzero(fn, extraLayerCost));
  }

  describe("Top level ns functions", () => {
    const nsScope = ns as unknown as NSLayer;
    const ramScope = RamCosts;
    testLayer(nsScope, ramScope, []);
  });

  describe("Bladeburner API (bladeburner) functions", () => {
    const nsScope = ns.bladeburner as unknown as NSLayer;
    const ramScope = RamCosts.bladeburner;
    testLayer(nsScope, ramScope, ["bladeburner"]);
  });

  describe("Corporation API (corporation) functions", () => {
    const nsScope = ns.corporation as unknown as NSLayer;
    const ramScope = RamCosts.corporation;
    testLayer(nsScope, ramScope, ["corporation"], 1024 - ScriptBaseCost);
  });

  describe("TIX API (stock) functions", () => {
    const nsScope = ns.stock as unknown as NSLayer;
    const ramScope = RamCosts.stock;
    testLayer(nsScope, ramScope, ["stock"]);
  });

  describe("Gang API (gang) functions", () => {
    const nsScope = ns.gang as unknown as NSLayer;
    const ramScope = RamCosts.gang;
    testLayer(nsScope, ramScope, ["gang"]);
  });

  describe("Coding Contract API (codingcontract) functions", () => {
    const nsScope = ns.codingcontract as unknown as NSLayer;
    const ramScope = RamCosts.codingcontract;
    testLayer(nsScope, ramScope, ["codingcontract"]);
  });

  describe("Sleeve API (sleeve) functions", () => {
    const nsScope = ns.sleeve as unknown as NSLayer;
    const ramScope = RamCosts.sleeve;
    testLayer(nsScope, ramScope, ["sleeve"]);
  });

  //Singularity functions are tested in a different way because they also check SF4 level effect
  describe("ns.singularity functions", () => {
    const singularityFunctions = Object.entries(RamCosts.singularity).map(([fnName, ramFn]) => {
      return {
        fnPath: ["singularity", fnName],
        // This will error if a singularity function is assigned a flat cost instead of using the SF4 function
        baseCost: (ramFn as () => number)(),
      };
    });
    testSingularityFunctions(singularityFunctions);
  });

  //Formulas requires deeper layer penetration
  function formulasTest(
    newLayer = "formulas",
    oldNSLayer = ns as unknown as NSLayer,
    oldRamLayer = RamCosts as unknown as RamLayer,
    path = ["formulas"],
    nsLayer = oldNSLayer[newLayer] as NSLayer,
    ramLayer = oldRamLayer[newLayer] as RamLayer,
  ) {
    testLayer(nsLayer, ramLayer, path);
    for (const [key, val] of Object.entries(nsLayer)) {
      if (Array.isArray(val) || typeof val === "function" || key === "enums") continue;
      // Only other option is an object / new layer
      describe(key, () => formulasTest(key, nsLayer, ramLayer, [...path, key]));
    }
  }
  describe("ns.formulas functions", formulasTest);
});
