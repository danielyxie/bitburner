import { IProgramCreate } from "../Program";
import { CONSTANTS } from "../../Constants";
import { BaseServer } from "../../Server/BaseServer";
import { Server } from "../../Server/Server";
import { ITerminal } from "../../Terminal/ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { HacknetServer } from "../../Hacknet/HacknetServer";
import { convertTimeMsToTimeElapsedString } from "../../../utils/StringHelperFunctions";
import { getServer } from "../../Server/ServerHelpers";
import { numeralWrapper } from "../../ui/numeralFormat";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { createPopup } from "../../ui/React/createPopup";
import { BitFlumePopup } from "../../BitNode/ui/BitFlumePopup";

import { calculateHackingTime, calculateGrowTime, calculateWeakenTime } from "../../Hacking";

function requireHackingLevel(lvl: number) {
  return function (p: IPlayer) {
    return p.hacking_skill >= lvl;
  };
}

function bitFlumeRequirements() {
  return function (p: IPlayer) {
    return p.sourceFiles.length > 0 && p.hacking_skill >= 1;
  };
}

export interface IProgramCreationParams {
  key: string;
  name: string;
  create: IProgramCreate | null;
  run: (router: IRouter, terminal: ITerminal, player: IPlayer, server: BaseServer, args: string[]) => void;
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
    run: (router: IRouter, terminal: ITerminal, player: IPlayer, server: BaseServer): void => {
      if (!(server instanceof Server)) {
        terminal.error("Cannot nuke this kind of server.");
        return;
      }
      if (server.hasAdminRights) {
        terminal.print("You already have root access to this computer. There is no reason to run NUKE.exe");
        return;
      }
      if (server.openPortCount >= server.numOpenPortsRequired) {
        server.hasAdminRights = true;
        terminal.print("NUKE successful! Gained root access to " + server.hostname);
        // TODO: Make this take time rather than be instant
        return;
      }

      terminal.print("NUKE unsuccessful. Not enough ports have been opened");
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
    run: (router: IRouter, terminal: ITerminal, player: IPlayer, server: BaseServer): void => {
      if (!(server instanceof Server)) {
        terminal.error("Cannot run BruteSSH.exe on this kind of server.");
        return;
      }
      if (server.sshPortOpen) {
        terminal.print("SSH Port (22) is already open!");
        return;
      }

      server.sshPortOpen = true;
      terminal.print("Opened SSH Port(22)!");
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
    run: (router: IRouter, terminal: ITerminal, player: IPlayer, server: BaseServer): void => {
      if (!(server instanceof Server)) {
        terminal.error("Cannot run FTPCrack.exe on this kind of server.");
        return;
      }
      if (server.ftpPortOpen) {
        terminal.print("FTP Port (21) is already open!");
        return;
      }

      server.ftpPortOpen = true;
      terminal.print("Opened FTP Port (21)!");
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
    run: (router: IRouter, terminal: ITerminal, player: IPlayer, server: BaseServer): void => {
      if (!(server instanceof Server)) {
        terminal.error("Cannot run relaySMTP.exe on this kind of server.");
        return;
      }
      if (server.smtpPortOpen) {
        terminal.print("SMTP Port (25) is already open!");
        return;
      }

      server.smtpPortOpen = true;
      terminal.print("Opened SMTP Port (25)!");
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
    run: (router: IRouter, terminal: ITerminal, player: IPlayer, server: BaseServer): void => {
      if (!(server instanceof Server)) {
        terminal.error("Cannot run HTTPWorm.exe on this kind of server.");
        return;
      }
      if (server.httpPortOpen) {
        terminal.print("HTTP Port (80) is already open!");
        return;
      }

      server.httpPortOpen = true;
      terminal.print("Opened HTTP Port (80)!");
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
    run: (router: IRouter, terminal: ITerminal, player: IPlayer, server: BaseServer): void => {
      if (!(server instanceof Server)) {
        terminal.error("Cannot run SQLInject.exe on this kind of server.");
        return;
      }
      if (server.sqlPortOpen) {
        terminal.print("SQL Port (1433) is already open!");
        return;
      }

      server.sqlPortOpen = true;
      terminal.print("Opened SQL Port (1433)!");
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
    run: (router: IRouter, terminal: ITerminal): void => {
      terminal.print("This executable cannot be run.");
      terminal.print("DeepscanV1.exe lets you run 'scan-analyze' with a depth up to 5.");
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
    run: (router: IRouter, terminal: ITerminal): void => {
      terminal.print("This executable cannot be run.");
      terminal.print("DeepscanV2.exe lets you run 'scan-analyze' with a depth up to 10.");
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
    run: (router: IRouter, terminal: ITerminal, player: IPlayer, server: BaseServer, args: string[]): void => {
      if (args.length !== 1) {
        terminal.print("Must pass a server hostname or IP as an argument for ServerProfiler.exe");
        return;
      }

      const targetServer = getServer(args[0]);
      if (targetServer == null) {
        terminal.print("Invalid server IP/hostname");
        return;
      }

      if (targetServer instanceof HacknetServer) {
        terminal.print(`ServerProfiler.exe cannot be run on a Hacknet Server.`);
        return;
      }

      terminal.print(targetServer.hostname + ":");
      terminal.print("Server base security level: " + targetServer.baseDifficulty);
      terminal.print("Server current security level: " + targetServer.hackDifficulty);
      terminal.print("Server growth rate: " + targetServer.serverGrowth);
      terminal.print(
        `Netscript hack() execution time: ${convertTimeMsToTimeElapsedString(
          calculateHackingTime(targetServer, player) * 1000,
          true,
        )}`,
      );
      terminal.print(
        `Netscript grow() execution time: ${convertTimeMsToTimeElapsedString(
          calculateGrowTime(targetServer, player) * 1000,
          true,
        )}`,
      );
      terminal.print(
        `Netscript weaken() execution time: ${convertTimeMsToTimeElapsedString(
          calculateWeakenTime(targetServer, player) * 1000,
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
    run: (router: IRouter, terminal: ITerminal): void => {
      terminal.print("This executable cannot be run.");
      terminal.print("AutoLink.exe lets you automatically connect to other servers when using 'scan-analyze'.");
      terminal.print("When using scan-analyze, click on a server's hostname to connect to it.");
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
    run: (router: IRouter, terminal: ITerminal, player: IPlayer): void => {
      const popupId = "bitflume-popup";
      createPopup(popupId, BitFlumePopup, {
        player: player,
        router: router,
        popupId: popupId,
      });
    },
  },
  {
    key: "Flight",
    name: "fl1ght.exe",
    create: null,
    run: (router: IRouter, terminal: ITerminal, player: IPlayer): void => {
      const numAugReq = Math.round(BitNodeMultipliers.DaedalusAugsRequirement * 30);
      const fulfilled =
        player.augmentations.length >= numAugReq && player.money.gt(1e11) && player.hacking_skill >= 2500;
      if (!fulfilled) {
        terminal.print(`Augmentations: ${player.augmentations.length} / ${numAugReq}`);
        terminal.print(`Money: ${numeralWrapper.formatMoney(player.money.toNumber())} / $100b`);
        terminal.print(`Hacking skill: ${player.hacking_skill} / 2500`);
        return;
      }

      terminal.print("We will contact you.");
      terminal.print("-- Daedalus --");
    },
  },
];
