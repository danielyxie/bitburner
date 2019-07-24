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
export function isValidFilename(filename: string): boolean {
    // * Allows everything except : " < > / | \ ? *
    // * The name must not end with a space or a period
    // * The name must not start with a space
    // see https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file#naming-conventions
    const regex = /^[^"<>/\\|?* ][^"<>/\\|?*]*[^"<>/\\|?*. ]$/;

	// match() returns null if no match is found
    return filename.match(regex) != null;
}

/**
 * Checks whether a string is a valid directory name. Only used for the directory itself,
 * not an entire path
 */
export function isValidDirectoryName(name: string): boolean {
    // * Allows everything except : " < > / | \ ? *
    // * The name must not end with a space or a period
    // * The name must not start with a space
    // see https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file#naming-conventions
    const regex = /^[^"<>/\\|?* ][^"<>/\\|?*]+[^"<>/\\|?*. ]$/;

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

    if (t_path.length === 0) { return false; }
    if (t_path.length === 1) {
        return t_path === "/";
    }

    // Trimming slashes from both sides does not matter
    t_path = removeTrailingSlash(t_path);
    t_path = (t_path.startsWith("/"))? t_path.slice(1): t_path;
    // Check that every section of the path is a valid directory name
    const dirs = t_path.split("/");
    for (const dir of dirs) {
        // Special case, "." and ".." are valid for path
        if (dir === "." || dir === "..") { continue; }
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
    if (path == null || typeof path !== "string") { return false; }
    const t_path = path;
    // Full filepath can't end with trailing slash because it must be a file
    if (t_path.endsWith("/")) { return false; }

    // Everything after the last forward slash is the filename. Everything before
    // it is the file path
    const fnSeparator = t_path.lastIndexOf("/");
    
    const fn = t_path.slice(fnSeparator + 1);
    const dirPath = t_path.slice(0, fnSeparator+1);
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

    if (t_path.lastIndexOf("/") === -1) { return "/"; }

    const dirs = t_path.split("/");
    if (dirs.length === 0) { return "/"; }

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
    if (lastSlash === -1) { return ""; }

    return t_path.slice(0, lastSlash + 1);
}

/**
 * Checks if a file path refers to a file in the root directory.
 */
export function isInRootDirectory(path: string): boolean {
    if (!isValidFilePath(path)) { return false; }
    if (path == null || path.length === 0) { return false; }

    return (path.lastIndexOf("/") <= 0);
}

/**
 * Evaluates a directory path, including the processing of linux dots.
 * Returns the full, proper path, or null if an invalid path is passed in
 */
export function evaluateDirectoryPath(server: any, path: string, currPath?: string): string | undefined {
    let t_path = path;
    console.log(`Current server=  ${JSON.stringify(server)}`);
    console.log(`Evaluate Directory Path ${JSON.stringify(path)}`);
    console.log(`Current Path = ${JSON.stringify(currPath)}`);
    // If the path begins with a slash, then its an absolute path. Otherwise its relative
    // For relative paths, we need to prepend the current directory
    if (!t_path.startsWith("/") && currPath != null) {
        t_path = currPath + (currPath.endsWith("/") ? "" : "/") + t_path + (t_path.endsWith("/") ? "" : "/");
    }
    console.log(`1. Current temporary path = ${JSON.stringify(t_path)}`);

    if (!server.isDir(t_path)) { return ; }

    // Trim leading/trailing slashes
    t_path = removeLeadingSlash(t_path);
    console.log(`2. Current temporary path = ${JSON.stringify(t_path)}`);

    t_path = removeTrailingSlash(t_path);
    console.log(`3. Current temporary path = ${JSON.stringify(t_path)}`);

    const dirs = t_path.split("/");
    console.log(`4. Current directories = ${JSON.stringify(dirs)}`);
    const reconstructedPath: string[] = [];

    for (const dir of dirs) {
        console.log(`5. Current reconstructed path = ${JSON.stringify(reconstructedPath)}:`);
        if (dir === ".") {
            // Current directory, do nothing
            continue;
        } else if (dir === "..") {
            // Parent directory
            const res = reconstructedPath.pop();
            if (res == null) {
                return ; // Array was empty, invalid path
            }
        } else {
            reconstructedPath.push(dir);
        }
    }
    const result = "/" + reconstructedPath.join("/");
    console.log(`5. result path = ${JSON.stringify(result)}:`);
    return result;
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

    if (!isValidFilePath(t_path)) { return null; }

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
