import { BaseServer } from "../BaseServer";
import {registerExecutable, ManualEntry, fetchUsage} from "./sys";
import {connect} from "./connect";
export function home(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    connect(server, term, out, err, ["home"]);
}

const MANUAL = new ManualEntry(
`home - connects back to your home server`,
`home`,
`Connect to your home computer. This will work no
matter what server you are currently connected to.`)

registerExecutable("home", home, MANUAL);
