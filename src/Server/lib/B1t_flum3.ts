import { BaseServer } from "../BaseServer";
import { Server } from "../Server";
import {registerExecutable, ManualEntry, fetchUsage, fetchExecutable} from "./sys";
import { hackWorldDaemon } from "../../RedPill";
import {Player} from "../../Player";
import {
    yesNoBoxCreate,
    yesNoBoxGetYesButton,
    yesNoBoxGetNoButton,
    yesNoBoxClose
} from "../../../utils/YesNoBox";

export function b1t_flum3(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    const yesBtn:any = yesNoBoxGetYesButton();
    const noBtn:any = yesNoBoxGetNoButton();
    yesBtn.innerHTML = "Travel to BitNode Nexus";
    noBtn.innerHTML = "Cancel";
    yesBtn.addEventListener("click", function() {
        hackWorldDaemon(Player.bitNodeN, true);
        return yesNoBoxClose();
    });
    noBtn.addEventListener("click", function() {
        return yesNoBoxClose();
    });
    yesNoBoxCreate("WARNING: USING THIS PROGRAM WILL CAUSE YOU TO LOSE ALL OF YOUR PROGRESS ON THE CURRENT BITNODE.<br><br>" +
                    "Do you want to travel to the BitNode Nexus? This allows you to reset the current BitNode " +
                    "and select a new one.");
}
const MANUAL = new ManualEntry(
`b1t_flum3.exe - u53 w1th c4ut10n`,
`b1t_flum3.exe`,
`...

...

...

4noth3r 0ne byt3s th3 DU5T!

R3qu1re th3 b1t_flum3.exe pr0gr4m.`)

registerExecutable("b1t_flum3.exe", b1t_flum3, MANUAL, true);
