// Calculate a script's RAM usage
const walk = require("acorn/dist/walk"); // Importing this doesn't work for some reason.

import { CONSTANTS }                            from "../Constants";
import {evaluateImport}                         from "../NetscriptEvaluator";
import { WorkerScript }                         from "../NetscriptWorker";
import { Player }                               from "../Player";
import {parse, Node}                            from "../../utils/acorn";

// These special strings are used to reference the presence of a given logical
// construct within a user script.
const specialReferenceIF = "__SPECIAL_referenceIf";
const specialReferenceFOR = "__SPECIAL_referenceFor";
const specialReferenceWHILE = "__SPECIAL_referenceWhile";

// The global scope of a script is registered under this key during parsing.
const memCheckGlobalKey = ".__GLOBAL__";

// Calcluates the amount of RAM a script uses. Uses parsing and AST walking only,
// rather than NetscriptEvaluator. This is useful because NetscriptJS code does
// not work under NetscriptEvaluator.
async function parseOnlyRamCalculate(server, code, workerScript) {
    try {
        // Maps dependent identifiers to their dependencies.
        //
        // The initial identifier is __SPECIAL_INITIAL_MODULE__.__GLOBAL__.
        // It depends on all the functions declared in the module, all the global scopes
        // of its imports, and any identifiers referenced in this global scope. Each
        // function depends on all the identifiers referenced internally.
        // We walk the dependency graph to calculate RAM usage, given that some identifiers
        // reference Netscript functions which have a RAM cost.
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

            // Splice all the references in.
            //Spread syntax not supported in edge, use Object.assign instead
            //dependencyMap = {...dependencyMap, ...result.dependencyMap};
            dependencyMap = Object.assign(dependencyMap, result.dependencyMap);
        }

        const initialModule = "__SPECIAL_INITIAL_MODULE__";
        parseCode(code, initialModule);

        while (parseQueue.length > 0) {
            // Get the code from the server.
            const nextModule = parseQueue.shift();

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
                    return -1;
                }
            } else {
                const script = server.getScript(nextModule.startsWith("./") ? nextModule.slice(2) : nextModule);
                if (!script) {
                    console.warn("Invalid script");
                    return -1;  // No such script on the server.
                }
                code = script.code;
            }

            parseCode(code, nextModule);
        }

        // Finally, walk the reference map and generate a ram cost. The initial set of keys to scan
        // are those that start with __SPECIAL_INITIAL_MODULE__.
        let ram = CONSTANTS.ScriptBaseRamCost;
        const unresolvedRefs = Object.keys(dependencyMap).filter(s => s.startsWith(initialModule));
        const resolvedRefs = new Set();
        while (unresolvedRefs.length > 0) {
            const ref = unresolvedRefs.shift();

            // Check if this is one of the special keys, and add the appropriate ram cost if so.
            if (ref === "hacknet" && !resolvedRefs.has("hacknet")) {
                ram += CONSTANTS.ScriptHacknetNodesRamCost;
            }
            if (ref === "document" && !resolvedRefs.has("document")) {
                ram += CONSTANTS.ScriptDomRamCost;
            }
            if (ref === "window" && !resolvedRefs.has("window")) {
                ram += CONSTANTS.ScriptDomRamCost;
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

            // Check if this ident is a function in the workerscript env. If it is, then we need to
            // get its RAM cost. We do this by calling it, which works because the running script
            // is in checkingRam mode.
            //
            // TODO it would be simpler to just reference a dictionary.
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
                            console.log("ERROR applying function: " + e);
                            return 0;
                        }
                    } else {
                        return 0;
                    }
                }

                //Special logic for namespaces (Bladeburner, CodingCOntract)
                var func;
                if (ref in workerScript.env.vars.bladeburner) {
                    func = workerScript.env.vars.bladeburner[ref];
                } else if (ref in workerScript.env.vars.codingcontract) {
                    func = workerScript.env.vars.codingcontract[ref];
                } else if (ref in workerScript.env.vars.gang) {
                    func = workerScript.env.vars.gang[ref];
                } else if (ref in workerScript.env.vars.sleeve) {
                    func = workerScript.env.vars.sleeve[ref];
                } else {
                    func = workerScript.env.get(ref);
                }
                ram += applyFuncRam(func);
            } catch (error) {continue;}
        }
        return ram;

    } catch (error) {
        // console.info("parse or eval error: ", error);
        // This is not unexpected. The user may be editing a script, and it may be in
        // a transitory invalid state.
        return -1;
    }
}

