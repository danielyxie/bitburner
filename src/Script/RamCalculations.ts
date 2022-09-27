/**
 * Implements RAM Calculation functionality.
 *
 * Uses the acorn.js library to parse a script's code into an AST and
 * recursively walk through that AST, calculating RAM usage along
 * the way
 */
import * as walk from "acorn-walk";
import acorn, { parse } from "acorn";

import { RamCalculationErrorCode } from "./RamCalculationErrorCodes";

import { RamCosts, RamCostConstants } from "../Netscript/RamCostGenerator";
import { Script } from "./Script";
import { areImportsEquals } from "../Terminal/DirectoryHelpers";
import { Node } from "../NetscriptJSEvaluator";

export interface RamUsageEntry {
  type: "ns" | "dom" | "fn" | "misc";
  name: string;
  cost: number;
}

export interface RamCalculation {
  cost: number;
  entries?: RamUsageEntry[];
}

// These special strings are used to reference the presence of a given logical
// construct within a user script.
const specialReferenceIF = "__SPECIAL_referenceIf";
const specialReferenceFOR = "__SPECIAL_referenceFor";
const specialReferenceWHILE = "__SPECIAL_referenceWhile";

// The global scope of a script is registered under this key during parsing.
const memCheckGlobalKey = ".__GLOBAL__";

/**
 * Parses code into an AST and walks through it recursively to calculate
 * RAM usage. Also accounts for imported modules.
 * @param {Script[]} otherScripts - All other scripts on the server. Used to account for imported scripts
 * @param {string} code - The code being parsed */
