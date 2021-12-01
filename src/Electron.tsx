import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { SkillNames } from "./Bladeburner/data/SkillNames";
import { Skills } from "./Bladeburner/Skills";
import { CONSTANTS } from "./Constants";
import { Industries } from "./Corporation/IndustryData";
import { Exploit } from "./Exploits/Exploit";
import { Factions } from "./Faction/Factions";
import { AllGangs } from "./Gang/AllGangs";
import { GangConstants } from "./Gang/data/Constants";
import { HacknetNodeConstants, HacknetServerConstants } from "./Hacknet/data/Constants";
import { hasHacknetServers } from "./Hacknet/HacknetHelpers";
import { HacknetNode } from "./Hacknet/HacknetNode";
import { HacknetServer } from "./Hacknet/HacknetServer";
import { CityName } from "./Locations/data/CityNames";
import { Player } from "./Player";
import { Programs } from "./Programs/Programs";
import { GetAllServers, GetServer } from "./Server/AllServers";
import { SpecialServers } from "./Server/data/SpecialServers";
import { Server } from "./Server/Server";
import { Router } from "./ui/GameRoot";
import { Page } from "./ui/Router";

interface Achievement {
  ID: string;
  Condition: () => boolean;
}

function bitNodeFinishedState(): boolean {
  const wd = GetServer(SpecialServers.WorldDaemon);
  if (!(wd instanceof Server)) return false;
  if (wd.backdoorInstalled) return true;
  return Player.bladeburner !== null && Player.bladeburner.blackops.hasOwnProperty("Operation Daedalus");
}

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

