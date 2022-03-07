// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { describe, expect, jest } from "@jest/globals";

// Player is needed for calculating costs like Singularity functions, that depend on acquired source files
import { Player } from "../../../src/Player";

import { RamCostConstants } from "../../../src/Netscript/RamCostGenerator";
import { calculateRamUsage } from "../../../src/Script/RamCalculations";
import { Script } from "../../../src/Script/Script";

jest.mock(`!!raw-loader!../NetscriptDefinitions.d.ts`, () => "", {
  virtual: true,
});

const ScriptBaseCost = RamCostConstants.ScriptBaseRamCost;
const HackCost = RamCostConstants.ScriptHackRamCost;
const StanekGetCost = RamCostConstants.ScriptStanekFragmentAt;
const StanekWidthCost = RamCostConstants.ScriptStanekWidth;
const GrowCost = RamCostConstants.ScriptGrowRamCost;
const SleeveGetTaskCost = RamCostConstants.ScriptSleeveBaseRamCost;
const HacknetCost = RamCostConstants.ScriptHacknetNodesRamCost;
const CorpCost = RamCostConstants.ScriptCorporationRamCost;
const DomCost = RamCostConstants.ScriptDomRamCost
describe("Parsing NetScript code to work out static RAM costs", function () {
  // Tests numeric equality, allowing for floating point imprecision - and includes script base cost
  function expectCost(val, expected) {
    const expectedWithBase = expected + ScriptBaseCost;
    expect(val).toBeGreaterThanOrEqual(expectedWithBase - 100 * Number.EPSILON);
    expect(val).toBeLessThanOrEqual(expectedWithBase + 100 * Number.EPSILON);
  }

  describe("special namespaces work", function () {
    it("Exporting an api to be used in another file", async function () {
      const code = `
      export async function main(ns) {
        window.blah
      }
    `;
      const calculated = (await calculateRamUsage(Player, code)).cost;
      expectCost(calculated, DomCost);
    });
  });


  describe("Single files with import exported NS api namespaces", function () {
    it("Exporting an api to be used in another file", async function () {
      const libCode = `
        export async function anExport(ns) { return ns.stanek }
      `;
      const lib = new Script(Player, "libTest.js", libCode, []);

      const code = `
        import {anExport} from "libTest.js";
        export async function main(ns) {
          await anExport(ns).get;
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [lib])).cost;
      expectCost(calculated, StanekGetCost);
    });

    it("Exporting api methods to be used in another file", async function () {
      const libCode = `
        export async function anExport(ns) { return ns.stanek.get }
        export async function anotherExport(ns) { return ns.stanek.width }
      `;
      const lib = new Script(Player, "libTest.js", libCode, []);

      const code = `
        import {anExport, anotherExport} from "libTest.js";
        export async function main(ns) {
          await anExport(ns);
          await anotherExport(ns);
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [lib])).cost;
      expectCost(calculated, StanekGetCost + StanekWidthCost);
    });

    it("Exporting api methods selectively import in another file", async function () {
      const libCode = `
        export async function anExport(ns) { return ns.stanek.get }
        export async function anotherExport(ns) { return ns.stanek.width }
      `;
      const lib = new Script(Player, "libTest.js", libCode, []);

      const code = `
        import {anExport} from "libTest.js";
        export async function main(ns) {
          await anExport(ns);
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [lib])).cost;
      expectCost(calculated, StanekGetCost);
    });

    it("Exporting all methods as a variable to be used in another file", async function () {
      const libCode = `
        export async function anExport(ns) { return ns.stanek.get }
        export async function anotherExport(ns) { return ns.stanek.width }
      `;
      const lib = new Script(Player, "libTest.js", libCode, []);

      const code = `
        import libTest from "libTest.js";
        export async function main(ns) {
          await libTest.anExport(ns);
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [lib])).cost;
      expectCost(calculated, StanekGetCost + StanekWidthCost);
    });

    it("Exporting api import as variable another file", async function () {
      const libCode = `
        export async function anExport(ns) { return ns.stanek }
      `;
      const lib = new Script(Player, "libTest.js", libCode, []);

      const code = `
        import libTest from "libTest.js";
        export async function main(ns) {
          await libTest.anExport(ns).get;
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [lib])).cost;
      expectCost(calculated, StanekGetCost);
    });
  });

  describe("Single files with basic NS functions", function () {
    it("Empty main function", async function () {
      const code = `
        export async function main(ns) { }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      expectCost(calculated, 0);
    });

    it("Free NS function directly in main", async function () {
      const code = `
        export async function main(ns) {
          ns.print("Slum snakes r00l!");
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      expectCost(calculated, 0);
    });

    it("Single simple base NS function directly in main", async function () {
      const code = `
        export async function main(ns) {
          await ns.hack("joesguns");
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      expectCost(calculated, HackCost);
    });

    it("Single simple base NS function directly in main with differing arg name", async function () {
      const code = `
        export async function main(X) {
          await X.hack("joesguns");
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      expectCost(calculated, HackCost);
    });

    it("Repeated simple base NS function directly in main", async function () {
      const code = `
        export async function main(ns) {
          await ns.hack("joesguns");
          await ns.hack("joesguns");
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      expectCost(calculated, HackCost);
    });

    it("Multiple simple base NS functions directly in main", async function () {
      const code = `
        export async function main(ns) {
          await ns.hack("joesguns");
          await ns.grow("joesguns");
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      expectCost(calculated, HackCost + GrowCost);
    });

    it("Simple base NS functions in a referenced function", async function () {
      const code = `
        export async function main(ns) {
          doHacking(ns);
        }
        async function doHacking(ns) {
          await ns.hack("joesguns");
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      expectCost(calculated, HackCost);
    });

    it("Simple base NS functions in a referenced class", async function () {
      const code = `
        export async function main(ns) {
          await new Hacker(ns).doHacking();
        }
        class Hacker {
          ns;
          constructor(ns) { this.ns = ns; }
          async doHacking() { await this.ns.hack("joesguns"); }
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      expectCost(calculated, HackCost);
    });

    it("Simple base NS functions in a referenced class", async function () {
      const code = `
        export async function main(ns) {
          await new Hacker(ns).doHacking();
        }
        class Hacker {
          #ns;
          constructor(ns) { this.#ns = ns; }
          async doHacking() { await this.#ns.hack("joesguns"); }
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      expectCost(calculated, HackCost);
    });
  });



  describe("Functions that can be confused with NS functions", function () {
    it("Function 'get' that can be confused with Stanek.get", async function () {
      const code = `
        export async function main(ns) {
          get();
        }
        function get() { return 0; }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      expectCost(calculated, 0);
    });

    it("Function 'purchaseNode' that can be confused with Hacknet.purchaseNode", async function () {
      const code = `
        export async function main(ns) {
          purchaseNode();
        }
        function purchaseNode() { return 0; }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      // Works at present, because the parser checks the namespace only, not the function name
      expectCost(calculated, 0);
    });

    it("Function 'getTask' that can be confused with Sleeve.getTask", async function () {
      const code = `
        export async function main(ns) {
          getTask();
        }
        function getTask() { return 0; }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      expectCost(calculated, 0);
    });
  });



  describe("Single files with non-core NS functions", function () {
    it("Hacknet NS function with a cost from namespace", async function () {
      const code = `
        export async function main(ns) {
          ns.hacknet.purchaseNode(0);
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      expectCost(calculated, HacknetCost);
    });

    it("Corporation NS function with a cost from namespace", async function () {
      const code = `
        export async function main(ns) {
          ns.corporation.getCorporation();
          ns.corporation.getOffice();
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      expectCost(calculated, CorpCost);
    });

    it("Both Corporation and Hacknet functions", async function () {
      const code = `
        export async function main(ns) {
          ns.corporation.getCorporation();
          ns.hacknet.purchaseNode(0);
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      expectCost(calculated, CorpCost + HacknetCost);
    });

    it("Sleeve functions with an individual cost", async function () {
      const code = `
        export async function main(ns) {
          ns.sleeve.getTask(3);
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [])).cost;
      expectCost(calculated, SleeveGetTaskCost);
    });
  });

  describe("Imported files", function () {
    it("Simple imported function with no cost", async function () {
      const libCode = `
        export function dummy() { return 0; }
      `;
      const lib = new Script(Player, "libTest.js", libCode, []);

      const code = `
        import { dummy } from "libTest.js";
        export async function main(ns) {
          dummy();
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [lib])).cost;
      expectCost(calculated, 0);
    });

    it("Imported ns function", async function () {
      const libCode = `
        export async function doHack(ns) { return await ns.hack("joesguns"); }
      `;
      const lib = new Script(Player, "libTest.js", libCode, []);

      const code = `
        import { doHack } from "libTest.js";
        export async function main(ns) {
          await doHack(ns);
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [lib])).cost;
      expectCost(calculated, HackCost);
    });

    it("Importing a single function from a library that exports multiple", async function () {
      const libCode = `
        export async function doHack(ns) { return await ns.hack("joesguns"); }
        export async function doGrow(ns) { return await ns.grow("joesguns"); }
      `;
      const lib = new Script(Player, "libTest.js", libCode, []);

      const code = `
        import { doHack } from "libTest.js";
        export async function main(ns) {
          await doHack(ns);
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [lib])).cost;
      expectCost(calculated, HackCost);
    });

    it("Importing all functions from a library that exports multiple", async function () {
      const libCode = `
        export async function doHack(ns) { return await ns.hack("joesguns"); }
        export async function doGrow(ns) { return await ns.grow("joesguns"); }
      `;
      const lib = new Script(Player, "libTest.js", libCode, []);

      const code = `
        import * as test from "libTest.js";
        export async function main(ns) {
          await test.doHack(ns);
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [lib])).cost;
      expectCost(calculated, HackCost + GrowCost);
    });

    it("Importing a function from a library that contains a class", async function () {
      const libCode = `
        export async function doHack(ns) { return await ns.hack("joesguns"); }
        class Grower {
          ns;
          constructor(ns) { this.ns = ns; }
          async doGrow() { return await this.ns.grow("joesguns"); }
        }
      `;
      const lib = new Script(Player, "libTest.js", libCode, []);

      const code = `
        import * as test from "libTest.js";
        export async function main(ns) {
          await test.doHack(ns);
        }
      `;
      const calculated = (await calculateRamUsage(Player, code, [lib])).cost;
      expectCost(calculated, HackCost);
    });

    it("Importing a function from a library that creates a class in a function", async function () {
      const libCode = `
          export function createClass() {
            class Grower {
              ns;
              constructor(ns) { this.ns = ns; }
              async doGrow() { return await this.ns.grow("joesguns"); }
            }
            return Grower;
          }
        `;
      const lib = new Script(Player, "libTest.js", libCode, []);

      const code = `
          import { createClass } from "libTest.js";

          export async function main(ns) {
            const grower = createClass();
            const growerInstance = new grower(ns);
            await growerInstance.doGrow();
          }
        `;
      const calculated = (await calculateRamUsage(Player, code, [lib])).cost;
      expectCost(calculated, GrowCost);
    });

  });

});
