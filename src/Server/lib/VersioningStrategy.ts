import { BaseServer } from "../BaseServer";

export enum VersioningStrategy {
    NONE = 1,
    EXISTING,
    NUMBERED,
    SIMPLE,
}


export function getVersionCheck(server:BaseServer, out:Function, err:Function, destFilename:string, options:any){
    let fileSuffix = options.suffix;

    if (server.exists(destFilename)) { // if so we first determine the versionning suffix.
        let version: number = 1;
        // here we verify the versioning naming scheme of the new file to be replaced.
        switch (options.strategy) {
            case VersioningStrategy.NONE:
                fileSuffix = "";
                break;
            case VersioningStrategy.SIMPLE:
                break;
            case VersioningStrategy.NUMBERED:
                while (server.exists(destFilename + fileSuffix + version)) { version ++; }// find the first available version number.
                fileSuffix += version;
                break;
            case VersioningStrategy.EXISTING:
                while (server.exists(destFilename + fileSuffix + version)) { version ++; }
                if (version > 1) { fileSuffix = version.toString(); }// if it is numbered, the version will be > 1, else it's a simple versionning mode.
                break;
        }
        destFilename += fileSuffix;
    }
    return destFilename;
}
