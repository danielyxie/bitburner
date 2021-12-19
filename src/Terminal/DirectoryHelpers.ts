/**
 * Helper functions that implement "directory" functionality in the Terminal.
 * These aren't "real" directories, it's more of a pseudo-directory implementation
 * that uses mainly string manipulation.
 *
 * This file contains functions that deal only with that string manipulation.
 * Functions that need to access/process Server-related things can be
 * found in ./DirectoryServerHelpers.ts
 */

/**
 * Removes leading forward slash ("/") from a string.
 */
export function removeLeadingSlash(s: string): string {
  if (s.startsWith("/")) {
    return s.slice(1);
  }

  return s;
}

/**
 * Removes trailing forward slash ("/") from a string.
 * Note that this will also remove the slash if it is the leading slash (i.e. if s = "/")
 */
export function removeTrailingSlash(s: string): string {
  if (s.endsWith("/")) {
    return s.slice(0, -1);
  }

  return s;
}

/**
 * Checks whether a string is a valid filename. Only used for the filename itself,
 * not the entire filepath
 */
function isValidFilename(filename: string): boolean {
  // Allows alphanumerics, hyphens, underscores, and percentage signs
  // Must have a file extension
  const regex = /^[.a-zA-Z0-9_-]+[.][a-zA-Z0-9]+(?:-\d+(?:\.\d*)?%-INC)?$/;

  // match() returns null if no match is found
  return filename.match(regex) != null;
}

/**
 * Checks whether a string is a valid directory name. Only used for the directory itself,
 * not an entire path
 */
function isValidDirectoryName(name: string): boolean {
  // Allows alphanumerics, hyphens, underscores, and percentage signs.
  // Name can begin with a single period, but otherwise cannot have any
  const regex = /^.?[a-zA-Z0-9_-]+$/;

  // match() returns null if no match is found
  return name.match(regex) != null;
}

/**
 * Checks whether a string is a valid directory path.
 * This only checks if it has the proper formatting. It does NOT check
 * if the directories actually exist on Terminal
 */
export function isValidDirectoryPath(path: string): boolean {
  let t_path: string = path;

  if (t_path.length === 0) {
    return false;
  }
  if (t_path.length === 1) {
    return t_path === "/";
  }

  // A full path must have a leading slash, but we'll ignore it for the checks
  if (t_path.startsWith("/")) {
    t_path = t_path.slice(1);
  } else {
    return false;
  }

  // Trailing slash does not matter
  t_path = removeTrailingSlash(t_path);

  // Check that every section of the path is a valid directory name
  const dirs = t_path.split("/");
  for (const dir of dirs) {
    // Special case, "." and ".." are valid for path
    if (dir === "." || dir === "..") {
      continue;
    }
    if (!isValidDirectoryName(dir)) {
      return false;
    }
  }

  return true;
}

/**
 * Checks whether a string is a valid file path. This only checks if it has the
 * proper formatting. It dose NOT check if the file actually exists on Terminal
 */
export function isValidFilePath(path: string): boolean {
  if (path == null || typeof path !== "string") {
    return false;
  }
  const t_path = path;

  // Impossible for filename to have less than length of 3
  if (t_path.length < 3) {
    return false;
  }

  // Full filepath can't end with trailing slash because it must be a file
  if (t_path.endsWith("/")) {
    return false;
  }

  // Everything after the last forward slash is the filename. Everything before
  // it is the file path
  const fnSeparator = t_path.lastIndexOf("/");
  if (fnSeparator === -1) {
    return isValidFilename(t_path);
  }

  const fn = t_path.slice(fnSeparator + 1);
  const dirPath = t_path.slice(0, fnSeparator + 1);

  return isValidDirectoryPath(dirPath) && isValidFilename(fn);
}

/**
 * Returns a formatted string for the first parent directory in a filepath. For example:
 * /home/var/test/ -> home/
 * If there is no first parent directory, then it returns "/" for root
 */
export function getFirstParentDirectory(path: string): string {
  let t_path = path;
  t_path = removeLeadingSlash(t_path);
  t_path = removeTrailingSlash(t_path);

  if (t_path.lastIndexOf("/") === -1) {
    return "/";
  }

  const dirs = t_path.split("/");
  if (dirs.length === 0) {
    return "/";
  }

  return dirs[0] + "/";
}

