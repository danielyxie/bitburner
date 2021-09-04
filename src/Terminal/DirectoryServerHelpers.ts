/**
 * Helper functions that implement "directory" functionality in the Terminal.
 * These aren't "real" directories, it's more of a pseudo-directory implementation
 * that uses mainly string manipulation.
 *
 * This file contains function that deal with Server-related directory things.
 * Functions that deal with the string manipulation can be found in
 * ./DirectoryHelpers.ts
 */
import {
  isValidDirectoryPath,
  isInRootDirectory,
  getFirstParentDirectory,
} from "./DirectoryHelpers";
import { BaseServer } from "../Server/BaseServer";

/**
 * Given a directory (by the full directory path) and a server, returns all
 * subdirectories of that directory. This is only for FIRST-LEVEl/immediate subdirectories
 */
export function getSubdirectories(serv: BaseServer, dir: string): string[] {
  const res: string[] = [];

  if (!isValidDirectoryPath(dir)) {
    return res;
  }

  let t_dir = dir;
  if (!t_dir.endsWith("/")) {
    t_dir += "/";
  }

  function processFile(fn: string): void {
    if (t_dir === "/" && isInRootDirectory(fn)) {
      const subdir = getFirstParentDirectory(fn);
      if (subdir !== "/" && !res.includes(subdir)) {
        res.push(subdir);
      }
    } else if (fn.startsWith(t_dir)) {
      const remaining = fn.slice(t_dir.length);
      const subdir = getFirstParentDirectory(remaining);
      if (subdir !== "/" && !res.includes(subdir)) {
        res.push(subdir);
      }
    }
  }

  for (const script of serv.scripts) {
    processFile(script.filename);
  }

  for (const txt of serv.textFiles) {
    processFile(txt.fn);
  }

  return res;
}
