import { Player } from "../../../src/Player";
import { NetscriptFunctions, wrappedNS } from "../../../src/NetscriptFunctions";
import { RamCosts, getRamCost, RamCostConstants } from "../../../src/Netscript/RamCostGenerator";
import { Environment } from "../../../src/Netscript/Environment";
import { RunningScript } from "../../../src/Script/RunningScript";
import { Script } from "../../../src/Script/Script";
import { WorkerScript } from "../../../src/Netscript/WorkerScript";
import { calculateRamUsage } from "../../../src/Script/RamCalculations";

type PotentiallyAsyncFunction = (arg?: unknown) => { catch?: PotentiallyAsyncFunction };
type NSLayer = {
  [key: string]: NSLayer | PotentiallyAsyncFunction;
};
type RamLayer = {
  [key: string]: number | (() => number) | RamLayer;
};
function grabCost(ramLayer: RamLayer, fullPath: string[]) {
  const ramEntry = ramLayer[fullPath[fullPath.length - 1]];
  const expectedRam = typeof ramEntry === "function" ? ramEntry() : ramEntry;
  if (typeof expectedRam !== "number") throw new Error(`There was no defined ram cost for ${fullPath.join(".")}().`);
  return expectedRam;
}
function isRemovedFunction(fn: Function) {
  try {
    fn();
  } catch {
    return true;
  }
  return false;
}

describe("Netscript RAM Calculation/Generation Tests", function () {
  Player.sourceFiles[0] = { n: 4, lvl: 3 };
  // For simulating costs of singularity functions.
  const sf4 = Player.sourceFiles[0];
  const baseCost = RamCostConstants.Base;
  const maxCost = RamCostConstants.Max;
  const script = new Script();
  /** Creates a RunningScript object which calculates static ram usage */
  function createRunningScript(code: string) {
    script.code = code;
    script.updateRamUsage([]);
    const runningScript = new RunningScript(script);
    return runningScript;
  }

  /** Runs a Netscript function and properly catches an error even if it returns promise. */
  function tryFunction(fn: PotentiallyAsyncFunction) {
    try {
      fn()?.catch?.(() => undefined);
    } catch {}
  }

  let scriptRef = createRunningScript("");
  //Since it is expensive to create a workerscript and wrap the ns API, this is done once
  const workerScript = {
    args: [] as string[],
    code: "",
    delay: null,
    dynamicLoadedFns: {},
    dynamicRamUsage: RamCostConstants.Base,
    env: new Environment(),
    ramUsage: scriptRef.ramUsage,
    scriptRef,
  };
  const ns = NetscriptFunctions(workerScript as WorkerScript);

  function combinedRamCheck(
    fn: PotentiallyAsyncFunction,
    fnPath: string[],
    expectedRamCost: number,
    extraLayerCost = 0,
  ) {
    const code = `${fnPath.join(".")}();\n`.repeat(3);
    const fnName = fnPath[fnPath.length - 1];

    //check imported getRamCost fn vs. expected ram from test
    expect(getRamCost(...fnPath)).toEqual(expectedRamCost);

    // Static ram check
    const staticCost = calculateRamUsage(code, []).cost;
    expect(staticCost).toBeCloseTo(Math.min(baseCost + expectedRamCost + extraLayerCost, maxCost));

    // reset workerScript for dynamic check
    scriptRef = createRunningScript(code);
    Object.assign(workerScript, {
      code,
      scriptRef,
      ramUsage: scriptRef.ramUsage,
      dynamicRamUsage: baseCost,
      env: new Environment(),
      dynamicLoadedFns: {},
    });
    workerScript.env.vars = ns;

    // Run the function through the workerscript's args
    if (typeof fn === "function") {
      tryFunction(fn);
      tryFunction(fn);
      tryFunction(fn);
    } else {
      throw new Error(`Invalid function specified: [${fnPath.toString()}]`);
    }

    expect(workerScript.dynamicLoadedFns).toHaveProperty(fnName);
    expect(workerScript.dynamicRamUsage).toBeCloseTo(Math.min(expectedRamCost + baseCost, maxCost), 5);
    expect(workerScript.dynamicRamUsage).toBeCloseTo(scriptRef.ramUsage - extraLayerCost, 5);
  }

  describe("ns", () => {
    Object.entries(wrappedNS as unknown as NSLayer).forEach(([key, val]) => {
      if (key === "args" || key === "enums") return;
      if (typeof val === "function") {
        // Removed functions have no ram cost and should be skipped.
        if (isRemovedFunction(val)) return;
        const expectedRam = grabCost(RamCosts, [key]);
        it(`${key}()`, () => combinedRamCheck(val.bind(ns), [key], expectedRam));
      }
      //The only other option should be an NSLayer
      const extraLayerCost = { hacknet: 4 }[key] ?? 0; // Currently only hacknet has a layer cost.
      testLayer(val as NSLayer, RamCosts[key as keyof typeof RamCosts] as RamLayer, [key], extraLayerCost);
    });
  });

  function testLayer(nsLayer: NSLayer, ramLayer: RamLayer, path: string[], extraLayerCost: number) {
    // nsLayer is the layer on the main, unstamped wrappedNS object. The actualLayer is needed to check correct stamping.
    const actualLayer = path.reduce((prev, curr) => prev[curr], ns as any); //todo: do this typesafely?
    describe(path[path.length - 1], () => {
      Object.entries(nsLayer).forEach(([key, val]) => {
        const newPath = [...path, key];
        if (typeof val === "function") {
          // Removed functions have no ram cost and should be skipped.
          if (isRemovedFunction(val)) return;
          const fnName = newPath.join(".");
          const expectedRam = grabCost(ramLayer, newPath);
          it(`${fnName}()`, () => combinedRamCheck(val.bind(actualLayer), newPath, expectedRam, extraLayerCost));
        }
        //Skip enums layers
        else if (key === "enums") return;
        //A layer should be the only other option.
        else testLayer(val, ramLayer[key] as RamLayer, newPath, 0);
      });
    });
  }

  describe("Singularity multiplier checks", () => {
    sf4.lvl = 3;
    const singFunctions = Object.entries(wrappedNS.singularity).filter(([__, val]) => typeof val === "function");
    const singObjects = singFunctions.map(([key, val]) => {
      return {
        name: key,
        fn: val.bind(ns.singularity),
        baseRam: grabCost(RamCosts.singularity, ["singularity", key]),
      };
    });
    const lvlToMult: Record<number, number> = { 0: 16, 1: 16, 2: 4 };
    for (const lvl of [0, 1, 2]) {
      it(`SF4.${lvl} check for x${lvlToMult[lvl]} costs`, () => {
        sf4.lvl = lvl;
        singObjects.forEach((obj) =>
          combinedRamCheck(
            obj.fn as PotentiallyAsyncFunction,
            ["singularity", obj.name],
            obj.baseRam * lvlToMult[lvl],
            0,
          ),
        );
      });
    }
  });
});
