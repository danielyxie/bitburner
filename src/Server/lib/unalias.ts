import { BaseServer } from "../BaseServer";

import {
    removeAlias,
} from "../../Alias";

export function unalias(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={}) {
    args.forEach(removeAlias);
}
import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`unalias - deletes the specified aliases.`,
`unalias ALIAS...`,
`Deletes the specified aliases

As an example, if an alias was declared using:

alias r="run"

Then it could be removed using:

unalias r

It is not necessary to differentiate between global
and non-global aliases when using 'unalias'
`)
registerExecutable("unalias", unalias, MANUAL);
