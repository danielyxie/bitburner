import { ITerminal, Output, Link, TTimer } from "./ITerminal";
import { IEngine } from "../IEngine";
import { IPlayer } from "../PersonObjects/IPlayer";
import { HacknetServer } from "../Hacknet/HacknetServer";
import { BaseServer } from "../Server/BaseServer";
import { hackWorldDaemon } from "../RedPill";
import { Programs } from "../Programs/Programs";
import { CodingContractResult } from "../CodingContracts";

import { TextFile } from "../TextFile";
import { Script } from "../Script/Script";
import { isScriptFilename } from "../Script/ScriptHelpersTS";
import { CONSTANTS } from "../Constants";
import { AllServers } from "../Server/AllServers";

import { removeLeadingSlash, isInRootDirectory, evaluateFilePath } from "./DirectoryHelpers";
import { checkIfConnectedToDarkweb } from "../DarkWeb/DarkWeb";
import { logBoxCreate } from "../../utils/LogBox";
import { iTutorialNextStep, iTutorialSteps, ITutorial } from "../InteractiveTutorial";
import { findRunningScript } from "../Script/ScriptHelpers";
import { TerminalHelpText } from "./HelpText";
import { GetServerByHostname, getServer, getServerOnNetwork } from "../Server/ServerHelpers";
import { ParseCommand, ParseCommands } from "./Parser";
import { SpecialServerIps, SpecialServerNames } from "../Server/SpecialServerIps";
import { Settings } from "../Settings/Settings";
import { createProgressBarText } from "../../utils/helpers/createProgressBarText";
import {
  calculateHackingChance,
  calculateHackingExpGain,
  calculatePercentMoneyHacked,
  calculateHackingTime,
} from "../Hacking";
import { numeralWrapper } from "../ui/numeralFormat";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";

import { alias } from "./commands/alias";
import { analyze } from "./commands/analyze";
import { backdoor } from "./commands/backdoor";
import { buy } from "./commands/buy";
import { cat } from "./commands/cat";
import { cd } from "./commands/cd";
import { check } from "./commands/check";
import { connect } from "./commands/connect";
import { download } from "./commands/download";
import { expr } from "./commands/expr";
import { free } from "./commands/free";
import { hack } from "./commands/hack";
import { help } from "./commands/help";
import { home } from "./commands/home";
import { hostname } from "./commands/hostname";
import { ifconfig } from "./commands/ifconfig";
import { kill } from "./commands/kill";
import { killall } from "./commands/killall";
import { ls } from "./commands/ls";
import { lscpu } from "./commands/lscpu";
import { mem } from "./commands/mem";
import { mv } from "./commands/mv";
import { nano } from "./commands/nano";
import { ps } from "./commands/ps";
import { rm } from "./commands/rm";
import { run } from "./commands/run";
import { scan } from "./commands/scan";
import { scananalyze } from "./commands/scananalyze";
import { scp } from "./commands/scp";
import { sudov } from "./commands/sudov";
import { tail } from "./commands/tail";
import { theme } from "./commands/theme";
import { top } from "./commands/top";
import { unalias } from "./commands/unalias";
import { wget } from "./commands/wget";

export class Terminal implements ITerminal {
  hasChanges = false;
  // Flags to determine whether the player is currently running a hack or an analyze
  action: TTimer | null = null;

  commandHistory: string[] = [];
  commandHistoryIndex = 0;

  outputHistory: (Output | Link)[] = [new Output(`Bitburner v${CONSTANTS.Version}`, "primary")];

  // True if a Coding Contract prompt is opened
  contractOpen = false;

  // Full Path of current directory
  // Excludes the trailing forward slash
  currDir = "/";

  process(player: IPlayer, cycles: number): void {
    if (this.action === null) return;
    this.action.timeLeft -= (CONSTANTS._idleSpeed * cycles) / 1000;
    this.hasChanges = true;
    if (this.action.timeLeft < 0) this.finishAction(player, false);
  }

  pollChanges(): boolean {
    if (this.hasChanges) {
      this.hasChanges = false;
      return true;
    }
    return false;
  }

