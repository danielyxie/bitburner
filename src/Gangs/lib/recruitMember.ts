import { BaseServer } from "../../Server/BaseServer";
import {throwIfNoGang} from "./throwIfNoGang";
import {GangMember} from "../../Gang";
import { Page, routing } from "../../ui/navigationTracking";
import { canRecruitMember } from "./canRecruitMember";


export function recruitMember(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={}) {
    throwIfNoGang(server, term, err);
    let gang = term.getPlayer().gang;
    //throws an error if the player cannot recruit
    let canRecruit:boolean=false;
    canRecruitMember(server, term, (tmp:boolean)=>{canRecruit=tmp;},err,[]);
    if(!canRecruit){
        err(`You cannot recruit a member currently`);
        return false;
    }
    if (args.length != 1){
        err(`You must provide a name and only one`);
        return false;
    }
    let name:string = args.shift() as string;
    if (name === "") {
        err(`You must provide a non-empty name`)
        return false;
    }
    if (Object.keys(gang.members).includes(name)){
        err(`Another member is already named ${name}, you must provide a unique name`)
        return false;
    }

    let member = new GangMember(name);
    gang.members[name] = member;
    if (routing.isOn(Page.Gang)) {
        gang.createGangMemberDisplayElement(member);
        gang.updateGangContent();
    }
    return true;
}

import { registerExecutable, ManualEntry } from "../../Server/lib/sys";

const MANUAL = new ManualEntry(
`recruitMember - Recruits a new gang member.`,
`recruitMember MEMBERNAME`,
`Recruits a new gang member. The member name must be unique.`);

registerExecutable("recruitMember", recruitMember, MANUAL, true, "gang");
