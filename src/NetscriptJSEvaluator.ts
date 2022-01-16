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
import { computeHash } from "./utils/helpers/computeHash";
import { BlobCache } from "./utils/BlobCache";
import { ImportCache } from "./utils/ImportCache";
import { areImportsEquals } from "./Terminal/DirectoryHelpers";
import { IPlayer } from "./PersonObjects/IPlayer";

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

  const ns = workerScript.env.vars;

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

/** Returns whether we should compile the script parameter.
 *
 * @param {Script} script
 * @param {Script[]} scripts
 */
function shouldCompile(script: Script, scripts: Script[]): boolean {
  if (script.module === "") return true;
  return script.dependencies.some((dep) => {
    const depScript = scripts.find((s) => s.filename == dep.filename);

    // If the script is not present on the server, we should recompile, if only to get any necessary
    // compilation errors.
    if (!depScript) return true;

    const depIsMoreRecent = depScript.moduleSequenceNumber > script.moduleSequenceNumber;
    return depIsMoreRecent;
  });
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
  /** @type {ScriptUrl[]} */
  const urlStack = [];
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
          end: node.source.range[1] - 1
        });
      },
      ExportNamedDeclaration(node: any) {
        if (node.source) {
          importNodes.push({
            filename: node.source.value,
            start: node.source.range[0] + 1,
            end: node.source.range[1] - 1
          });
        }
      },
      ExportAllDeclaration(node: any) {
        if (node.source) {
          importNodes.push({
            filename: node.source.value,
            start: node.source.range[0] + 1,
            end: node.source.range[1] - 1
          });
        }
      }
    });
    // Sort the nodes from last start index to first. This replaces the last import with a blob first,
    // preventing the ranges for other imports from being shifted.
    importNodes.sort((a, b) => b.start - a.start);
    let transformedCode = script.code;
    // Loop through each node and replace the script name with a blob url.
    for (const node of importNodes) {
      const filename = node.filename.startsWith("./") ? node.filename.substring(2) : node.filename;

      // Find the corresponding script.
      const matchingScripts = scripts.filter((s) => areImportsEquals(s.filename, filename));
      if (matchingScripts.length === 0) continue;

      const [importedScript] = matchingScripts;
      // Check to see if the urls for this script are stored in the cache by the hash value.
      let urls = ImportCache.get(importedScript.hash());
      // If we don't have it in the cache, then we need to generate the urls for it.
      if (!urls) {
        // Try to get a URL for the requested script and its dependencies.
        urls = _getScriptUrls(importedScript, scripts, seen);
      }

      // The top url in the stack is the replacement import file for this script.
      urlStack.push(...urls);
      const blob = urls[urls.length - 1].url;
      ImportCache.store(importedScript.hash(), urls);

      // Replace the blob inside the import statement.
      transformedCode = transformedCode.substring(0, node.start) + blob + transformedCode.substring(node.end);
    }

    // We automatically define a print function() in the NetscriptJS module so that
    // accidental calls to window.print() do not bring up the "print screen" dialog
    transformedCode += `\n\nfunction print() {throw new Error("Invalid call to window.print(). Did you mean to use Netscript's print()?");}`;

    // If we successfully transformed the code, create a blob url for it
    // Compute the hash for the transformed code
    const transformedHash = computeHash(transformedCode);
    // Check to see if this transformed hash is in our cache
    let blob = BlobCache.get(transformedHash);
    if (!blob) {
      blob = URL.createObjectURL(makeScriptBlob(transformedCode));
    }
    // Store this blob in the cache. Any script that transforms the same
    // (e.g. same scripts on server, same hash value, etc) can use this blob url.
    BlobCache.store(transformedHash, blob);
    // Push the blob URL onto the top of the stack.
    urlStack.push(new ScriptUrl(script.filename, blob));
    return urlStack;
  } catch (err) {
    // If there is an error, we need to clean up the URLs.
    for (const url in urlStack) URL.revokeObjectURL(url);
    throw err;
  } finally {
    seen.pop();
  }
}
