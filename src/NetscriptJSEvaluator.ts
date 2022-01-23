/**
 * Uses the acorn.js library to parse a script's code into an AST and
 * recursively walk through that AST to replace import urls with blobs
 */
import * as walk from "acorn-walk";
import { parse } from "acorn";

import { makeRuntimeRejectMsg } from "./NetscriptEvaluator";
import { ScriptUrl } from "./Script/ScriptUrl";
import { WorkerScript } from "./Netscript/WorkerScript";
import { Script } from "./Script/Script";
import { areImportsEquals } from "./Terminal/DirectoryHelpers";
import { IPlayer } from "./PersonObjects/IPlayer";
import {NsImportCache} from './utils/NsImportCache';
import {RamCosts} from './Netscript/RamCostGenerator';
import {Settings} from './Settings/Settings';


const nsSymbol = Symbol.for('ns');
class NS{
  private constructor() {
    //do nothing
  }
}
// Put the NS class onto the document so it's accessible from the NS modules
// @ts-ignore
document[nsSymbol] = NS;


// Makes a blob that contains the code of a given script.
function makeScriptBlob(code: string): Blob {
  return new Blob([code], { type: "text/javascript" });
}

export async function compile(player: IPlayer, script: Script, scripts: Script[]): Promise<void> {
  if (!shouldCompile(script, scripts)) return;
  // The URL at the top is the one we want to import. It will
  // recursively import all the other modules in the urlStack.
  //
  // Webpack likes to turn the import into a require, which sort of
  // but not really behaves like import. Particularly, it cannot
  // load fully dynamic content. So we hide the import from webpack
  // by placing it inside an eval call.
  await script.updateRamUsage(player, scripts);
  const uurls = _getScriptUrls(script, scripts, []);
  const url = uurls[uurls.length - 1].url;
  if (script.url && script.url !== url) {
    // Thoughts: Should we be revoking any URLs here?
    // If a script is modified repeatedly between two states,
    // we could reuse the blob at a later time.
    // BlobCache.removeByValue(script.url);
    // URL.revokeObjectURL(script.url);
    // if (script.dependencies.length > 0) {
    //   script.dependencies.forEach((dep) => {
    //     removeBlobFromCache(dep.url);
    //     URL.revokeObjectURL(dep.url);
    //   });
    // }
  }
  script.url = url;
  script.module = new Promise((resolve) => resolve(eval("import(url)")));
  script.dependencies = uurls;
}

// Begin executing a user JS script, and return a promise that resolves
// or rejects when the script finishes.
// - script is a script to execute (see Script.js). We depend only on .filename and .code.
// scripts is an array of other scripts on the server.
// env is the global environment that should be visible to all the scripts
// (i.e. hack, grow, etc.).
// When the promise returned by this resolves, we'll have finished
// running the main function of the script.
export async function executeJSScript(
  player: IPlayer,
  scripts: Script[] = [],
  workerScript: WorkerScript,
): Promise<void> {
  const script = workerScript.getScript();
  if (script === null) throw new Error("script is null");
  await compile(player, script, scripts);
  workerScript.ramUsage = script.ramUsage;
  const loadedModule = await script.module;

  let ns = workerScript.env.vars;
  if(Settings.AlternateStaticRamAlgorithm){
    // If using the alternate RAM algorithm, wrap NS in a proxy that detects old-style calls and instructs them on how
    //  to replace them

    function proxyFor(original: any, name: string, module: string, prototype?: any): any {
      return new Proxy(original, {
        // Override so `xyz instanceof NS` checks work
        // eslint-disable-next-line
        getPrototypeOf(target: any): object | null {
          return prototype ?? Object.getPrototypeOf(target);
        },
        get(target: any, key: string | symbol){
          if(key === nsSymbol)
            return original;
          if(typeof key === 'symbol')
            return original[key];
          if(module === 'ns' && key === 'args'){
            throw makeRuntimeRejectMsg(workerScript,
              `Cannot get ns.args. New syntax is required with the alt static RAM algorithm:\n` +
              `import {getArgs} from "ns";\n` +
              `...\n` +
              `getArgs(ns)`
            );
          }
          const value = original[key];
          if(typeof value === 'function'){
            throw makeRuntimeRejectMsg(workerScript,
              `Cannot call ${name}.${key}. New syntax is required with the alt static RAM algorithm:\n` +
              `import {${key}} from "${module}";\n` +
              `...\n` +
              `${key}(ns, ...)`
            );
          }
          if(typeof value === 'object' && value != null)
            return proxyFor(original[key], `${name}.${key}`, `${module}/${key}`);
          return original[key];
        }
      });
    }

    ns = proxyFor(ns, 'ns', 'ns', NS.prototype);
  }

  // TODO: putting await in a non-async function yields unhelpful
  // "SyntaxError: unexpected reserved word" with no line number information.
  if (!loadedModule.main) {
    throw makeRuntimeRejectMsg(
      workerScript,
      `${script.filename} cannot be run because it does not have a main function.`,
    );
  }
  return loadedModule.main(ns);
}

