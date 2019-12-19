import {BaseServer} from "../../Server/BaseServer";
import {throwIfNoGang} from "./throwIfNoGang";
import {ManualEntry, registerExecutable} from "../../Server/lib/sys";

export function setTerritoryWarfare(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {
    type: false,
    list: false
}) {
    let HELPMESSAGE = `USAGE: setTerritoryWarfare true/false`;

    if (args.length != 1) err(HELPMESSAGE);


    throwIfNoGang(server, term, err);

    let engage = args[0];
    if (typeof args[0] == "string") engage = JSON.parse(engage);
    try {
        if (engage) {
            term.getPlayer().gang.territoryWarfareEngaged = true;
            out("Engaging in Gang Territory Warfare");
        } else {
            term.getPlayer().gang.territoryWarfareEngaged = false;
            out("Disengaging in Gang Territory Warfare");
        }
        return true;
    } catch (e) {
        err(e);
        return false;
    }
}

const MANUAL = new ManualEntry(
    `setTerritoryWarfare - Set your gang participation in the next Territory Warfare clashes.`,
    `setTerritoryWarfare true/false`,
    `Set your gang participation in the next Territory Warfare clashes.`);

registerExecutable("setTerritoryWarfare", setTerritoryWarfare, MANUAL, true, "gang");
