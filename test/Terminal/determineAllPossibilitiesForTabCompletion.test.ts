import { Player } from "../../src/Player";
import { determineAllPossibilitiesForTabCompletion } from "../../src/Terminal/determineAllPossibilitiesForTabCompletion";
import { Server } from "../../src/Server/Server";
import { AddToAllServers, prestigeAllServers } from "../../src/Server/AllServers";
import { LocationName } from "../../src/Locations/data/LocationNames";
import { Message } from "../../src/Message/Message";
import { CodingContract } from "../../src/CodingContracts";

describe("determineAllPossibilitiesForTabCompletion", function () {
  let closeServer: Server;
  let farServer: Server;

  beforeEach(() => {
    prestigeAllServers();
    Player.init();

    closeServer = new Server({
      ip: "8.8.8.8",
      hostname: "near",
      hackDifficulty: 1,
      moneyAvailable: 70000,
      numOpenPortsRequired: 0,
      organizationName: LocationName.NewTokyoNoodleBar,
      requiredHackingSkill: 1,
      serverGrowth: 3000,
    });
    farServer = new Server({
      ip: "4.4.4.4",
      hostname: "far",
      hackDifficulty: 1,
      moneyAvailable: 70000,
      numOpenPortsRequired: 0,
      organizationName: LocationName.Aevum,
      requiredHackingSkill: 1,
      serverGrowth: 3000,
    });
    Player.getHomeComputer().serversOnNetwork.push(closeServer.ip);
    closeServer.serversOnNetwork.push(Player.getHomeComputer().ip);
    closeServer.serversOnNetwork.push(farServer.ip);
    farServer.serversOnNetwork.push(closeServer.ip);
    AddToAllServers(closeServer);
    AddToAllServers(farServer);
  });

  it("completes the connect command", () => {
    const options = determineAllPossibilitiesForTabCompletion(Player, "connect ", 0);
    expect(options).toEqual(["8.8.8.8", "near"]);
  });

  it("completes the buy command", () => {
    const options = determineAllPossibilitiesForTabCompletion(Player, "buy ", 0);
    expect(options).toEqual([
      "BruteSSH.exe",
      "FTPCrack.exe",
      "relaySMTP.exe",
      "HTTPWorm.exe",
      "SQLInject.exe",
      "DeepscanV1.exe",
      "DeepscanV2.exe",
      "AutoLink.exe",
      "ServerProfiler.exe",
    ]);
  });

  it("completes the scp command", () => {
    Player.getHomeComputer().writeToTextFile("note.txt", "oh hai mark");
    Player.getHomeComputer().messages.push("af.lit");
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    const options1 = determineAllPossibilitiesForTabCompletion(Player, "scp ", 0);
    expect(options1).toEqual(["/www/script.js", "af.lit", "note.txt", "www/"]);

    const options2 = determineAllPossibilitiesForTabCompletion(Player, "scp note.txt ", 1);
    expect(options2).toEqual([Player.getHomeComputer().ip, "home", "8.8.8.8", "near", "4.4.4.4", "far"]);
  });

  it("completes the kill, tail, mem, and check commands", () => {
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    for (const command of ["kill", "tail", "mem", "check"]) {
      expect(determineAllPossibilitiesForTabCompletion(Player, `${command} `, 0)).toEqual(["/www/script.js", "www/"]);
    }
  });

  it("completes the nano commands", () => {
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    Player.getHomeComputer().writeToTextFile("note.txt", "oh hai mark");
    expect(determineAllPossibilitiesForTabCompletion(Player, "nano ", 0)).toEqual([
      "/www/script.js",
      "note.txt",
      ".fconf",
      "www/",
    ]);
  });

  it("completes the rm command", () => {
    Player.getHomeComputer().writeToTextFile("note.txt", "oh hai mark");
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    Player.getHomeComputer().contracts.push(new CodingContract("linklist.cct"));
    Player.getHomeComputer().messages.push(new Message("asl.msg"));
    Player.getHomeComputer().messages.push("af.lit");
    expect(determineAllPossibilitiesForTabCompletion(Player, "rm ", 0)).toEqual([
      "/www/script.js",
      "NUKE.exe",
      "af.lit",
      "note.txt",
      "linklist.cct",
      "www/",
    ]);
  });

  it("completes the run command", () => {
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    Player.getHomeComputer().contracts.push(new CodingContract("linklist.cct"));
    expect(determineAllPossibilitiesForTabCompletion(Player, "run ", 0)).toEqual([
      "/www/script.js",
      "NUKE.exe",
      "linklist.cct",
      "www/",
    ]);
  });

  it("completes the cat command", () => {
    Player.getHomeComputer().writeToTextFile("/www/note.txt", "oh hai mark");
    Player.getHomeComputer().messages.push(new Message("asl.msg"));
    Player.getHomeComputer().messages.push("af.lit");
    expect(determineAllPossibilitiesForTabCompletion(Player, "cat ", 0)).toEqual([
      "asl.msg",
      "af.lit",
      "/www/note.txt",
      "www/",
    ]);
  });

  it("completes the download and mv commands", () => {
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    Player.getHomeComputer().writeToTextFile("note.txt", "oh hai mark");
    for (const command of ["download", "mv"]) {
      expect(determineAllPossibilitiesForTabCompletion(Player, `${command} `, 0)).toEqual([
        "/www/script.js",
        "note.txt",
        "www/",
      ]);
    }
  });

  it("completes the cd command", () => {
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    expect(determineAllPossibilitiesForTabCompletion(Player, "cd ", 0)).toEqual(["www/"]);
  });

  it("completes the ls and cd commands", () => {
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    for (const command of ["ls", "cd"]) {
      expect(determineAllPossibilitiesForTabCompletion(Player, `${command} `, 0)).toEqual(["www/"]);
    }
  });

  it("completes commands starting with ./", () => {
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    expect(determineAllPossibilitiesForTabCompletion(Player, "run ./", 0)).toEqual([
      ".//www/script.js",
      "NUKE.exe",
      "./www/",
    ]);
  });
});