  append(item: Output | Link): void {
    this.outputHistory.push(item);
    if (this.outputHistory.length > Settings.MaxTerminalCapacity) {
      this.outputHistory.slice(this.outputHistory.length - Settings.MaxTerminalCapacity);
    }
  }

  print(s: string): void {
    this.append(new Output(s, "primary"));
    this.hasChanges = true;
  }

  error(s: string): void {
    this.append(new Output(s, "error"));
    this.hasChanges = true;
  }

  startHack(player: IPlayer): void {
    // Hacking through Terminal should be faster than hacking through a script
    this.startAction(calculateHackingTime(player.getCurrentServer(), player) / 4, "h");
  }

  startBackdoor(player: IPlayer): void {
    // Backdoor should take the same amount of time as hack
    this.startAction(calculateHackingTime(player.getCurrentServer(), player) / 4, "b");
  }

  startAnalyze(): void {
    this.print("Analyzing system...");
    this.startAction(1, "a");
  }

  startAction(n: number, action: "h" | "b" | "a"): void {
    this.action = new TTimer(n, action);
  }

  // Complete the hack/analyze command
  finishHack(player: IPlayer, cancelled = false): void {
    if (cancelled) return;
    const server = player.getCurrentServer();

    // Calculate whether hack was successful
    const hackChance = calculateHackingChance(server, player);
    const rand = Math.random();
    const expGainedOnSuccess = calculateHackingExpGain(server, player);
    const expGainedOnFailure = expGainedOnSuccess / 4;
    if (rand < hackChance) {
      // Success!
      if (
        SpecialServerIps[SpecialServerNames.WorldDaemon] &&
        SpecialServerIps[SpecialServerNames.WorldDaemon] == server.ip
      ) {
        if (player.bitNodeN == null) {
          player.bitNodeN = 1;
        }
        hackWorldDaemon(player.bitNodeN);
        return;
      }
      server.backdoorInstalled = true;
      let moneyGained = calculatePercentMoneyHacked(server, player);
      moneyGained = Math.floor(server.moneyAvailable * moneyGained);

      if (moneyGained <= 0) {
        moneyGained = 0;
      } // Safety check

      server.moneyAvailable -= moneyGained;
      player.gainMoney(moneyGained);
      player.recordMoneySource(moneyGained, "hacking");
      player.gainHackingExp(expGainedOnSuccess);
      player.gainIntelligenceExp(expGainedOnSuccess / CONSTANTS.IntelligenceTerminalHackBaseExpGain);

      server.fortify(CONSTANTS.ServerFortifyAmount);

      this.print(
        `Hack successful! Gained ${numeralWrapper.formatMoney(moneyGained)} and ${numeralWrapper.formatExp(
          expGainedOnSuccess,
        )} hacking exp`,
      );
    } else {
      // Failure
      // player only gains 25% exp for failure? TODO Can change this later to balance
      player.gainHackingExp(expGainedOnFailure);
      this.print(
        `Failed to hack ${server.hostname}. Gained ${numeralWrapper.formatExp(expGainedOnFailure)} hacking exp`,
      );
    }
  }

  finishBackdoor(player: IPlayer, cancelled = false): void {
    if (!cancelled) {
      const server = player.getCurrentServer();
      if (
        SpecialServerIps[SpecialServerNames.WorldDaemon] &&
        SpecialServerIps[SpecialServerNames.WorldDaemon] == server.ip
      ) {
        if (player.bitNodeN == null) {
          player.bitNodeN = 1;
        }
        hackWorldDaemon(player.bitNodeN);
        return;
      }
      server.backdoorInstalled = true;
      this.print("Backdoor successful!");
    }
  }

