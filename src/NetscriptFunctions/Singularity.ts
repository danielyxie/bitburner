import { INetscriptHelper } from "./INetscriptHelper";
import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { purchaseAugmentation, joinFaction } from "../Faction/FactionHelpers";
import { startWorkerScript } from "../NetscriptWorker";
import { Augmentation } from "../Augmentation/Augmentation";
import { Augmentations } from "../Augmentation/Augmentations";
import { augmentationExists, installAugmentations } from "../Augmentation/AugmentationHelpers";
import { prestigeAugmentation } from "../Prestige";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { killWorkerScript } from "../Netscript/killWorkerScript";
import { CONSTANTS } from "../Constants";
import { isString } from "../utils/helpers/isString";
import { getRamCost } from "../Netscript/RamCostGenerator";
import { RunningScript } from "../Script/RunningScript";

import {
  AugmentationStats,
  CharacterInfo,
  CrimeStats,
  PlayerSkills,
  Singularity as ISingularity,
} from "../ScriptEditor/NetscriptDefinitions";

import { findCrime } from "../Crime/CrimeHelpers";
import { CompanyPosition } from "../Company/CompanyPosition";
import { CompanyPositions } from "../Company/CompanyPositions";
import { DarkWebItems } from "../DarkWeb/DarkWebItems";
import { AllGangs } from "../Gang/AllGangs";
import { CityName } from "../Locations/data/CityNames";
import { LocationName } from "../Locations/data/LocationNames";
import { Router } from "../ui/GameRoot";
import { SpecialServers } from "../Server/data/SpecialServers";
import { Page } from "../ui/Router";
import { Locations } from "../Locations/Locations";
import { GetServer, AddToAllServers, createUniqueRandomIp } from "../Server/AllServers";
import { Programs } from "../Programs/Programs";
import { numeralWrapper } from "../ui/numeralFormat";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { Company } from "../Company/Company";
import { Companies } from "../Company/Companies";
import { Factions, factionExists } from "../Faction/Factions";
import { Faction } from "../Faction/Faction";
import { netscriptDelay } from "../NetscriptEvaluator";
import { convertTimeMsToTimeElapsedString } from "../utils/StringHelperFunctions";
import { getServerOnNetwork, safetlyCreateUniqueServer } from "../Server/ServerHelpers";
import { Terminal } from "../Terminal";
import { calculateHackingTime } from "../Hacking";
import { Server } from "../Server/Server";
import { netscriptCanHack } from "../Hacking/netscriptCanHack";
import { FactionInfos } from "../Faction/FactionInfo";