/**
 * Given a filepath, returns a formatted string for all of the parent directories
 * in that filepath. For example:
 * /home/var/tes -> home/var/
 * /home/var/test/ -> home/var/test/
 * If there are no parent directories, it returns the empty string
 */
export function getAllParentDirectories(path: string): string {
  const t_path = path;
  const lastSlash = t_path.lastIndexOf("/");
  if (lastSlash === -1) {
    return "";
  }

  return t_path.slice(0, lastSlash + 1);
}

/**
 * Given a destination that only contains a directory part, returns the
 * path to the source filename inside the new destination directory.
 * Otherwise, returns the path to the destination file.
 * @param destination The destination path or file name
 * @param source The source path
 * @param cwd The current working directory
 * @returns A file path which may be absolute or relative
 */
export function getDestinationFilepath(destination: string, source: string, cwd: string) {
  const dstDir = evaluateDirectoryPath(destination, cwd);
  // If evaluating the directory for this destination fails, we have a filename or full path.
  if (dstDir === null) {
    return destination;
  } else {
    // Append the filename to the directory provided.
    const t_path = removeTrailingSlash(dstDir);
    const fileName = getFileName(source);
    return t_path + "/" + fileName;
  }
}

/**
 * Given a filepath, returns the file name (e.g. without directory parts)
 * For example:
 * /home/var/test.js -> test.js
 * ./var/test.js -> test.js
 * test.js -> test.js
 */
export function getFileName(path: string): string {
  const t_path = path;
  const lastSlash = t_path.lastIndexOf("/");
  if (lastSlash === -1) {
    return t_path;
  }

  return t_path.slice(lastSlash + 1);
}

/**
 * Checks if a file path refers to a file in the root directory.
 */
export function isInRootDirectory(path: string): boolean {
  if (!isValidFilePath(path)) {
    return false;
  }
  if (path == null || path.length === 0) {
    return false;
  }

  return path.lastIndexOf("/") <= 0;
}

/**
 * Evaluates a directory path, including the processing of linux dots.
 * Returns the full, proper path, or null if an invalid path is passed in
 */
export function evaluateDirectoryPath(path: string, currPath?: string): string | null {
  let t_path = path;

  // If the path begins with a slash, then its an absolute path. Otherwise its relative
  // For relative paths, we need to prepend the current directory
  if (!t_path.startsWith("/") && currPath != null) {
    t_path = currPath + (currPath.endsWith("/") ? "" : "/") + t_path;
  }

  if (!isValidDirectoryPath(t_path)) {
    return null;
  }

  // Trim leading/trailing slashes
  t_path = removeLeadingSlash(t_path);
  t_path = removeTrailingSlash(t_path);

  const dirs = t_path.split("/");
  const reconstructedPath: string[] = [];

  for (const dir of dirs) {
    if (dir === ".") {
      // Current directory, do nothing
      continue;
    } else if (dir === "..") {
      // Parent directory
      const res = reconstructedPath.pop();
      if (res == null) {
        return null; // Array was empty, invalid path
      }
    } else {
      reconstructedPath.push(dir);
    }
  }

  return "/" + reconstructedPath.join("/");
}

/**
 * Evaluates a file path, including the processing of linux dots.
 * Returns the full, proper path, or null if an invalid path is passed in
 */
export function evaluateFilePath(path: string, currPath?: string): string | null {
  let t_path = path;

  // If the path begins with a slash, then its an absolute path. Otherwise its relative
  // For relative paths, we need to prepend the current directory
  if (!t_path.startsWith("/") && currPath != null) {
    t_path = currPath + (currPath.endsWith("/") ? "" : "/") + t_path;
  }

  if (!isValidFilePath(t_path)) {
    return null;
  }

  // Trim leading/trailing slashes
  t_path = removeLeadingSlash(t_path);

  const dirs = t_path.split("/");
  const reconstructedPath: string[] = [];

  for (const dir of dirs) {
    if (dir === ".") {
      // Current directory, do nothing
      continue;
    } else if (dir === "..") {
      // Parent directory
      const res = reconstructedPath.pop();
      if (res == null) {
        return null; // Array was empty, invalid path
      }
    } else {
      reconstructedPath.push(dir);
    }
  }

  return "/" + reconstructedPath.join("/");
}

export function areFilesEqual(f0: string, f1: string): boolean {
  if (!f0.startsWith("/")) f0 = "/" + f0;
  if (!f1.startsWith("/")) f1 = "/" + f1;
  return f0 === f1;
}
