import {fetchHelp, fetchHelpIndex, registerExecutable, ManualEntry} from "./sys";
import { BaseServer } from "../BaseServer";


export function help(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={}){
    let executable:string;
    if(args.length == 0){
        out(fetchHelpIndex());
        return;
    }
    else {
        executable = args.shift() as string
    }
    let result = fetchHelp(executable);
    if (!result) {
        err(`No help found for '${result}'.`);
    }
    else{
        out(result);
    }
}


const MANUAL = new ManualEntry(
`help - an interface to the on-line reference manuals`,
`help
help program`,
`help is the system's manual pager. Each page argument given  to  man  is
normally  the  name of a program, utility or function.  The manual page
associated with each of these arguments is then found and displayed.

A manual page consists of several sections.

Conventional  section  names  include  NAME,  SYNOPSIS and DESCRIPTION.

The following conventions apply to the SYNOPSIS section and can be used
as a guide in other sections.


bold text          type exactly as shown.
italic text        replace with appropriate argument.
[-abc]             any or all arguments within [ ] are optional.
-a|-b              options delimited by | cannot be used together.
argument ...       argument is repeatable.
[expression] ...   entire expression within [ ] is repeatable.


Exact rendering may vary depending on the output device.  For instance,
help will usually not be able to render italics when running in a termi‐
nal.


The command or function illustration is a pattern that should match all
possible invocations.  In some cases it is advisable to illustrate sev‐
eral exclusive invocations as is shown in the SYNOPSIS section of  this
manual page.`)

registerExecutable("help", help, MANUAL)
