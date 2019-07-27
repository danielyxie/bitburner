import { BaseServer } from "../BaseServer";

type Executable = ( server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any) => number|undefined;