const achievements: Achievement[] = [
  { ID: "CYBERSEC", Condition: () => Player.factions.includes("CyberSec") },
  { ID: "NITESEC", Condition: () => Player.factions.includes("NiteSec") },
  { ID: "THE_BLACK_HAND", Condition: () => Player.factions.includes("The Black Hand") },
  { ID: "BITRUNNERS", Condition: () => Player.factions.includes("BitRunners") },
  { ID: "THE_COVENANT", Condition: () => Player.factions.includes("The Covenant") },
  { ID: "DAEDALUS", Condition: () => Player.factions.includes("Daedalus") },
  { ID: "ILLUMINATI", Condition: () => Player.factions.includes("Illuminati") },
  { ID: "BRUTESSH.EXE", Condition: () => Player.getHomeComputer().programs.includes(Programs.BruteSSHProgram.name) },
  { ID: "FTPCRACK.EXE", Condition: () => Player.getHomeComputer().programs.includes(Programs.FTPCrackProgram.name) },
  { ID: "RELAYSMTP.EXE", Condition: () => Player.getHomeComputer().programs.includes(Programs.RelaySMTPProgram.name) },
  { ID: "HTTPWORM.EXE", Condition: () => Player.getHomeComputer().programs.includes(Programs.HTTPWormProgram.name) },
  { ID: "SQLINJECT.EXE", Condition: () => Player.getHomeComputer().programs.includes(Programs.SQLInjectProgram.name) },
  { ID: "FORMULAS.EXE", Condition: () => Player.getHomeComputer().programs.includes(Programs.Formulas.name) },
  { ID: "SF1.1", Condition: () => Player.sourceFileLvl(1) >= 1 },
  { ID: "SF2.1", Condition: () => Player.sourceFileLvl(2) >= 1 },
  { ID: "SF3.1", Condition: () => Player.sourceFileLvl(3) >= 1 },
  { ID: "SF4.1", Condition: () => Player.sourceFileLvl(4) >= 1 },
  { ID: "SF5.1", Condition: () => Player.sourceFileLvl(5) >= 1 },
  { ID: "SF6.1", Condition: () => Player.sourceFileLvl(6) >= 1 },
  { ID: "SF7.1", Condition: () => Player.sourceFileLvl(7) >= 1 },
  { ID: "SF8.1", Condition: () => Player.sourceFileLvl(8) >= 1 },
  { ID: "SF9.1", Condition: () => Player.sourceFileLvl(9) >= 1 },
  { ID: "SF10.1", Condition: () => Player.sourceFileLvl(10) >= 1 },
  { ID: "SF11.1", Condition: () => Player.sourceFileLvl(11) >= 1 },
  { ID: "SF12.1", Condition: () => Player.sourceFileLvl(12) >= 1 },
  {
    ID: "MONEY_1Q",
    Condition: () => Player.money >= 1e18,
  },
  {
    ID: "MONEY_M1B",
    Condition: () => Player.money <= -1e9,
  },
  {
    ID: "INSTALL_1",
    Condition: () => Player.augmentations.length >= 1,
  },
  {
    ID: "INSTALL_100",
    Condition: () => Player.augmentations.length >= 100,
  },
  {
    ID: "QUEUE_40",
    Condition: () => Player.queuedAugmentations.length >= 40,
  },
  {
    ID: "HACKING_100000",
    Condition: () => Player.hacking >= 100000,
  },
  {
    ID: "COMBAT_3000",
    Condition: () =>
      Player.strength >= 3000 && Player.defense >= 3000 && Player.dexterity >= 3000 && Player.agility >= 3000,
  },
  {
    ID: "NEUROFLUX_255",
    Condition: () => Player.augmentations.some((a) => a.name === AugmentationNames.NeuroFluxGovernor && a.level >= 255),
  },
  {
    ID: "NS2",
    Condition: () =>
      Player.getHomeComputer().scripts.some((s) => s.filename.endsWith(".js") || s.filename.endsWith(".ns")),
  },
  { ID: "FROZE", Condition: () => location.href.includes("noScripts") },
  {
    ID: "RUNNING_SCRIPTS_1000",
    Condition: () => {
      let running = 0;
      for (const s of GetAllServers()) {
        running += s.runningScripts.length;
      }
      return running >= 1000;
    },
  },
  {
    ID: "DRAIN_SERVER",
    Condition: () => {
      for (const s of GetAllServers()) {
        if (s instanceof Server) {
          if (s.moneyMax > 0 && s.moneyAvailable === 0) return true;
        }
      }
      return false;
    },
  },
  { ID: "MAX_RAM", Condition: () => Player.getHomeComputer().maxRam === CONSTANTS.HomeComputerMaxRam },
  { ID: "MAX_CORES", Condition: () => Player.getHomeComputer().cpuCores === 8 },
  { ID: "SCRIPTS_30", Condition: () => Player.getHomeComputer().scripts.length >= 30 },
  { ID: "KARMA_1000000", Condition: () => Player.karma <= -1e6 },
  { ID: "STOCK_1q", Condition: () => Player.moneySourceB.stock >= 1e15 },
  {
    ID: "DISCOUNT",
    Condition: () => {
      const p = GetServer("powerhouse-fitness");
      if (!(p instanceof Server)) return false;
      return p.backdoorInstalled;
    },
  },
  { ID: "SCRIPT_32GB", Condition: () => Player.getHomeComputer().scripts.some((s) => s.ramUsage >= 32) },
  { ID: "FIRST_HACKNET_NODE", Condition: () => !hasHacknetServers(Player) && Player.hacknetNodes.length > 0 },
  {
    ID: "30_HACKNET_NODE",
    Condition: () => !hasHacknetServers(Player) && Player.hacknetNodes.length >= 30,
  },
  {
    ID: "MAX_HACKNET_NODE",
    Condition: () => {
      if (hasHacknetServers(Player)) return false;
      for (const h of Player.hacknetNodes) {
        if (!(h instanceof HacknetNode)) return false;
        if (
          h.ram === HacknetNodeConstants.MaxRam &&
          h.cores === HacknetNodeConstants.MaxCores &&
          h.level === HacknetNodeConstants.MaxLevel
        )
          return true;
      }
      return false;
    },
  },
  { ID: "HACKNET_NODE_10M", Condition: () => !hasHacknetServers(Player) && Player.moneySourceB.hacknet >= 10e6 },
  { ID: "REPUTATION_10M", Condition: () => Object.values(Factions).some((f) => f.playerReputation >= 10e6) },
  { ID: "DONATION", Condition: () => Object.values(Factions).some((f) => f.favor >= 150) },
  { ID: "TRAVEL", Condition: () => Player.city !== CityName.Sector12 },
  {
    ID: "WORKOUT",
    Condition: () =>
      [
        CONSTANTS.ClassGymStrength,
        CONSTANTS.ClassGymDefense,
        CONSTANTS.ClassGymDexterity,
        CONSTANTS.ClassGymAgility,
      ].includes(Player.className),
  },
  { ID: "TOR", Condition: () => Player.hasTorRouter() },
  { ID: "HOSPITALIZED", Condition: () => Player.moneySourceB.hospitalization !== 0 },
  { ID: "GANG", Condition: () => Player.gang !== null },
  {
    ID: "FULL_GANG",
    Condition: () => Player.gang !== null && Player.gang.members.length === GangConstants.MaximumGangMembers,
  },
  {
    ID: "GANG_TERRITORY",
    Condition: () => Player.gang !== null && AllGangs[Player.gang.facName].territory === 1,
  },
  {
    ID: "GANG_MEMBER_POWER",
    Condition: () =>
      Player.gang !== null &&
      Player.gang.members.some(
        (m) =>
          m.hack >= 10000 || m.str >= 10000 || m.def >= 10000 || m.dex >= 10000 || m.agi >= 10000 || m.cha >= 10000,
      ),
  },
  { ID: "CORPORATION", Condition: () => Player.corporation !== null },
  {
    ID: "CORPORATION_BRIBE",
    Condition: () => Player.corporation !== null && Player.corporation.unlockUpgrades[6] === 1,
  },
  {
    ID: "CORPORATION_PROD_1000",
    Condition: () => Player.corporation !== null && Player.corporation.divisions.some((d) => d.prodMult >= 1000),
  },
  {
    ID: "CORPORATION_EMPLOYEE_3000",
    Condition: () => {
      if (Player.corporation === null) return false;
      for (const d of Player.corporation.divisions) {
        for (const o of Object.values(d.offices)) {
          if (o === 0) continue;
          if (o.employees.length > 3000) return true;
        }
      }
      return false;
    },
  },
  {
    ID: "CORPORATION_REAL_ESTATE",
    Condition: () =>
      Player.corporation !== null && Player.corporation.divisions.some((d) => d.type === Industries.RealEstate),
  },
  { ID: "INTELLIGENCE_255", Condition: () => Player.intelligence >= 255 },
  { ID: "BLADEBURNER_DIVISION", Condition: () => Player.bladeburner !== null },
  {
    ID: "BLADEBURNER_OVERCLOCK",
    Condition: () =>
      Player.bladeburner !== null && Player.bladeburner.skills[SkillNames.Overclock] === Skills[SkillNames.Overclock],
  },
  {
    ID: "BLADEBURNER_UNSPENT_100000",
    Condition: () => Player.bladeburner !== null && Player.bladeburner.skillPoints >= 100000,
  },
  { ID: "4S", Condition: () => Player.has4SData },
  { ID: "FIRST_HACKNET_SERVER", Condition: () => hasHacknetServers(Player) && Player.hacknetNodes.length > 0 },
  {
    ID: "ALL_HACKNET_SERVER",
    Condition: () => hasHacknetServers(Player) && Player.hacknetNodes.length === HacknetServerConstants.MaxServers,
  },
  {
    ID: "MAX_HACKNET_SERVER",
    Condition: () => {
      if (!hasHacknetServers(Player)) return false;
      for (const h of Player.hacknetNodes) {
        if (!(h instanceof HacknetServer)) return false;
        if (
          h.maxRam === HacknetServerConstants.MaxRam &&
          h.cores === HacknetServerConstants.MaxCores &&
          h.level === HacknetServerConstants.MaxLevel &&
          h.cache === HacknetServerConstants.MaxCache
        )
          return true;
      }
      return false;
    },
  },
  { ID: "HACKNET_SERVER_1B", Condition: () => hasHacknetServers(Player) && Player.moneySourceB.hacknet >= 1e9 },
  {
    ID: "MAX_CACHE",
    Condition: () => hasHacknetServers(Player) && Player.hashManager.hashes === Player.hashManager.capacity,
  },
  {
    ID: "SLEEVE_8",
    Condition: () => Player.sleeves.length === 8,
  },
  {
    ID: "FAST_BN",
    Condition: () => bitNodeFinishedState() && Player.playtimeSinceLastBitnode < 1000 * 60 * 60 * 24 * 2,
  },
  {
    ID: "INDECISIVE",
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
  {
    ID: "CHALLENGE_BN1",
    Condition: () =>
      Player.bitNodeN === 1 &&
      bitNodeFinishedState() &&
      Player.getHomeComputer().maxRam <= 32 &&
      Player.getHomeComputer().cpuCores === 1,
  },
  {
    ID: "CHALLENGE_BN2",
    Condition: () => Player.bitNodeN === 2 && bitNodeFinishedState() && Player.gang === null,
  },
  {
    ID: "CHALLENGE_BN3",
    Condition: () => Player.bitNodeN === 2 && bitNodeFinishedState() && Player.corporation === null,
  },
  {
    ID: "CHALLENGE_BN6",
    Condition: () => Player.bitNodeN === 6 && bitNodeFinishedState() && Player.bladeburner === null,
  },
  {
    ID: "CHALLENGE_BN7",
    Condition: () => Player.bitNodeN === 7 && bitNodeFinishedState() && Player.bladeburner === null,
  },
  {
    ID: "CHALLENGE_BN8",
    Condition: () => Player.bitNodeN === 8 && bitNodeFinishedState() && !Player.has4SData && !Player.has4SDataTixApi,
  },
  {
    ID: "CHALLENGE_BN9",
    Condition: () =>
      Player.bitNodeN === 9 &&
      bitNodeFinishedState() &&
      Player.moneySourceB.hacknet === 0 &&
      Player.moneySourceB.hacknet_expenses === 0,
  },
  {
    ID: "CHALLENGE_BN10",
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
  { ID: "CHALLENGE_BN12", Condition: () => Player.sourceFileLvl(12) >= 50 },
  { ID: "BYPASS", Condition: () => Player.exploits.includes(Exploit.Bypass) },
  { ID: "PROTOTYPETAMPERING", Condition: () => Player.exploits.includes(Exploit.PrototypeTampering) },
  { ID: "UNCLICKABLE", Condition: () => Player.exploits.includes(Exploit.Unclickable) },
  { ID: "UNDOCUMENTEDFUNCTIONCALL", Condition: () => Player.exploits.includes(Exploit.UndocumentedFunctionCall) },
  { ID: "TIMECOMPRESSION", Condition: () => Player.exploits.includes(Exploit.TimeCompression) },
  { ID: "REALITYALTERATION", Condition: () => Player.exploits.includes(Exploit.RealityAlteration) },
  { ID: "N00DLES", Condition: () => Player.exploits.includes(Exploit.N00dles) },
  { ID: "EDITSAVEFILE", Condition: () => Player.exploits.includes(Exploit.EditSaveFile) },
  {
    ID: "UNACHIEVABLE",
    // Hey Players! Yes, you're supposed to modify this to get the achievement!
    Condition: () => false,
  },

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
];

function setAchievements(achs: string[]): void {
  (document as any).achievements = achs;
}

function calculateAchievements(): void {
  setAchievements(achievements.filter((a) => a.Condition()).map((a) => a.ID));
}

export function initElectron(): void {
  setAchievements([]);
  setInterval(calculateAchievements, 5000);
}