function isDependencyOutOfDate(filename: string, scripts: Script[], scriptModuleSequenceNumber: number): boolean {
  const depScript = scripts.find((s) => s.filename == filename);

  // If the script is not present on the server, we should recompile, if only to get any necessary
  // compilation errors.
  if (!depScript) return true;

  const depIsMoreRecent = depScript.moduleSequenceNumber > scriptModuleSequenceNumber;
  return depIsMoreRecent;
}
/** Returns whether we should compile the script parameter.
 *
 * @param {Script} script
 * @param {Script[]} scripts
 */
function shouldCompile(script: Script, scripts: Script[]): boolean {
  if (script.module === "") return true;
  return script.dependencies.some((dep) => isDependencyOutOfDate(dep.filename, scripts, script.moduleSequenceNumber));
}

// Gets a stack of blob urls, the top/right-most element being
// the blob url for the named script on the named server.
//
// - script -- the script for whom we are getting a URL.
// - scripts -- all the scripts available on this server
// - seen -- The modules above this one -- to prevent mutual dependency.
//
// TODO We don't make any effort to cache a given module when it is imported at
// different parts of the tree. That hasn't presented any problem with during
// testing, but it might be an idea for the future. Would require a topo-sort
// then url-izing from leaf-most to root-most.
/**
 * @param {Script} script
 * @param {Script[]} scripts
 * @param {Script[]} seen
 * @returns {ScriptUrl[]} All of the compiled scripts, with the final one
 *                         in the list containing the blob corresponding to
 *                         the script parameter.
 */
