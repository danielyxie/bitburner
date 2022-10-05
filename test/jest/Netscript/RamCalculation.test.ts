import { Player } from "../../../src/Player";
import { NetscriptFunctions } from "../../../src/NetscriptFunctions";
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

describe("Netscript RAM Calculation/Generation Tests", function () {
  Player.sourceFiles[0] = { n: 4, lvl: 3 };
  const sf4 = Player.sourceFiles[0];
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
    dynamicRamUsage: RamCostConstants.ScriptBaseRamCost,
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
    expect(staticCost).toBeCloseTo(ScriptBaseCost + expectedRamCost + extraLayerCost);

    // reset workerScript for dynamic check
    scriptRef = createRunningScript(code);
    Object.assign(workerScript, {
      code,
      scriptRef,
      ramUsage: scriptRef.ramUsage,
      dynamicRamUsage: ScriptBaseCost,
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
    expect(workerScript.dynamicRamUsage - ScriptBaseCost).toBeCloseTo(expectedRamCost, 5);
    expect(workerScript.dynamicRamUsage).toBeCloseTo(scriptRef.ramUsage - extraLayerCost, 5);
  }

  describe("ns", () => {
    Object.entries(ns as unknown as NSLayer).forEach(([key, val]) => {
      if (key === "args" || key === "enums") return;
      if (typeof val === "function") {
        const expectedRam = grabCost(RamCosts, [key]);
        it(`${key}()`, () => combinedRamCheck(val, [key], expectedRam));
      }
      //The only other option should be an NSLayer
      const extraLayerCost = { corporation: 1022.4, hacknet: 4 }[key] ?? 0;
      testLayer(val as NSLayer, RamCosts[key as keyof typeof RamCosts] as RamLayer, [key], extraLayerCost);
    });
  });

  function testLayer(nsLayer: NSLayer, ramLayer: RamLayer, path: string[], extraLayerCost: number) {
    describe(path[path.length - 1], () => {
      Object.entries(nsLayer).forEach(([key, val]) => {
        const newPath = [...path, key];
        if (typeof val === "function") {
          const fnName = newPath.join(".");
          const expectedRam = grabCost(ramLayer, newPath);
          it(`${fnName}()`, () => combinedRamCheck(val, newPath, expectedRam, extraLayerCost));
        }
        //A layer should be the only other option.
        else testLayer(val, ramLayer[key] as RamLayer, newPath, 0);
      });
    });
  }

  describe("Singularity multiplier checks", () => {
    sf4.lvl = 3;
    const singFunctions = Object.entries(ns.singularity).filter(([key, val]) => typeof val === "function");
    const singObjects = singFunctions.map(([key, val]) => {
      return {
        name: key,
        fn: val,
        baseRam: grabCost(RamCosts.singularity, ["singularity", key]),
      };
    });
    const lvlToMult: Record<number, number> = { 0: 16, 1: 16, 2: 4 };
    for (const lvl of [0, 1, 2]) {
      it(`SF4.${lvl} check for x${lvlToMult[lvl]} costs`, () => {
        sf4.lvl = lvl;
        singObjects.forEach((obj) =>
          combinedRamCheck(obj.fn, ["singularity", obj.name], obj.baseRam * lvlToMult[lvl], 0),
        );
      });
    }
  });
});