// Parses one script and calculates its ram usage, for the global scope and each function.
// Returns a cost map and a dependencyMap for the module. Returns a reference map to be joined
// onto the main reference map, and a list of modules that need to be parsed.
function parseOnlyCalculateDeps(code, currentModule) {
    const ast = parse(code, {sourceType:"module", ecmaVersion: 8});

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
            Identifier: (node, st, walkDeeper) => {
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

    //Spread syntax not supported in Edge yet, use Object.assign
    /*
    walk.recursive(ast, {key: globalKey}, {
        ImportDeclaration: (node, st, walkDeeper) => {
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
        FunctionDeclaration: (node, st, walkDeeper) => {
            // Don't use walkDeeper, because we are changing the visitor set.
            const key = currentModule + "." + node.id.name;
            walk.recursive(node, {key: key}, commonVisitors());
        },
        ...commonVisitors()
    });
    */
    walk.recursive(ast, {key: globalKey}, Object.assign({
        ImportDeclaration: (node, st, walkDeeper) => {
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
        FunctionDeclaration: (node, st, walkDeeper) => {
            // Don't use walkDeeper, because we are changing the visitor set.
            const key = currentModule + "." + node.id.name;
            walk.recursive(node, {key: key}, commonVisitors());
        },
    }, commonVisitors()));

    return {dependencyMap: dependencyMap, additionalModules: additionalModules};
}

export async function calculateRamUsage(codeCopy) {
    //Create a temporary/mock WorkerScript and an AST from the code
    var currServ = Player.getCurrentServer();
    var workerScript = new WorkerScript({
        filename:"foo",
        scriptRef: {code:""},
        args:[],
        getCode: function() { return ""; }
    });
    workerScript.checkingRam = true; //Netscript functions will return RAM usage
    workerScript.serverIp = currServ.ip;

    try {
        return await parseOnlyRamCalculate(currServ, codeCopy, workerScript);
	} catch (e) {
        console.log("Failed to parse ram using new method. Falling back.", e);
	}

    // Try the old way.

    try {
        var ast = parse(codeCopy, {sourceType:"module"});
    } catch(e) {
        return -1;
    }

    //Search through AST, scanning for any 'Identifier' nodes for functions, or While/For/If nodes
    var queue = [], ramUsage = CONSTANTS.ScriptBaseRamCost;
    var whileUsed = false, forUsed = false, ifUsed = false;
    queue.push(ast);
    while (queue.length != 0) {
        var exp = queue.shift();
        switch (exp.type) {
            case "ImportDeclaration":
                //Gets an array of all imported functions as AST expressions
                //and pushes them on the queue.
                var res = evaluateImport(exp, workerScript, true);
                for (var i = 0; i < res.length; ++i) {
                    queue.push(res[i]);
                }
                break;
            case "BlockStatement":
            case "Program":
                for (var i = 0; i < exp.body.length; ++i) {
                    if (exp.body[i] instanceof Node) {
                        queue.push(exp.body[i]);
                    }
                }
                break;
            case "WhileStatement":
                if (!whileUsed) {
                    ramUsage += CONSTANTS.ScriptWhileRamCost;
                    whileUsed = true;
                }
                break;
            case "ForStatement":
                if (!forUsed) {
                    ramUsage += CONSTANTS.ScriptForRamCost;
                    forUsed = true;
                }
                break;
            case "IfStatement":
                if (!ifUsed) {
                    ramUsage += CONSTANTS.ScriptIfRamCost;
                    ifUsed = true;
                }
                break;
            case "Identifier":
                if (exp.name in workerScript.env.vars) {
                    var func = workerScript.env.get(exp.name);
                    if (typeof func === "function") {
                        try {
                            var res = func.apply(null, []);
                            if (typeof res === "number") {
                                ramUsage += res;
                            }
                        } catch(e) {
                            console.log("ERROR applying function: " + e);
                        }
                    }
                }
                break;
            default:
                break;
        }

        for (var prop in exp) {
            if (exp.hasOwnProperty(prop)) {
                if (exp[prop] instanceof Node) {
                    queue.push(exp[prop]);
                }
            }
        }
    }

    //Special case: hacknetnodes array
    if (codeCopy.includes("hacknet")) {
        ramUsage += CONSTANTS.ScriptHacknetNodesRamCost;
    }
    return ramUsage;
}
