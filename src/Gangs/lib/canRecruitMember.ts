import {BaseServer} from "../../Server/BaseServer";
import {throwIfNoGang} from "./throwIfNoGang";
import {MaximumGangMembers} from "../../Gang";
import {ManualEntry, registerExecutable} from "../../Server/lib/sys";

export function canRecruitMember(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {}) {
    throwIfNoGang(server, term, err);
    let gang = term.getPlayer().gang;
    if (Object.keys(gang.members).length >= MaximumGangMembers) {
        out(false);
    } else {
        out(gang.respect >= gang.getRespectNeededToRecruitMember());
    }
    //TODO refactor getRespectNeededToRecruitMember into its own executable and call it instead.
    return true;
}

const MANUAL = new ManualEntry(
    `canRecruitMember - Returns whether you currently can recruit a Gang member or not.`,
    `canRecruitMember`,
    `Returns whether you currently can recruit a Gang member or not.`);

registerExecutable("canRecruitMember", canRecruitMember, MANUAL, true, "gang");
