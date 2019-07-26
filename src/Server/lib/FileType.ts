/**
 * Returns the actual FileType of a specific directory entry.
 *
 * @export
 * @param {*} dirent The directory entry type object to detect.
 * @returns The actual type of the directory entry.
 */
export function detectFileType(dirent: any) { // actual type fs.Dirent; couldn't get it to compile with it though.
    if (dirent.isBlockDevice()) {
        return FileType.BLOCK_DEVICE;
    }
    if (dirent.isCharacterDevice()) {
        return FileType.CHARACTER_DEVICE;
    }
    if (dirent.isDirectory()) {
        return FileType.DIRECTORY;
    }
    if (dirent.isFIFO()) {
        return FileType.FIFO;
    }
    if (dirent.isFile()) {
        return FileType.FILE;
    }
    if (dirent.isSocket()) {
        return FileType.SOCKET;
    }
    if (dirent.isSymbolicLink()) {
        return FileType.SYMBOLIC_LINK;
    }
    return FileType.UNKNOWN;
}
/**
 * The different types of objects the memfs can store and keep in memory.
 * Those can be accessed using fs.readdir(path, withFileType=true).
 * See the memfs or the node.js API documentation for more details
 * @export
 * @enum {number}
 */
export enum FileType {
    BLOCK_DEVICE = "BLOCK_DEVICE",
    CHARACTER_DEVICE = "CHARACTER_DEVICE",
    DIRECTORY = "DIRECTORY",
    FIFO = "FIFO",
    FILE = "FILE",
    SOCKET = "SOCKET",
    SYMBOLIC_LINK = "SYMBOLIC_LINK",
    UNKNOWN = "UNKNOWN",
}
