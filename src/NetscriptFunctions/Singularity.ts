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

import { Singularity as ISingularity } from "../ScriptEditor/NetscriptDefinitions";

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

export function NetscriptSingularity(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): ISingularity {
  const getAugmentation = function (func: any, name: any): Augmentation {
    if (!augmentationExists(name)) {
      throw helper.makeRuntimeErrorMsg(func, `Invalid augmentation: '${name}'`);
    }

    return Augmentations[name];
  };

  const getFaction = function (func: any, name: any): Faction {
    if (!factionExists(name)) {
      throw helper.makeRuntimeErrorMsg(func, `Invalid faction name: '${name}`);
    }

    return Factions[name];
  };

  const getCompany = function (func: any, name: any): Company {
    const company = Companies[name];
    if (company == null || !(company instanceof Company)) {
      throw helper.makeRuntimeErrorMsg(func, `Invalid company name: '${name}'`);
    }
    return company;
  };

  const runAfterReset = function (cbScript = null): void {
    //Run a script after reset
    if (cbScript && isString(cbScript)) {
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
          startWorkerScript(runningScriptObj, home);
        }
      }
    }
  };
  return {
    getOwnedAugmentations: function (purchased: any = false): any {
      helper.updateDynamicRam("getOwnedAugmentations", getRamCost("getOwnedAugmentations"));
      helper.checkSingularityAccess("getOwnedAugmentations", 3);
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
    getOwnedSourceFiles: function (): any {
      helper.updateDynamicRam("getOwnedSourceFiles", getRamCost("getOwnedSourceFiles"));
      helper.checkSingularityAccess("getOwnedSourceFiles", 3);
      const res = [];
      for (let i = 0; i < player.sourceFiles.length; ++i) {
        res.push({
          n: player.sourceFiles[i].n,
          lvl: player.sourceFiles[i].lvl,
        });
      }
      return res;
    },
    getAugmentationsFromFaction: function (facname: any): any {
      helper.updateDynamicRam("getAugmentationsFromFaction", getRamCost("getAugmentationsFromFaction"));
      helper.checkSingularityAccess("getAugmentationsFromFaction", 3);
      const faction = getFaction("getAugmentationsFromFaction", facname);

      // If player has a gang with this faction, return all augmentations.
      if (player.hasGangWith(facname)) {
        const res = [];
        for (const augName in Augmentations) {
          const aug = Augmentations[augName];
          if (!aug.isSpecial) {
            res.push(augName);
          }
        }

        return res;
      }

      return faction.augmentations.slice();
    },
    getAugmentationCost: function (name: any): any {
      helper.updateDynamicRam("getAugmentationCost", getRamCost("getAugmentationCost"));
      helper.checkSingularityAccess("getAugmentationCost", 3);
      const aug = getAugmentation("getAugmentationCost", name);
      return [aug.baseRepRequirement, aug.baseCost];
    },
    getAugmentationPrereq: function (name: any): any {
      helper.updateDynamicRam("getAugmentationPrereq", getRamCost("getAugmentationPrereq"));
      helper.checkSingularityAccess("getAugmentationPrereq", 3);
      const aug = getAugmentation("getAugmentationPrereq", name);
      return aug.prereqs.slice();
    },
    getAugmentationPrice: function (name: any): any {
      helper.updateDynamicRam("getAugmentationPrice", getRamCost("getAugmentationPrice"));
      helper.checkSingularityAccess("getAugmentationPrice", 3);
      const aug = getAugmentation("getAugmentationPrice", name);
      return aug.baseCost;
    },
    getAugmentationRepReq: function (name: any): any {
      helper.updateDynamicRam("getAugmentationRepReq", getRamCost("getAugmentationRepReq"));
      helper.checkSingularityAccess("getAugmentationRepReq", 3);
      const aug = getAugmentation("getAugmentationRepReq", name);
      return aug.baseRepRequirement;
    },
    getAugmentationStats: function (name: any): any {
      helper.updateDynamicRam("getAugmentationStats", getRamCost("getAugmentationStats"));
      helper.checkSingularityAccess("getAugmentationStats", 3);
      const aug = getAugmentation("getAugmentationStats", name);
      return Object.assign({}, aug.mults);
    },
    purchaseAugmentation: function (faction: any, name: any): any {
      helper.updateDynamicRam("purchaseAugmentation", getRamCost("purchaseAugmentation"));
      helper.checkSingularityAccess("purchaseAugmentation", 3);
      const fac = getFaction("purchaseAugmentation", faction);
      const aug = getAugmentation("purchaseAugmentation", name);

      let augs = [];
      if (player.hasGangWith(faction)) {
        for (const augName in Augmentations) {
          const tempAug = Augmentations[augName];
          if (!tempAug.isSpecial) {
            augs.push(augName);
          }
        }
      } else {
        augs = fac.augmentations;
      }

      if (!augs.includes(name)) {
        workerScript.log("purchaseAugmentation", `Faction '${faction}' does not have the '${name}' augmentation.`);
        return false;
      }

      const isNeuroflux = aug.name === AugmentationNames.NeuroFluxGovernor;
      if (!isNeuroflux) {
        for (let j = 0; j < player.queuedAugmentations.length; ++j) {
          if (player.queuedAugmentations[j].name === aug.name) {
            workerScript.log("purchaseAugmentation", `You already have the '${name}' augmentation.`);
            return false;
          }
        }
        for (let j = 0; j < player.augmentations.length; ++j) {
          if (player.augmentations[j].name === aug.name) {
            workerScript.log("purchaseAugmentation", `You already have the '${name}' augmentation.`);
            return false;
          }
        }
      }

      if (fac.playerReputation < aug.baseRepRequirement) {
        workerScript.log("purchaseAugmentation", `You do not have enough reputation with '${fac.name}'.`);
        return false;
      }

      const res = purchaseAugmentation(aug, fac, true);
      workerScript.log("purchaseAugmentation", res);
      if (isString(res) && res.startsWith("You purchased")) {
        player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
        return true;
      } else {
        return false;
      }
    },
    softReset: function (cbScript: any): any {
      helper.updateDynamicRam("softReset", getRamCost("softReset"));
      helper.checkSingularityAccess("softReset", 3);

      workerScript.log("softReset", "Soft resetting. This will cause this script to be killed");
      setTimeout(() => {
        prestigeAugmentation();
        runAfterReset(cbScript);
      }, 0);

      // Prevent workerScript from "finishing execution naturally"
      workerScript.running = false;
      killWorkerScript(workerScript);
    },
    installAugmentations: function (cbScript: any): any {
      helper.updateDynamicRam("installAugmentations", getRamCost("installAugmentations"));
      helper.checkSingularityAccess("installAugmentations", 3);

      if (player.queuedAugmentations.length === 0) {
        workerScript.log("installAugmentations", "You do not have any Augmentations to be installed.");
        return false;
      }
      player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
      workerScript.log("installAugmentations", "Installing Augmentations. This will cause this script to be killed");
      setTimeout(() => {
        installAugmentations();
        runAfterReset(cbScript);
      }, 0);

      workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
      killWorkerScript(workerScript);
    },

    goToLocation: function (locationName: any): boolean {
      helper.updateDynamicRam("goToLocation", getRamCost("goToLocation"));
      helper.checkSingularityAccess("goToLocation", 1);
      const location = Object.values(Locations).find((l) => l.name === locationName);
      if (!location) {
        workerScript.log("goToLocation", `No location named ${locationName}`);
        return false;
      }
      if (player.city !== location.city) {
        workerScript.log("goToLocation", `No location named ${locationName} in ${player.city}`);
        return false;
      }
      Router.toLocation(location);
      player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain / 100);
      return true;
    },
    universityCourse: function (universityName: any, className: any): any {
      helper.updateDynamicRam("universityCourse", getRamCost("universityCourse"));
      helper.checkSingularityAccess("universityCourse", 1);
      if (player.isWorking) {
        const txt = player.singularityStopWork();
        workerScript.log("universityCourse", txt);
      }

      let costMult, expMult;
      switch (universityName.toLowerCase()) {
        case LocationName.AevumSummitUniversity.toLowerCase():
          if (player.city != CityName.Aevum) {
            workerScript.log(
              "universityCourse",
              "You cannot study at 'Summit University' because you are not in 'Aevum'.",
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
              "You cannot study at 'Rothman University' because you are not in 'Sector-12'.",
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
              "You cannot study at 'ZB Institute of Technology' because you are not in 'Volhaven'.",
            );
            return false;
          }
          player.location = LocationName.VolhavenZBInstituteOfTechnology;
          costMult = 5;
          expMult = 4;
          break;
        default:
          workerScript.log("universityCourse", `Invalid university name: '${universityName}'.`);
          return false;
      }

      let task;
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
          workerScript.log("universityCourse", `Invalid class name: ${className}.`);
          return false;
      }
      player.startClass(Router, costMult, expMult, task);
      workerScript.log("universityCourse", `Started ${task} at ${universityName}`);
      return true;
    },

    gymWorkout: function (gymName: any, stat: any): any {
      helper.updateDynamicRam("gymWorkout", getRamCost("gymWorkout"));
      helper.checkSingularityAccess("gymWorkout", 1);
      if (player.isWorking) {
        const txt = player.singularityStopWork();
        workerScript.log("gymWorkout", txt);
      }
      let costMult, expMult;
      switch (gymName.toLowerCase()) {
        case LocationName.AevumCrushFitnessGym.toLowerCase():
          if (player.city != CityName.Aevum) {
            workerScript.log("gymWorkout", "You cannot workout at 'Crush Fitness' because you are not in 'Aevum'.");
            return false;
          }
          player.location = LocationName.AevumCrushFitnessGym;
          costMult = 3;
          expMult = 2;
          break;
        case LocationName.AevumSnapFitnessGym.toLowerCase():
          if (player.city != CityName.Aevum) {
            workerScript.log("gymWorkout", "You cannot workout at 'Snap Fitness' because you are not in 'Aevum'.");
            return false;
          }
          player.location = LocationName.AevumSnapFitnessGym;
          costMult = 10;
          expMult = 5;
          break;
        case LocationName.Sector12IronGym.toLowerCase():
          if (player.city != CityName.Sector12) {
            workerScript.log("gymWorkout", "You cannot workout at 'Iron Gym' because you are not in 'Sector-12'.");
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
              "You cannot workout at 'Powerhouse Gym' because you are not in 'Sector-12'.",
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
              "You cannot workout at 'Millenium Fitness Gym' because you are not in 'Volhaven'.",
            );
            return false;
          }
          player.location = LocationName.VolhavenMilleniumFitnessGym;
          costMult = 7;
          expMult = 4;
          break;
        default:
          workerScript.log("gymWorkout", `Invalid gym name: ${gymName}. gymWorkout() failed`);
          return false;
      }

      switch (stat.toLowerCase()) {
        case "strength".toLowerCase():
        case "str".toLowerCase():
          player.startClass(Router, costMult, expMult, CONSTANTS.ClassGymStrength);
          break;
        case "defense".toLowerCase():
        case "def".toLowerCase():
          player.startClass(Router, costMult, expMult, CONSTANTS.ClassGymDefense);
          break;
        case "dexterity".toLowerCase():
        case "dex".toLowerCase():
          player.startClass(Router, costMult, expMult, CONSTANTS.ClassGymDexterity);
          break;
        case "agility".toLowerCase():
        case "agi".toLowerCase():
          player.startClass(Router, costMult, expMult, CONSTANTS.ClassGymAgility);
          break;
        default:
          workerScript.log("gymWorkout", `Invalid stat: ${stat}.`);
          return false;
      }
      workerScript.log("gymWorkout", `Started training ${stat} at ${gymName}`);
      return true;
    },

    travelToCity: function (cityname: any): any {
      helper.updateDynamicRam("travelToCity", getRamCost("travelToCity"));
      helper.checkSingularityAccess("travelToCity", 1);

      switch (cityname) {
        case CityName.Aevum:
        case CityName.Chongqing:
        case CityName.Sector12:
        case CityName.NewTokyo:
        case CityName.Ishima:
        case CityName.Volhaven:
          if (player.money < CONSTANTS.TravelCost) {
            throw helper.makeRuntimeErrorMsg("travelToCity", "Not enough money to travel.");
          }
          player.loseMoney(CONSTANTS.TravelCost, "other");
          player.city = cityname;
          workerScript.log("travelToCity", `Traveled to ${cityname}`);
          player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain / 50);
          return true;
        default:
          workerScript.log("travelToCity", `Invalid city name: '${cityname}'.`);
          return false;
      }
    },

    purchaseTor: function (): any {
      helper.updateDynamicRam("purchaseTor", getRamCost("purchaseTor"));
      helper.checkSingularityAccess("purchaseTor", 1);

      if (player.hasTorRouter()) {
        workerScript.log("purchaseTor", "You already have a TOR router!");
        return false;
      }

      if (player.money < CONSTANTS.TorRouterCost) {
        workerScript.log("purchaseTor", "You cannot afford to purchase a Tor router.");
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
      player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
      workerScript.log("purchaseTor", "You have purchased a Tor router!");
      return true;
    },
    purchaseProgram: function (programName: any): any {
      helper.updateDynamicRam("purchaseProgram", getRamCost("purchaseProgram"));
      helper.checkSingularityAccess("purchaseProgram", 1);

      if (!player.hasTorRouter()) {
        workerScript.log("purchaseProgram", "You do not have the TOR router.");
        return false;
      }

      programName = programName.toLowerCase();

      let item = null;
      for (const key in DarkWebItems) {
        const i = DarkWebItems[key];
        if (i.program.toLowerCase() == programName) {
          item = i;
        }
      }

      if (item == null) {
        workerScript.log("purchaseProgram", `Invalid program name: '${programName}.`);
        return false;
      }

      if (player.money < item.price) {
        workerScript.log(
          "purchaseProgram",
          `Not enough money to purchase '${item.program}'. Need ${numeralWrapper.formatMoney(item.price)}`,
        );
        return false;
      }

      if (player.hasProgram(item.program)) {
        workerScript.log("purchaseProgram", `You already have the '${item.program}' program`);
        return true;
      }

      player.loseMoney(item.price, "other");
      player.getHomeComputer().programs.push(item.program);
      workerScript.log(
        "purchaseProgram",
        `You have purchased the '${item.program}' program. The new program can be found on your home computer.`,
      );
      player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain / 50);
      return true;
    },
    getCurrentServer: function (): any {
      helper.updateDynamicRam("getCurrentServer", getRamCost("getCurrentServer"));
      helper.checkSingularityAccess("getCurrentServer", 1);
      return player.getCurrentServer().hostname;
    },
    connect: function (hostname: any): any {
      helper.updateDynamicRam("connect", getRamCost("connect"));
      helper.checkSingularityAccess("connect", 1);
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
    manualHack: function (): any {
      helper.updateDynamicRam("manualHack", getRamCost("manualHack"));
      helper.checkSingularityAccess("manualHack", 1);
      const server = player.getCurrentServer();
      return helper.hack(server.hostname, true);
    },
    installBackdoor: function (): any {
      helper.updateDynamicRam("installBackdoor", getRamCost("installBackdoor"));
      helper.checkSingularityAccess("installBackdoor", 1);
      const baseserver = player.getCurrentServer();
      if (!(baseserver instanceof Server)) {
        workerScript.log("installBackdoor", "cannot backdoor this kind of server");
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
        `Installing backdoor on '${server.hostname}' in ${convertTimeMsToTimeElapsedString(installTime, true)}`,
      );

      return netscriptDelay(installTime, workerScript).then(function () {
        if (workerScript.env.stopFlag) {
          return Promise.reject(workerScript);
        }
        workerScript.log("installBackdoor", `Successfully installed backdoor on '${server.hostname}'`);

        server.backdoorInstalled = true;

        if (SpecialServers.WorldDaemon === server.hostname) {
          Router.toBitVerse(false, false);
        }
        return Promise.resolve();
      });
    },
    getStats: function (): any {
      helper.updateDynamicRam("getStats", getRamCost("getStats"));
      helper.checkSingularityAccess("getStats", 1);
      workerScript.log("getStats", `getStats is deprecated, please use getplayer`);

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
    getCharacterInformation: function (): any {
      helper.updateDynamicRam("getCharacterInformation", getRamCost("getCharacterInformation"));
      helper.checkSingularityAccess("getCharacterInformation", 1);
      workerScript.log("getCharacterInformation", `getCharacterInformation is deprecated, please use getplayer`);

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
    hospitalize: function (): any {
      helper.updateDynamicRam("hospitalize", getRamCost("hospitalize"));
      helper.checkSingularityAccess("hospitalize", 1);
      if (player.isWorking || Router.page() === Page.Infiltration || Router.page() === Page.BitVerse) {
        workerScript.log("hospitalize", "Cannot go to the hospital because the player is busy.");
        return;
      }
      return player.hospitalize();
    },
    isBusy: function (): any {
      helper.updateDynamicRam("isBusy", getRamCost("isBusy"));
      helper.checkSingularityAccess("isBusy", 1);
      return player.isWorking || Router.page() === Page.Infiltration || Router.page() === Page.BitVerse;
    },
    stopAction: function (): any {
      helper.updateDynamicRam("stopAction", getRamCost("stopAction"));
      helper.checkSingularityAccess("stopAction", 1);
      if (player.isWorking) {
        Router.toTerminal();
        const txt = player.singularityStopWork();
        workerScript.log("stopAction", txt);
        return true;
      }
      return false;
    },
    upgradeHomeCores: function (): any {
      helper.updateDynamicRam("upgradeHomeCores", getRamCost("upgradeHomeCores"));
      helper.checkSingularityAccess("upgradeHomeCores", 2);

      // Check if we're at max cores
      const homeComputer = player.getHomeComputer();
      if (homeComputer.cpuCores >= 8) {
        workerScript.log("upgradeHomeCores", `Your home computer is at max cores.`);
        return false;
      }

      const cost = player.getUpgradeHomeCoresCost();
      if (player.money < cost) {
        workerScript.log("upgradeHomeCores", `You don't have enough money. Need ${numeralWrapper.formatMoney(cost)}`);
        return false;
      }

      homeComputer.cpuCores += 1;
      player.loseMoney(cost, "servers");

      player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
      workerScript.log(
        "upgradeHomeCores",
        `Purchased an additional core for home computer! It now has ${homeComputer.cpuCores} cores.`,
      );
      return true;
    },
    getUpgradeHomeCoresCost: function (): any {
      helper.updateDynamicRam("getUpgradeHomeCoresCost", getRamCost("getUpgradeHomeCoresCost"));
      helper.checkSingularityAccess("getUpgradeHomeCoresCost", 2);

      return player.getUpgradeHomeCoresCost();
    },
    upgradeHomeRam: function (): any {
      helper.updateDynamicRam("upgradeHomeRam", getRamCost("upgradeHomeRam"));
      helper.checkSingularityAccess("upgradeHomeRam", 2);

      // Check if we're at max RAM
      const homeComputer = player.getHomeComputer();
      if (homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
        workerScript.log("upgradeHomeRam", `Your home computer is at max RAM.`);
        return false;
      }

      const cost = player.getUpgradeHomeRamCost();
      if (player.money < cost) {
        workerScript.log("upgradeHomeRam", `You don't have enough money. Need ${numeralWrapper.formatMoney(cost)}`);
        return false;
      }

      homeComputer.maxRam *= 2;
      player.loseMoney(cost, "servers");

      player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
      workerScript.log(
        "upgradeHomeRam",
        `Purchased additional RAM for home computer! It now has ${numeralWrapper.formatRAM(
          homeComputer.maxRam,
        )} of RAM.`,
      );
      return true;
    },
    getUpgradeHomeRamCost: function (): any {
      helper.updateDynamicRam("getUpgradeHomeRamCost", getRamCost("getUpgradeHomeRamCost"));
      helper.checkSingularityAccess("getUpgradeHomeRamCost", 2);

      return player.getUpgradeHomeRamCost();
    },
    workForCompany: function (companyName: any): any {
      helper.updateDynamicRam("workForCompany", getRamCost("workForCompany"));
      helper.checkSingularityAccess("workForCompany", 2);

      // Sanitize input
      if (companyName == null) {
        companyName = player.companyName;
      }

      // Make sure its a valid company
      if (companyName == null || companyName === "" || !(Companies[companyName] instanceof Company)) {
        workerScript.log("workForCompany", `Invalid company: '${companyName}'`);
        return false;
      }

      // Make sure player is actually employed at the comapny
      if (!Object.keys(player.jobs).includes(companyName)) {
        workerScript.log("workForCompany", `You do not have a job at '${companyName}'`);
        return false;
      }

      // Check to make sure company position data is valid
      const companyPositionName = player.jobs[companyName];
      const companyPosition = CompanyPositions[companyPositionName];
      if (companyPositionName === "" || !(companyPosition instanceof CompanyPosition)) {
        workerScript.log("workForCompany", "You do not have a job");
        return false;
      }

      if (player.isWorking) {
        const txt = player.singularityStopWork();
        workerScript.log("workForCompany", txt);
      }

      if (companyPosition.isPartTimeJob()) {
        player.startWorkPartTime(Router, companyName);
      } else {
        player.startWork(Router, companyName);
      }
      workerScript.log("workForCompany", `Began working at '${player.companyName}' as a '${companyPositionName}'`);
      return true;
    },
    applyToCompany: function (companyName: any, field: any): any {
      helper.updateDynamicRam("applyToCompany", getRamCost("applyToCompany"));
      helper.checkSingularityAccess("applyToCompany", 2);
      getCompany("applyToCompany", companyName);

      player.location = companyName;
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
          workerScript.log("applyToCompany", `Invalid job: '${field}'.`);
          return false;
      }
      // TODO https://github.com/danielyxie/bitburner/issues/1378
      // The player object's applyForJob function can return string with special error messages
      // if (isString(res)) {
      //   workerScript.log("applyToCompany", res);
      //   return false;
      // }
      if (res) {
        workerScript.log(
          "applyToCompany",
          `You were offered a new job at '${companyName}' as a '${player.jobs[companyName]}'`,
        );
      } else {
        workerScript.log(
          "applyToCompany",
          `You failed to get a new job/promotion at '${companyName}' in the '${field}' field.`,
        );
      }
      return res;
    },
    getCompanyRep: function (companyName: any): any {
      helper.updateDynamicRam("getCompanyRep", getRamCost("getCompanyRep"));
      helper.checkSingularityAccess("getCompanyRep", 2);
      const company = getCompany("getCompanyRep", companyName);
      return company.playerReputation;
    },
    getCompanyFavor: function (companyName: any): any {
      helper.updateDynamicRam("getCompanyFavor", getRamCost("getCompanyFavor"));
      helper.checkSingularityAccess("getCompanyFavor", 2);
      const company = getCompany("getCompanyFavor", companyName);
      return company.favor;
    },
    getCompanyFavorGain: function (companyName: any): any {
      helper.updateDynamicRam("getCompanyFavorGain", getRamCost("getCompanyFavorGain"));
      helper.checkSingularityAccess("getCompanyFavorGain", 2);
      const company = getCompany("getCompanyFavorGain", companyName);
      return company.getFavorGain();
    },
    checkFactionInvitations: function (): any {
      helper.updateDynamicRam("checkFactionInvitations", getRamCost("checkFactionInvitations"));
      helper.checkSingularityAccess("checkFactionInvitations", 2);
      // Make a copy of player.factionInvitations
      return player.factionInvitations.slice();
    },
    joinFaction: function (name: any): any {
      helper.updateDynamicRam("joinFaction", getRamCost("joinFaction"));
      helper.checkSingularityAccess("joinFaction", 2);
      getFaction("joinFaction", name);

      if (!player.factionInvitations.includes(name)) {
        workerScript.log("joinFaction", `You have not been invited by faction '${name}'`);
        return false;
      }
      const fac = Factions[name];
      joinFaction(fac);

      // Update Faction Invitation list to account for joined + banned factions
      for (let i = 0; i < player.factionInvitations.length; ++i) {
        if (player.factionInvitations[i] == name || Factions[player.factionInvitations[i]].isBanned) {
          player.factionInvitations.splice(i, 1);
          i--;
        }
      }
      player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain);
      workerScript.log("joinFaction", `Joined the '${name}' faction.`);
      return true;
    },
    workForFaction: function (name: any, type: any): any {
      helper.updateDynamicRam("workForFaction", getRamCost("workForFaction"));
      helper.checkSingularityAccess("workForFaction", 2);
      getFaction("workForFaction", name);

      // if the player is in a gang and the target faction is any of the gang faction, fail
      if (player.inGang() && AllGangs[name] !== undefined) {
        workerScript.log("workForFaction", `Faction '${name}' does not offer work at the moment.`);
        return;
      }

      if (!player.factions.includes(name)) {
        workerScript.log("workForFaction", `You are not a member of '${name}'`);
        return false;
      }

      if (player.isWorking) {
        const txt = player.singularityStopWork();
        workerScript.log("workForFaction", txt);
      }

      const fac = Factions[name];
      // Arrays listing factions that allow each time of work
      const hackAvailable = [
        "Illuminati",
        "Daedalus",
        "The Covenant",
        "ECorp",
        "MegaCorp",
        "Bachman & Associates",
        "Blade Industries",
        "NWO",
        "Clarke Incorporated",
        "OmniTek Incorporated",
        "Four Sigma",
        "KuaiGong International",
        "Fulcrum Secret Technologies",
        "BitRunners",
        "The Black Hand",
        "NiteSec",
        "Chongqing",
        "Sector-12",
        "New Tokyo",
        "Aevum",
        "Ishima",
        "Volhaven",
        "Speakers for the Dead",
        "The Dark Army",
        "The Syndicate",
        "Silhouette",
        "Netburners",
        "Tian Di Hui",
        "CyberSec",
      ];
      const fdWkAvailable = [
        "Illuminati",
        "Daedalus",
        "The Covenant",
        "ECorp",
        "MegaCorp",
        "Bachman & Associates",
        "Blade Industries",
        "NWO",
        "Clarke Incorporated",
        "OmniTek Incorporated",
        "Four Sigma",
        "KuaiGong International",
        "The Black Hand",
        "Chongqing",
        "Sector-12",
        "New Tokyo",
        "Aevum",
        "Ishima",
        "Volhaven",
        "Speakers for the Dead",
        "The Dark Army",
        "The Syndicate",
        "Silhouette",
        "Tetrads",
        "Slum Snakes",
      ];
      const scWkAvailable = [
        "ECorp",
        "MegaCorp",
        "Bachman & Associates",
        "Blade Industries",
        "NWO",
        "Clarke Incorporated",
        "OmniTek Incorporated",
        "Four Sigma",
        "KuaiGong International",
        "Fulcrum Secret Technologies",
        "Chongqing",
        "Sector-12",
        "New Tokyo",
        "Aevum",
        "Ishima",
        "Volhaven",
        "Speakers for the Dead",
        "The Syndicate",
        "Tetrads",
        "Slum Snakes",
        "Tian Di Hui",
      ];

      switch (type.toLowerCase()) {
        case "hacking":
        case "hacking contracts":
        case "hackingcontracts":
          if (!hackAvailable.includes(fac.name)) {
            workerScript.log("workForFaction", `Faction '${fac.name}' do not need help with hacking contracts.`);
            return false;
          }
          player.startFactionHackWork(Router, fac);
          workerScript.log("workForFaction", `Started carrying out hacking contracts for '${fac.name}'`);
          return true;
        case "field":
        case "fieldwork":
        case "field work":
          if (!fdWkAvailable.includes(fac.name)) {
            workerScript.log("workForFaction", `Faction '${fac.name}' do not need help with field missions.`);
            return false;
          }
          player.startFactionFieldWork(Router, fac);
          workerScript.log("workForFaction", `Started carrying out field missions for '${fac.name}'`);
          return true;
        case "security":
        case "securitywork":
        case "security work":
          if (!scWkAvailable.includes(fac.name)) {
            workerScript.log("workForFaction", `Faction '${fac.name}' do not need help with security work.`);
            return false;
          }
          player.startFactionSecurityWork(Router, fac);
          workerScript.log("workForFaction", `Started carrying out security work for '${fac.name}'`);
          return true;
        default:
          workerScript.log("workForFaction", `Invalid work type: '${type}`);
      }
      return true;
    },
    getFactionRep: function (name: any): any {
      helper.updateDynamicRam("getFactionRep", getRamCost("getFactionRep"));
      helper.checkSingularityAccess("getFactionRep", 2);
      const faction = getFaction("getFactionRep", name);
      return faction.playerReputation;
    },
    getFactionFavor: function (name: any): any {
      helper.updateDynamicRam("getFactionFavor", getRamCost("getFactionFavor"));
      helper.checkSingularityAccess("getFactionFavor", 2);
      const faction = getFaction("getFactionFavor", name);
      return faction.favor;
    },
    getFactionFavorGain: function (name: any): any {
      helper.updateDynamicRam("getFactionFavorGain", getRamCost("getFactionFavorGain"));
      helper.checkSingularityAccess("getFactionFavorGain", 2);
      const faction = getFaction("getFactionFavorGain", name);
      return faction.getFavorGain();
    },
    donateToFaction: function (name: any, amt: any): any {
      helper.updateDynamicRam("donateToFaction", getRamCost("donateToFaction"));
      helper.checkSingularityAccess("donateToFaction", 3);
      const faction = getFaction("donateToFaction", name);

      if (typeof amt !== "number" || amt <= 0) {
        workerScript.log("donateToFaction", `Invalid donation amount: '${amt}'.`);
        return false;
      }
      if (player.money < amt) {
        workerScript.log(
          "donateToFaction",
          `You do not have enough money to donate ${numeralWrapper.formatMoney(amt)} to '${name}'`,
        );
        return false;
      }
      const repNeededToDonate = Math.round(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
      if (faction.favor < repNeededToDonate) {
        workerScript.log(
          "donateToFaction",
          `You do not have enough favor to donate to this faction. Have ${faction.favor}, need ${repNeededToDonate}`,
        );
        return false;
      }
      const repGain = (amt / CONSTANTS.DonateMoneyToRepDivisor) * player.faction_rep_mult;
      faction.playerReputation += repGain;
      player.loseMoney(amt, "other");
      workerScript.log(
        "donateToFaction",
        `${numeralWrapper.formatMoney(amt)} donated to '${name}' for ${numeralWrapper.formatReputation(
          repGain,
        )} reputation`,
      );
      return true;
    },
    createProgram: function (name: any): any {
      helper.updateDynamicRam("createProgram", getRamCost("createProgram"));
      helper.checkSingularityAccess("createProgram", 3);

      if (player.isWorking) {
        const txt = player.singularityStopWork();
        workerScript.log("createProgram", txt);
      }

      name = name.toLowerCase();

      let p = null;
      for (const key in Programs) {
        if (Programs[key].name.toLowerCase() == name) {
          p = Programs[key];
        }
      }

      if (p == null) {
        workerScript.log("createProgram", `The specified program does not exist: '${name}`);
        return false;
      }

      if (player.hasProgram(p.name)) {
        workerScript.log("createProgram", `You already have the '${p.name}' program`);
        return false;
      }

      const create = p.create;
      if (create === null) {
        workerScript.log("createProgram", `You cannot create the '${p.name}' program`);
        return false;
      }

      if (!create.req(player)) {
        workerScript.log("createProgram", `Hacking level is too low to create '${p.name}' (level ${create.level} req)`);
        return false;
      }

      player.startCreateProgramWork(Router, p.name, create.time, create.level);
      workerScript.log("createProgram", `Began creating program: '${name}'`);
      return true;
    },
    commitCrime: function (crimeRoughName: any): any {
      helper.updateDynamicRam("commitCrime", getRamCost("commitCrime"));
      helper.checkSingularityAccess("commitCrime", 3);

      if (player.isWorking) {
        const txt = player.singularityStopWork();
        workerScript.log("commitCrime", txt);
      }

      // Set Location to slums
      player.gotoLocation(LocationName.Slums);

      const crime = findCrime(crimeRoughName.toLowerCase());
      if (crime == null) {
        // couldn't find crime
        throw helper.makeRuntimeErrorMsg("commitCrime", `Invalid crime: '${crimeRoughName}'`);
      }
      workerScript.log("commitCrime", `Attempting to commit ${crime.name}...`);
      return crime.commit(Router, player, 1, workerScript);
    },
    getCrimeChance: function (crimeRoughName: any): any {
      helper.updateDynamicRam("getCrimeChance", getRamCost("getCrimeChance"));
      helper.checkSingularityAccess("getCrimeChance", 3);

      const crime = findCrime(crimeRoughName.toLowerCase());
      if (crime == null) {
        throw helper.makeRuntimeErrorMsg("getCrimeChance", `Invalid crime: ${crimeRoughName}`);
      }

      return crime.successRate(player);
    },
    getCrimeStats: function (crimeRoughName: any): any {
      helper.updateDynamicRam("getCrimeStats", getRamCost("getCrimeStats"));
      helper.checkSingularityAccess("getCrimeStats", 3);

      const crime = findCrime(crimeRoughName.toLowerCase());
      if (crime == null) {
        throw helper.makeRuntimeErrorMsg("getCrimeStats", `Invalid crime: ${crimeRoughName}`);
      }

      return Object.assign({}, crime);
    },
    isFocused: function (): boolean {
      helper.updateDynamicRam("isFocused", getRamCost("isFocused"));
      helper.checkSingularityAccess("isFocused", 2);
      return player.focus;
    },
    setFocus: function (focus: any): void {
      helper.updateDynamicRam("isFocused", getRamCost("isFocused"));
      helper.checkSingularityAccess("isFocused", 2);
      if (focus === true) {
        player.startFocusing();
      } else if (focus === false) {
        player.stopFocusing();
      }
    },
  };
}
