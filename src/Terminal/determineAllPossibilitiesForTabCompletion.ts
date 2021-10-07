import { evaluateDirectoryPath, getAllParentDirectories } from "./DirectoryHelpers";
import { getSubdirectories } from "./DirectoryServerHelpers";

import { Aliases, GlobalAliases } from "../Alias";
import { DarkWebItems } from "../DarkWeb/DarkWebItems";
import { Message } from "../Message/Message";
import { IPlayer } from "../PersonObjects/IPlayer";
import { GetServer, GetAllServers } from "../Server/AllServers";

// An array of all Terminal commands
const commands = [
  "alias",
  "analyze",
  "backdoor",
  "cat",
  "cd",
  "check",
  "clear",
  "cls",
  "connect",
  "download",
  "expr",
  "free",
  "grow",
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
  "scan-analyze",
  "scan",
  "scp",
  "sudov",
  "tail",
  "theme",
  "top",
  "weaken",
];

export function determineAllPossibilitiesForTabCompletion(
  p: IPlayer,
  input: string,
  index: number,
  currPath = "",
): string[] {
  let allPos: string[] = [];
  allPos = allPos.concat(Object.keys(GlobalAliases));
  const currServ = p.getCurrentServer();
  const homeComputer = p.getHomeComputer();

  let parentDirPath = "";
  let evaledParentDirPath: string | null = null;

  // Helper functions
  function addAllCodingContracts(): void {
    for (const cct of currServ.contracts) {
      allPos.push(cct.fn);
    }
  }

  function addAllLitFiles(): void {
    for (const file of currServ.messages) {
      if (!(file instanceof Message)) {
        allPos.push(file);
      }
    }
  }

  function addAllMessages(): void {
    for (const file of currServ.messages) {
      if (file instanceof Message) {
        allPos.push(file.filename);
      }
    }
  }

  function addAllPrograms(): void {
    for (const program of homeComputer.programs) {
      allPos.push(program);
    }
  }

  function addAllScripts(): void {
    for (const script of currServ.scripts) {
      const res = processFilepath(script.filename);
      if (res) {
        allPos.push(res);
      }
    }
  }

  function addAllTextFiles(): void {
    for (const txt of currServ.textFiles) {
      const res = processFilepath(txt.fn);
      if (res) {
        allPos.push(res);
      }
    }
  }

  function addAllDirectories(): void {
    // Directories are based on the currently evaluated path
    const subdirs = getSubdirectories(currServ, evaledParentDirPath == null ? "/" : evaledParentDirPath);

    for (let i = 0; i < subdirs.length; ++i) {
      const assembledDirPath = evaledParentDirPath == null ? subdirs[i] : evaledParentDirPath + subdirs[i];
      const res = processFilepath(assembledDirPath);
      if (res != null) {
        subdirs[i] = res;
      }
    }

    allPos = allPos.concat(subdirs);
  }

  // Convert from the real absolute path back to the original path used in the input
  function convertParentPath(filepath: string): string {
    if (parentDirPath == null || evaledParentDirPath == null) {
      console.warn(`convertParentPath() called when paths are null`);
      return filepath;
    }

    if (!filepath.startsWith(evaledParentDirPath)) {
      console.warn(
        `convertParentPath() called for invalid path. (filepath=${filepath}) (evaledParentDirPath=${evaledParentDirPath})`,
      );
      return filepath;
    }

    return parentDirPath + filepath.slice(evaledParentDirPath.length);
  }

  // Given an a full, absolute filepath, converts it to the proper value
  // for autocompletion purposes
  function processFilepath(filepath: string): string | null {
    if (evaledParentDirPath) {
      if (filepath.startsWith(evaledParentDirPath)) {
        return convertParentPath(filepath);
      }
    } else if (parentDirPath !== "") {
      // If the parent directory is the root directory, but we're not searching
      // it from the root directory, we have to add the original path
      let t_parentDirPath = parentDirPath;
      if (!t_parentDirPath.endsWith("/")) {
        t_parentDirPath += "/";
      }
      return parentDirPath + filepath;
    } else {
      return filepath;
    }

    return null;
  }

  function isCommand(cmd: string): boolean {
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
    for (let i = 0; i < currServ.scripts.length; ++i) {
      allPos.push("./" + currServ.scripts[i].filename);
    }

    //Programs are on home computer
    for (let i = 0; i < homeComputer.programs.length; ++i) {
      allPos.push("./" + homeComputer.programs[i]);
    }
    return allPos;
  }

  // Autocomplete the command
  if (index === -1) {
    return commands.concat(Object.keys(Aliases)).concat(Object.keys(GlobalAliases));
  }

  // Since we're autocompleting an argument and not a command, the argument might
  // be a file/directory path. We have to account for that when autocompleting
  const commandArray = input.split(" ");
  if (commandArray.length === 0) {
    console.warn(`Tab autocompletion logic reached invalid branch`);
    return allPos;
  }
  const arg = commandArray[commandArray.length - 1];
  parentDirPath = getAllParentDirectories(arg);
  evaledParentDirPath = evaluateDirectoryPath(parentDirPath, currPath);
  if (evaledParentDirPath === "/") {
    evaledParentDirPath = null;
  } else if (evaledParentDirPath == null) {
    return allPos; // Invalid path
  } else {
    evaledParentDirPath += "/";
  }

  if (isCommand("buy")) {
    const options = [];
    for (const i in DarkWebItems) {
      const item = DarkWebItems[i];
      options.push(item.program);
    }

    return options.concat(Object.keys(GlobalAliases));
  }

  if (isCommand("scp") && index === 1) {
    for (const server of GetAllServers()) {
      allPos.push(server.ip);
      allPos.push(server.hostname);
    }

    return allPos;
  }

  if (isCommand("scp") && index === 0) {
    addAllScripts();
    addAllLitFiles();
    addAllTextFiles();
    addAllDirectories();

    return allPos;
  }

  if (isCommand("connect")) {
    // All network connections
    for (let i = 0; i < currServ.serversOnNetwork.length; ++i) {
      const serv = GetServer(currServ.serversOnNetwork[i]);
      if (serv == null) {
        continue;
      }
      allPos.push(serv.ip);
      allPos.push(serv.hostname);
    }

    return allPos;
  }

  if (isCommand("kill") || isCommand("tail") || isCommand("mem") || isCommand("check")) {
    addAllScripts();
    addAllDirectories();

    return allPos;
  }

  if (isCommand("nano")) {
    addAllScripts();
    addAllTextFiles();
    allPos.push(".fconf");
    addAllDirectories();

    return allPos;
  }

  if (isCommand("rm")) {
    addAllScripts();
    addAllPrograms();
    addAllLitFiles();
    addAllTextFiles();
    addAllCodingContracts();
    addAllDirectories();

    return allPos;
  }

  if (isCommand("run")) {
    addAllScripts();
    addAllPrograms();
    addAllCodingContracts();
    addAllDirectories();

    return allPos;
  }

  if (isCommand("cat")) {
    addAllMessages();
    addAllLitFiles();
    addAllTextFiles();
    addAllDirectories();

    return allPos;
  }

  if (isCommand("download") || isCommand("mv")) {
    addAllScripts();
    addAllTextFiles();
    addAllDirectories();

    return allPos;
  }

  if (isCommand("cd")) {
    addAllDirectories();

    return allPos;
  }

  if (isCommand("ls") && index === 0) {
    addAllDirectories();
  }

  return allPos;
}