// BUG: apparently seen is never consulted. Oops.
function _getScriptUrls(script: Script, scripts: Script[], seen: Script[]): ScriptUrl[] {
  // Inspired by: https://stackoverflow.com/a/43834063/91401
  const urlStack: ScriptUrl[] = [];
  // Seen contains the dependents of the current script. Make sure we include that in the script dependents.
  for (const dependent of seen) {
    if (!script.dependents.some((s) => s.server === dependent.server && s.filename == dependent.filename)) {
      script.dependents.push({ server: dependent.server, filename: dependent.filename });
    }
  }
  seen.push(script);
  try {
    // Replace every import statement with an import to a blob url containing
    // the corresponding script. E.g.
    //
    // import {foo} from "bar.js";
    //
    // becomes
    //
    // import {foo} from "blob://<uuid>"
    //
    // Where the blob URL contains the script content.

    // Parse the code into an ast tree
    const ast: any = parse(script.code, { sourceType: "module", ecmaVersion: "latest", ranges: true });

    const importNodes: Array<any> = [];
    // Walk the nodes of this tree and find any import declaration statements.
    walk.simple(ast, {
      ImportDeclaration(node: any) {
        // Push this import onto the stack to replace
        importNodes.push({
          filename: node.source.value,
          start: node.source.range[0] + 1,
          end: node.source.range[1] - 1,
        });
      },
      ExportNamedDeclaration(node: any) {
        if (node.source) {
          importNodes.push({
            filename: node.source.value,
            start: node.source.range[0] + 1,
            end: node.source.range[1] - 1,
          });
        }
      },
      ExportAllDeclaration(node: any) {
        if (node.source) {
          importNodes.push({
            filename: node.source.value,
            start: node.source.range[0] + 1,
            end: node.source.range[1] - 1,
          });
        }
      },
    });
    // Sort the nodes from last start index to first. This replaces the last import with a blob first,
    // preventing the ranges for other imports from being shifted.
    importNodes.sort((a, b) => b.start - a.start);
    let transformedCode = script.code;
    // Loop through each node and replace the script name with a blob url.
    outer:
    for (const node of importNodes) {
      let blob;
      const match = node.filename.match(/^ns(?:\/(.+))?$/);
      if(match){
        const namespace = match[1];
        blob = NsImportCache.get(namespace);
        if(!blob){
          const namespacePath = namespace ? namespace.split('/') : [];

          let funcs = RamCosts;
          for(const key of namespacePath){
            funcs = funcs[key];
            if(typeof funcs !== 'object' || funcs == null)
              continue outer;
          }

          let code = [
            "const nsSymbol = Symbol.for('ns');",
            "function _redefine(obj, key, value){",
            "  Object.defineProperty(obj, key, {",
            "    ...Object.getOwnPropertyDescriptor(obj, key),",
            "    value",
            "  });",
            "}"
          ].join("\n");
          if(!namespace) {
            code += [
              "export const NS = document[nsSymbol];",
              "export function getArgs(ns){ return ns[nsSymbol].args; }"
            ].join("\n");
          }

          code += Object.entries(funcs)
            .filter(([, func]) => {
              return typeof func === 'number' || typeof func === 'function';
            })
            .map(([key, ]) => {
              if(!key.match(/^[a-zA-Z$_][a-zA-Z$_0-9]*$/))
                throw new Error(`Key ${JSON.stringify(key)} is not valid identifier?!`);

              // note: this is only safe because we've already confirmed that the identifier doesn't contain special
              //  chars/spaces
              function isReserved(key: string): boolean {
                try{
                  eval(`let ${key};`);
                  return false;
                }catch(err){
                  return true;
                }
              }

              let nsKey = key;
              if(namespacePath.length > 0)
                nsKey = `${namespacePath.join('.')}.${nsKey}`;
              const lines = [];
              // we have to do some special gymnastics to support reserved words (e.g. heart.break)
              if(isReserved(key)){
                lines.push(
                  `function ${key}_(ns, ...args){ return ns[nsSymbol].${nsKey}(...args); }`,
                  `_redefine(${key}_, 'name', '${key}');`,
                  `export {${key}_ as ${key}};`
                );
              }else{
                lines.push(`export function ${key}(ns, ...args){ return ns[nsSymbol].${nsKey}(...args); }`);
              }
              return lines.join("\n");
            })
            .join('\n');
          blob = URL.createObjectURL(makeScriptBlob(code));
          NsImportCache.store(namespace, blob);
        }
      }else{
        const filename = node.filename.startsWith("./") ? node.filename.substring(2) : node.filename;

        // Find the corresponding script.
        const matchingScripts = scripts.filter((s) => areImportsEquals(s.filename, filename));
        if (matchingScripts.length === 0) continue;

        const [importedScript] = matchingScripts;

        const urls = _getScriptUrls(importedScript, scripts, seen);

        // The top url in the stack is the replacement import file for this script.
        urlStack.push(...urls);
        blob = urls[urls.length - 1].url;
      }

      // Replace the blob inside the import statement.
      transformedCode = transformedCode.substring(0, node.start) + blob + transformedCode.substring(node.end);
    }

    // We automatically define a print function() in the NetscriptJS module so that
    // accidental calls to window.print() do not bring up the "print screen" dialog
    transformedCode += `\n\nfunction print() {throw new Error("Invalid call to window.print(). Did you mean to use Netscript's print()?");}`;

    const blob = URL.createObjectURL(makeScriptBlob(transformedCode));
    // Push the blob URL onto the top of the stack.
    urlStack.push(new ScriptUrl(script.filename, blob, script.moduleSequenceNumber));
    return urlStack;
  } catch (err) {
    // If there is an error, we need to clean up the URLs.
    for (const url of urlStack) URL.revokeObjectURL(url.url);
    throw err;
  } finally {
    seen.pop();
  }
}
