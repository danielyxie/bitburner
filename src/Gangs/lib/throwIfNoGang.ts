
import {hasGang} from "./hasGang";
import { BaseServer } from "../../Server/BaseServer";

export function throwIfNoGang(server:BaseServer, term:any, err:any){
    let hasGangAlready:boolean = false;
    let hasGangOut = (value:boolean)=>{hasGangAlready=value;};
    hasGang(server, term, hasGangOut, err, [])
    if(!hasGangAlready){
        err(`You dont have a gang`);
        return false;
    }
    return true;
}
