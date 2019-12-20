import { FactionToGangType, Gang, GANGTYPE } from "../../Gang";
import { BaseServer } from "../../Server/BaseServer";
import { ManualEntry, registerExecutable } from "../../Server/lib/sys";
import { hasGang } from "./hasGang";

export function createGang(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {
    type: false,
    list: false
}) {

    const HELP_MESSAGE: string = "Usage: createGang <-t> FACTION";

    let factions: string[] = [];
    while (args.length > 0) {
        const arg = args.shift() as string;
        switch (arg) {
            case "-h":
            case "--help":
                out(HELP_MESSAGE);
                return false;
            case "-t":
            case "--type":
                options.type = true;
                break;
            case "-l":
            case "--list":
                options.list = true;
                break;
            default:
                factions.push(arg as string);
                break;
        }
    }

    if (options.list) {
        for (let faction of term.getPlayer().factions) {
            if (Object.keys(FactionToGangType).includes(faction)) {
                let type = FactionToGangType[faction];
                switch (type) {
                    case GANGTYPE.HACKING:
                        out(`${faction}\thacking`);
                        break;
                    case GANGTYPE.COMBAT:
                        out(`${faction}\tcombat`);
                        break;
                    default:
                        err(`Unknown Gang Type ${type}`);
                        return false;
                }
            }
        }
    } else {
        if (factions.length == 0) {
            err(`You must provide a faction`);
            return false;
        }

        if (options.type) {
            for (let faction of factions) {

                if (!term.getPlayer().factions.includes(faction)) {
                    err(`You are not a member of ${faction}`);
                    continue;
                }
                if (Object.keys(FactionToGangType).includes(faction)) {
                    let type = FactionToGangType[faction];
                    switch (type) {
                        case GANGTYPE.HACKING:
                            out(`${faction}\thacking`);
                            break;
                        case GANGTYPE.COMBAT:
                            out(`${faction}\tcombat`);
                            break;
                        default:
                            err(`Unknown Gang Type ${type}`);
                    }
                } else {
                    out(`${faction} does not deal with gangs`);
                }
            }
            return false;
        } else {
            let hasGangAlready: boolean = false;
            let hasGangOut = (value: boolean) => {
                hasGangAlready = value;
            };
            hasGang(server, term, hasGangOut, err, []);
            if (hasGangAlready) {
                err(`You already have a gang`);
                return false;
            }

            if (factions.length > 1) {
                err(`You cannot create a gang with multiple factions, did you meant to use the --type flag?`);
                return false;
            }
            let faction: string = factions[0];
            if (!term.getPlayer().factions.includes(faction)) {
                err(`You are not a member of ${faction}`);
                return false;
            }
            if (!Object.keys(FactionToGangType).includes(faction)) {
                err(`${faction} does not deal with gangs`);
                return false;
            }

            out(`Gang with ${faction} successfully created!`);
            term.getPlayer().gang = new Gang(faction, FactionToGangType[faction]);
            return true;
        }
    }
}

const MANUAL = new ManualEntry(
    `createGang - Create a gang if you don't currently have one.`,
    `createGang FACTION
createGang -t FACTION1 FACTION2...
createGang -l`,
    `Without arguments, it creates a gang if you don't currently have one.
You can only create a gang with a faction you are in.


-t, --type
    Print the type of gang FACTION can create (hacking/combat)

-l, --list
    Prints the type of gang you can create with all the factions you
    are a member of currently.

Examples:

createGang -t "Slum Snakes" "NiteSec"
createGang -l
createGang "Slum Snakes"
`);

registerExecutable("createGang", createGang, MANUAL, true, "gang");
