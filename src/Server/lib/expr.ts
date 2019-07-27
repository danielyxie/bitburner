import { BaseServer } from "../BaseServer";
import {evaluate} from 'mathjs';

export function expr( server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){

    let sanitizedExpr = args.join(" ");//.replace(/s+/g, '').replace(/[^-()\d/*+.]/g, '');
    try {
        out(evaluate(sanitizedExpr));
    } catch(e) {
        err(`Could not evaluate expression: ${sanitizedExpr}\n${e}`);
    }
}
