import {CONSTANTS} from "./Constants.js";
import {Player} from "./Player.js";

/* Create programs */
let Programs = {
    NukeProgram:          "NUKE.exe",
    BruteSSHProgram:      "BruteSSH.exe",
    FTPCrackProgram:      "FTPCrack.exe",
    RelaySMTPProgram:     "relaySMTP.exe",
    HTTPWormProgram:      "HTTPWorm.exe",
    SQLInjectProgram:     "SQLInject.exe",
    DeepscanV1:           "DeepscanV1.exe",
    DeepscanV2:           "DeepscanV2.exe",
    ServerProfiler:       "ServerProfiler.exe",
    AutoLink:             "AutoLink.exe",
    Flight:               "fl1ght.exe",
};

//TODO Right now the times needed to complete work are hard-coded...
//maybe later make this dependent on hacking level or something
function displayCreateProgramContent() {
    var nukeALink           = document.getElementById("create-program-nuke");
    var bruteSshALink       = document.getElementById("create-program-brutessh");
    var ftpCrackALink       = document.getElementById("create-program-ftpcrack");
    var relaySmtpALink      = document.getElementById("create-program-relaysmtp");
    var httpWormALink       = document.getElementById("create-program-httpworm");
    var sqlInjectALink      = document.getElementById("create-program-sqlinject");
    var deepscanv1ALink     = document.getElementById("create-program-deepscanv1");
    var deepscanv2ALink     = document.getElementById("create-program-deepscanv2");
    var servProfilerALink   = document.getElementById("create-program-serverprofiler");
    var autolinkALink       = document.getElementById("create-program-autolink");

    nukeALink.style.display = "none";
    bruteSshALink.style.display = "none";
    ftpCrackALink.style.display = "none";
    relaySmtpALink.style.display = "none";
    httpWormALink.style.display = "none";
    sqlInjectALink.style.display = "none";
    deepscanv1ALink.style.display = "none";
    deepscanv2ALink.style.display = "none";
    servProfilerALink.style.display = "none";
    autolinkALink.style.display = "none";

    //NUKE.exe (in case you delete it lol)
    if (Player.getHomeComputer().programs.indexOf(Programs.NukeProgram) == -1) {
        nukeALink.style.display = "inline-block";
    }
    //BruteSSH
    if (Player.getHomeComputer().programs.indexOf(Programs.BruteSSHProgram) == -1 &&
        Player.hacking_skill >= 50) {
        bruteSshALink.style.display = "inline-block";
    }
    //FTPCrack
    if (Player.getHomeComputer().programs.indexOf(Programs.FTPCrackProgram) == -1 &&
        Player.hacking_skill >= 100) {
        ftpCrackALink.style.display = "inline-block";
    }
    //relaySMTP
    if (Player.getHomeComputer().programs.indexOf(Programs.RelaySMTPProgram) == -1 &&
        Player.hacking_skill >= 250) {
        relaySmtpALink.style.display = "inline-block";
    }
    //HTTPWorm
    if (Player.getHomeComputer().programs.indexOf(Programs.HTTPWormProgram) == -1 &&
        Player.hacking_skill >= 500) {
        httpWormALink.style.display = "inline-block";
    }
    //SQLInject
    if (Player.getHomeComputer().programs.indexOf(Programs.SQLInjectProgram) == -1 &&
        Player.hacking_skill >= 750) {
        sqlInjectALink.style.display = "inline-block";
    }
    //Deepscan V1 and V2
    if (!Player.hasProgram(Programs.DeepscanV1) && Player.hacking_skill >= 75) {
        deepscanv1ALink.style.display = "inline-block";
    }
    if (!Player.hasProgram(Programs.DeepscanV2) && Player.hacking_skill >= 400) {
        deepscanv2ALink.style.display = "inline-block";
    }
    //Server profiler
    if (!Player.hasProgram(Programs.ServerProfiler) && Player.hacking_skill >= 75) {
        servProfilerALink.style.display = "inline-block";
    }
    //Auto Link
    if (!Player.hasProgram(Programs.AutoLink) && Player.hacking_skill >= 25) {
        autolinkALink.style.display = "inline-block";
    }
}

