import { makeRuntimeRejectMsg } from "./NetscriptEvaluator";
import { ScriptUrl } from "./Script/ScriptUrl";
import { WorkerScript } from "./Netscript/WorkerScript";
import { Script } from "./Script/Script";

// Makes a blob that contains the code of a given script.
function makeScriptBlob(code: string): Blob {
  return new Blob([code], { type: "text/javascript" });
}

// Begin executing a user JS script, and return a promise that resolves
// or rejects when the script finishes.
// - script is a script to execute (see Script.js). We depend only on .filename and .code.
// scripts is an array of other scripts on the server.
// env is the global environment that should be visible to all the scripts
// (i.e. hack, grow, etc.).
// When the promise returned by this resolves, we'll have finished
// running the main function of the script.
export async function executeJSScript(scripts: Script[] = [], workerScript: WorkerScript): Promise<void> {
  let uurls: ScriptUrl[] = [];
  const script = workerScript.getScript();
  if (script === null) throw new Error("script is null");
  if (shouldCompile(script, scripts)) {
    // The URL at the top is the one we want to import. It will
    // recursively import all the other modules in the urlStack.
    //
    // Webpack likes to turn the import into a require, which sort of
    // but not really behaves like import. Particularly, it cannot
    // load fully dynamic content. So we hide the import from webpack
    // by placing it inside an eval call.
    await script.updateRamUsage(scripts);
    workerScript.ramUsage = script.ramUsage;
    uurls = _getScriptUrls(script, scripts, []);
    script.url = uurls[uurls.length - 1].url;
    script.module = new Promise((resolve) => resolve(eval("import(uurls[uurls.length - 1].url)")));
    script.dependencies = uurls;
  }
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
    let transformedCode = script.code.replace(
      /((?:from|import)\s+(?:'|"))(?:\.\/)?([^'"]+)('|")/g,
      (unmodified, prefix, filename, suffix) => {
        const isAllowedImport = scripts.some((s) => s.filename == filename);
        if (!isAllowedImport) return unmodified;

        // Find the corresponding script.
        const [importedScript] = scripts.filter((s) => s.filename == filename);

        // Try to get a URL for the requested script and its dependencies.
        const urls = _getScriptUrls(importedScript, scripts, seen);

        // The top url in the stack is the replacement import file for this script.
        urlStack.push(...urls);
        return [prefix, urls[urls.length - 1].url, suffix].join("");
      },
    );

    // We automatically define a print function() in the NetscriptJS module so that
    // accidental calls to window.print() do not bring up the "print screen" dialog
    transformedCode += `\n\nfunction print() {throw new Error("Invalid call to window.print(). Did you mean to use Netscript's print()?");}`;

    // If we successfully transformed the code, create a blob url for it and
    // push that URL onto the top of the stack.
    urlStack.push(new ScriptUrl(script.filename, URL.createObjectURL(makeScriptBlob(transformedCode))));
    return urlStack;
  } catch (err) {
    // If there is an error, we need to clean up the URLs.
    for (const url in urlStack) URL.revokeObjectURL(url);
    throw err;
  } finally {
    seen.pop();
  }
}
