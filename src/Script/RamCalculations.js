/**
 * Implements RAM Calculation functionality.
 *
 * Uses the acorn.js library to parse a script's code into an AST and
 * recursively walk through that AST, calculating RAM usage along
 * the way
 */
import * as walk from "acorn-walk";
import { parse } from "acorn";

import { RamCalculationErrorCode } from "./RamCalculationErrorCodes";

import { RamCosts, RamCostConstants } from "../Netscript/RamCostGenerator";

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
 * @param {string} codeCopy - The code being parsed
 * @param {WorkerScript} workerScript - Object containing RAM costs of Netscript functions. Also used to
 *                                      keep track of what functions have/havent been accounted for
 */
async function parseOnlyRamCalculate(otherScripts, code, workerScript) {
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
        let dependencyMap = {};

        // Scripts we've parsed.
        const completedParses = new Set();

        // Scripts we've discovered that need to be parsed.
        const parseQueue = [];

        // Parses a chunk of code with a given module name, and updates parseQueue and dependencyMap.
        function parseCode(code, moduleName) {
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

            // Additional modules can either be imported from the web (in which case we use
            // a dynamic import), or from other in-game scripts
            let code;
            if (nextModule.startsWith("https://") || nextModule.startsWith("http://")) {
                try {
                    const module = await eval('import(nextModule)');
                    code = "";
                    for (const prop in module) {
                        if (typeof module[prop] === 'function') {
                            code += module[prop].toString() + ";\n";
                        }
                    }
                } catch(e) {
                    console.error(`Error dynamically importing module from ${nextModule} for RAM calculations: ${e}`);
                    return RamCalculationErrorCode.URLImportError;
                }
            } else {
                if (!Array.isArray(otherScripts)) {
                    console.warn(`parseOnlyRamCalculate() not called with array of scripts`);
                    return RamCalculationErrorCode.ImportError;
                }

                let script = null;
                let fn = nextModule.startsWith("./") ? nextModule.slice(2) : nextModule;
                for (const s of otherScripts) {
                    if (s.filename === fn) {
                        script = s;
                        break;
                    }
                }

                if (script == null) {
                    return RamCalculationErrorCode.ImportError; // No such script on the server
                }

                code = script.code;
            }

            parseCode(code, nextModule);
        }

        // Finally, walk the reference map and generate a ram cost. The initial set of keys to scan
        // are those that start with __SPECIAL_INITIAL_MODULE__.
        let ram = RamCostConstants.ScriptBaseRamCost;
        const unresolvedRefs = Object.keys(dependencyMap).filter(s => s.startsWith(initialModule));
        const resolvedRefs = new Set();
        while (unresolvedRefs.length > 0) {
            const ref = unresolvedRefs.shift();

            // Check if this is one of the special keys, and add the appropriate ram cost if so.
            if (ref === "hacknet" && !resolvedRefs.has("hacknet")) {
                ram += RamCostConstants.ScriptHacknetNodesRamCost;
            }
            if (ref === "document" && !resolvedRefs.has("document")) {
                ram += RamCostConstants.ScriptDomRamCost;
            }
            if (ref === "window" && !resolvedRefs.has("window")) {
                ram += RamCostConstants.ScriptDomRamCost;
            }

            resolvedRefs.add(ref);

            if (ref.endsWith(".*")) {
                // A prefix reference. We need to find all matching identifiers.
                const prefix = ref.slice(0, ref.length - 2);
                for (let ident of Object.keys(dependencyMap).filter(k => k.startsWith(prefix))) {
                    for (let dep of dependencyMap[ident] || []) {
                        if (!resolvedRefs.has(dep)) unresolvedRefs.push(dep);
                    }
                }
            } else {
                // An exact reference. Add all dependencies of this ref.
                for (let dep of dependencyMap[ref] || []) {
                    if (!resolvedRefs.has(dep)) unresolvedRefs.push(dep);
                }
            }

            // Check if this identifier is a function in the workerScript environment.
            // If it is, then we need to get its RAM cost.
            try {
                function applyFuncRam(func) {
                    if (typeof func === "function") {
                        try {
                            let res;
                            if (func.constructor.name === "AsyncFunction") {
                                res = 0; // Async functions will always be 0 RAM
                            } else {
                                res = func.apply(null, []);
                            }
                            if (typeof res === "number") {
                                return res;
                            }
                            return 0;
                        } catch(e) {
                            console.error(`Error applying function: ${e}`);
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                }

                // Only count each function once
                if (workerScript.loadedFns[ref]) {
                    continue;
                } else {
                    workerScript.loadedFns[ref] = true;
                }

                // This accounts for namespaces (Bladeburner, CodingCpntract, etc.)
                let func;
                if (ref in workerScript.env.vars.bladeburner) {
                    func = workerScript.env.vars.bladeburner[ref];
                } else if (ref in workerScript.env.vars.codingcontract) {
                    func = workerScript.env.vars.codingcontract[ref];
                } else if (ref in workerScript.env.vars.gang) {
                    func = workerScript.env.vars.gang[ref];
                } else if (ref in workerScript.env.vars.sleeve) {
                    func = workerScript.env.vars.sleeve[ref];
                } else {
                    func = workerScript.env.vars[ref];
                }
                ram += applyFuncRam(func);
            } catch (error) {continue;}
        }
        return ram;

    } catch (error) {
        // console.info("parse or eval error: ", error);
        // This is not unexpected. The user may be editing a script, and it may be in
        // a transitory invalid state.
        return RamCalculationErrorCode.SyntaxError;
    }
}

/**
 * Helper function that parses a single script. It returns a map of all dependencies,
 * which are items in the code's AST that potentially need to be evaluated
 * for RAM usage calculations. It also returns an array of additional modules
 * that need to be parsed (i.e. are 'import'ed scripts).
 */
function parseOnlyCalculateDeps(code, currentModule) {
    const ast = parse(code, {sourceType:"module", ecmaVersion: 9});

    // Everything from the global scope goes in ".". Everything else goes in ".function", where only
    // the outermost layer of functions counts.
    const globalKey = currentModule + memCheckGlobalKey;
    const dependencyMap = {};
    dependencyMap[globalKey] = new Set();

    // If we reference this internal name, we're really referencing that external name.
    // Filled when we import names from other modules.
    let internalToExternal = {};

    var additionalModules = [];

    // References get added pessimistically. They are added for thisModule.name, name, and for
    // any aliases.
    function addRef(key, name) {
        const s = dependencyMap[key] || (dependencyMap[key] = new Set());
        if (name in internalToExternal) {
            s.add(internalToExternal[name]);
        }
        s.add(currentModule + "." + name);
        s.add(name);  // For builtins like hack.
    }

    //A list of identifiers that resolve to "native Javascript code"
    const objectPrototypeProperties = Object.getOwnPropertyNames(Object.prototype);

    // If we discover a dependency identifier, state.key is the dependent identifier.
    // walkDeeper is for doing recursive walks of expressions in composites that we handle.
    function commonVisitors() {
        return {
            Identifier: (node, st) => {
                if (objectPrototypeProperties.includes(node.name)) {return;}
                addRef(st.key, node.name);
            },
            WhileStatement: (node, st, walkDeeper) => {
                addRef(st.key, specialReferenceWHILE);
                node.test && walkDeeper(node.test, st);
                node.body && walkDeeper(node.body, st);
            },
            DoWhileStatement: (node, st, walkDeeper) => {
                addRef(st.key, specialReferenceWHILE);
                node.test && walkDeeper(node.test, st);
                node.body && walkDeeper(node.body, st);
            },
            ForStatement: (node, st, walkDeeper) => {
                addRef(st.key, specialReferenceFOR);
                node.init && walkDeeper(node.init, st);
                node.test && walkDeeper(node.test, st);
                node.update && walkDeeper(node.update, st);
                node.body && walkDeeper(node.body, st);
            },
            IfStatement: (node, st, walkDeeper) => {
                addRef(st.key, specialReferenceIF);
                node.test && walkDeeper(node.test, st);
                node.consequent && walkDeeper(node.consequent, st);
                node.alternate && walkDeeper(node.alternate, st);
            },
            MemberExpression: (node, st, walkDeeper) => {
                node.object && walkDeeper(node.object, st);
                node.property && walkDeeper(node.property, st);
            },
        }
    }

    walk.recursive(ast, {key: globalKey}, Object.assign({
        ImportDeclaration: (node, st) => {
            const importModuleName = node.source.value;
            additionalModules.push(importModuleName);

            // This module's global scope refers to that module's global scope, no matter how we
            // import it.
            dependencyMap[st.key].add(importModuleName + memCheckGlobalKey);

            for (let i = 0; i < node.specifiers.length; ++i) {
                const spec = node.specifiers[i];
                if (spec.imported !== undefined && spec.local !== undefined) {
                    // We depend on specific things.
                    internalToExternal[spec.local.name] = importModuleName + "." + spec.imported.name;
                } else {
                    // We depend on everything.
                    dependencyMap[st.key].add(importModuleName + ".*");
                }
            }
        },
        FunctionDeclaration: (node) => {
            const key = currentModule + "." + node.id.name;
            walk.recursive(node, {key: key}, commonVisitors());
        },
    }, commonVisitors()));

    return {dependencyMap: dependencyMap, additionalModules: additionalModules};
}

/**
 * Calculate's a scripts RAM Usage
 * @param {string} codeCopy - The script's code
 * @param {Script[]} otherScripts - All other scripts on the server.
 *                                  Used to account for imported scripts
 */
export async function calculateRamUsage(codeCopy, otherScripts) {
    // We don't need a real WorkerScript for this. Just an object that keeps
    // track of whatever's needed for RAM calculations
    const workerScript = {
        loadedFns: {},
        env: {
            vars: RamCosts,
        },
    }

    try {
        return await parseOnlyRamCalculate(otherScripts, codeCopy, workerScript);
	} catch (e) {
        console.error(`Failed to parse script for RAM calculations:`);
        console.error(e);
        return RamCalculationErrorCode.SyntaxError;
	}

    return RamCalculationErrorCode.SyntaxError;
}
