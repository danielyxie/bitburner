import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { isScriptFilename } from "../../Script/isScriptFilename";
import FileSaver from "file-saver";
import JSZip from "jszip";

export function exportScripts(pattern: string, server: BaseServer): void {
  const matchEnding = pattern.length == 1 || pattern === "*.*" ? null : pattern.slice(1); // Treat *.* the same as *
  const zip = new JSZip();
  // Helper function to zip any file contents whose name matches the pattern
  const zipFiles = (fileNames: string[], fileContents: string[]): void => {
    for (let i = 0; i < fileContents.length; ++i) {
      let name = fileNames[i];
      if (name.startsWith("/")) name = name.slice(1);
      if (!matchEnding || name.endsWith(matchEnding))
        zip.file(name, new Blob([fileContents[i]], { type: "text/plain" }));
    }
  };
  // In the case of script files, we pull from the server.scripts array
  if (!matchEnding || isScriptFilename(matchEnding))
    zipFiles(
      server.scripts.map((s) => s.filename),
      server.scripts.map((s) => s.code),
    );
  // In the case of text files, we pull from the server.scripts array
  if (!matchEnding || matchEnding.endsWith(".txt"))
    zipFiles(
      server.textFiles.map((s) => s.fn),
      server.textFiles.map((s) => s.text),
    );

  // Return an error if no files matched, rather than an empty zip folder
  if (Object.keys(zip.files).length == 0) throw new Error(`No files match the pattern ${pattern}`);
  const zipFn = `bitburner${isScriptFilename(pattern) ? "Scripts" : pattern === "*.txt" ? "Texts" : "Files"}.zip`;
  zip.generateAsync({ type: "blob" }).then((content: any) => FileSaver.saveAs(content, zipFn));
}

export function download(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  try {
    if (args.length !== 1) {
      terminal.error("Incorrect usage of download command. Usage: download [script/text file]");
      return;
    }
    const fn = args[0] + "";
    // If the parameter starts with *, download all files that match the wildcard pattern
    if (fn.startsWith("*")) {
      try {
        exportScripts(fn, server);
        return;
      } catch (e: unknown) {
        let msg = String(e);
        if (e !== null && typeof e == "object" && e.hasOwnProperty("message")) {
          msg = String((e as { message: unknown }).message);
        }
        return terminal.error(msg);
      }
    } else if (isScriptFilename(fn)) {
      // Download a single script
      const script = terminal.getScript(player, fn);
      if (script != null) {
        return script.download();
      }
    } else if (fn.endsWith(".txt")) {
      // Download a single text file
      const txt = terminal.getTextFile(player, fn);
      if (txt != null) {
        return txt.download();
      }
    } else {
      terminal.error(`Cannot download this filetype`);
      return;
    }
    terminal.error(`${fn} does not exist`);
    return;
  } catch (e) {
    terminal.error(e + "");
    return;
  }
}