export function NetscriptSingularity(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): ISingularity {
  const getAugmentation = function (func: string, name: string): Augmentation {
    if (!augmentationExists(name)) {
      throw helper.makeRuntimeErrorMsg(func, `Invalid augmentation: '${name}'`);
    }

    return Augmentations[name];
  };

  const getFaction = function (func: string, name: string): Faction {
    if (!factionExists(name)) {
      throw helper.makeRuntimeErrorMsg(func, `Invalid faction name: '${name}`);
    }

    return Factions[name];
  };

  const getCompany = function (func: string, name: string): Company {
    const company = Companies[name];
    if (company == null || !(company instanceof Company)) {
      throw helper.makeRuntimeErrorMsg(func, `Invalid company name: '${name}'`);
    }
    return company;
  };

  const runAfterReset = function (cbScript: string | null = null): void {
    //Run a script after reset
    if (!cbScript) return;
    const home = player.getHomeComputer();
    for (const script of home.scripts) {
      if (script.filename === cbScript) {
        const ramUsage = script.ramUsage;
        const ramAvailable = home.maxRam - home.ramUsed;
        if (ramUsage > ramAvailable) {
          return; // Not enough RAM
        }
        const runningScriptObj = new RunningScript(script, []); // No args
        runningScriptObj.threads = 1; // Only 1 thread
        startWorkerScript(player, runningScriptObj, home);
      }
    }
  };
  return {
    getOwnedAugmentations: function (_purchased: unknown = false): string[] {
      const purchased = helper.boolean(_purchased);
      helper.updateDynamicRam("getOwnedAugmentations", getRamCost(player, "getOwnedAugmentations"));
      helper.checkSingularityAccess("getOwnedAugmentations");
      const res = [];
      for (let i = 0; i < player.augmentations.length; ++i) {
        res.push(player.augmentations[i].name);
      }
      if (purchased) {
        for (let i = 0; i < player.queuedAugmentations.length; ++i) {
          res.push(player.queuedAugmentations[i].name);
        }
      }
      return res;
    },
    getAugmentationsFromFaction: function (_facName: unknown): string[] {
      const facName = helper.string("getAugmentationsFromFaction", "facName", _facName);
      helper.updateDynamicRam("getAugmentationsFromFaction", getRamCost(player, "getAugmentationsFromFaction"));
      helper.checkSingularityAccess("getAugmentationsFromFaction");
      const faction = getFaction("getAugmentationsFromFaction", facName);

      // If player has a gang with this faction, return all augmentations.
      if (player.hasGangWith(facName)) {
        let augs = Object.values(Augmentations);

        // Remove special augs.
        augs = augs.filter((a) => !a.isSpecial);

        if (player.bitNodeN !== 2) {
          // Remove faction-unique augs outside BN2. (But keep the one for this faction.)
          augs = augs.filter((a) => a.factions.length > 1 || Factions[facName].augmentations.includes(a.name));

          // Remove blacklisted augs.
          const blacklist = [AugmentationNames.NeuroFluxGovernor, AugmentationNames.TheRedPill];
          augs = augs.filter((a) => !blacklist.includes(a.name));
        }

        return augs.map((a) => a.name);
      }

      return faction.augmentations.slice();
    },
    getAugmentationCost: function (_augName: unknown): [number, number] {
      const augName = helper.string("getAugmentationCost", "augName", _augName);
      helper.updateDynamicRam("getAugmentationCost", getRamCost(player, "getAugmentationCost"));
      helper.checkSingularityAccess("getAugmentationCost");
      const aug = getAugmentation("getAugmentationCost", augName);
      return [aug.baseRepRequirement, aug.baseCost];
    },
    getAugmentationPrereq: function (_augName: unknown): string[] {
      const augName = helper.string("getAugmentationPrereq", "augName", _augName);
      helper.updateDynamicRam("getAugmentationPrereq", getRamCost(player, "getAugmentationPrereq"));
      helper.checkSingularityAccess("getAugmentationPrereq");
      const aug = getAugmentation("getAugmentationPrereq", augName);
      return aug.prereqs.slice();
    },
    getAugmentationPrice: function (_augName: unknown): number {
      const augName = helper.string("getAugmentationPrice", "augName", _augName);
      helper.updateDynamicRam("getAugmentationPrice", getRamCost(player, "getAugmentationPrice"));
      helper.checkSingularityAccess("getAugmentationPrice");
      const aug = getAugmentation("getAugmentationPrice", augName);
      return aug.baseCost;
    },
    getAugmentationRepReq: function (_augName: unknown): number {
      const augName = helper.string("getAugmentationRepReq", "augName", _augName);
      helper.updateDynamicRam("getAugmentationRepReq", getRamCost(player, "getAugmentationRepReq"));
      helper.checkSingularityAccess("getAugmentationRepReq");
      const aug = getAugmentation("getAugmentationRepReq", augName);
      return aug.baseRepRequirement;
    },
    getAugmentationStats: function (_augName: unknown): AugmentationStats {
      const augName = helper.string("getAugmentationStats", "augName", _augName);
      helper.updateDynamicRam("getAugmentationStats", getRamCost(player, "getAugmentationStats"));
      helper.checkSingularityAccess("getAugmentationStats");
      const aug = getAugmentation("getAugmentationStats", augName);
      return Object.assign({}, aug.mults);
    },
    purchaseAugmentation: function (_facName: unknown, _augName: unknown): boolean {
      const facName = helper.string("purchaseAugmentation", "facName", _facName);
      const augName = helper.string("purchaseAugmentation", "augName", _augName);
      helper.updateDynamicRam("purchaseAugmentation", getRamCost(player, "purchaseAugmentation"));
      helper.checkSingularityAccess("purchaseAugmentation");
      const fac = getFaction("purchaseAugmentation", facName);
      const aug = getAugmentation("purchaseAugmentation", augName);

      let augs = [];
      if (player.hasGangWith(facName)) {
        for (const augName of Object.keys(Augmentations)) {
          const aug = Augmentations[augName];
          if (
            augName === AugmentationNames.NeuroFluxGovernor ||
            (augName === AugmentationNames.TheRedPill && player.bitNodeN !== 2) ||
            // Special augs (i.e. Bladeburner augs)
            aug.isSpecial ||
            // Exclusive augs (i.e. QLink)
            (aug.factions.length <= 1 && !fac.augmentations.includes(augName) && player.bitNodeN !== 2)
          )
            continue;
          augs.push(augName);
        }
      } else {
        augs = fac.augmentations;
      }

      if (!augs.includes(augName)) {
        workerScript.log(
          "purchaseAugmentation",
          () => `Faction '${facName}' does not have the '${augName}' augmentation.`,
        );
        return false;
      }

      const isNeuroflux = aug.name === AugmentationNames.NeuroFluxGovernor;
      if (!isNeuroflux) {
        for (let j = 0; j < player.queuedAugmentations.length; ++j) {
          if (player.queuedAugmentations[j].name === aug.name) {
            workerScript.log("purchaseAugmentation", () => `You already have the '${augName}' augmentation.`);
            return false;
          }
        }
        for (let j = 0; j < player.augmentations.length; ++j) {
          if (player.augmentations[j].name === aug.name) {
            workerScript.log("purchaseAugmentation", () => `You already have the '${augName}' augmentation.`);
            return false;
          }
        }
      }

      if (fac.playerReputation < aug.baseRepRequirement) {
        workerScript.log("purchaseAugmentation", () => `You do not have enough reputation with '${fac.name}'.`);
        return false;
      }

      const res = purchaseAugmentation(aug, fac, true);
      workerScript.log("purchaseAugmentation", () => res);
      if (isString(res) && res.startsWith("You purchased")) {
        player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain * 10);
        return true;
      } else {
        return false;
      }
    },
    softReset: function (_cbScript: unknown): void {
      const cbScript = helper.string("softReset", "cbScript", _cbScript);
      helper.updateDynamicRam("softReset", getRamCost(player, "softReset"));
      helper.checkSingularityAccess("softReset");

      workerScript.log("softReset", () => "Soft resetting. This will cause this script to be killed");
      setTimeout(() => {
        prestigeAugmentation();
        runAfterReset(cbScript);
      }, 0);

      // Prevent workerScript from "finishing execution naturally"
      workerScript.running = false;
      killWorkerScript(workerScript);
    },
    installAugmentations: function (_cbScript: unknown): boolean {
      const cbScript = helper.string("installAugmentations", "cbScript", _cbScript);
      helper.updateDynamicRam("installAugmentations", getRamCost(player, "installAugmentations"));
      helper.checkSingularityAccess("installAugmentations");

      if (player.queuedAugmentations.length === 0) {
        workerScript.log("installAugmentations", () => "You do not have any Augmentations to be installed.");
        return false;
      }
      player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain * 10);
      workerScript.log(
        "installAugmentations",
        () => "Installing Augmentations. This will cause this script to be killed",
      );
      setTimeout(() => {
        installAugmentations();
        runAfterReset(cbScript);
      }, 0);

      workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
      killWorkerScript(workerScript);
      return true;
    },

    goToLocation: function (_locationName: unknown): boolean {
      const locationName = helper.string("goToLocation", "locationName", _locationName);
      helper.updateDynamicRam("goToLocation", getRamCost(player, "goToLocation"));
      helper.checkSingularityAccess("goToLocation");
      const location = Object.values(Locations).find((l) => l.name === locationName);
      if (!location) {
        workerScript.log("goToLocation", () => `No location named ${locationName}`);
        return false;
      }
      if (player.city !== location.city) {
        workerScript.log("goToLocation", () => `No location named ${locationName} in ${player.city}`);
        return false;
      }
      Router.toLocation(location);
      player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain / 50000);
      return true;
    },
    universityCourse: function (_universityName: unknown, _className: unknown, _focus: unknown = true): boolean {
      const universityName = helper.string("universityCourse", "universityName", _universityName);
      const className = helper.string("universityCourse", "className", _className);
      const focus = helper.boolean(_focus);
      helper.updateDynamicRam("universityCourse", getRamCost(player, "universityCourse"));
      helper.checkSingularityAccess("universityCourse");
      const wasFocusing = player.focus;
      if (player.isWorking) {
        const txt = player.singularityStopWork();
        workerScript.log("universityCourse", () => txt);
      }

      let costMult, expMult;
      switch (universityName.toLowerCase()) {
        case LocationName.AevumSummitUniversity.toLowerCase():
          if (player.city != CityName.Aevum) {
            workerScript.log(
              "universityCourse",
              () => `You cannot study at 'Summit University' because you are not in '${CityName.Aevum}'.`,
            );
            return false;
          }
          player.gotoLocation(LocationName.AevumSummitUniversity);
          costMult = 4;
          expMult = 3;
          break;
        case LocationName.Sector12RothmanUniversity.toLowerCase():
          if (player.city != CityName.Sector12) {
            workerScript.log(
              "universityCourse",
              () => `You cannot study at 'Rothman University' because you are not in '${CityName.Sector12}'.`,
            );
            return false;
          }
          player.location = LocationName.Sector12RothmanUniversity;
          costMult = 3;
          expMult = 2;
          break;
        case LocationName.VolhavenZBInstituteOfTechnology.toLowerCase():
          if (player.city != CityName.Volhaven) {
            workerScript.log(
              "universityCourse",
              () => `You cannot study at 'ZB Institute of Technology' because you are not in '${CityName.Volhaven}'.`,
            );
            return false;
          }
          player.location = LocationName.VolhavenZBInstituteOfTechnology;
          costMult = 5;
          expMult = 4;
          break;
        default:
          workerScript.log("universityCourse", () => `Invalid university name: '${universityName}'.`);
          return false;
      }

      let task = "";
      switch (className.toLowerCase()) {
        case "Study Computer Science".toLowerCase():
          task = CONSTANTS.ClassStudyComputerScience;
          break;
        case "Data Structures".toLowerCase():
          task = CONSTANTS.ClassDataStructures;
          break;
        case "Networks".toLowerCase():
          task = CONSTANTS.ClassNetworks;
          break;
        case "Algorithms".toLowerCase():
          task = CONSTANTS.ClassAlgorithms;
          break;
        case "Management".toLowerCase():
          task = CONSTANTS.ClassManagement;
          break;
        case "Leadership".toLowerCase():
          task = CONSTANTS.ClassLeadership;
          break;
        default:
          workerScript.log("universityCourse", () => `Invalid class name: ${className}.`);
          return false;
      }
      player.startClass(costMult, expMult, task);
      if (focus) {
        player.startFocusing();
        Router.toWork();
      } else if (wasFocusing) {
        player.stopFocusing();
        Router.toTerminal();
      }
      workerScript.log("universityCourse", () => `Started ${task} at ${universityName}`);
      return true;
    },

    gymWorkout: function (_gymName: unknown, _stat: unknown, _focus: unknown = true): boolean {
      const gymName = helper.string("gymWorkout", "gymName", _gymName);
      const stat = helper.string("gymWorkout", "stat", _stat);
      const focus = helper.boolean(_focus);
      helper.updateDynamicRam("gymWorkout", getRamCost(player, "gymWorkout"));
      helper.checkSingularityAccess("gymWorkout");
      const wasFocusing = player.focus;
      if (player.isWorking) {
        const txt = player.singularityStopWork();
        workerScript.log("gymWorkout", () => txt);
      }
      let costMult, expMult;
      switch (gymName.toLowerCase()) {
        case LocationName.AevumCrushFitnessGym.toLowerCase():
          if (player.city != CityName.Aevum) {
            workerScript.log(
              "gymWorkout",
              () =>
                `You cannot workout at '${LocationName.AevumCrushFitnessGym}' because you are not in '${CityName.Aevum}'.`,
            );
            return false;
          }
          player.location = LocationName.AevumCrushFitnessGym;
          costMult = 3;
          expMult = 2;
          break;
        case LocationName.AevumSnapFitnessGym.toLowerCase():
          if (player.city != CityName.Aevum) {
            workerScript.log(
              "gymWorkout",
              () =>
                `You cannot workout at '${LocationName.AevumSnapFitnessGym}' because you are not in '${CityName.Aevum}'.`,
            );
            return false;
          }
          player.location = LocationName.AevumSnapFitnessGym;
          costMult = 10;
          expMult = 5;
          break;
        case LocationName.Sector12IronGym.toLowerCase():
          if (player.city != CityName.Sector12) {
            workerScript.log(
              "gymWorkout",
              () =>
                `You cannot workout at '${LocationName.Sector12IronGym}' because you are not in '${CityName.Sector12}'.`,
            );
            return false;
          }
          player.location = LocationName.Sector12IronGym;
          costMult = 1;
          expMult = 1;
          break;
        case LocationName.Sector12PowerhouseGym.toLowerCase():
          if (player.city != CityName.Sector12) {
            workerScript.log(
              "gymWorkout",
              () =>
                `You cannot workout at '${LocationName.Sector12PowerhouseGym}' because you are not in '${CityName.Sector12}'.`,
            );
            return false;
          }
          player.location = LocationName.Sector12PowerhouseGym;
          costMult = 20;
          expMult = 10;
          break;
        case LocationName.VolhavenMilleniumFitnessGym.toLowerCase():
          if (player.city != CityName.Volhaven) {
            workerScript.log(
              "gymWorkout",
              () =>
                `You cannot workout at '${LocationName.VolhavenMilleniumFitnessGym}' because you are not in '${CityName.Volhaven}'.`,
            );
            return false;
          }
          player.location = LocationName.VolhavenMilleniumFitnessGym;
          costMult = 7;
          expMult = 4;
          break;
        default:
          workerScript.log("gymWorkout", () => `Invalid gym name: ${gymName}. gymWorkout() failed`);
          return false;
      }

      switch (stat.toLowerCase()) {
        case "strength".toLowerCase():
        case "str".toLowerCase():
          player.startClass(costMult, expMult, CONSTANTS.ClassGymStrength);
          break;
        case "defense".toLowerCase():
        case "def".toLowerCase():
          player.startClass(costMult, expMult, CONSTANTS.ClassGymDefense);
          break;
        case "dexterity".toLowerCase():
        case "dex".toLowerCase():
          player.startClass(costMult, expMult, CONSTANTS.ClassGymDexterity);
          break;
        case "agility".toLowerCase():
        case "agi".toLowerCase():
          player.startClass(costMult, expMult, CONSTANTS.ClassGymAgility);
          break;
        default:
          workerScript.log("gymWorkout", () => `Invalid stat: ${stat}.`);
          return false;
      }
      if (focus) {
        player.startFocusing();
        Router.toWork();
      } else if (wasFocusing) {
        player.stopFocusing();
        Router.toTerminal();
      }
      workerScript.log("gymWorkout", () => `Started training ${stat} at ${gymName}`);
      return true;
    },

    travelToCity: function (_cityName: unknown): boolean {
      const cityName = helper.string("travelToCity", "cityName", _cityName);
      helper.updateDynamicRam("travelToCity", getRamCost(player, "travelToCity"));
      helper.checkSingularityAccess("travelToCity");

      switch (cityName) {
        case CityName.Aevum:
        case CityName.Chongqing:
        case CityName.Sector12:
        case CityName.NewTokyo:
        case CityName.Ishima:
        case CityName.Volhaven:
          if (player.money < CONSTANTS.TravelCost) {
            workerScript.log("travelToCity", () => "Not enough money to travel.");
            return false;
          }
          player.loseMoney(CONSTANTS.TravelCost, "other");
          player.city = cityName;
          workerScript.log("travelToCity", () => `Traveled to ${cityName}`);
          player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain / 50000);
          return true;
        default:
          throw helper.makeRuntimeErrorMsg("travelToCity", `Invalid city name: '${cityName}'.`);
      }
    },

    purchaseTor: function (): boolean {
      helper.updateDynamicRam("purchaseTor", getRamCost(player, "purchaseTor"));
      helper.checkSingularityAccess("purchaseTor");

      if (player.hasTorRouter()) {
        workerScript.log("purchaseTor", () => "You already have a TOR router!");
        return true;
      }

      if (player.money < CONSTANTS.TorRouterCost) {
        workerScript.log("purchaseTor", () => "You cannot afford to purchase a Tor router.");
        return false;
      }
      player.loseMoney(CONSTANTS.TorRouterCost, "other");

      const darkweb = safetlyCreateUniqueServer({
        ip: createUniqueRandomIp(),
        hostname: "darkweb",
        organizationName: "",
        isConnectedTo: false,
        adminRights: false,
        purchasedByPlayer: false,
        maxRam: 1,
      });
      AddToAllServers(darkweb);

      player.getHomeComputer().serversOnNetwork.push(darkweb.hostname);
      darkweb.serversOnNetwork.push(player.getHomeComputer().hostname);
      player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain / 500);
      workerScript.log("purchaseTor", () => "You have purchased a Tor router!");
      return true;
    },
    purchaseProgram: function (_programName: unknown): boolean {
      const programName = helper.string("purchaseProgram", "programName", _programName).toLowerCase();
      helper.updateDynamicRam("purchaseProgram", getRamCost(player, "purchaseProgram"));
      helper.checkSingularityAccess("purchaseProgram");

      if (!player.hasTorRouter()) {
        workerScript.log("purchaseProgram", () => "You do not have the TOR router.");
        return false;
      }

      const item = Object.values(DarkWebItems).find((i) => i.program.toLowerCase() === programName);
      if (item == null) {
        workerScript.log("purchaseProgram", () => `Invalid program name: '${programName}.`);
        return false;
      }

      if (player.money < item.price) {
        workerScript.log(
          "purchaseProgram",
          () => `Not enough money to purchase '${item.program}'. Need ${numeralWrapper.formatMoney(item.price)}`,
        );
        return false;
      }

      if (player.hasProgram(item.program)) {
        workerScript.log("purchaseProgram", () => `You already have the '${item.program}' program`);
        return true;
      }

      player.loseMoney(item.price, "other");
      player.getHomeComputer().programs.push(item.program);
      workerScript.log(
        "purchaseProgram",
        () => `You have purchased the '${item.program}' program. The new program can be found on your home computer.`,
      );
      player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain / 5000);
      return true;
    },
    getCurrentServer: function (): string {
      helper.updateDynamicRam("getCurrentServer", getRamCost(player, "getCurrentServer"));
      helper.checkSingularityAccess("getCurrentServer");
      return player.getCurrentServer().hostname;
    },
    connect: function (_hostname: unknown): boolean {
      const hostname = helper.string("purchaseProgram", "hostname", _hostname);
      helper.updateDynamicRam("connect", getRamCost(player, "connect"));
      helper.checkSingularityAccess("connect");
      if (!hostname) {
        throw helper.makeRuntimeErrorMsg("connect", `Invalid hostname: '${hostname}'`);
      }

      const target = GetServer(hostname);
      if (target == null) {
        throw helper.makeRuntimeErrorMsg("connect", `Invalid hostname: '${hostname}'`);
      }

      if (hostname === "home") {
        player.getCurrentServer().isConnectedTo = false;
        player.currentServer = player.getHomeComputer().hostname;
        player.getCurrentServer().isConnectedTo = true;
        Terminal.setcwd("/");
        return true;
      }

      const server = player.getCurrentServer();
      for (let i = 0; i < server.serversOnNetwork.length; i++) {
        const other = getServerOnNetwork(server, i);
        if (other === null) continue;
        if (other.hostname == hostname) {
          player.getCurrentServer().isConnectedTo = false;
          player.currentServer = target.hostname;
          player.getCurrentServer().isConnectedTo = true;
          Terminal.setcwd("/");
          return true;
        }
      }

      return false;
    },
    manualHack: function (): Promise<number> {
      helper.updateDynamicRam("manualHack", getRamCost(player, "manualHack"));
      helper.checkSingularityAccess("manualHack");
      const server = player.getCurrentServer();
      return helper.hack(server.hostname, true);
    },
    installBackdoor: function (): Promise<void> {
      helper.updateDynamicRam("installBackdoor", getRamCost(player, "installBackdoor"));
      helper.checkSingularityAccess("installBackdoor");
      const baseserver = player.getCurrentServer();
      if (!(baseserver instanceof Server)) {
        workerScript.log("installBackdoor", () => "cannot backdoor this kind of server");
        return Promise.resolve();
      }
      const server = baseserver as Server;
      const installTime = (calculateHackingTime(server, player) / 4) * 1000;

      // No root access or skill level too low
      const canHack = netscriptCanHack(server, player);
      if (!canHack.res) {
        throw helper.makeRuntimeErrorMsg("installBackdoor", canHack.msg || "");
      }

      workerScript.log(
        "installBackdoor",
        () => `Installing backdoor on '${server.hostname}' in ${convertTimeMsToTimeElapsedString(installTime, true)}`,
      );

      return netscriptDelay(installTime, workerScript).then(function () {
        workerScript.log("installBackdoor", () => `Successfully installed backdoor on '${server.hostname}'`);

        server.backdoorInstalled = true;

        if (SpecialServers.WorldDaemon === server.hostname) {
          Router.toBitVerse(false, false);
        }
        return Promise.resolve();
      });
    },
    isFocused: function (): boolean {
      helper.updateDynamicRam("isFocused", getRamCost(player, "isFocused"));
      helper.checkSingularityAccess("isFocused");
      return player.focus;
    },
    setFocus: function (_focus: unknown): boolean {
      const focus = helper.boolean(_focus);
      helper.updateDynamicRam("setFocus", getRamCost(player, "setFocus"));
      helper.checkSingularityAccess("setFocus");
      if (!player.isWorking) {
        throw helper.makeRuntimeErrorMsg("setFocus", "Not currently working");
      }
      if (
        !(
          player.workType == CONSTANTS.WorkTypeFaction ||
          player.workType == CONSTANTS.WorkTypeCompany ||
          player.workType == CONSTANTS.WorkTypeCompanyPartTime ||
          player.workType == CONSTANTS.WorkTypeCreateProgram ||
          player.workType == CONSTANTS.WorkTypeStudyClass
        )
      ) {
        throw helper.makeRuntimeErrorMsg("setFocus", "Cannot change focus for current job");
      }
      if (!player.focus && focus) {
        player.startFocusing();
        Router.toWork();
        return true;
      } else if (player.focus && !focus) {
        player.stopFocusing();
        Router.toTerminal();
        return true;
      }
      return false;
    },
    getStats: function (): PlayerSkills {
      helper.updateDynamicRam("getStats", getRamCost(player, "getStats"));
      helper.checkSingularityAccess("getStats");
      workerScript.log("getStats", () => `getStats is deprecated, please use getplayer`);

      return {
        hacking: player.hacking,
        strength: player.strength,
        defense: player.defense,
        dexterity: player.dexterity,
        agility: player.agility,
        charisma: player.charisma,
        intelligence: player.intelligence,
      };
    },
    getCharacterInformation: function (): CharacterInfo {
      helper.updateDynamicRam("getCharacterInformation", getRamCost(player, "getCharacterInformation"));
      helper.checkSingularityAccess("getCharacterInformation");
      workerScript.log("getCharacterInformation", () => `getCharacterInformation is deprecated, please use getplayer`);

      return {
        bitnode: player.bitNodeN,
        city: player.city,
        factions: player.factions.slice(),
        hp: player.hp,
        jobs: Object.keys(player.jobs),
        jobTitles: Object.values(player.jobs),
        maxHp: player.max_hp,
        mult: {
          agility: player.agility_mult,
          agilityExp: player.agility_exp_mult,
          companyRep: player.company_rep_mult,
          crimeMoney: player.crime_money_mult,
          crimeSuccess: player.crime_success_mult,
          defense: player.defense_mult,
          defenseExp: player.defense_exp_mult,
          dexterity: player.dexterity_mult,
          dexterityExp: player.dexterity_exp_mult,
          factionRep: player.faction_rep_mult,
          hacking: player.hacking_mult,
          hackingExp: player.hacking_exp_mult,
          strength: player.strength_mult,
          strengthExp: player.strength_exp_mult,
          workMoney: player.work_money_mult,
        },
        timeWorked: player.timeWorked,
        tor: player.hasTorRouter(),
        workHackExpGain: player.workHackExpGained,
        workStrExpGain: player.workStrExpGained,
        workDefExpGain: player.workDefExpGained,
        workDexExpGain: player.workDexExpGained,
        workAgiExpGain: player.workAgiExpGained,
        workChaExpGain: player.workChaExpGained,
        workRepGain: player.workRepGained,
        workMoneyGain: player.workMoneyGained,
        hackingExp: player.hacking_exp,
        strengthExp: player.strength_exp,
        defenseExp: player.defense_exp,
        dexterityExp: player.dexterity_exp,
        agilityExp: player.agility_exp,
        charismaExp: player.charisma_exp,
      };
    },
    hospitalize: function (): void {
      helper.updateDynamicRam("hospitalize", getRamCost(player, "hospitalize"));
      helper.checkSingularityAccess("hospitalize");
      if (player.isWorking || Router.page() === Page.Infiltration || Router.page() === Page.BitVerse) {
        workerScript.log("hospitalize", () => "Cannot go to the hospital because the player is busy.");
        return;
      }
      player.hospitalize();
    },
    isBusy: function (): boolean {
      helper.updateDynamicRam("isBusy", getRamCost(player, "isBusy"));
      helper.checkSingularityAccess("isBusy");
      return player.isWorking || Router.page() === Page.Infiltration || Router.page() === Page.BitVerse;
    },
    stopAction: function (): boolean {
      helper.updateDynamicRam("stopAction", getRamCost(player, "stopAction"));
      helper.checkSingularityAccess("stopAction");
      if (player.isWorking) {
        if (player.focus) {
          player.stopFocusing();
          Router.toTerminal();
        }
        const txt = player.singularityStopWork();
        workerScript.log("stopAction", () => txt);
        return true;
      }
      return false;
    },
    upgradeHomeCores: function (): boolean {
      helper.updateDynamicRam("upgradeHomeCores", getRamCost(player, "upgradeHomeCores"));
      helper.checkSingularityAccess("upgradeHomeCores");

      // Check if we're at max cores
      const homeComputer = player.getHomeComputer();
      if (homeComputer.cpuCores >= 8) {
        workerScript.log("upgradeHomeCores", () => `Your home computer is at max cores.`);
        return false;
      }

      const cost = player.getUpgradeHomeCoresCost();
      if (player.money < cost) {
        workerScript.log(
          "upgradeHomeCores",
          () => `You don't have enough money. Need ${numeralWrapper.formatMoney(cost)}`,
        );
        return false;
      }

      homeComputer.cpuCores += 1;
      player.loseMoney(cost, "servers");

      player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain * 2);
      workerScript.log(
        "upgradeHomeCores",
        () => `Purchased an additional core for home computer! It now has ${homeComputer.cpuCores} cores.`,
      );
      return true;
    },
    getUpgradeHomeCoresCost: function (): number {
      helper.updateDynamicRam("getUpgradeHomeCoresCost", getRamCost(player, "getUpgradeHomeCoresCost"));
      helper.checkSingularityAccess("getUpgradeHomeCoresCost");

      return player.getUpgradeHomeCoresCost();
    },
    upgradeHomeRam: function (): boolean {
      helper.updateDynamicRam("upgradeHomeRam", getRamCost(player, "upgradeHomeRam"));
      helper.checkSingularityAccess("upgradeHomeRam");

      // Check if we're at max RAM
      const homeComputer = player.getHomeComputer();
      if (homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
        workerScript.log("upgradeHomeRam", () => `Your home computer is at max RAM.`);
        return false;
      }

      const cost = player.getUpgradeHomeRamCost();
      if (player.money < cost) {
        workerScript.log(
          "upgradeHomeRam",
          () => `You don't have enough money. Need ${numeralWrapper.formatMoney(cost)}`,
        );
        return false;
      }

      homeComputer.maxRam *= 2;
      player.loseMoney(cost, "servers");

      player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain * 2);
      workerScript.log(
        "upgradeHomeRam",
        () =>
          `Purchased additional RAM for home computer! It now has ${numeralWrapper.formatRAM(
            homeComputer.maxRam,
          )} of RAM.`,
      );
      return true;
    },
    getUpgradeHomeRamCost: function (): number {
      helper.updateDynamicRam("getUpgradeHomeRamCost", getRamCost(player, "getUpgradeHomeRamCost"));
      helper.checkSingularityAccess("getUpgradeHomeRamCost");

      return player.getUpgradeHomeRamCost();
    },
    workForCompany: function (_companyName: unknown, _focus: unknown = true): boolean {
      let companyName = helper.string("workForCompany", "companyName", _companyName);
      const focus = helper.boolean(_focus);
      helper.updateDynamicRam("workForCompany", getRamCost(player, "workForCompany"));
      helper.checkSingularityAccess("workForCompany");

      // Sanitize input
      if (companyName == null) {
        companyName = player.companyName;
      }

      // Make sure its a valid company
      if (companyName == null || companyName === "" || !(Companies[companyName] instanceof Company)) {
        workerScript.log("workForCompany", () => `Invalid company: '${companyName}'`);
        return false;
      }

      // Make sure player is actually employed at the comapny
      if (!Object.keys(player.jobs).includes(companyName)) {
        workerScript.log("workForCompany", () => `You do not have a job at '${companyName}'`);
        return false;
      }

      // Check to make sure company position data is valid
      const companyPositionName = player.jobs[companyName];
      const companyPosition = CompanyPositions[companyPositionName];
      if (companyPositionName === "" || !(companyPosition instanceof CompanyPosition)) {
        workerScript.log("workForCompany", () => "You do not have a job");
        return false;
      }

      const wasFocused = player.focus;
      if (player.isWorking) {
        const txt = player.singularityStopWork();
        workerScript.log("workForCompany", () => txt);
      }

      if (companyPosition.isPartTimeJob()) {
        player.startWorkPartTime(companyName);
      } else {
        player.startWork(companyName);
      }

      if (focus) {
        player.startFocusing();
        Router.toWork();
      } else if (wasFocused) {
        player.stopFocusing();
        Router.toTerminal();
      }
      workerScript.log(
        "workForCompany",
        () => `Began working at '${player.companyName}' as a '${companyPositionName}'`,
      );
      return true;
    },
    applyToCompany: function (_companyName: unknown, _field: unknown): boolean {
      const companyName = helper.string("applyToCompany", "companyName", _companyName);
      const field = helper.string("applyToCompany", "field", _field);
      helper.updateDynamicRam("applyToCompany", getRamCost(player, "applyToCompany"));
      helper.checkSingularityAccess("applyToCompany");
      getCompany("applyToCompany", companyName);

      player.location = companyName as LocationName;
      let res;
      switch (field.toLowerCase()) {
        case "software":
          res = player.applyForSoftwareJob(true);
          break;
        case "software consultant":
          res = player.applyForSoftwareConsultantJob(true);
          break;
        case "it":
          res = player.applyForItJob(true);
          break;
        case "security engineer":
          res = player.applyForSecurityEngineerJob(true);
          break;
        case "network engineer":
          res = player.applyForNetworkEngineerJob(true);
          break;
        case "business":
          res = player.applyForBusinessJob(true);
          break;
        case "business consultant":
          res = player.applyForBusinessConsultantJob(true);
          break;
        case "security":
          res = player.applyForSecurityJob(true);
          break;
        case "agent":
          res = player.applyForAgentJob(true);
          break;
        case "employee":
          res = player.applyForEmployeeJob(true);
          break;
        case "part-time employee":
          res = player.applyForPartTimeEmployeeJob(true);
          break;
        case "waiter":
          res = player.applyForWaiterJob(true);
          break;
        case "part-time waiter":
          res = player.applyForPartTimeWaiterJob(true);
          break;
        default:
          workerScript.log("applyToCompany", () => `Invalid job: '${field}'.`);
          return false;
      }
      // TODO https://github.com/danielyxie/bitburner/issues/1378
      // The player object's applyForJob function can return string with special error messages
      // if (isString(res)) {
      //   workerScript.log("applyToCompany",()=> res);
      //   return false;
      // }
      if (res) {
        workerScript.log(
          "applyToCompany",
          () => `You were offered a new job at '${companyName}' as a '${player.jobs[companyName]}'`,
        );
      } else {
        workerScript.log(
          "applyToCompany",
          () => `You failed to get a new job/promotion at '${companyName}' in the '${field}' field.`,
        );
      }
      return res;
    },
    getCompanyRep: function (_companyName: unknown): number {
      const companyName = helper.string("getCompanyRep", "companyName", _companyName);
      helper.updateDynamicRam("getCompanyRep", getRamCost(player, "getCompanyRep"));
      helper.checkSingularityAccess("getCompanyRep");
      const company = getCompany("getCompanyRep", companyName);
      return company.playerReputation;
    },
    getCompanyFavor: function (_companyName: unknown): number {
      const companyName = helper.string("getCompanyFavor", "companyName", _companyName);
      helper.updateDynamicRam("getCompanyFavor", getRamCost(player, "getCompanyFavor"));
      helper.checkSingularityAccess("getCompanyFavor");
      const company = getCompany("getCompanyFavor", companyName);
      return company.favor;
    },
    getCompanyFavorGain: function (_companyName: unknown): number {
      const companyName = helper.string("getCompanyFavorGain", "companyName", _companyName);
      helper.updateDynamicRam("getCompanyFavorGain", getRamCost(player, "getCompanyFavorGain"));
      helper.checkSingularityAccess("getCompanyFavorGain");
      const company = getCompany("getCompanyFavorGain", companyName);
      return company.getFavorGain();
    },
    checkFactionInvitations: function (): string[] {
      helper.updateDynamicRam("checkFactionInvitations", getRamCost(player, "checkFactionInvitations"));
      helper.checkSingularityAccess("checkFactionInvitations");
      // Make a copy of player.factionInvitations
      return player.factionInvitations.slice();
    },
    joinFaction: function (_facName: unknown): boolean {
      const facName = helper.string("joinFaction", "facName", _facName);
      helper.updateDynamicRam("joinFaction", getRamCost(player, "joinFaction"));
      helper.checkSingularityAccess("joinFaction");
      getFaction("joinFaction", facName);

      if (!player.factionInvitations.includes(facName)) {
        workerScript.log("joinFaction", () => `You have not been invited by faction '${facName}'`);
        return false;
      }
      const fac = Factions[facName];
      joinFaction(fac);

      // Update Faction Invitation list to account for joined + banned factions
      for (let i = 0; i < player.factionInvitations.length; ++i) {
        if (player.factionInvitations[i] == facName || Factions[player.factionInvitations[i]].isBanned) {
          player.factionInvitations.splice(i, 1);
          i--;
        }
      }
      player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain * 5);
      workerScript.log("joinFaction", () => `Joined the '${facName}' faction.`);
      return true;
    },
    workForFaction: function (_facName: unknown, _type: unknown, _focus: unknown = true): boolean {
      const facName = helper.string("workForFaction", "facName", _facName);
      const type = helper.string("workForFaction", "type", _type);
      const focus = helper.boolean(_focus);
      helper.updateDynamicRam("workForFaction", getRamCost(player, "workForFaction"));
      helper.checkSingularityAccess("workForFaction");
      getFaction("workForFaction", facName);

      // if the player is in a gang and the target faction is any of the gang faction, fail
      if (player.inGang() && AllGangs[facName] !== undefined) {
        workerScript.log("workForFaction", () => `Faction '${facName}' does not offer work at the moment.`);
        return false;
      }

      if (!player.factions.includes(facName)) {
        workerScript.log("workForFaction", () => `You are not a member of '${facName}'`);
        return false;
      }

      const wasFocusing = player.focus;
      if (player.isWorking) {
        const txt = player.singularityStopWork();
        workerScript.log("workForFaction", () => txt);
      }

      const fac = Factions[facName];
      // Arrays listing factions that allow each time of work

      switch (type.toLowerCase()) {
        case "hacking":
        case "hacking contracts":
        case "hackingcontracts":
          if (!FactionInfos[fac.name].offerHackingWork) {
            workerScript.log("workForFaction", () => `Faction '${fac.name}' do not need help with hacking contracts.`);
            return false;
          }
          player.startFactionHackWork(fac);
          if (focus) {
            player.startFocusing();
            Router.toWork();
          } else if (wasFocusing) {
            player.stopFocusing();
            Router.toTerminal();
          }
          workerScript.log("workForFaction", () => `Started carrying out hacking contracts for '${fac.name}'`);
          return true;
        case "field":
        case "fieldwork":
        case "field work":
          if (!FactionInfos[fac.name].offerFieldWork) {
            workerScript.log("workForFaction", () => `Faction '${fac.name}' do not need help with field missions.`);
            return false;
          }
          player.startFactionFieldWork(fac);
          if (focus) {
            player.startFocusing();
            Router.toWork();
          } else if (wasFocusing) {
            player.stopFocusing();
            Router.toTerminal();
          }
          workerScript.log("workForFaction", () => `Started carrying out field missions for '${fac.name}'`);
          return true;
        case "security":
        case "securitywork":
        case "security work":
          if (!FactionInfos[fac.name].offerSecurityWork) {
            workerScript.log("workForFaction", () => `Faction '${fac.name}' do not need help with security work.`);
            return false;
          }
          player.startFactionSecurityWork(fac);
          if (focus) {
            player.startFocusing();
            Router.toWork();
          } else if (wasFocusing) {
            player.stopFocusing();
            Router.toTerminal();
          }
          workerScript.log("workForFaction", () => `Started carrying out security work for '${fac.name}'`);
          return true;
        default:
          workerScript.log("workForFaction", () => `Invalid work type: '${type}`);
      }
      return true;
    },
    getFactionRep: function (_facName: unknown): number {
      const facName = helper.string("getFactionRep", "facName", _facName);
      helper.updateDynamicRam("getFactionRep", getRamCost(player, "getFactionRep"));
      helper.checkSingularityAccess("getFactionRep");
      const faction = getFaction("getFactionRep", facName);
      return faction.playerReputation;
    },
    getFactionFavor: function (_facName: unknown): number {
      const facName = helper.string("getFactionRep", "facName", _facName);
      helper.updateDynamicRam("getFactionFavor", getRamCost(player, "getFactionFavor"));
      helper.checkSingularityAccess("getFactionFavor");
      const faction = getFaction("getFactionFavor", facName);
      return faction.favor;
    },
    getFactionFavorGain: function (_facName: unknown): number {
      const facName = helper.string("getFactionFavorGain", "facName", _facName);
      helper.updateDynamicRam("getFactionFavorGain", getRamCost(player, "getFactionFavorGain"));
      helper.checkSingularityAccess("getFactionFavorGain");
      const faction = getFaction("getFactionFavorGain", facName);
      return faction.getFavorGain();
    },
    donateToFaction: function (_facName: unknown, _amt: unknown): boolean {
      const facName = helper.string("donateToFaction", "facName", _facName);
      const amt = helper.number("donateToFaction", "amt", _amt);
      helper.updateDynamicRam("donateToFaction", getRamCost(player, "donateToFaction"));
      helper.checkSingularityAccess("donateToFaction");
      const faction = getFaction("donateToFaction", facName);
      if (!player.factions.includes(faction.name)) {
        workerScript.log("donateToFaction", () => `You can't donate to '${facName}' because you aren't a member`);
        return false;
      }
      if (player.inGang() && faction.name === player.getGangFaction().name) {
        workerScript.log(
          "donateToFaction",
          () => `You can't donate to '${facName}' because youre managing a gang for it`,
        );
        return false;
      }
      if (typeof amt !== "number" || amt <= 0 || isNaN(amt)) {
        workerScript.log("donateToFaction", () => `Invalid donation amount: '${amt}'.`);
        return false;
      }
      if (player.money < amt) {
        workerScript.log(
          "donateToFaction",
          () => `You do not have enough money to donate ${numeralWrapper.formatMoney(amt)} to '${facName}'`,
        );
        return false;
      }
      const repNeededToDonate = Math.floor(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
      if (faction.favor < repNeededToDonate) {
        workerScript.log(
          "donateToFaction",
          () =>
            `You do not have enough favor to donate to this faction. Have ${faction.favor}, need ${repNeededToDonate}`,
        );
        return false;
      }
      const repGain = (amt / CONSTANTS.DonateMoneyToRepDivisor) * player.faction_rep_mult;
      faction.playerReputation += repGain;
      player.loseMoney(amt, "other");
      workerScript.log(
        "donateToFaction",
        () =>
          `${numeralWrapper.formatMoney(amt)} donated to '${facName}' for ${numeralWrapper.formatReputation(
            repGain,
          )} reputation`,
      );
      return true;
    },
    createProgram: function (_programName: any, _focus: unknown = true): boolean {
      const programName = helper.string("createProgram", "programName", _programName).toLowerCase();
      const focus = helper.boolean(_focus);
      helper.updateDynamicRam("createProgram", getRamCost(player, "createProgram"));
      helper.checkSingularityAccess("createProgram");

      const wasFocusing = player.focus;
      if (player.isWorking) {
        const txt = player.singularityStopWork();
        workerScript.log("createProgram", () => txt);
      }

      const p = Object.values(Programs).find((p) => p.name.toLowerCase() === programName);

      if (p == null) {
        workerScript.log("createProgram", () => `The specified program does not exist: '${programName}`);
        return false;
      }

      if (player.hasProgram(p.name)) {
        workerScript.log("createProgram", () => `You already have the '${p.name}' program`);
        return false;
      }

      const create = p.create;
      if (create === null) {
        workerScript.log("createProgram", () => `You cannot create the '${p.name}' program`);
        return false;
      }

      if (!create.req(player)) {
        workerScript.log(
          "createProgram",
          () => `Hacking level is too low to create '${p.name}' (level ${create.level} req)`,
        );
        return false;
      }

      player.startCreateProgramWork(p.name, create.time, create.level);
      if (focus) {
        player.startFocusing();
        Router.toWork();
      } else if (wasFocusing) {
        player.stopFocusing();
        Router.toTerminal();
      }
      workerScript.log("createProgram", () => `Began creating program: '${programName}'`);
      return true;
    },
    commitCrime: function (_crimeRoughName: unknown): number {
      const crimeRoughName = helper.string("commitCrime", "crimeRoughName", _crimeRoughName);
      helper.updateDynamicRam("commitCrime", getRamCost(player, "commitCrime"));
      helper.checkSingularityAccess("commitCrime");

      if (player.isWorking) {
        const txt = player.singularityStopWork();
        workerScript.log("commitCrime", () => txt);
      }

      // Set Location to slums
      player.gotoLocation(LocationName.Slums);

      const crime = findCrime(crimeRoughName.toLowerCase());
      if (crime == null) {
        // couldn't find crime
        throw helper.makeRuntimeErrorMsg("commitCrime", `Invalid crime: '${crimeRoughName}'`);
      }
      workerScript.log("commitCrime", () => `Attempting to commit ${crime.name}...`);
      return crime.commit(Router, player, 1, workerScript);
    },
    getCrimeChance: function (_crimeRoughName: unknown): number {
      const crimeRoughName = helper.string("getCrimeChance", "crimeRoughName", _crimeRoughName);
      helper.updateDynamicRam("getCrimeChance", getRamCost(player, "getCrimeChance"));
      helper.checkSingularityAccess("getCrimeChance");

      const crime = findCrime(crimeRoughName.toLowerCase());
      if (crime == null) {
        throw helper.makeRuntimeErrorMsg("getCrimeChance", `Invalid crime: ${crimeRoughName}`);
      }

      return crime.successRate(player);
    },
    getCrimeStats: function (_crimeRoughName: unknown): CrimeStats {
      const crimeRoughName = helper.string("getCrimeStats", "crimeRoughName", _crimeRoughName);
      helper.updateDynamicRam("getCrimeStats", getRamCost(player, "getCrimeStats"));
      helper.checkSingularityAccess("getCrimeStats");

      const crime = findCrime(crimeRoughName.toLowerCase());
      if (crime == null) {
        throw helper.makeRuntimeErrorMsg("getCrimeStats", `Invalid crime: ${crimeRoughName}`);
      }

      return Object.assign({}, crime);
    },
    getDarkwebPrograms: function (): string[] {
      helper.updateDynamicRam("getDarkwebPrograms", getRamCost(player, "getDarkwebPrograms"));
      helper.checkSingularityAccess("getDarkwebPrograms");

      // If we don't have Tor, log it and return [] (empty list)
      if (!player.hasTorRouter()) {
        workerScript.log("getDarkwebPrograms", () => "You do not have the TOR router.");
        return [];
      }
      return Object.values(DarkWebItems).map((p) => p.program);
    },
    getDarkwebProgramCost: function (_programName: unknown): number {
      const programName = helper.string("getDarkwebProgramCost", "programName", _programName).toLowerCase();
      helper.updateDynamicRam("getDarkwebProgramCost", getRamCost(player, "getDarkwebProgramCost"));
      helper.checkSingularityAccess("getDarkwebProgramCost");

      // If we don't have Tor, log it and return -1
      if (!player.hasTorRouter()) {
        workerScript.log("getDarkwebProgramCost", () => "You do not have the TOR router.");
        // returning -1 rather than throwing an error to be consistent with purchaseProgram
        // which returns false if tor has
        return -1;
      }

      const item = Object.values(DarkWebItems).find((i) => i.program.toLowerCase() === programName);

      // If the program doesn't exist, throw an error. The reasoning here is that the 99% case is that
      // the player will be using this in automation scripts, and if they're asking for a program that
      // doesn't exist, it's the first time they've run the script. So throw an error to let them know
      // that they need to fix it.
      if (item == null) {
        throw helper.makeRuntimeErrorMsg(
          "getDarkwebProgramCost",
          `No such exploit ('${programName}') found on the darkweb! ` +
            `\nThis function is not case-sensitive. Did you perhaps forget .exe at the end?`,
        );
      }

      if (player.hasProgram(item.program)) {
        workerScript.log("getDarkwebProgramCost", () => `You already have the '${item.program}' program`);
        return 0;
      }
      return item.price;
    },
  };
}
