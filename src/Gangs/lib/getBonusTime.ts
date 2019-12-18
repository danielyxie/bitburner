import { BaseServer } from "../../Server/BaseServer";
import { Gang} from "../../Gang";

export function getBonusTime(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={type:false, list:false}) {

    if(! (term.getPlayer().gang instanceof Gang)){
        err(`You have no gang`)
        return false;
    }
    let result = Math.round(term.getPlayer().gang.storedCycles / 5);
    out(result);
    return true;
}

import { registerExecutable, ManualEntry } from "../../Server/lib/sys";

const MANUAL = new ManualEntry(
`getBonusTime - Displays the amount of bonus time remaining for your gang.`,
`getBonusTime`,
`Displays the amount of bonus time remaining for your gang.`);

registerExecutable("getBonusTime", getBonusTime, MANUAL, true, "gang");
