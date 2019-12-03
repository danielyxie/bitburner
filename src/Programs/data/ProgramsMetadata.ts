import { CONSTANTS } from "../../Constants";
import { IPlayer,
         IProgramCreate } from "../Program";

function requireHackingLevel(lvl: number) {
    return function(p: IPlayer) {
        return p.hacking_skill >= lvl;
    };
}

function bitFlumeRequirements() {
    return function(p: IPlayer) {
        return p.sourceFiles.length > 0 && p.hacking_skill >= 1;
    };
}

export interface IProgramCreationParams {
    key: string;
    name: string;
    create: IProgramCreate | null;
}

export const programsMetadata: IProgramCreationParams[] = [
    {
        key: "NukeProgram",
        name: "NUKE.exe",
        create: {
            level: 1,
            tooltip: "This virus is used to gain root access to a machine if enough ports are opened.",
            req: requireHackingLevel(1),
            time: CONSTANTS.MillisecondsPerFiveMinutes,
        },
    },
    {
        key: "BruteSSHProgram",
        name: "BruteSSH.exe",
        create: {
            level: 50,
            tooltip: "This program executes a brute force attack that opens SSH ports",
            req: requireHackingLevel(50),
            time: CONSTANTS.MillisecondsPerFiveMinutes * 2,
        },
    },
    {
        key: "FTPCrackProgram",
        name: "FTPCrack.exe",
        create: {
            level: 100,
            tooltip: "This program cracks open FTP ports",
            req: requireHackingLevel(100),
            time: CONSTANTS.MillisecondsPerHalfHour,
        },
    },
    {
        key: "RelaySMTPProgram",
        name: "relaySMTP.exe",
        create: {
            level: 250,
            tooltip: "This program opens SMTP ports by redirecting data",
            req: requireHackingLevel(250),
            time: CONSTANTS.MillisecondsPer2Hours,
        },
    },
    {
        key: "HTTPWormProgram",
        name: "HTTPWorm.exe",
        create: {
            level: 500,
            tooltip: "This virus opens up HTTP ports",
            req: requireHackingLevel(500),
            time: CONSTANTS.MillisecondsPer4Hours,
        },
    },
    {
        key: "SQLInjectProgram",
        name: "SQLInject.exe",
        create: {
            level: 750,
            tooltip: "This virus opens SQL ports",
            req: requireHackingLevel(750),
            time: CONSTANTS.MillisecondsPer8Hours,
        },
    },
    {
        key: "DeepscanV1",
        name: "DeepscanV1.exe",
        create: {
            level: 75,
            tooltip: "This program allows you to use the scan-analyze command with a depth up to 5",
            req: requireHackingLevel(75),
            time: CONSTANTS.MillisecondsPerQuarterHour,
        },
    },
    {
        key: "DeepscanV2",
        name: "DeepscanV2.exe",
        create: {
            level: 400,
            tooltip: "This program allows you to use the scan-analyze command with a depth up to 10",
            req: requireHackingLevel(400),
            time: CONSTANTS.MillisecondsPer2Hours,
        },
    },
    {
        key: "ServerProfiler",
        name: "ServerProfiler.exe",
        create: {
            level: 75,
            tooltip: "This program is used to display hacking and Netscript-related information about servers",
            req: requireHackingLevel(75),
            time: CONSTANTS.MillisecondsPerHalfHour,
        },
    },
    {
        key: "AutoLink",
        name: "AutoLink.exe",
        create: {
            level: 25,
            tooltip: "This program allows you to directly connect to other servers through the 'scan-analyze' command",
            req: requireHackingLevel(25),
            time: CONSTANTS.MillisecondsPerQuarterHour,
        },
    },
    {
        key: "BitFlume",
        name: "b1t_flum3.exe",
        create: {
            level: 1,
            tooltip: "This program creates a portal to the BitNode Nexus (allows you to restart and switch BitNodes)",
            req: bitFlumeRequirements(),
            time: CONSTANTS.MillisecondsPerFiveMinutes / 20,
        },
    },
    {
        key: "Flight",
        name: "fl1ght.exe",
        create: null,
    },
];
