/* eslint-disable no-await-in-loop */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jest, describe, expect, test } from '@jest/globals'

import { Player } from "../../src/Player";
import { determineAllPossibilitiesForTabCompletion } from "../../src/Terminal/determineAllPossibilitiesForTabCompletion";
import { Server } from "../../src/Server/Server";
import { AddToAllServers, prestigeAllServers } from "../../src/Server/AllServers";
import { LocationName } from "../../src/Locations/data/LocationNames";
import { CodingContract } from "../../src/CodingContracts";

jest.mock(`!!raw-loader!../NetscriptDefinitions.d.ts`, () => '', {
  virtual: true,
});

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

  it("completes the connect command", async () => {
    const options = await determineAllPossibilitiesForTabCompletion(Player, "connect ", 0);
    expect(options).toEqual(["near"]);
  });

  it("completes the buy command", async () => {
    const options = await determineAllPossibilitiesForTabCompletion(Player, "buy ", 0);
    expect(options.sort()).toEqual([
      "BruteSSH.exe",
      "FTPCrack.exe",
      "relaySMTP.exe",
      "HTTPWorm.exe",
      "SQLInject.exe",
      "DeepscanV1.exe",
      "DeepscanV2.exe",
      "AutoLink.exe",
      "ServerProfiler.exe",
      "Formulas.exe",
    ].sort());
  });

  it("completes the scp command", async () => {
    Player.getHomeComputer().writeToTextFile("note.txt", "oh hai mark");
    Player.getHomeComputer().messages.push("af.lit");
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    const options1 = await determineAllPossibilitiesForTabCompletion(Player, "scp ", 0);
    expect(options1).toEqual(["/www/script.js", "af.lit", "note.txt", "www/"]);

    const options2 = await determineAllPossibilitiesForTabCompletion(Player, "scp note.txt ", 1);
    expect(options2).toEqual(["home", "near", "far"]);
  });

  it("completes the kill, tail, mem, and check commands", async () => {
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    for (const command of ["kill", "tail", "mem", "check"]) {
      const options = await determineAllPossibilitiesForTabCompletion(Player, `${command} `, 0);
      expect(options).toEqual(["/www/script.js", "www/"]);
    }
  });

  it("completes the nano commands", async () => {
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    Player.getHomeComputer().writeToTextFile("note.txt", "oh hai mark");
    const options = await determineAllPossibilitiesForTabCompletion(Player, "nano ", 0);
    expect(options).toEqual([
      "/www/script.js",
      "note.txt",
      "www/",
    ]);
  });

  it("completes the rm command", async () => {
    Player.getHomeComputer().writeToTextFile("note.txt", "oh hai mark");
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    Player.getHomeComputer().contracts.push(new CodingContract("linklist.cct"));
    Player.getHomeComputer().messages.push("asl.msg");
    Player.getHomeComputer().messages.push("af.lit");
    const options = await determineAllPossibilitiesForTabCompletion(Player, "rm ", 0);
    expect(options).toEqual([
      "/www/script.js",
      "NUKE.exe",
      "af.lit",
      "note.txt",
      "linklist.cct",
      "www/",
    ]);
  });

  it("completes the run command", async () => {
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    Player.getHomeComputer().contracts.push(new CodingContract("linklist.cct"));
    const options = await determineAllPossibilitiesForTabCompletion(Player, "run ", 0);
    expect(options).toEqual([
      "/www/script.js",
      "NUKE.exe",
      "linklist.cct",
      "www/",
    ]);
  });

  it("completes the cat command", async () => {
    Player.getHomeComputer().writeToTextFile("/www/note.txt", "oh hai mark");
    Player.getHomeComputer().messages.push("asl.msg");
    Player.getHomeComputer().messages.push("af.lit");
    const options = await determineAllPossibilitiesForTabCompletion(Player, "cat ", 0);
    expect(options).toEqual([
      "asl.msg",
      "af.lit",
      "/www/note.txt",
      "www/",
    ]);
  });

  it("completes the download and mv commands", async () => {
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    Player.getHomeComputer().writeToTextFile("note.txt", "oh hai mark");
    for (const command of ["download", "mv"]) {

      const options = await determineAllPossibilitiesForTabCompletion(Player, `${command} `, 0);
      expect(options).toEqual([
        "/www/script.js",
        "note.txt",
        "www/",
      ]);
    }
  });

  it("completes the cd command", async () => {
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    const options = await determineAllPossibilitiesForTabCompletion(Player, "cd ", 0);
    expect(options).toEqual(["www/"]);
  });

  it("completes the ls and cd commands", async () => {
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    for (const command of ["ls", "cd"]) {
      const options = await determineAllPossibilitiesForTabCompletion(Player, `${command} `, 0);
      expect(options).toEqual(["www/"]);
    }
  });

  it("completes commands starting with ./", async () => {
    Player.getHomeComputer().writeToScriptFile("/www/script.js", "oh hai mark");
    const options = await determineAllPossibilitiesForTabCompletion(Player, "run ./", 0);
    expect(options).toEqual([
      ".//www/script.js",
      "NUKE.exe",
      "./www/",
    ]);
  });
});
