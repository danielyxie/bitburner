import {CONSTANTS}          from "./Constants.js";
import {Player}             from "./Player.js";
import {createElement}      from "../utils/HelperFunctions.js";

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
    BitFlume:             "b1t_flum3.exe"
};

var nukeALink, bruteSshALink, ftpCrackALink, relaySmtpALink, httpWormALink, sqlInjectALink,
    deepscanv1ALink, deepscanv2ALink, servProfilerALink, autolinkALink, bitFlumeALink;
function displayCreateProgramContent() {
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
    bitFlumeALink.style.display = "none";

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
    //Bit Flume
    if (!Player.hasProgram(Programs.BitFlume) && Player.sourceFiles.length > 0 && Player.hacking_skill >= 5) {
        bitFlumeALink.style.display = "inline-block";
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
    //Bit Flume
    if (!Player.hasProgram(Programs.BitFlume) && Player.sourceFiles.length > 0 && Player.hacking_skill >= 5) {
        ++count;
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
    nukeALink = createElement("a", {
        class:"a-link-button", id:"create-program-nuke", innerText:Programs.NukeProgram,
        tooltip:"This virus is used to gain root access to a machine if enough ports are opened.",
    });
    createProgramList.appendChild(nukeALink);

    bruteSshALink = createElement("a", {
        class:"a-link-button", id:"create-program-brutessh", innerText:Programs.BruteSSHProgram,
        tooltip:"This program executes a brute force attack that opens SSH ports"
    });
    createProgramList.appendChild(bruteSshALink);

    ftpCrackALink = createElement("a", {
        class:"a-link-button", id:"create-program-ftpcrack", innerText:Programs.FTPCrackProgram,
        tooltip:"This program cracks open FTP ports"
    });
    createProgramList.appendChild(ftpCrackALink);

    relaySmtpALink = createElement("a", {
        class:"a-link-button", id:"create-program-relaysmtp", innerText:Programs.RelaySMTPProgram,
        tooltip:"This program opens SMTP ports by redirecting data"
    }) ;
    createProgramList.appendChild(relaySmtpALink);

    httpWormALink = createElement("a", {
        class:"a-link-button", id:"create-program-httpworm", innerText:Programs.HTTPWormProgram,
        tooltip:"This virus opens up HTTP ports"
    });
    createProgramList.appendChild(httpWormALink);

    sqlInjectALink = createElement("a", {
        class:"a-link-button", id:"create-program-sqlinject", innerText:Programs.SQLInjectProgram,
        tooltip:"This virus opens SQL ports"
    });
    createProgramList.appendChild(sqlInjectALink);

    deepscanv1ALink = createElement("a", {
        class:"a-link-button", id:"create-program-deepscanv1", innerText:Programs.DeepscanV1,
        tooltip:"This program allows you to use the scan-analyze command with a depth up to 5"
    });
    createProgramList.appendChild(deepscanv1ALink);

    deepscanv2ALink = createElement("a", {
        class:"a-link-button", id:"create-program-deepscanv2", innerText:Programs.DeepscanV2,
        tooltip:"This program allows you to use the scan-analyze command with a depth up to 10"
    });
    createProgramList.appendChild(deepscanv2ALink);

    servProfilerALink = createElement("a", {
        class:"a-link-button", id:"create-program-serverprofiler", innerText:Programs.ServerProfiler,
        tooltip:"This program is used to display hacking and Netscript-related information about servers"
    });
    createProgramList.appendChild(servProfilerALink);

    bitFlumeALink = createElement("a", {
        class:"a-link-button", id:"create-program-bitflume", innerText:Programs.BitFlume,
        tooltip:"This program creates a portal to the BitNode Nexus (allows you to restart and switch BitNodes)"
    });
    createProgramList.appendChild(bitFlumeALink);

    autolinkALink = createElement("a", {
        class:"a-link-button", id:"create-program-autolink", innerText:"AutoLink.exe",
        tooltip:"This program allows you to directly connect to other servers through the 'scan-analyze' command"
    });
    createProgramList.appendChild(autolinkALink);

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
    bitFlumeALink.addEventListener("click", function() {
        Player.startCreateProgramWork(Programs.BitFlume, CONSTANTS.MillisecondsPerFiveMinutes / 5, 5);
        return false;
    });
}

export {Programs, displayCreateProgramContent, getNumAvailableCreateProgram,
        initCreateProgramButtons};