//Returns the number of programs that are currently available to be created
function getNumAvailableCreateProgram() {
    var count = 0;
    //PortHack.exe (in case you delete it lol)
    if (Player.getHomeComputer().programs.indexOf(Programs.NukeProgram) == -1) {
        ++count;
    }
    //BruteSSH
    if (Player.getHomeComputer().programs.indexOf(Programs.BruteSSHProgram) == -1 &&
        Player.hacking_skill >= 50) {
        ++count;
    }
    //FTPCrack
    if (Player.getHomeComputer().programs.indexOf(Programs.FTPCrackProgram) == -1 &&
        Player.hacking_skill >= 100) {
        ++count;
    }
    //relaySMTP
    if (Player.getHomeComputer().programs.indexOf(Programs.RelaySMTPProgram) == -1 &&
        Player.hacking_skill >= 250) {
        ++count;
    }
    //HTTPWorm
    if (Player.getHomeComputer().programs.indexOf(Programs.HTTPWormProgram) == -1 &&
        Player.hacking_skill >= 500) {
        ++count;
    }
    //SQLInject
    if (Player.getHomeComputer().programs.indexOf(Programs.SQLInjectProgram) == -1 &&
        Player.hacking_skill >= 750) {
        ++count;
    }
    //Deepscan V1 and V2
        if (!Player.hasProgram(Programs.DeepscanV1) && Player.hacking_skill >= 75) {
        ++count;
    }
    if (!Player.hasProgram(Programs.DeepscanV2) && Player.hacking_skill >= 400) {
        ++count;
    }
    //Server profiler
    if (!Player.hasProgram(Programs.ServerProfiler) && Player.hacking_skill >= 75) {
        ++count;
    }
    //Auto link
    if (!Player.hasProgram(Programs.AutoLink) && Player.hacking_skill >= 25) {
        ++count;
    }
    if (Player.firstProgramAvailable === false && count > 0) {
        Player.firstProgramAvailable = true;
        document.getElementById("create-program-tab").style.display = "list-item";
    }
    return count;
}

function initCreateProgramButtons() {
    var nukeALink           = document.getElementById("create-program-nuke");
    var bruteSshALink       = document.getElementById("create-program-brutessh");
    var ftpCrackALink       = document.getElementById("create-program-ftpcrack");
    var relaySmtpALink      = document.getElementById("create-program-relaysmtp");
    var httpWormALink       = document.getElementById("create-program-httpworm");
    var sqlInjectALink      = document.getElementById("create-program-sqlinject");
    var deepscanv1ALink     = document.getElementById("create-program-deepscanv1");
    var deepscanv2ALink     = document.getElementById("create-program-deepscanv2");
    var servProfilerALink   = document.getElementById("create-program-serverprofiler");
    var autolinkALink       = document.getElementById("create-program-autolink");

    nukeALink.addEventListener("click", function() {
        Player.startCreateProgramWork(Programs.NukeProgram, CONSTANTS.MillisecondsPerFiveMinutes, 1);
        return false;
    });
    bruteSshALink.addEventListener("click", function() {
        Player.startCreateProgramWork(Programs.BruteSSHProgram, CONSTANTS.MillisecondsPerFiveMinutes * 2, 50);
        return false;
    });
    ftpCrackALink.addEventListener("click", function() {
        Player.startCreateProgramWork(Programs.FTPCrackProgram, CONSTANTS.MillisecondsPerHalfHour, 100);
        return false;
    });
    relaySmtpALink.addEventListener("click", function() {
        Player.startCreateProgramWork(Programs.RelaySMTPProgram, CONSTANTS.MillisecondsPer2Hours, 250);
        return false;
    });
    httpWormALink.addEventListener("click", function() {
        Player.startCreateProgramWork(Programs.HTTPWormProgram, CONSTANTS.MillisecondsPer4Hours, 500);
        return false;
    });
    sqlInjectALink.addEventListener("click", function() {
        Player.startCreateProgramWork(Programs.SQLInjectProgram, CONSTANTS.MillisecondsPer8Hours, 750);
        return false;
    });
    deepscanv1ALink.addEventListener("click", function() {
        Player.startCreateProgramWork(Programs.DeepscanV1, CONSTANTS.MillisecondsPerQuarterHour, 75);
        return false;
    });
    deepscanv2ALink.addEventListener("click", function() {
        Player.startCreateProgramWork(Programs.DeepscanV2, CONSTANTS.MillisecondsPer2Hours, 400);
        return false;
    });
    servProfilerALink.addEventListener("click", function() {
        Player.startCreateProgramWork(Programs.ServerProfiler, CONSTANTS.MillisecondsPerHalfHour, 75);
        return false;
    });
    autolinkALink.addEventListener("click", function() {
        Player.startCreateProgramWork(Programs.AutoLink, CONSTANTS.MillisecondsPerQuarterHour, 25);
        return false;
    });
}

export {Programs, displayCreateProgramContent, getNumAvailableCreateProgram,
        initCreateProgramButtons};
