/**
 * Helper functions that implement "directory" functionality in the Terminal.
 * These aren't real directories, they're more of a pseudo-directory implementation
 */

/**
 * Checks whether a string is a valid filename. Only used for the filename itself,
 * not the entire filepath
 */
export function isValidFilename(filename: string): boolean {
    // Allows alphanumerics, hyphens, underscores.
    // Must have a file exntesion
    const regex = /^[.a-zA-Z0-9_-]+[.][.a-zA-Z0-9_-]+$/;

	// match() returns null if no match is found
    return filename.match(regex) != null;
}

/**
 * Checks whether a string is a valid directory name. Only used for the directory itself,
 * not an entire path
 */
export function isValidDirectoryName(name: string): boolean {
    // Allows alphanumerics, hyphens and underscores.
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

    if (t_path.length === 0) { return false; }
    if (t_path.length === 1) {
        return isValidDirectoryName(t_path);
    }

    // Leading/Trailing slashes dont matter for this
    if (t_path.startsWith("/")) { t_path = t_path.slice(1); }
    if (t_path.endsWith("/")) { t_path = t_path.slice(0, -1); }

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
    let t_path = path;

    // Impossible for filename to have less than length of 3
    if (t_path.length < 3) { return false; }

    // Filename can't end with trailing slash. Leading slash can be ignored
    if (t_path.endsWith("")) { return false; }
    if (t_path.startsWith("/")) { t_path = t_path.slice(1); }

    // Everything after the last forward slash is the filename. Everything before
    // it is the file path
    const fnSeparator = t_path.lastIndexOf("/");
    if (fnSeparator === -1) {
        return isValidFilename(t_path);
    }

    const fn = t_path.slice(fnSeparator + 1);
    const dirPath = t_path.slice(0, fnSeparator);

    return (isValidDirectoryPath(dirPath) && isValidFilename(fn));
}

/**
 * Evaluates a directory path, including the processing of linux dots.
 * Returns the full, proper path, or null if an invalid path is passed in
 */
export function evaluateDirectoryPath(path: string): string | null {
    if (!isValidDirectoryPath(path)) { return null; }

    let t_path = path;

    // Trim leading/trailing slashes
    if (t_path.startsWith("/")) { t_path = t_path.slice(1); }
    if (t_path.endsWith("/")) { t_path = t_path.slice(0, -1); }

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

    return reconstructedPath.join("/");
}