  finishAnalyze(player: IPlayer, cancelled = false): void {
    if (!cancelled) {
      const currServ = player.getCurrentServer();
      const isHacknet = currServ instanceof HacknetServer;
      this.print(currServ.hostname + ": ");
      const org = currServ.organizationName;
      this.print("Organization name: " + (!isHacknet ? org : "player"));
      const hasAdminRights = (!isHacknet && currServ.hasAdminRights) || isHacknet;
      this.print("Root Access: " + (hasAdminRights ? "YES" : "NO"));
      const hackingSkill = currServ.requiredHackingSkill;
      this.print("Required hacking skill: " + (!isHacknet ? hackingSkill : "N/A"));
      const security = currServ.hackDifficulty;
      this.print("Server security level: " + (!isHacknet ? numeralWrapper.formatServerSecurity(security) : "N/A"));
      const hackingChance = calculateHackingChance(currServ, player);
      this.print("Chance to hack: " + (!isHacknet ? numeralWrapper.formatPercentage(hackingChance) : "N/A"));
      const hackingTime = calculateHackingTime(currServ, player) * 1000;
      this.print("Time to hack: " + (!isHacknet ? convertTimeMsToTimeElapsedString(hackingTime, true) : "N/A"));
      this.print(
        `Total money available on server: ${!isHacknet ? numeralWrapper.formatMoney(currServ.moneyAvailable) : "N/A"}`,
      );
      const numPort = currServ.numOpenPortsRequired;
      this.print("Required number of open ports for NUKE: " + (!isHacknet ? numPort : "N/A"));
      this.print("SSH port: " + (currServ.sshPortOpen ? "Open" : "Closed"));
      this.print("FTP port: " + (currServ.ftpPortOpen ? "Open" : "Closed"));
      this.print("SMTP port: " + (currServ.smtpPortOpen ? "Open" : "Closed"));
      this.print("HTTP port: " + (currServ.httpPortOpen ? "Open" : "Closed"));
      this.print("SQL port: " + (currServ.sqlPortOpen ? "Open" : "Closed"));
    }
  }

  finishAction(player: IPlayer, cancelled = false): void {
    if (this.action === null) {
      if (!cancelled) throw new Error("Finish action called when there was no action");
      return;
    }
    this.print(this.getProgressText());
    if (this.action.action === "h") {
      this.finishHack(player, cancelled);
    } else if (this.action.action === "b") {
      this.finishBackdoor(player, cancelled);
    } else if (this.action.action === "a") {
      this.finishAnalyze(player, cancelled);
    }
    if (cancelled) {
      this.print("Cancelled");
    }
    this.action = null;
  }

  getFile(player: IPlayer, filename: string): Script | TextFile | string | null {
    if (isScriptFilename(filename)) {
      return this.getScript(player, filename);
    }

    if (filename.endsWith(".lit")) {
      return this.getLitFile(player, filename);
    }

    if (filename.endsWith(".txt")) {
      return this.getTextFile(player, filename);
    }

    return null;
  }

  getFilepath(filename: string): string {
    const path = evaluateFilePath(filename, this.cwd());
    if (path == null) {
      throw new Error(`Invalid file path specified: ${filename}`);
    }

    if (isInRootDirectory(path)) {
      return removeLeadingSlash(path);
    }

    return path;
  }

  getScript(player: IPlayer, filename: string): Script | null {
    const s = player.getCurrentServer();
    const filepath = this.getFilepath(filename);
    for (const script of s.scripts) {
      if (filepath === script.filename) {
        return script;
      }
    }

    return null;
  }

  getTextFile(player: IPlayer, filename: string): TextFile | null {
    const s = player.getCurrentServer();
    const filepath = this.getFilepath(filename);
    for (const txt of s.textFiles) {
      if (filepath === txt.fn) {
        return txt;
      }
    }

    return null;
  }

  getLitFile(player: IPlayer, filename: string): string | null {
    const s = player.getCurrentServer();
    const filepath = this.getFilepath(filename);
    for (const lit of s.messages) {
      if (typeof lit === "string" && filepath === lit) {
        return lit;
      }
    }

    return null;
  }

  cwd(): string {
    return this.currDir;
  }

  setcwd(dir: string): void {
    this.currDir = dir;
    this.hasChanges = true;
  }

