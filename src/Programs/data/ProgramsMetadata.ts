import { IProgramCreate } from "../Program";
import { CONSTANTS } from "../../Constants";
import { BaseServer } from "../../Server/BaseServer";
import { Server } from "../../Server/Server";
import { Terminal } from "../../Terminal";
import { Player } from "../../Player";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { GetServer } from "../../Server/AllServers";
import { numeralWrapper } from "../../ui/numeralFormat";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { BitFlumeEvent } from "../../BitNode/ui/BitFlumeModal";
import { calculateHackingTime, calculateGrowTime, calculateWeakenTime } from "../../Hacking";
import { FactionNames } from "../../Faction/data/FactionNames";

function requireHackingLevel(lvl: number) {
  return function () {
    return Player.skills.hacking + Player.skills.intelligence / 2 >= lvl;
  };
}

function bitFlumeRequirements() {
  return function () {
    return Player.sourceFiles.length > 0 && Player.skills.hacking >= 1;
  };
}

interface IProgramCreationParams {
  key: string;
  name: string;
  create: IProgramCreate | null;
  run: (args: string[], server: BaseServer) => void;
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
    run: (_args:string[], server: BaseServer): void => {
      if (!(server instanceof Server)) {
        Terminal.error("Cannot nuke this kind of server.");
        return;
      }
      if (server.hasAdminRights) {
        Terminal.print("You already have root access to this computer. There is no reason to run NUKE.exe");
        Terminal.print("You can now run scripts on this server.");
        return;
      }
      if (server.openPortCount >= server.numOpenPortsRequired) {
        server.hasAdminRights = true;
        Terminal.print("NUKE successful! Gained root access to " + server.hostname);
        Terminal.print("You can now run scripts on this server.");
        return;
      }

      Terminal.print("NUKE unsuccessful. Not enough ports have been opened");
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
    run: (_args:string[], server: BaseServer): void => {
      if (!(server instanceof Server)) {
        Terminal.error("Cannot run BruteSSH.exe on this kind of server.");
        return;
      }
      if (server.sshPortOpen) {
        Terminal.print("SSH Port (22) is already open!");
        return;
      }

      server.sshPortOpen = true;
      Terminal.print("Opened SSH Port(22)!");
      server.openPortCount++;
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
    run: (_args:string[], server: BaseServer): void => {
      if (!(server instanceof Server)) {
        Terminal.error("Cannot run FTPCrack.exe on this kind of server.");
        return;
      }
      if (server.ftpPortOpen) {
        Terminal.print("FTP Port (21) is already open!");
        return;
      }

      server.ftpPortOpen = true;
      Terminal.print("Opened FTP Port (21)!");
      server.openPortCount++;
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
    run: (_args:string[], server: BaseServer): void => {
      if (!(server instanceof Server)) {
        Terminal.error("Cannot run relaySMTP.exe on this kind of server.");
        return;
      }
      if (server.smtpPortOpen) {
        Terminal.print("SMTP Port (25) is already open!");
        return;
      }

      server.smtpPortOpen = true;
      Terminal.print("Opened SMTP Port (25)!");
      server.openPortCount++;
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
    run: (_args:string[], server: BaseServer): void => {
      if (!(server instanceof Server)) {
        Terminal.error("Cannot run HTTPWorm.exe on this kind of server.");
        return;
      }
      if (server.httpPortOpen) {
        Terminal.print("HTTP Port (80) is already open!");
        return;
      }

      server.httpPortOpen = true;
      Terminal.print("Opened HTTP Port (80)!");
      server.openPortCount++;
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
    run: (_args:string[], server: BaseServer): void => {
      if (!(server instanceof Server)) {
        Terminal.error("Cannot run SQLInject.exe on this kind of server.");
        return;
      }
      if (server.sqlPortOpen) {
        Terminal.print("SQL Port (1433) is already open!");
        return;
      }

      server.sqlPortOpen = true;
      Terminal.print("Opened SQL Port (1433)!");
      server.openPortCount++;
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
    run: (): void => {
      Terminal.print("This executable cannot be run.");
      Terminal.print("DeepscanV1.exe lets you run 'scan-analyze' with a depth up to 5.");
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
    run: (): void => {
      Terminal.print("This executable cannot be run.");
      Terminal.print("DeepscanV2.exe lets you run 'scan-analyze' with a depth up to 10.");
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
    run: (args: string[]): void => {
      if (args.length !== 1) {
        Terminal.error("Must pass a server hostname or IP as an argument for ServerProfiler.exe");
        return;
      }

      const targetServer = GetServer(args[0]);
      if (targetServer == null) {
        Terminal.error("Invalid server IP/hostname");
        return;
      }

      if (!(targetServer instanceof Server)) {
        Terminal.error(`ServerProfiler.exe can only be run on normal servers.`);
        return;
      }

      Terminal.print(targetServer.hostname + ":");
      Terminal.print("Server base security level: " + targetServer.baseDifficulty);
      Terminal.print("Server current security level: " + targetServer.hackDifficulty);
      Terminal.print("Server growth rate: " + targetServer.serverGrowth);
      Terminal.print(
        `Netscript hack() execution time: ${convertTimeMsToTimeElapsedString(
          calculateHackingTime(targetServer, Player) * 1000,
          true,
        )}`,
      );
      Terminal.print(
        `Netscript grow() execution time: ${convertTimeMsToTimeElapsedString(
          calculateGrowTime(targetServer, Player) * 1000,
          true,
        )}`,
      );
      Terminal.print(
        `Netscript weaken() execution time: ${convertTimeMsToTimeElapsedString(
          calculateWeakenTime(targetServer, Player) * 1000,
          true,
        )}`,
      );
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
    run: (): void => {
      Terminal.print("This executable cannot be run.");
      Terminal.print("AutoLink.exe lets you automatically connect to other servers when using 'scan-analyze'.");
      Terminal.print("When using scan-analyze, click on a server's hostname to connect to it.");
    },
  },
  {
    key: "Formulas",
    name: "Formulas.exe",
    create: {
      level: 1000,
      tooltip: "This program allows you to use the formulas API",
      req: requireHackingLevel(1000),
      time: CONSTANTS.MillisecondsPer4Hours,
    },
    run: (): void => {
      Terminal.print("This executable cannot be run.");
      Terminal.print("Formulas.exe lets you use the formulas API.");
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
    run: (): void => {
      BitFlumeEvent.emit();
    },
  },
  {
    key: "Flight",
    name: "fl1ght.exe",
    create: null,
    run: (): void => {
      const numAugReq = BitNodeMultipliers.DaedalusAugsRequirement;
      const fulfilled =
        Player.augmentations.length >= numAugReq && Player.money > 1e11 && Player.skills.hacking >= 2500;
      if (!fulfilled) {
        Terminal.print(`Augmentations: ${Player.augmentations.length} / ${numAugReq}`);
        Terminal.print(`Money: ${numeralWrapper.formatMoney(Player.money)} / $100b`);
        Terminal.print(`Hacking skill: ${Player.skills.hacking} / 2500`);
        return;
      }

      Terminal.print("We will contact you.");
      Terminal.print(`-- ${FactionNames.Daedalus} --`);
    },
  },
];
