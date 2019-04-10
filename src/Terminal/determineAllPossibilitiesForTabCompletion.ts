import {
    getFirstParentDirectory,
    isInRootDirectory
} from "./DirectoryHelpers";

import {
    Aliases,
    GlobalAliases
} from "../Alias";
import { DarkWebItems } from "../DarkWeb/DarkWebItems";
import { Message } from "../Message/Message";
import { IPlayer } from "../PersonObjects/IPlayer"
import { AllServers } from "../Server/AllServers";

// An array of all Terminal commands
const commands = [
    "alias",
    "analyze",
    "cat",
    "cd",
    "check",
    "clear",
    "cls",
    "connect",
    "download",
    "expr",
    "free",
    "hack",
    "help",
    "home",
    "hostname",
    "ifconfig",
    "kill",
    "killall",
    "ls",
    "lscpu",
    "mem",
    "mv",
    "nano",
    "ps",
    "rm",
    "run",
    "scan",
    "scan-analyze",
    "scp",
    "sudov",
    "tail",
    "theme",
    "top"
];

export function determineAllPossibilitiesForTabCompletion(p: IPlayer, input: string, index: number=0): string[] {
    let allPos: string[] = [];
    allPos = allPos.concat(Object.keys(GlobalAliases));
    const currServ = p.getCurrentServer();
    const homeComputer = p.getHomeComputer();
    input = input.toLowerCase();

    // Helper functions
    function addAllCodingContracts() {
        for (const cct of currServ.contracts) {
            allPos.push(cct.fn);
        }
    }

    function addAllLitFiles() {
        for (const file of currServ.messages) {
            if (!(file instanceof Message)) {
                allPos.push(file);
            }
        }
    }

    function addAllMessages() {
        for (const file of currServ.messages) {
            if (file instanceof Message) {
                allPos.push(file.filename);
            }
        }
    }

    function addAllPrograms() {
        for (const program of currServ.programs) {
            allPos.push(program);
        }
    }

    function addAllScripts() {
        for (const script of currServ.scripts) {
            allPos.push(script.filename);
        }
    }

    function addAllTextFiles() {
        for (const txt of currServ.textFiles) {
            allPos.push(txt.fn);
        }
    }

    function isCommand(cmd: string) {
        let t_cmd = cmd;
        if (!t_cmd.endsWith(" ")) {
            t_cmd += " ";
        }

        return input.startsWith(t_cmd);
    }

    /**
     * If the command starts with './' and the index == -1, then the user
     * has input ./partialexecutablename so autocomplete the script or program.
     * Put './' in front of each script/executable
     */
    if (isCommand("./") && index == -1) {
        //All programs and scripts
        for (var i = 0; i < currServ.scripts.length; ++i) {
            allPos.push("./" + currServ.scripts[i].filename);
        }

        //Programs are on home computer
        for(var i = 0; i < homeComputer.programs.length; ++i) {
            allPos.push("./" + homeComputer.programs[i]);
        }
        return allPos;
    }

    // Autocomplete the command
    if (index == -1) {
        return commands.concat(Object.keys(Aliases)).concat(Object.keys(GlobalAliases));
    }

    if (isCommand("buy")) {
        let options = [];
        for (const i in DarkWebItems) {
            const item = DarkWebItems[i]
            options.push(item.program);
        }

        return options.concat(Object.keys(GlobalAliases));
    }

    if (isCommand("scp") && index === 1) {
        for (const iphostname in AllServers) {
            allPos.push(AllServers[iphostname].ip);
            allPos.push(AllServers[iphostname].hostname);
        }

        return allPos;
    }

    if (isCommand("scp") && index === 0) {
        addAllScripts();
        addAllLitFiles();
        addAllTextFiles();

        return allPos;
    }

    if (isCommand("connect")) {
        // All network connections
        for (var i = 0; i < currServ.serversOnNetwork.length; ++i) {
            var serv = AllServers[currServ.serversOnNetwork[i]];
            if (serv == null) { continue; }
            allPos.push(serv.ip);
            allPos.push(serv.hostname);
        }

        return allPos;
    }

    if (isCommand("kill") || isCommand("tail") || isCommand("mem") || isCommand("check")) {
        addAllScripts();

        return allPos;
    }

    if (isCommand("nano")) {
        addAllScripts();
        addAllTextFiles();
        allPos.push(".fconf");

        return allPos;
    }

    if (isCommand("rm")) {
        addAllScripts();
        addAllPrograms();
        addAllLitFiles();
        addAllTextFiles();
        addAllCodingContracts();

        return allPos;
    }

    if (isCommand("run")) {
        addAllScripts();
        addAllPrograms();
        addAllCodingContracts();

        return allPos;
    }

    if (isCommand("cat")) {
        addAllMessages();
        addAllLitFiles();
        addAllTextFiles();

        return allPos;
    }

    if (isCommand("download") || isCommand("mv")) {
        addAllScripts();
        addAllTextFiles();

        return allPos;
    }

    return allPos;
}
