import { BaseServer } from "../BaseServer";
import {registerExecutable, ManualEntry, fetchUsage} from "./sys";
import { WorkerScriptStartStopEventEmitter } from "../../Netscript/WorkerScriptStartStopEventEmitter";
import {Player}  from "../../Player";
import {getServer, AllServers} from "../AllServers";
import {connect} from "./connect";
import { Programs } from "../../Programs/Programs";
import {HacknetServer} from "../../Hacknet/HacknetServer";

export function scan_analyze(server, term, out, err, args, options={}){
    if (args.length === 0) {
        executeScanAnalyze(server, term, out, err, 1);
    } else {
        // # of args must be 2 or 3
        if (args.length > 2) {
            err("Incorrect usage of scan-analyze command. usage: scan-analyze [depth]");
            return;
        }
        let all = false;
        if (args.length === 2 && args[1] === "-a") {
            all = true;
        }

        let depth = parseInt(args[0]);

        if (isNaN(depth) || depth < 0) {
            err("Incorrect usage of scan-analyze command. depth argument must be positive numeric");
            return;
        }
        if (depth > 3 && !Player.hasProgram(Programs.DeepscanV1.name) &&
            !Player.hasProgram(Programs.DeepscanV2.name)) {
            err("You cannot scan-analyze with that high of a depth. Maximum depth is 3");
            return;
        } else if (depth > 5 && !Player.hasProgram(Programs.DeepscanV2.name)) {
            err("You cannot scan-analyze with that high of a depth. Maximum depth is 5");
            return;
        } else if (depth > 10) {
            err("You cannot scan-analyze with that high of a depth. Maximum depth is 10");
            return;
        }
        executeScanAnalyze(server, term, out, err, depth, all);
    }
}

function executeScanAnalyze(server, term, out, err, depth, all=false){
    // TODO Using array as stack for now, can make more efficient
    out("~~~~~~~~~~ Beginning scan-analyze ~~~~~~~~~~");
    out(" ");

    // Map of all servers to keep track of which have been visited
    var visited = {};
    for (const ip in AllServers) {
        visited[ip] = 0;
    }

    const stack = [];
    const depthQueue = [0];
    stack.push(server);
    while(stack.length != 0) {
        const s = stack.pop();
        const d = depthQueue.pop();
        const isHacknet = s instanceof HacknetServer;
        if (!all && s.purchasedByPlayer && s.hostname != "home") {
            continue; // Purchased server
        } else if (visited[s.ip] || d > depth) {
            continue; // Already visited or out-of-depth
        } else if (!all && isHacknet) {
            continue; // Hacknet Server
        } else {
            visited[s.ip] = 1;
        }
        for (var i = s.serversOnNetwork.length-1; i >= 0; --i) {
            stack.push(getServer(s.serversOnNetwork[i]));
            depthQueue.push(d+1);
        }
        if (d == 0) {continue;} // Don't print current server
        var titleDashes = Array((d-1) * 4 + 1).join("-");
        if (Player.hasProgram(Programs.AutoLink.name)) {
            out("<strong>" +  titleDashes + "> <a class='scan-analyze-link'>"  + s.hostname + "</a></strong>", false);
        } else {
            out("<strong>" + titleDashes + ">" + s.hostname + "</strong>");
        }

        var dashes = titleDashes + "--";
        var c = "NO";
        if (s.hasAdminRights) {c = "YES";}
        out(`${dashes}Root Access: ${c}${!isHacknet ? ", Required hacking skill: " + s.requiredHackingSkill : ""}`);
        if (!isHacknet) { out(dashes + "Number of open ports required to NUKE: " + s.numOpenPortsRequired); }
        out(dashes + "RAM: " + s.maxRam);
        out(" ");
    }

    var links = document.getElementsByClassName("scan-analyze-link");
    for (let i = 0; i < links.length; ++i) {
        (function() {
        var hostname = links[i].innerHTML.toString();
        links[i].onclick = function() {
            if (term.analyzeFlag || term.hackFlag) {return;}
            connect(server, term, out, err, [hostname], {autolink:true});
        }
        }());// Immediate invocation
    }
}

const MANUAL = new ManualEntry(
`scan_analyze - print detailed information about servers`,
`scan_analyze [depth]`,
`Prints detailed information about all servers up to [depth] nodes away 
on the network. Calling 'scan_analyze 1' will display information about
the same servers that are shown by the 'scan' command. This command also 
shows the relative paths to reach each server.

By default, the maximum depth that can be specified for this command is 3.
However, owning the DeepscanV1.exe and DeepscanV2.exe programs lets you 
execute this command with a depth up to 5 and 10, respectively.

The information this command displays about each server includes whether 
or not you have root access to it, its required hacking level, the number of 
open ports required to run NUKE.exe on it, and how much RAM it has.`);

registerExecutable("scan_analyze", scan_analyze, MANUAL);