function parseOnlyRamCalculate(otherScripts: Script[], code: string): RamCalculation {
  try {
    /**
     * Maps dependent identifiers to their dependencies.
     *
     * The initial identifier is __SPECIAL_INITIAL_MODULE__.__GLOBAL__.
     * It depends on all the functions declared in the module, all the global scopes
     * of its imports, and any identifiers referenced in this global scope. Each
     * function depends on all the identifiers referenced internally.
     * We walk the dependency graph to calculate RAM usage, given that some identifiers
     * reference Netscript functions which have a RAM cost.
     */
    let dependencyMap: { [key: string]: string[] } = {};

    // Scripts we've parsed.
    const completedParses = new Set();

    // Scripts we've discovered that need to be parsed.
    const parseQueue: string[] = [];

    // Parses a chunk of code with a given module name, and updates parseQueue and dependencyMap.
    function parseCode(code: string, moduleName: string): void {
      const result = parseOnlyCalculateDeps(code, moduleName);
      completedParses.add(moduleName);

      // Add any additional modules to the parse queue;
      for (let i = 0; i < result.additionalModules.length; ++i) {
        if (!completedParses.has(result.additionalModules[i])) {
          parseQueue.push(result.additionalModules[i]);
        }
      }

      // Splice all the references in
      dependencyMap = Object.assign(dependencyMap, result.dependencyMap);
    }

    // Parse the initial module, which is the "main" script that is being run
    const initialModule = "__SPECIAL_INITIAL_MODULE__";
    parseCode(code, initialModule);

    // Process additional modules, which occurs if the "main" script has any imports
    while (parseQueue.length > 0) {
      const nextModule = parseQueue.shift();
      if (nextModule === undefined) throw new Error("nextModule should not be undefined");
      if (nextModule.startsWith("https://") || nextModule.startsWith("http://")) continue;

      let script = null;
      const fn = nextModule.startsWith("./") ? nextModule.slice(2) : nextModule;
      for (const s of otherScripts) {
        if (areImportsEquals(s.filename, fn)) {
          script = s;
          break;
        }
      }

      if (script == null) {
        return { cost: RamCalculationErrorCode.ImportError }; // No such script on the server
      }

      parseCode(script.code, nextModule);
    }

    // Finally, walk the reference map and generate a ram cost. The initial set of keys to scan
    // are those that start with __SPECIAL_INITIAL_MODULE__.
    let ram = RamCostConstants.ScriptBaseRamCost;
    const detailedCosts: RamUsageEntry[] = [
      { type: "misc", name: "baseCost", cost: RamCostConstants.ScriptBaseRamCost },
    ];
    const unresolvedRefs = Object.keys(dependencyMap).filter((s) => s.startsWith(initialModule));
    const resolvedRefs = new Set();
    const loadedFns: Record<string, boolean> = {};
    while (unresolvedRefs.length > 0) {
      const ref = unresolvedRefs.shift();
      if (ref === undefined) throw new Error("ref should not be undefined");

      // Check if this is one of the special keys, and add the appropriate ram cost if so.
      if (ref === "hacknet" && !resolvedRefs.has("hacknet")) {
        ram += RamCostConstants.ScriptHacknetNodesRamCost;
        detailedCosts.push({ type: "ns", name: "hacknet", cost: RamCostConstants.ScriptHacknetNodesRamCost });
      }
      if (ref === "document" && !resolvedRefs.has("document")) {
        ram += RamCostConstants.ScriptDomRamCost;
        detailedCosts.push({ type: "dom", name: "document", cost: RamCostConstants.ScriptDomRamCost });
      }
      if (ref === "window" && !resolvedRefs.has("window")) {
        ram += RamCostConstants.ScriptDomRamCost;
        detailedCosts.push({ type: "dom", name: "window", cost: RamCostConstants.ScriptDomRamCost });
      }
      if (ref === "corporation" && !resolvedRefs.has("corporation")) {
        ram += RamCostConstants.ScriptCorporationRamCost;
        detailedCosts.push({ type: "ns", name: "corporation", cost: RamCostConstants.ScriptCorporationRamCost });
      }

      resolvedRefs.add(ref);

      if (ref.endsWith(".*")) {
        // A prefix reference. We need to find all matching identifiers.
        const prefix = ref.slice(0, ref.length - 2);
        for (const ident of Object.keys(dependencyMap).filter((k) => k.startsWith(prefix))) {
          for (const dep of dependencyMap[ident] || []) {
            if (!resolvedRefs.has(dep)) unresolvedRefs.push(dep);
          }
        }
      } else {
        // An exact reference. Add all dependencies of this ref.
        for (const dep of dependencyMap[ref] || []) {
          if (!resolvedRefs.has(dep)) unresolvedRefs.push(dep);
        }
      }

      // Check if this identifier is a function in the workerScript environment.
      // If it is, then we need to get its RAM cost.
      try {
        function applyFuncRam(cost: number | (() => number)): number {
          if (typeof cost === "number") {
            return cost;
          } else if (typeof cost === "function") {
            return cost();
          } else {
            return 0;
          }
        }

        // Only count each function once
        if (loadedFns[ref]) {
          continue;
        }
        loadedFns[ref] = true;

        // This accounts for namespaces (Bladeburner, CodingContract, etc.)
        const findFunc = (
          prefix: string,
          obj: object,
          ref: string,
        ): { func: () => number | number; refDetail: string } | undefined => {
          if (!obj) return;
          const elem = Object.entries(obj).find(([key]) => key === ref);
          if (elem !== undefined && (typeof elem[1] === "function" || typeof elem[1] === "number")) {
            return { func: elem[1], refDetail: `${prefix}${ref}` };
          }
          for (const [key, value] of Object.entries(obj)) {
            const found = findFunc(`${key}.`, value, ref);
            if (found) return found;
          }
          return undefined;
        };

        const details = findFunc("", RamCosts, ref);
        const fnRam = applyFuncRam(details?.func ?? 0);
        ram += fnRam;
        detailedCosts.push({ type: "fn", name: details?.refDetail ?? "", cost: fnRam });
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    return { cost: ram, entries: detailedCosts.filter((e) => e.cost > 0) };
  } catch (error) {
    // console.info("parse or eval error: ", error);
    // This is not unexpected. The user may be editing a script, and it may be in
    // a transitory invalid state.
    return { cost: RamCalculationErrorCode.SyntaxError };
  }
}

export function checkInfiniteLoop(code: string): number {
  const ast = parse(code, { sourceType: "module", ecmaVersion: "latest" });

  function nodeHasTrueTest(node: acorn.Node): boolean {
    return node.type === "Literal" && (node as any).raw === "true";
  }

  function hasAwait(ast: acorn.Node): boolean {
    let hasAwait = false;
    walk.recursive(
      ast,
      {},
      {
        AwaitExpression: () => {
          hasAwait = true;
        },
      },
    );
    return hasAwait;
  }

  let missingAwaitLine = -1;
  walk.recursive(
    ast,
    {},
    {
      WhileStatement: (node: Node, st: unknown, walkDeeper: walk.WalkerCallback<any>) => {
        if (nodeHasTrueTest(node.test) && !hasAwait(node)) {
          missingAwaitLine = (code.slice(0, node.start).match(/\n/g) || []).length + 1;
        } else {
          node.body && walkDeeper(node.body, st);
        }
      },
    },
  );

  return missingAwaitLine;
}

interface ParseDepsResult {
  dependencyMap: {
    [key: string]: Set<string> | undefined;
  };
  additionalModules: string[];
}

/**
 * Helper function that parses a single script. It returns a map of all dependencies,
 * which are items in the code's AST that potentially need to be evaluated
 * for RAM usage calculations. It also returns an array of additional modules
 * that need to be parsed (i.e. are 'import'ed scripts).
 */
function parseOnlyCalculateDeps(code: string, currentModule: string): ParseDepsResult {
  const ast = parse(code, { sourceType: "module", ecmaVersion: "latest" });
  // Everything from the global scope goes in ".". Everything else goes in ".function", where only
  // the outermost layer of functions counts.
  const globalKey = currentModule + memCheckGlobalKey;
  const dependencyMap: { [key: string]: Set<string> | undefined } = {};
  dependencyMap[globalKey] = new Set<string>();

  // If we reference this internal name, we're really referencing that external name.
  // Filled when we import names from other modules.
  const internalToExternal: { [key: string]: string | undefined } = {};

  const additionalModules: string[] = [];

  // References get added pessimistically. They are added for thisModule.name, name, and for
  // any aliases.
  function addRef(key: string, name: string): void {
    const s = dependencyMap[key] || (dependencyMap[key] = new Set());
    const external = internalToExternal[name];
    if (external !== undefined) {
      s.add(external);
    }
    s.add(currentModule + "." + name);
    s.add(name); // For builtins like hack.
  }

  //A list of identifiers that resolve to "native Javascript code"
  const objectPrototypeProperties = Object.getOwnPropertyNames(Object.prototype);

  interface State {
    key: string;
  }

  // If we discover a dependency identifier, state.key is the dependent identifier.
  // walkDeeper is for doing recursive walks of expressions in composites that we handle.
  function commonVisitors(): walk.RecursiveVisitors<State> {
    return {
      Identifier: (node: Node, st: State) => {
        if (objectPrototypeProperties.includes(node.name)) {
          return;
        }
        addRef(st.key, node.name);
      },
      WhileStatement: (node: Node, st: State, walkDeeper: walk.WalkerCallback<State>) => {
        addRef(st.key, specialReferenceWHILE);
        node.test && walkDeeper(node.test, st);
        node.body && walkDeeper(node.body, st);
      },
      DoWhileStatement: (node: Node, st: State, walkDeeper: walk.WalkerCallback<State>) => {
        addRef(st.key, specialReferenceWHILE);
        node.test && walkDeeper(node.test, st);
        node.body && walkDeeper(node.body, st);
      },
      ForStatement: (node: Node, st: State, walkDeeper: walk.WalkerCallback<State>) => {
        addRef(st.key, specialReferenceFOR);
        node.init && walkDeeper(node.init, st);
        node.test && walkDeeper(node.test, st);
        node.update && walkDeeper(node.update, st);
        node.body && walkDeeper(node.body, st);
      },
      IfStatement: (node: Node, st: State, walkDeeper: walk.WalkerCallback<State>) => {
        addRef(st.key, specialReferenceIF);
        node.test && walkDeeper(node.test, st);
        node.consequent && walkDeeper(node.consequent, st);
        node.alternate && walkDeeper(node.alternate, st);
      },
      MemberExpression: (node: Node, st: State, walkDeeper: walk.WalkerCallback<State>) => {
        node.object && walkDeeper(node.object, st);
        node.property && walkDeeper(node.property, st);
      },
    };
  }

  walk.recursive<State>(
    ast,
    { key: globalKey },
    Object.assign(
      {
        ImportDeclaration: (node: Node, st: State) => {
          const importModuleName = node.source.value;
          additionalModules.push(importModuleName);

          // This module's global scope refers to that module's global scope, no matter how we
          // import it.
          const set = dependencyMap[st.key];
          if (set === undefined) throw new Error("set should not be undefined");
          set.add(importModuleName + memCheckGlobalKey);

          for (let i = 0; i < node.specifiers.length; ++i) {
            const spec = node.specifiers[i];
            if (spec.imported !== undefined && spec.local !== undefined) {
              // We depend on specific things.
              internalToExternal[spec.local.name] = importModuleName + "." + spec.imported.name;
            } else {
              // We depend on everything.
              const set = dependencyMap[st.key];
              if (set === undefined) throw new Error("set should not be undefined");
              set.add(importModuleName + ".*");
            }
          }
        },
        FunctionDeclaration: (node: Node) => {
          // node.id will be null when using 'export default'. Add a module name indicating the default export.
          const key = currentModule + "." + (node.id === null ? "__SPECIAL_DEFAULT_EXPORT__" : node.id.name);
          walk.recursive(node, { key: key }, commonVisitors());
        },
      },
      commonVisitors(),
    ),
  );

  return { dependencyMap: dependencyMap, additionalModules: additionalModules };
}

/**
 * Calculate's a scripts RAM Usage
 * @param {string} codeCopy - The script's code
 * @param {Script[]} otherScripts - All other scripts on the server.
 *                                  Used to account for imported scripts
 */
export function calculateRamUsage(codeCopy: string, otherScripts: Script[]): RamCalculation {
  try {
    return parseOnlyRamCalculate(otherScripts, codeCopy);
  } catch (e) {
    console.error(`Failed to parse script for RAM calculations:`);
    console.error(e);
    return { cost: RamCalculationErrorCode.SyntaxError };
  }
}
