import { BaseServer } from "../BaseServer";
import {Player} from "../../Player"
import {HacknetServer} from "../../Hacknet/HacknetServer";
export function hack( server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    if(!options.Player) options.Player = Player; // not testing?

    // Hack the current PC (usually for money)
    // You can't hack your home pc or servers you purchased
    if (server.purchasedByPlayer) {
        err("Cannot hack your own machines! You are currently connected to your home PC or one of your purchased servers");
    } else if (server.hasAdminRights == false ) {
        err("You do not have admin rights for this machine! Cannot hack");
    } else if (server.requiredHackingSkill > options.Player.hacking_skill) {
        err("Your hacking skill is not high enough to attempt hacking this machine. Try analyzing the machine to determine the required hacking skill");
    } else if (server instanceof HacknetServer) {
        err("Cannot hack this type of Server")
    } else {
        term.startHack();
    }
}


import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`hack - attempt to hack the current server`,
`hack`,
`Attempt to hack the current server. Requires
root access in order to be run. See the wiki page
for hacking mechanics.`)
registerExecutable("hack", hack, MANUAL);
