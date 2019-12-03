import {evaluate} from 'mathjs';
import { BaseServer } from "../BaseServer";

export function expr( server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){

    let sanitizedExpr = args.join(" ");//.replace(/s+/g, '').replace(/[^-()\d/*+.]/g, '');
    try {
        out(evaluate(sanitizedExpr));
    } catch(e) {
        err(`Could not evaluate expression: ${sanitizedExpr}\n${e}`);
    }
}
import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`expr - evaluate mathematical expressions`,
`expr FORMULA`,
`Evaluate any mathematical expression. Supports native JavaScript
operators:
+, -, /, *, **, %, ^

Also support mathjs operators and functions such as:
    - trigonometric operations: sin(), cos(), ...
    - linear algebra operations: derivate(), simplify() ...
    - and more, see the mathjs documentation for more information.

--help
    display this help and exit
`)
registerExecutable("expr", expr, MANUAL);
