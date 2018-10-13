import {CONSTANTS}          from "./Constants";
import {Player}             from "./Player";
import {createElement}      from "../utils/uiHelpers/createElement";

// a function that returns a requirement for a program that requires only that
// the player has at least the given skill level.
function requireLevel(lvl) {
    return function() {
        return Player.hacking_skill >= lvl;
    }
}

function Program(name, create) {
    this.name = name;
    this.create = create;
}

Program.prototype.htmlID = function() {
    const name = this.name.endsWith('.exe') ? this.name.slice(0, -('.exe'.length)) : this.name;
    return "create-program-"+name;
}

/* Create programs */
const Programs = {
    NukeProgram: new Program("NUKE.exe", {
        level: 1,
        tooltip:"This virus is used to gain root access to a machine if enough ports are opened.",
        req: requireLevel(1),
        time: CONSTANTS.MillisecondsPerFiveMinutes,
    }),
    BruteSSHProgram: new Program("BruteSSH.exe", {
        level: 50,
        tooltip:"This program executes a brute force attack that opens SSH ports",
        req: requireLevel(50),
        time: CONSTANTS.MillisecondsPerFiveMinutes * 2,
    }),
    FTPCrackProgram: new Program("FTPCrack.exe", {
        level: 100,
        tooltip:"This program cracks open FTP ports",
        req: requireLevel(100),
        time: CONSTANTS.MillisecondsPerHalfHour,
    }),
    RelaySMTPProgram: new Program("relaySMTP.exe", {
        level: 250,
        tooltip:"This program opens SMTP ports by redirecting data",
        req: requireLevel(250),
        time: CONSTANTS.MillisecondsPer2Hours,
    }),
    HTTPWormProgram: new Program("HTTPWorm.exe", {
        level: 500,
        tooltip:"This virus opens up HTTP ports",
        req: requireLevel(500),
        time: CONSTANTS.MillisecondsPer4Hours,
    }),
    SQLInjectProgram: new Program("SQLInject.exe", {
        level: 750,
        tooltip:"This virus opens SQL ports",
        req: requireLevel(750),
        time: CONSTANTS.MillisecondsPer8Hours,
    }),
    DeepscanV1: new Program("DeepscanV1.exe", {
        level: 75,
        tooltip:"This program allows you to use the scan-analyze command with a depth up to 5",
        req: requireLevel(75),
        time: CONSTANTS.MillisecondsPerQuarterHour,
    }),
    DeepscanV2: new Program("DeepscanV2.exe", {
        level: 400,
        tooltip:"This program allows you to use the scan-analyze command with a depth up to 10",
        req: requireLevel(400),
        time: CONSTANTS.MillisecondsPer2Hours,
    }),
    ServerProfiler: new Program("ServerProfiler.exe", {
        level: 75,
        tooltip:"This program is used to display hacking and Netscript-related information about servers",
        req: requireLevel(75),
        time: CONSTANTS.MillisecondsPerHalfHour,
    }),
    AutoLink: new Program("AutoLink.exe", {
        level: 25,
        tooltip:"This program allows you to directly connect to other servers through the 'scan-analyze' command",
        req: requireLevel(25),
        time: CONSTANTS.MillisecondsPerQuarterHour,
    }),
    BitFlume: new Program("b1t_flum3.exe", {
        level: 1,
        tooltip:"This program creates a portal to the BitNode Nexus (allows you to restart and switch BitNodes)",
        req: function() {return Player.sourceFiles.length > 0 && Player.hacking_skill >= 1},
        time: CONSTANTS.MillisecondsPerFiveMinutes / 20,
    }),
    // special because you can't create it.
    Flight: new Program("fl1ght.exe"),
};

// this has the same key as 'Programs', not program names
const aLinks = {};

function displayCreateProgramContent() {
    for(const key in aLinks) {
        const p = Programs[key]
        aLinks[key].style.display = "none";
        if(!Player.hasProgram(p.name) && p.create.req()){
            aLinks[key].style.display = "inline-block";
        }
    }
}

//Returns the number of programs that are currently available to be created
function getNumAvailableCreateProgram() {
    var count = 0;
    for(const key in Programs) {
        if(Programs[key].create === undefined) { // a program we can't create
            continue
        }
        if(Player.hasProgram(Programs[key].name)) { // can't create it twice
            continue
        }

        if(!Programs[key].create.req()) { // if you don't fullfill the creation requirement
            continue
        }

        count++;
    }

    if (Player.firstProgramAvailable === false && count > 0) {
        Player.firstProgramAvailable = true;
        document.getElementById("create-program-tab").style.display = "list-item";
        document.getElementById("hacking-menu-header").click();
        document.getElementById("hacking-menu-header").click();
    }
    return count;
}

function initCreateProgramButtons() {
    var createProgramList = document.getElementById("create-program-list");
    for(const key in Programs) {
        if(Programs[key].create === undefined) {
            continue
        }
        const elem = createElement("a", {
            class: "a-link-button", id: Programs[key].htmlID(), innerText: Programs[key].name,
            tooltip: Programs[key].create.tooltip,
        });
        aLinks[key] = elem;
        createProgramList.appendChild(elem);
    }

    for(const key in aLinks) {
        const p = Programs[key]
        aLinks[key].addEventListener("click", function() {
            Player.startCreateProgramWork(p.name, p.create.time, p.create.level);
            return false;
        });
    }
}

export {Programs, displayCreateProgramContent, getNumAvailableCreateProgram,
        initCreateProgramButtons};
