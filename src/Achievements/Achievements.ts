import { PlayerObject } from "src/PersonObjects/Player/PlayerObject";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { SkillNames } from "../Bladeburner/data/SkillNames";
import { Skills } from "../Bladeburner/Skills";
import { CONSTANTS } from "../Constants";
import { Industries } from "../Corporation/IndustryData";
import { Exploit } from "../Exploits/Exploit";
import { Factions } from "../Faction/Factions";
import { AllGangs } from "../Gang/AllGangs";
import { GangConstants } from "../Gang/data/Constants";
import { HacknetNodeConstants, HacknetServerConstants } from "../Hacknet/data/Constants";
import { hasHacknetServers } from "../Hacknet/HacknetHelpers";
import { HacknetNode } from "../Hacknet/HacknetNode";
import { HacknetServer } from "../Hacknet/HacknetServer";
import { CityName } from "../Locations/data/CityNames";
import { Player } from "../Player";
import { Programs } from "../Programs/Programs";
import { GetAllServers, GetServer } from "../Server/AllServers";
import { SpecialServers } from "../Server/data/SpecialServers";
import { Server } from "../Server/Server";
import { Router } from "../ui/GameRoot";
import { Page } from "../ui/Router";
import { IMap } from "../types";
import * as data from "./AchievementData.json";

// Unable to correctly cast the JSON data into AchievementDataJson type otherwise...
const achievementData = (<AchievementDataJson>(<unknown>data)).achievements;

export interface Achievement {
  ID: string;
  Icon?: string;
  Name?: string;
  Description?: string;
  Secret?: boolean;
  Condition: () => boolean;
  Visible?: () => boolean;
  AdditionalUnlock?: string[]; // IDs of achievements that should be awarded when awarding this one
}

export interface PlayerAchievement {
  ID: string;
  unlockedOn?: number;
}

export interface AchievementDataJson {
  achievements: IMap<AchievementData>;
}

export interface AchievementData {
  ID: string;
  Name: string;
  Description: string;
}

function bitNodeFinishedState(): boolean {
  const wd = GetServer(SpecialServers.WorldDaemon);
  if (!(wd instanceof Server)) return false;
  if (wd.backdoorInstalled) return true;
  return Player.bladeburner !== null && Player.bladeburner.blackops.hasOwnProperty("Operation Daedalus");
}

function hasAccessToSF(player: PlayerObject, bn: number): boolean {
  return player.bitNodeN === bn || player.sourceFiles.some((a) => a.n === bn);
}