  async runContract(player: IPlayer, contractName: string): Promise<void> {
    // There's already an opened contract
    if (this.contractOpen) {
      return this.error("There's already a Coding Contract in Progress");
    }

    const serv = player.getCurrentServer();
    const contract = serv.getContract(contractName);
    if (contract == null) {
      return this.error("No such contract");
    }

    this.contractOpen = true;
    const res = await contract.prompt();

    switch (res) {
      case CodingContractResult.Success:
        if (contract.reward !== null) {
          const reward = player.gainCodingContractReward(contract.reward, contract.getDifficulty());
          this.print(`Contract SUCCESS - ${reward}`);
        }
        serv.removeContract(contract);
        break;
      case CodingContractResult.Failure:
        ++contract.tries;
        if (contract.tries >= contract.getMaxNumTries()) {
          this.print("Contract <p style='color:red;display:inline'>FAILED</p> - Contract is now self-destructing");
          serv.removeContract(contract);
        } else {
          this.print(
            `Contract <p style='color:red;display:inline'>FAILED</p> - ${
              contract.getMaxNumTries() - contract.tries
            } tries remaining`,
          );
        }
        break;
      case CodingContractResult.Cancelled:
      default:
        this.print("Contract cancelled");
        break;
    }
    this.contractOpen = false;
  }

  executeScanAnalyzeCommand(player: IPlayer, depth = 1, all = false): void {
    // TODO Using array as stack for now, can make more efficient
    this.print("~~~~~~~~~~ Beginning scan-analyze ~~~~~~~~~~");
    this.print(" ");

    // Map of all servers to keep track of which have been visited
    const visited: {
      [key: string]: number | undefined;
    } = {};
    for (const ip in AllServers) {
      visited[ip] = 0;
    }

    const stack: BaseServer[] = [];
    const depthQueue: number[] = [0];
    const currServ = player.getCurrentServer();
    stack.push(currServ);
    while (stack.length != 0) {
      const s = stack.pop();
      if (!s) continue;
      const d = depthQueue.pop();
      if (d === undefined) continue;
      const isHacknet = s instanceof HacknetServer;
      if (!all && (s as any).purchasedByPlayer && s.hostname != "home") {
        continue; // Purchased server
      } else if (visited[s.ip] || d > depth) {
        continue; // Already visited or out-of-depth
      } else if (!all && isHacknet) {
        continue; // Hacknet Server
      } else {
        visited[s.ip] = 1;
      }
      for (let i = s.serversOnNetwork.length - 1; i >= 0; --i) {
        const newS = getServerOnNetwork(s, i);
        if (newS === null) continue;
        stack.push(newS);
        depthQueue.push(d + 1);
      }
      if (d == 0) {
        continue;
      } // Don't print current server
      const titleDashes = Array((d - 1) * 4 + 1).join("-");
      if (player.hasProgram(Programs.AutoLink.name)) {
        this.append(new Link(s.hostname));
      } else {
        this.print(s.hostname);
      }

      const dashes = titleDashes + "--";
      let c = "NO";
      if (s.hasAdminRights) {
        c = "YES";
      }
      this.print(
        `${dashes}Root Access: ${c}${!isHacknet ? ", Required hacking skill: " + (s as any).requiredHackingSkill : ""}`,
      );
      if (s.hasOwnProperty("numOpenPortsRequired")) {
        this.print(dashes + "Number of open ports required to NUKE: " + (s as any).numOpenPortsRequired);
      }
      this.print(dashes + "RAM: " + numeralWrapper.formatRAM(s.maxRam));
      this.print(" ");
    }

    const links = document.getElementsByClassName("scan-analyze-link");
    for (let i = 0; i < links.length; ++i) {
      (() => {
        const hostname = links[i].innerHTML.toString();
        links[i].addEventListener("onclick", () => {
          if (this.action !== null) {
            return;
          }
          this.connectToServer(player, hostname);
        });
      })(); // Immediate invocation
    }
  }

  connectToServer(player: IPlayer, server: string): void {
    const serv = getServer(server);
    if (serv == null) {
      this.error("Invalid server. Connection failed.");
      return;
    }
    player.getCurrentServer().isConnectedTo = false;
    player.currentServer = serv.ip;
    player.getCurrentServer().isConnectedTo = true;
    this.print("Connected to " + serv.hostname);
    this.setcwd("/");
    if (player.getCurrentServer().hostname == "darkweb") {
      checkIfConnectedToDarkweb(); // Posts a 'help' message if connecting to dark web
    }
  }

