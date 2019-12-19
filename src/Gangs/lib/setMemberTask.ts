import {BaseServer} from "../../Server/BaseServer";
import {throwIfNoGang} from "./throwIfNoGang";
import {GangMemberTasks} from "../../Gang";
import {ManualEntry, registerExecutable} from "../../Server/lib/sys";


export function setMemberTask(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {
    type: false,
    list: false
}) {

    const HELP_MESSAGE: string = "Usage: setMemberTask [-t] TASKNAME [-m] MEMBERNAME";
    let memberNames: string[] = [];
    let taskName: string | undefined;
    let memberFlag = false;
    while (args.length > 0) {
        const arg = args.shift() as string;
        switch (arg) {
            case "-h":
            case "--help":
                out(HELP_MESSAGE);
                return false;
            case "-t":
            case "--task":
                if (args.length < 1) {
                    err(`No taskname specified after -t`);
                    return false;
                }
                taskName = args.shift() as string;
                break;
            case "-m":
            case "--member":
                if (memberFlag || memberNames.length > 0) {
                    err(`Cannot specify multiple members using the -m flag`);
                    return false;
                }

                memberFlag = true;
                if (args.length < 1) {
                    err(`No member specified after -m`);
                    return false;
                }
                memberNames.push(args.shift() as string);
                break;
            default:

                if (memberFlag && taskName !== undefined) {
                    err(`Cannot specify multiple members using the -m flag`);
                    return false;
                }

                if (taskName === undefined) {
                    taskName = arg as string;
                } else {
                    memberNames.push(arg as string);
                }
                break;
        }
    }

    let player = term.getPlayer();

    throwIfNoGang(server, term, err);
    let gang = player.gang;
    for (let memberName of memberNames) {
        const member = gang.getMember(memberName);
        if (member === undefined) {
            err(`No gang member could be found with name ${memberName}`);
            return false;
        }
        if (taskName === undefined) {
            taskName = "Unassigned";
        } else if (!GangMemberTasks.hasOwnProperty(taskName)) {
            err(`No task could be found with name ${taskName}`);
            return false;
        }

        if (member.task == taskName) {
            out(`${memberName} already assigned to task ${taskName}`);
        } else {
            member.task = taskName;
            out(`Gang member ${memberName} assigned to task ${taskName}`);
        }
    }
    return true;
}

const MANUAL = new ManualEntry(
    `setMemberTask - Assign a specific task to a gang member.`,
    `setMemberTask [-t] TASKNAME [-m] MEMBERNAME
setMemberTask [-t] TASKNAME MEMBERNAME ...`,
    `Assign a specific task to a gang member.

-t, --task TASKNAME
    Sets the assigned task to TASKNAME.

-m, --member MEMBERNAME
    Sets the assigned task to the member MEMBERNAME only.

examples:
setMemberTask "Vigilante Justice" member1 member2
setMemberTask -m member1 -t "Vigilante Justice"

`);

registerExecutable("setMemberTask", setMemberTask, MANUAL, true, "gang");
