import { Aliases,
         GlobalAliases }                        from "../Alias";
import { DarkWebItems }                         from "../DarkWeb/DarkWebItems";
import { Message }                              from "../Message/Message";
import { IPlayer }                              from "../PersonObjects/IPlayer"
import { AllServers }                           from "../Server/AllServers";

export function determineAllPossibilitiesForTabCompletion(p: IPlayer, input: string, index: number=0): string[] {
    let allPos: string[] = [];
    allPos = allPos.concat(Object.keys(GlobalAliases));
    const currServ = p.getCurrentServer();
    const homeComputer = p.getHomeComputer();
    input = input.toLowerCase();

    //If the command starts with './' and the index == -1, then the user
    //has input ./partialexecutablename so autocomplete the script or program
    //Put './' in front of each script/executable
    if (input.startsWith("./") && index == -1) {
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

    //Autocomplete the command
    if (index == -1) {
        return ["alias", "analyze", "cat", "check", "clear", "cls", "connect", "download", "expr",
                "free", "hack", "help", "home", "hostname", "ifconfig", "kill", "killall",
                "ls", "lscpu", "mem", "nano", "ps", "rm", "run", "scan", "scan-analyze",
                "scp", "sudov", "tail", "theme", "top"].concat(Object.keys(Aliases)).concat(Object.keys(GlobalAliases));
    }

    if (input.startsWith("buy ")) {
        let options = [];
        for (const i in DarkWebItems) {
            const item = DarkWebItems[i]
            options.push(item.program);
        }
        return options.concat(Object.keys(GlobalAliases));
    }

    if (input.startsWith("scp ") && index == 1) {
        for (var iphostname in AllServers) {
            if (AllServers.hasOwnProperty(iphostname)) {
                allPos.push(AllServers[iphostname].ip);
                allPos.push(AllServers[iphostname].hostname);
            }
        }
    }

    if (input.startsWith("scp ") && index == 0) {
        //All Scripts and lit files
        for (var i = 0; i < currServ.scripts.length; ++i) {
            allPos.push(currServ.scripts[i].filename);
        }
        for (var i = 0; i < currServ.messages.length; ++i) {
            if (!(currServ.messages[i] instanceof Message)) {
                allPos.push(<string>currServ.messages[i]);
            }
        }
        for (var i = 0; i < currServ.textFiles.length; ++i) {
            allPos.push(currServ.textFiles[i].fn);
        }
    }

    if (input.startsWith("connect ") || input.startsWith("telnet ")) {
        //All network connections
        for (var i = 0; i < currServ.serversOnNetwork.length; ++i) {
            var serv = AllServers[currServ.serversOnNetwork[i]];
            if (serv == null) {continue;}
            allPos.push(serv.ip); //IP
            allPos.push(serv.hostname); //Hostname
        }
        return allPos;
    }

    if (input.startsWith("kill ") || input.startsWith("tail ") ||
        input.startsWith("mem ") || input.startsWith("check ")) {
        //All Scripts
        for (var i = 0; i < currServ.scripts.length; ++i) {
            allPos.push(currServ.scripts[i].filename);
        }
        return allPos;
    }

    if (input.startsWith("nano ")) {
        //Scripts and text files and .fconf
        for (var i = 0; i < currServ.scripts.length; ++i) {
            allPos.push(currServ.scripts[i].filename);
        }
        for (var i = 0; i < currServ.textFiles.length; ++i) {
            allPos.push(currServ.textFiles[i].fn);
        }
        allPos.push(".fconf");
        return allPos;
    }

    if (input.startsWith("rm ")) {
        for (let i = 0; i < currServ.scripts.length; ++i) {
            allPos.push(currServ.scripts[i].filename);
        }
        for (let i = 0; i < currServ.programs.length; ++i) {
            allPos.push(currServ.programs[i]);
        }
        for (let i = 0; i < currServ.messages.length; ++i) {
            if (!(currServ.messages[i] instanceof Message)) {
                allPos.push(<string>currServ.messages[i]);
            }
        }
        for (let i = 0; i < currServ.textFiles.length; ++i) {
            allPos.push(currServ.textFiles[i].fn);
        }
        for (let i = 0; i < currServ.contracts.length; ++i) {
            allPos.push(currServ.contracts[i].fn);
        }
        return allPos;
    }

    if (input.startsWith("run ")) {
        //All programs, scripts, and contracts
        for (let i = 0; i < currServ.scripts.length; ++i) {
            allPos.push(currServ.scripts[i].filename);
        }

        //Programs are on home computer
        for (let i = 0; i < homeComputer.programs.length; ++i) {
            allPos.push(homeComputer.programs[i]);
        }

        for (let i = 0; i < currServ.contracts.length; ++i) {
            allPos.push(currServ.contracts[i].fn);
        }
        return allPos;
    }

    if (input.startsWith("cat ")) {
        for (var i = 0; i < currServ.messages.length; ++i) {
            if (currServ.messages[i] instanceof Message) {
                const msg: Message = <Message>currServ.messages[i];
                allPos.push(msg.filename);
            } else {
                allPos.push(<string>currServ.messages[i]);
            }
        }
        for (var i = 0; i < currServ.textFiles.length; ++i) {
            allPos.push(currServ.textFiles[i].fn);
        }
        return allPos;
    }

    if (input.startsWith("download ")) {
        for (var i = 0; i < currServ.textFiles.length; ++i) {
            allPos.push(currServ.textFiles[i].fn);
        }
        for (var i = 0; i < currServ.scripts.length; ++i) {
            allPos.push(currServ.scripts[i].filename);
        }
    }

    if (input.startsWith("ls ")) {
        for (var i = 0; i < currServ.textFiles.length; ++i) {
            allPos.push(currServ.textFiles[i].fn);
        }
        for (var i = 0; i < currServ.scripts.length; ++i) {
            allPos.push(currServ.scripts[i].filename);
        }
    }
    return allPos;
}