  executeCommands(engine: IEngine, player: IPlayer, commands: string): void {
    // Sanitize input
    commands = commands.trim();
    commands = commands.replace(/\s\s+/g, " "); // Replace all extra whitespace in command with a single space

    // Handle Terminal History - multiple commands should be saved as one
    if (this.commandHistory[this.commandHistory.length - 1] != commands) {
      this.commandHistory.push(commands);
      if (this.commandHistory.length > 50) {
        this.commandHistory.splice(0, 1);
      }
    }
    this.commandHistoryIndex = this.commandHistory.length;
    const allCommands = ParseCommands(commands);

    for (let i = 0; i < allCommands.length; i++) {
      this.executeCommand(engine, player, allCommands[i]);
    }
  }

  clear(): void {
    // TODO: remove this once we figure out the height issue.
    this.outputHistory = [new Output(`Bitburner v${CONSTANTS.Version}`, "primary")];
    this.hasChanges = true;
  }

  prestige(): void {
    this.action = null;
    this.clear();
  }

  executeCommand(engine: IEngine, player: IPlayer, command: string): void {
    if (this.action !== null) {
      this.error(`Cannot execute command (${command}) while an action is in progress`);
      return;
    }
    // Allow usage of ./
    if (command.startsWith("./")) {
      command = "run " + command.slice(2);
    }
    // Only split the first space
    const commandArray = ParseCommand(command);
    if (commandArray.length == 0) {
      return;
    }
    const s = player.getCurrentServer();
    /****************** Interactive Tutorial Terminal Commands ******************/
    if (ITutorial.isRunning) {
      const n00dlesServ = GetServerByHostname("n00dles");
      if (n00dlesServ == null) {
        throw new Error("Could not get n00dles server");
        return;
      }
      switch (ITutorial.currStep) {
        case iTutorialSteps.TerminalHelp:
          if (commandArray.length === 1 && commandArray[0] == "help") {
            TerminalHelpText.forEach((line) => this.print(line));
            iTutorialNextStep();
          } else {
            this.print("Bad command. Please follow the tutorial");
          }
          break;
        case iTutorialSteps.TerminalLs:
          if (commandArray.length === 1 && commandArray[0] == "ls") {
            ls(this, engine, player, s, commandArray.slice(1));
            iTutorialNextStep();
          } else {
            this.print("Bad command. Please follow the tutorial");
          }
          break;
        case iTutorialSteps.TerminalScan:
          if (commandArray.length === 1 && commandArray[0] == "scan") {
            scan(this, engine, player, s, commandArray.slice(1));
            iTutorialNextStep();
          } else {
            this.print("Bad command. Please follow the tutorial");
          }
          break;
        case iTutorialSteps.TerminalScanAnalyze1:
          if (commandArray.length == 1 && commandArray[0] == "scan-analyze") {
            this.executeScanAnalyzeCommand(player, 1);
            iTutorialNextStep();
          } else {
            this.print("Bad command. Please follow the tutorial");
          }
          break;
        case iTutorialSteps.TerminalScanAnalyze2:
          if (commandArray.length == 2 && commandArray[0] == "scan-analyze" && commandArray[1] === 2) {
            this.executeScanAnalyzeCommand(player, 2);
            iTutorialNextStep();
          } else {
            this.print("Bad command. Please follow the tutorial");
          }
          break;
        case iTutorialSteps.TerminalConnect:
          if (commandArray.length == 2) {
            if (commandArray[0] == "connect" && (commandArray[1] == "n00dles" || commandArray[1] == n00dlesServ.ip)) {
              player.getCurrentServer().isConnectedTo = false;
              player.currentServer = n00dlesServ.ip;
              player.getCurrentServer().isConnectedTo = true;
              this.print("Connected to n00dles");
              iTutorialNextStep();
            } else {
              this.print("Wrong command! Try again!");
              return;
            }
          } else {
            this.print("Bad command. Please follow the tutorial");
          }
          break;
        case iTutorialSteps.TerminalAnalyze:
          if (commandArray.length === 1 && commandArray[0] === "analyze") {
            if (commandArray.length !== 1) {
              this.print("Incorrect usage of analyze command. Usage: analyze");
              return;
            }
            this.startAnalyze();
            iTutorialNextStep();
          } else {
            this.print("Bad command. Please follow the tutorial");
          }
          break;
        case iTutorialSteps.TerminalNuke:
          if (commandArray.length == 2 && commandArray[0] == "run" && commandArray[1] == "NUKE.exe") {
            n00dlesServ.hasAdminRights = true;
            this.print("NUKE successful! Gained root access to n00dles");
            iTutorialNextStep();
          } else {
            this.print("Bad command. Please follow the tutorial");
          }
          break;
        case iTutorialSteps.TerminalManualHack:
          if (commandArray.length == 1 && commandArray[0] == "hack") {
            this.startHack(player);
            iTutorialNextStep();
          } else {
            this.print("Bad command. Please follow the tutorial");
          }
          break;
        case iTutorialSteps.TerminalCreateScript:
          if (commandArray.length == 2 && commandArray[0] == "nano" && commandArray[1] == "n00dles.script") {
            engine.loadScriptEditorContent("n00dles.script", "");
            iTutorialNextStep();
          } else {
            this.print("Bad command. Please follow the tutorial");
          }
          break;
        case iTutorialSteps.TerminalFree:
          if (commandArray.length == 1 && commandArray[0] == "free") {
            free(this, engine, player, s, commandArray.slice(1));
            iTutorialNextStep();
          } else {
            this.print("Bad command. Please follow the tutorial");
          }
          break;
        case iTutorialSteps.TerminalRunScript:
          if (commandArray.length == 2 && commandArray[0] == "run" && commandArray[1] == "n00dles.script") {
            run(this, engine, player, s, commandArray.slice(1));
            iTutorialNextStep();
          } else {
            this.print("Bad command. Please follow the tutorial");
          }
          break;
        case iTutorialSteps.ActiveScriptsToTerminal:
          if (commandArray.length == 2 && commandArray[0] == "tail" && commandArray[1] == "n00dles.script") {
            // Check that the script exists on this machine
            const runningScript = findRunningScript("n00dles.script", [], player.getCurrentServer());
            if (runningScript == null) {
              this.print("Error: No such script exists");
              return;
            }
            logBoxCreate(runningScript);
            iTutorialNextStep();
          } else {
            this.print("Bad command. Please follow the tutorial");
          }
          break;
        default:
          this.print("Please follow the tutorial, or click 'Exit Tutorial' if you'd like to skip it");
          return;
      }
      return;
    }
    /****************** END INTERACTIVE TUTORIAL ******************/
    /* Command parser */
    const commandName = commandArray[0];
    if (typeof commandName === "number") {
      this.error(`Command ${commandArray[0]} not found`);
      return;
    }

    const commands: {
      [key: string]: (
        terminal: ITerminal,
        engine: IEngine,
        player: IPlayer,
        server: BaseServer,
        args: (string | number)[],
      ) => void;
    } = {
      alias: alias,
      analyze: analyze,
      backdoor: backdoor,
      buy: buy,
      cat: cat,
      cd: cd,
      check: check,
      cls: () => this.clear(),
      clear: () => this.clear(),
      connect: connect,
      download: download,
      expr: expr,
      free: free,
      hack: hack,
      help: help,
      home: home,
      hostname: hostname,
      ifconfig: ifconfig,
      kill: kill,
      killall: killall,
      ls: ls,
      lscpu: lscpu,
      mem: mem,
      mv: mv,
      nano: nano,
      ps: ps,
      rm: rm,
      run: run,
      scan: scan,
      "scan-analyze": scananalyze,
      scp: scp,
      sudov: sudov,
      tail: tail,
      theme: theme,
      top: top,
      unalias: unalias,
      wget: wget,
    };

    const f = commands[commandName.toLowerCase()];
    if (!f) {
      this.error(`Command ${commandArray[0]} not found`);
      return;
    }

    f(this, engine, player, s, commandArray.slice(1));
  }

  getProgressText(): string {
    if (this.action === null) throw new Error("trying to get the progress text when there's no action");
    return createProgressBarText({
      progress: (this.action.time - this.action.timeLeft) / this.action.time,
      totalTicks: 50,
    });
  }
}