function knowsAboutBitverse(player: PlayerObject): boolean {
  return player.sourceFiles.some((a) => a.n === 1);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sfAchievement(): Achievement[] {
  const achs: Achievement[] = [];
  for (let i = 0; i <= 11; i++) {
    for (let j = 1; j <= 3; j++) {
      achs.push({
        ID: `SF${i}.${j}`,
        Condition: () => Player.sourceFileLvl(i) >= j,
      });
    }
  }
  return achs;
}

export const achievements: IMap<Achievement> = {
  CYBERSEC: {
    ...achievementData["CYBERSEC"],
    Icon: "CSEC",
    Condition: () => Player.factions.includes("CyberSec"),
  },
  NITESEC: {
    ...achievementData["NITESEC"],
    Icon: "NiteSec",
    Condition: () => Player.factions.includes("NiteSec"),
  },
  THE_BLACK_HAND: {
    ...achievementData["THE_BLACK_HAND"],
    Icon: "TBH",
    Condition: () => Player.factions.includes("The Black Hand"),
  },
  BITRUNNERS: {
    ...achievementData["BITRUNNERS"],
    Icon: "bitrunners",
    Condition: () => Player.factions.includes("BitRunners"),
  },
  DAEDALUS: {
    ...achievementData["DAEDALUS"],
    Icon: "daedalus",
    Condition: () => Player.factions.includes("Daedalus"),
  },
  THE_COVENANT: {
    ...achievementData["THE_COVENANT"],
    Icon: "thecovenant",
    Condition: () => Player.factions.includes("The Covenant"),
  },
  ILLUMINATI: {
    ...achievementData["ILLUMINATI"],
    Icon: "illuminati",
    Condition: () => Player.factions.includes("Illuminati"),
  },
  "BRUTESSH.EXE": {
    ...achievementData["BRUTESSH.EXE"],
    Icon: "p0",
    Condition: () => Player.getHomeComputer().programs.includes(Programs.BruteSSHProgram.name),
  },
  "FTPCRACK.EXE": {
    ...achievementData["FTPCRACK.EXE"],
    Icon: "p1",
    Condition: () => Player.getHomeComputer().programs.includes(Programs.FTPCrackProgram.name),
  },
  //-----------------------------------------------------
  "RELAYSMTP.EXE": {
    ...achievementData["RELAYSMTP.EXE"],
    Icon: "p2",
    Condition: () => Player.getHomeComputer().programs.includes(Programs.RelaySMTPProgram.name),
  },
  "HTTPWORM.EXE": {
    ...achievementData["HTTPWORM.EXE"],
    Icon: "p3",
    Condition: () => Player.getHomeComputer().programs.includes(Programs.HTTPWormProgram.name),
  },
  "SQLINJECT.EXE": {
    ...achievementData["SQLINJECT.EXE"],
    Icon: "p4",
    Condition: () => Player.getHomeComputer().programs.includes(Programs.SQLInjectProgram.name),
  },
  "FORMULAS.EXE": {
    ...achievementData["FORMULAS.EXE"],
    Icon: "formulas",
    Condition: () => Player.getHomeComputer().programs.includes(Programs.Formulas.name),
  },
  "SF1.1": {
    ...achievementData["SF1.1"],
    Icon: "SF1.1",
    Visible: () => hasAccessToSF(Player, 1),
    Condition: () => Player.sourceFileLvl(1) >= 1,
  },
  "SF2.1": {
    ...achievementData["SF2.1"],
    Icon: "SF2.1",
    Visible: () => hasAccessToSF(Player, 2),
    Condition: () => Player.sourceFileLvl(2) >= 1,
  },
  "SF3.1": {
    ...achievementData["SF3.1"],
    Icon: "SF3.1",
    Visible: () => hasAccessToSF(Player, 3),
    Condition: () => Player.sourceFileLvl(3) >= 1,
  },
  "SF4.1": {
    ...achievementData["SF4.1"],
    Icon: "SF4.1",
    Visible: () => hasAccessToSF(Player, 4),
    Condition: () => Player.sourceFileLvl(4) >= 1,
  },
  "SF5.1": {
    ...achievementData["SF5.1"],
    Icon: "SF5.1",
    Visible: () => hasAccessToSF(Player, 5),
    Condition: () => Player.sourceFileLvl(5) >= 1,
  },
  "SF6.1": {
    ...achievementData["SF6.1"],
    Icon: "SF6.1",
    Visible: () => hasAccessToSF(Player, 6),
    Condition: () => Player.sourceFileLvl(6) >= 1,
  },
  "SF7.1": {
    ...achievementData["SF7.1"],
    Icon: "SF7.1",
    Visible: () => hasAccessToSF(Player, 7),
    Condition: () => Player.sourceFileLvl(7) >= 1,
  },
  "SF8.1": {
    ...achievementData["SF8.1"],
    Icon: "SF8.1",
    Visible: () => hasAccessToSF(Player, 8),
    Condition: () => Player.sourceFileLvl(8) >= 1,
  },
  "SF9.1": {
    ...achievementData["SF9.1"],
    Icon: "SF9.1",
    Visible: () => hasAccessToSF(Player, 9),
    Condition: () => Player.sourceFileLvl(9) >= 1,
  },
  "SF10.1": {
    ...achievementData["SF10.1"],
    Icon: "SF10.1",
    Visible: () => hasAccessToSF(Player, 10),
    Condition: () => Player.sourceFileLvl(10) >= 1,
  },
  "SF11.1": {
    ...achievementData["SF11.1"],
    Icon: "SF11.1",
    Visible: () => hasAccessToSF(Player, 11),
    Condition: () => Player.sourceFileLvl(11) >= 1,
  },
  "SF12.1": {
    ...achievementData["SF12.1"],
    Icon: "SF12.1",
    Visible: () => hasAccessToSF(Player, 12),
    Condition: () => Player.sourceFileLvl(12) >= 1,
  },
  MONEY_1Q: {
    ...achievementData["MONEY_1Q"],
    Icon: "$1Q",
    Condition: () => Player.money >= 1e18,
  },
  MONEY_M1B: {
    ...achievementData["MONEY_M1B"],
    Icon: "-1b",
    Secret: true,
    Condition: () => Player.money <= -1e9,
  },
  INSTALL_1: {
    ...achievementData["INSTALL_1"],
    Icon: "install",
    Condition: () => Player.augmentations.length >= 1,
  },
  INSTALL_100: {
    ...achievementData["INSTALL_100"],
    Icon: "install_100",
    Condition: () => Player.augmentations.length >= 100,
  },
  QUEUE_40: {
    ...achievementData["QUEUE_40"],
    Icon: "queue40",
    Condition: () => Player.queuedAugmentations.length >= 40,
  },
  HACKING_100000: {
    ...achievementData["HACKING_100000"],
    Icon: "hack100000",
    Condition: () => Player.hacking >= 100000,
  },
  COMBAT_3000: {
    ...achievementData["COMBAT_3000"],
    Icon: "combat3000",
    Condition: () =>
      Player.strength >= 3000 && Player.defense >= 3000 && Player.dexterity >= 3000 && Player.agility >= 3000,
  },
  NEUROFLUX_255: {
    ...achievementData["NEUROFLUX_255"],
    Icon: "nf255",
    Condition: () => Player.augmentations.some((a) => a.name === AugmentationNames.NeuroFluxGovernor && a.level >= 255),
  },
  NS2: {
    ...achievementData["NS2"],
    Icon: "ns2",
    Condition: () =>
      Player.getHomeComputer().scripts.some((s) => s.filename.endsWith(".js") || s.filename.endsWith(".ns")),
  },
  FROZE: {
    ...achievementData["FROZE"],
    Icon: "forze",
    Condition: () => location.href.includes("noScripts"),
  },
  RUNNING_SCRIPTS_1000: {
    ...achievementData["RUNNING_SCRIPTS_1000"],
    Icon: "run1000",
    Condition: (): boolean => {
      let running = 0;
      for (const s of GetAllServers()) {
        running += s.runningScripts.length;
      }
      return running >= 1000;
    },
  },
  DRAIN_SERVER: {
    ...achievementData["DRAIN_SERVER"],
    Icon: "drain",
    Condition: (): boolean => {
      for (const s of GetAllServers()) {
        if (s instanceof Server) {
          if (s.moneyMax > 0 && s.moneyAvailable === 0) return true;
        }
      }
      return false;
    },
  },
  MAX_RAM: {
    ...achievementData["MAX_RAM"],
    Icon: "maxram",
    Condition: () => Player.getHomeComputer().maxRam === CONSTANTS.HomeComputerMaxRam,
  },
  MAX_CORES: {
    ...achievementData["MAX_CORES"],
    Icon: "maxcores",
    Condition: () => Player.getHomeComputer().cpuCores === 8,
  },
  SCRIPTS_30: {
    ...achievementData["SCRIPTS_30"],
    Icon: "folders",
    Condition: () => Player.getHomeComputer().scripts.length >= 30,
  },
  KARMA_1000000: {
    ...achievementData["KARMA_1000000"],
    Icon: "karma",
    Secret: true,
    Condition: () => Player.karma <= -1e6,
  },
  STOCK_1q: {
    ...achievementData["STOCK_1q"],
    Icon: "$1Q",
    Condition: () => Player.moneySourceB.stock >= 1e15,
  },
  DISCOUNT: {
    ...achievementData["DISCOUNT"],
    Icon: "discount",
    Condition: (): boolean => {
      const p = GetServer("powerhouse-fitness");
      if (!(p instanceof Server)) return false;
      return p.backdoorInstalled;
    },
  },
  SCRIPT_32GB: {
    ...achievementData["SCRIPT_32GB"],
    Icon: "bigcost",
    Condition: () => Player.getHomeComputer().scripts.some((s) => s.ramUsage >= 32),
  },
  FIRST_HACKNET_NODE: {
    ...achievementData["FIRST_HACKNET_NODE"],
    Icon: "node",
    Condition: () => Player.hacknetNodes.length > 0,
  },
  "30_HACKNET_NODE": {
    ...achievementData["30_HACKNET_NODE"],
    Icon: "hacknet-all",
    Condition: () => Player.hacknetNodes.length >= 30,
  },
  MAX_HACKNET_NODE: {
    ...achievementData["MAX_HACKNET_NODE"],
    Icon: "hacknet-max",
    Condition: (): boolean => {
      for (const h of Player.hacknetNodes) {
        if (!(h instanceof HacknetNode) || !(h instanceof HacknetServer)) return false;
        if (
          h.ram >= HacknetNodeConstants.MaxRam &&
          h.cores >= HacknetNodeConstants.MaxCores &&
          h.level >= HacknetNodeConstants.MaxLevel
        )
          return true;
      }
      return false;
    },
  },
  HACKNET_NODE_10M: {
    ...achievementData["HACKNET_NODE_10M"],
    Icon: "hacknet-10m",
    Condition: () => Player.moneySourceB.hacknet >= 10e6,
  },
  REPUTATION_10M: {
    ...achievementData["REPUTATION_10M"],
    Icon: "reputation",
    Condition: () => Object.values(Factions).some((f) => f.playerReputation >= 10e6),
  },
  DONATION: {
    ...achievementData["DONATION"],
    Icon: "donation",
    Condition: () => Object.values(Factions).some((f) => f.favor >= 150),
  },
  TRAVEL: {
    ...achievementData["TRAVEL"],
    Icon: "TRAVEL",
    Condition: () => Player.city !== CityName.Sector12,
  },
  WORKOUT: {
    ...achievementData["WORKOUT"],
    Icon: "WORKOUT",
    Condition: () =>
      [
        CONSTANTS.ClassGymStrength,
        CONSTANTS.ClassGymDefense,
        CONSTANTS.ClassGymDexterity,
        CONSTANTS.ClassGymAgility,
      ].includes(Player.className),
  },
  TOR: {
    ...achievementData["TOR"],
    Icon: "TOR",
    Condition: () => Player.hasTorRouter(),
  },
  HOSPITALIZED: {
    ...achievementData["HOSPITALIZED"],
    Icon: "OUCH",
    Condition: () => Player.moneySourceB.hospitalization !== 0,
  },
  GANG: {
    ...achievementData["GANG"],
    Icon: "GANG",
    Visible: () => hasAccessToSF(Player, 2),
    Condition: () => Player.gang !== null,
  },
  FULL_GANG: {
    ...achievementData["FULL_GANG"],
    Icon: "GANGMAX",
    Visible: () => hasAccessToSF(Player, 2),
    Condition: () => Player.gang !== null && Player.gang.members.length === GangConstants.MaximumGangMembers,
  },
  GANG_TERRITORY: {
    ...achievementData["GANG_TERRITORY"],
    Icon: "GANG100%",
    Visible: () => hasAccessToSF(Player, 2),
    Condition: () => Player.gang !== null && AllGangs[Player.gang.facName].territory >= 0.999,
  },
  GANG_MEMBER_POWER: {
    ...achievementData["GANG_MEMBER_POWER"],
    Icon: "GANG10000",
    Visible: () => hasAccessToSF(Player, 2),
    Condition: () =>
      Player.gang !== null &&
      Player.gang.members.some(
        (m) =>
          m.hack >= 10000 || m.str >= 10000 || m.def >= 10000 || m.dex >= 10000 || m.agi >= 10000 || m.cha >= 10000,
      ),
  },
  CORPORATION: {
    ...achievementData["CORPORATION"],
    Icon: "CORP",
    Visible: () => hasAccessToSF(Player, 3),
    Condition: () => Player.corporation !== null,
  },
  CORPORATION_BRIBE: {
    ...achievementData["CORPORATION_BRIBE"],
    Icon: "CORPLOBBY",
    Visible: () => hasAccessToSF(Player, 3),
    Condition: () => Player.corporation !== null && Player.corporation.unlockUpgrades[6] === 1,
  },
  CORPORATION_PROD_1000: {
    ...achievementData["CORPORATION_PROD_1000"],
    Icon: "CORP1000",
    Visible: () => hasAccessToSF(Player, 3),
    Condition: () => Player.corporation !== null && Player.corporation.divisions.some((d) => d.prodMult >= 1000),
  },
  CORPORATION_EMPLOYEE_3000: {
    ...achievementData["CORPORATION_EMPLOYEE_3000"],
    Icon: "CORPCITY",
    Visible: () => hasAccessToSF(Player, 3),
    Condition: (): boolean => {
      if (Player.corporation === null) return false;
      for (const d of Player.corporation.divisions) {
        for (const o of Object.values(d.offices)) {
          if (o === 0) continue;
          if (o.employees.length >= 3000) return true;
        }
      }
      return false;
    },
  },
  CORPORATION_REAL_ESTATE: {
    ...achievementData["CORPORATION_REAL_ESTATE"],
    Icon: "CORPRE",
    Name: "Own the land",
    Description: "Expand to the Real Estate division.",
    Visible: () => hasAccessToSF(Player, 3),
    Condition: () =>
      Player.corporation !== null && Player.corporation.divisions.some((d) => d.type === Industries.RealEstate),
  },
  INTELLIGENCE_255: {
    ...achievementData["INTELLIGENCE_255"],
    Icon: "INT255",
    Visible: () => hasAccessToSF(Player, 5),
    Condition: () => Player.intelligence >= 255,
  },
  BLADEBURNER_DIVISION: {
    ...achievementData["BLADEBURNER_DIVISION"],
    Icon: "BLADE",
    Visible: () => hasAccessToSF(Player, 6),
    Condition: () => Player.bladeburner !== null,
  },
  BLADEBURNER_OVERCLOCK: {
    ...achievementData["BLADEBURNER_OVERCLOCK"],
    Icon: "BLADEOVERCLOCK",
    Visible: () => hasAccessToSF(Player, 6),
    Condition: () =>
      Player.bladeburner !== null &&
      Player.bladeburner.skills[SkillNames.Overclock] === Skills[SkillNames.Overclock].maxLvl,
  },
  BLADEBURNER_UNSPENT_100000: {
    ...achievementData["BLADEBURNER_UNSPENT_100000"],
    Icon: "BLADE100K",
    Visible: () => hasAccessToSF(Player, 6),
    Condition: () => Player.bladeburner !== null && Player.bladeburner.skillPoints >= 100000,
  },
  "4S": {
    ...achievementData["4S"],
    Icon: "4S",
    Condition: () => Player.has4SData,
  },
  FIRST_HACKNET_SERVER: {
    ...achievementData["FIRST_HACKNET_SERVER"],
    Icon: "HASHNET",
    Visible: () => hasAccessToSF(Player, 9),
    Condition: () => hasHacknetServers(Player) && Player.hacknetNodes.length > 0,
    AdditionalUnlock: [achievementData.FIRST_HACKNET_NODE.ID],
  },
  ALL_HACKNET_SERVER: {
    ...achievementData["ALL_HACKNET_SERVER"],
    Icon: "HASHNETALL",
    Visible: () => hasAccessToSF(Player, 9),
    Condition: () => hasHacknetServers(Player) && Player.hacknetNodes.length === HacknetServerConstants.MaxServers,
    AdditionalUnlock: [achievementData["30_HACKNET_NODE"].ID],
  },
  MAX_HACKNET_SERVER: {
    ...achievementData["MAX_HACKNET_SERVER"],
    Icon: "HASHNETALL",
    Visible: () => hasAccessToSF(Player, 9),
    Condition: (): boolean => {
      if (!hasHacknetServers(Player)) return false;
      for (const h of Player.hacknetNodes) {
        if (typeof h !== "string") return false;
        const hs = GetServer(h);
        if (!(hs instanceof HacknetServer)) return false;
        if (
          hs.maxRam === HacknetServerConstants.MaxRam &&
          hs.cores === HacknetServerConstants.MaxCores &&
          hs.level === HacknetServerConstants.MaxLevel &&
          hs.cache === HacknetServerConstants.MaxCache
        )
          return true;
      }
      return false;
    },
    AdditionalUnlock: [achievementData.MAX_HACKNET_NODE.ID],
  },
  HACKNET_SERVER_1B: {
    ...achievementData["HACKNET_SERVER_1B"],
    Icon: "HASHNETMONEY",
    Visible: () => hasAccessToSF(Player, 9),
    Condition: () => hasHacknetServers(Player) && Player.moneySourceB.hacknet >= 1e9,
    AdditionalUnlock: [achievementData.HACKNET_NODE_10M.ID],
  },
  MAX_CACHE: {
    ...achievementData["MAX_CACHE"],
    Icon: "HASHNETCAP",
    Visible: () => hasAccessToSF(Player, 9),
    Condition: () => hasHacknetServers(Player) &&
      Player.hashManager.hashes === Player.hashManager.capacity &&
      Player.hashManager.capacity > 0,
  },
  SLEEVE_8: {
    ...achievementData["SLEEVE_8"],
    Icon: "SLEEVE8",
    Visible: () => hasAccessToSF(Player, 10),
    Condition: () => Player.sleeves.length === 8,
  },
  INDECISIVE: {
    ...achievementData["INDECISIVE"],
    Icon: "1H",
    Visible: () => knowsAboutBitverse(Player),
    Condition: (function () {
      let c = 0;
      setInterval(() => {
        if (Router.page() === Page.BitVerse) {
          c++;
        } else {
          c = 0;
        }
      }, 60 * 1000);
      return () => c > 60;
    })(),
  },
  FAST_BN: {
    ...achievementData["FAST_BN"],
    Icon: "2DAYS",
    Visible: () => knowsAboutBitverse(Player),
    Condition: () => bitNodeFinishedState() && Player.playtimeSinceLastBitnode < 1000 * 60 * 60 * 24 * 2,
  },
  CHALLENGE_BN1: {
    ...achievementData["CHALLENGE_BN1"],
    Icon: "BN1+",
    Visible: () => knowsAboutBitverse(Player),
    Condition: () =>
      Player.bitNodeN === 1 &&
      bitNodeFinishedState() &&
      Player.getHomeComputer().maxRam <= 128 &&
      Player.getHomeComputer().cpuCores === 1,
  },
  CHALLENGE_BN2: {
    ...achievementData["CHALLENGE_BN2"],
    Icon: "BN2+",
    Visible: () => hasAccessToSF(Player, 2),
    Condition: () => Player.bitNodeN === 2 && bitNodeFinishedState() && Player.gang === null,
  },
  CHALLENGE_BN3: {
    ...achievementData["CHALLENGE_BN3"],
    Icon: "BN3+",
    Visible: () => hasAccessToSF(Player, 3),
    Condition: () => Player.bitNodeN === 3 && bitNodeFinishedState() && Player.corporation === null,
  },
  CHALLENGE_BN6: {
    ...achievementData["CHALLENGE_BN6"],
    Icon: "BN6+",
    Visible: () => hasAccessToSF(Player, 6),
    Condition: () => Player.bitNodeN === 6 && bitNodeFinishedState() && Player.bladeburner === null,
  },
  CHALLENGE_BN7: {
    ...achievementData["CHALLENGE_BN7"],
    Icon: "BN7+",
    Visible: () => hasAccessToSF(Player, 7),
    Condition: () => Player.bitNodeN === 7 && bitNodeFinishedState() && Player.bladeburner === null,
  },
  CHALLENGE_BN8: {
    ...achievementData["CHALLENGE_BN8"],
    Icon: "BN8+",
    Visible: () => hasAccessToSF(Player, 8),
    Condition: () => Player.bitNodeN === 8 && bitNodeFinishedState() && !Player.has4SData && !Player.has4SDataTixApi,
  },
  CHALLENGE_BN9: {
    ...achievementData["CHALLENGE_BN9"],
    Icon: "BN9+",
    Visible: () => hasAccessToSF(Player, 9),
    Condition: () =>
      Player.bitNodeN === 9 &&
      bitNodeFinishedState() &&
      Player.moneySourceB.hacknet === 0 &&
      Player.moneySourceB.hacknet_expenses === 0,
  },
  CHALLENGE_BN10: {
    ...achievementData["CHALLENGE_BN10"],
    Icon: "BN10+",
    Visible: () => hasAccessToSF(Player, 10),
    Condition: () =>
      Player.bitNodeN === 10 &&
      bitNodeFinishedState() &&
      !Player.sleeves.some(
        (s) =>
          s.augmentations.length > 0 ||
          s.hacking_exp > 0 ||
          s.strength_exp > 0 ||
          s.defense_exp > 0 ||
          s.agility_exp > 0 ||
          s.dexterity_exp > 0 ||
          s.charisma_exp > 0,
      ),
  },
  CHALLENGE_BN12: {
    ...achievementData["CHALLENGE_BN12"],
    Icon: "BN12+",
    Visible: () => hasAccessToSF(Player, 12),
    Condition: () => Player.sourceFileLvl(12) >= 50,
  },
  BYPASS: {
    ...achievementData["BYPASS"],
    Icon: "SF-1",
    Secret: true,
    Condition: () => Player.exploits.includes(Exploit.Bypass),
  },
  PROTOTYPETAMPERING: {
    ...achievementData["PROTOTYPETAMPERING"],
    Icon: "SF-1",
    Secret: true,
    Condition: () => Player.exploits.includes(Exploit.PrototypeTampering),
  },
  UNCLICKABLE: {
    ...achievementData["UNCLICKABLE"],
    Icon: "SF-1",
    Secret: true,
    Condition: () => Player.exploits.includes(Exploit.Unclickable),
  },
  UNDOCUMENTEDFUNCTIONCALL: {
    ...achievementData["UNDOCUMENTEDFUNCTIONCALL"],
    Icon: "SF-1",
    Secret: true,
    Condition: () => Player.exploits.includes(Exploit.UndocumentedFunctionCall),
  },
  TIMECOMPRESSION: {
    ...achievementData["TIMECOMPRESSION"],
    Icon: "SF-1",
    Secret: true,
    Condition: () => Player.exploits.includes(Exploit.TimeCompression),
  },
  REALITYALTERATION: {
    ...achievementData["REALITYALTERATION"],
    Icon: "SF-1",
    Secret: true,
    Condition: () => Player.exploits.includes(Exploit.RealityAlteration),
  },
  N00DLES: {
    ...achievementData["N00DLES"],
    Icon: "SF-1",
    Secret: true,
    Condition: () => Player.exploits.includes(Exploit.N00dles),
  },
  EDITSAVEFILE: {
    ...achievementData["EDITSAVEFILE"],
    Icon: "SF-1",
    Secret: true,
    Condition: () => Player.exploits.includes(Exploit.EditSaveFile),
  },
  UNACHIEVABLE: {
    ...achievementData["UNACHIEVABLE"],
    Icon: "SF-1",
    Secret: true,
    // Hey Players! Yes, you're supposed to modify this to get the achievement!
    Condition: () => false,
  },
  CHALLENGE_BN13: {
    ...achievementData["CHALLENGE_BN13"],
    Icon: "BN13+",
    Visible: () => hasAccessToSF(Player, 13),
    Condition: () =>
      Player.bitNodeN === 13 &&
      bitNodeFinishedState() &&
      !Player.augmentations.some((a) => a.name === AugmentationNames.StaneksGift1),
  },
  DEVMENU: {
    ...achievementData["DEVMENU"],
    Icon: "SF-1",
    Secret: true,
    Condition: () => Player.exploits.includes(Exploit.YoureNotMeantToAccessThis),
  },
};

// Steam has a limit of 100 achievement. So these were planned but commented for now.
// { ID: "ECORP", Condition: () => Player.factions.includes("ECorp") },
// { ID: "MEGACORP", Condition: () => Player.factions.includes("MegaCorp") },
// { ID: "BACHMAN_&_ASSOCIATES", Condition: () => Player.factions.includes("Bachman & Associates") },
// { ID: "BLADE_INDUSTRIES", Condition: () => Player.factions.includes("Blade Industries") },
// { ID: "NWO", Condition: () => Player.factions.includes("NWO") },
// { ID: "CLARKE_INCORPORATED", Condition: () => Player.factions.includes("Clarke Incorporated") },
// { ID: "OMNITEK_INCORPORATED", Condition: () => Player.factions.includes("OmniTek Incorporated") },
// { ID: "FOUR_SIGMA", Condition: () => Player.factions.includes("Four Sigma") },
// { ID: "KUAIGONG_INTERNATIONAL", Condition: () => Player.factions.includes("KuaiGong International") },
// { ID: "FULCRUM_SECRET_TECHNOLOGIES", Condition: () => Player.factions.includes("Fulcrum Secret Technologies") },
// { ID: "AEVUM", Condition: () => Player.factions.includes("Aevum") },
// { ID: "CHONGQING", Condition: () => Player.factions.includes("Chongqing") },
// { ID: "ISHIMA", Condition: () => Player.factions.includes("Ishima") },
// { ID: "NEW_TOKYO", Condition: () => Player.factions.includes("New Tokyo") },
// { ID: "SECTOR-12", Condition: () => Player.factions.includes("Sector-12") },
// { ID: "VOLHAVEN", Condition: () => Player.factions.includes("Volhaven") },
// { ID: "SPEAKERS_FOR_THE_DEAD", Condition: () => Player.factions.includes("Speakers for the Dead") },
// { ID: "THE_DARK_ARMY", Condition: () => Player.factions.includes("The Dark Army") },
// { ID: "THE_SYNDICATE", Condition: () => Player.factions.includes("The Syndicate") },
// { ID: "SILHOUETTE", Condition: () => Player.factions.includes("Silhouette") },
// { ID: "TETRADS", Condition: () => Player.factions.includes("Tetrads") },
// { ID: "SLUM_SNAKES", Condition: () => Player.factions.includes("Slum Snakes") },
// { ID: "NETBURNERS", Condition: () => Player.factions.includes("Netburners") },
// { ID: "TIAN_DI_HUI", Condition: () => Player.factions.includes("Tian Di Hui") },
// { ID: "BLADEBURNERS", Condition: () => Player.factions.includes("Bladeburners") },
// { ID: "DEEPSCANV1.EXE", Condition: () => Player.getHomeComputer().programs.includes(Programs.DeepscanV1.name) },
// { ID: "DEEPSCANV2.EXE", Condition: () => Player.getHomeComputer().programs.includes(Programs.DeepscanV2.name) },
// {
//   ID: "SERVERPROFILER.EXE",
//   Condition: () => Player.getHomeComputer().programs.includes(Programs.ServerProfiler.name),
// },
// { ID: "AUTOLINK.EXE", Condition: () => Player.getHomeComputer().programs.includes(Programs.AutoLink.name) },
// { ID: "FLIGHT.EXE", Condition: () => Player.getHomeComputer().programs.includes(Programs.Flight.name) },

export function calculateAchievements(): void {
  const playerAchievements = Player.achievements.map((a) => a.ID);

  const missingAchievements = Object.values(achievements)
    .filter((a) => !playerAchievements.includes(a.ID) && a.Condition())
    // callback returns array of achievement id and id of any in the additional list, flatmap means we have only a 1D array
    .flatMap((a) => [a.ID, ...(a.AdditionalUnlock || [])]);

  for (const id of missingAchievements) {
    Player.giveAchievement(id);
  }

  // Write all player's achievements to document for Steam/Electron
  // This could be replaced by "availableAchievements"
  // if we don't want to grant the save game achievements to steam but only currently available
  (document as any).achievements = [...Player.achievements.map((a) => a.ID)];
}
