import { BaseServer } from "../../Server/BaseServer";
import { ManualEntry, registerExecutable } from "../../Server/lib/sys";

export function hasAPI(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {}) {
    if (args.length !== 1) {
        err("You must only provide a single API name");
        return false;
    }
    let name: string = args.shift() as string;
    // By default, every namespace stats at level 1.
    if (!name.includes("-")) {
        name += "-1";
    }
    const level = name.split("-")[1];
    if (isNaN(parseInt(level))) {
        // this is an executable file, we check it's presence
        const filepath = `${level}.exe`;
        out(term.getPlayer().getHomeComputer().exists(filepath));
        return true;
    }
    switch (name) {
        case "system-1":
            out(true);
            return true;
        case "gang-1":
            out((term.getPlayer().bitNodeN === 2 || term.getPlayer().sourceFiles.some((a: any) => {
                return a.n === 2;
            })));
            return true;
        default:
            err(`API ${name} not found`);
            return false;
    }

}

const MANUAL = new ManualEntry(
    `hasAPI - Returns whether the specified API is available or not.`,
    `hasAPI API`,
    `Returns whether the specified API is available or not. A valid name is the name
    of the API followed by it's level requirements as such APINAME-APILEVEL.
    By default, level 1 is assumed if none is specified.`);

registerExecutable("hasAPI", hasAPI, MANUAL, false);
