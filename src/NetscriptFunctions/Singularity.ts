import { Player } from "../Player";
import { purchaseAugmentation, joinFaction, getFactionAugmentationsFiltered } from "../Faction/FactionHelpers";
import { startWorkerScript } from "../NetscriptWorker";
import { Augmentation } from "../Augmentation/Augmentation";
import { StaticAugmentations } from "../Augmentation/StaticAugmentations";
import { augmentationExists, installAugmentations } from "../Augmentation/AugmentationHelpers";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { killWorkerScript } from "../Netscript/killWorkerScript";
import { CONSTANTS } from "../Constants";
import { isString } from "../utils/helpers/isString";
import { RunningScript } from "../Script/RunningScript";
import { calculateAchievements } from "../Achievements/Achievements";

import {
  Multipliers,
  CrimeStats,
  Singularity as ISingularity,
  SourceFileLvl,
} from "../ScriptEditor/NetscriptDefinitions";

import { findCrime } from "../Crime/CrimeHelpers";
import { CompanyPositions } from "../Company/CompanyPositions";
import { DarkWebItems } from "../DarkWeb/DarkWebItems";
import { CityName } from "../Locations/data/CityNames";
import { LocationName } from "../Locations/data/LocationNames";
import { Router } from "../ui/GameRoot";
import { SpecialServers } from "../Server/data/SpecialServers";
import { Page } from "../ui/Router";
import { Locations } from "../Locations/Locations";
import { GetServer } from "../Server/AllServers";
import { Programs } from "../Programs/Programs";
import { numeralWrapper } from "../ui/numeralFormat";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { Company } from "../Company/Company";
import { Companies } from "../Company/Companies";
import { Factions, factionExists } from "../Faction/Factions";
import { Faction } from "../Faction/Faction";
import { helpers } from "../Netscript/NetscriptHelpers";
import { aOrAn, convertTimeMsToTimeElapsedString } from "../utils/StringHelperFunctions";
import { getServerOnNetwork } from "../Server/ServerHelpers";
import { Terminal } from "../Terminal";
import { calculateHackingTime } from "../Hacking";
import { Server } from "../Server/Server";
import { netscriptCanHack } from "../Hacking/netscriptCanHack";
import { FactionInfos } from "../Faction/FactionInfo";
import { InternalAPI, NetscriptContext } from "src/Netscript/APIWrapper";
import { BlackOperationNames } from "../Bladeburner/data/BlackOperationNames";
import { enterBitNode } from "../RedPill";
import { FactionNames } from "../Faction/data/FactionNames";
import { ClassWork, ClassType } from "../Work/ClassWork";
import { CreateProgramWork, isCreateProgramWork } from "../Work/CreateProgramWork";
import { FactionWork } from "../Work/FactionWork";
import { FactionWorkType } from "../Work/data/FactionWorkType";
import { CompanyWork } from "../Work/CompanyWork";
import { canGetBonus, onExport } from "../ExportBonus";
import { saveObject } from "../SaveObject";
import { calculateCrimeWorkStats } from "../Work/formulas/Crime";

export function NetscriptSingularity(): InternalAPI<ISingularity> {
  const getAugmentation = function (ctx: NetscriptContext, name: string): Augmentation {
    if (!augmentationExists(name)) {
      throw helpers.makeRuntimeErrorMsg(ctx, `Invalid augmentation: '${name}'`);
    }

    return StaticAugmentations[name];
  };

  const getFaction = function (ctx: NetscriptContext, name: string): Faction {
    if (!factionExists(name)) {
      throw helpers.makeRuntimeErrorMsg(ctx, `Invalid faction name: '${name}`);
    }

    return Factions[name];
  };

  const getCompany = function (ctx: NetscriptContext, name: string): Company {
    const company = Companies[name];
    if (!company) throw helpers.makeRuntimeErrorMsg(ctx, `Invalid company name: '${name}'`);
    return company;
  };

  const runAfterReset = function (cbScript: string | null = null): void {
    //Run a script after reset
    if (!cbScript) return;
    const home = Player.getHomeComputer();
    for (const script of home.scripts) {
      if (script.filename === cbScript) {
        const ramUsage = script.ramUsage;
        const ramAvailable = home.maxRam - home.ramUsed;
        if (ramUsage > ramAvailable + 0.001) {
          return; // Not enough RAM
        }
        const runningScriptObj = new RunningScript(script, []); // No args
        runningScriptObj.threads = 1; // Only 1 thread
        startWorkerScript(runningScriptObj, home);
      }
    }
  };

  return {
    getOwnedAugmentations: (ctx: NetscriptContext) =>
      function (_purchased: unknown = false): string[] {
        helpers.checkSingularityAccess(ctx);
        const purchased = !!_purchased;
        const res = [];
        for (let i = 0; i < Player.augmentations.length; ++i) {
          res.push(Player.augmentations[i].name);
        }
        if (purchased) {
          for (let i = 0; i < Player.queuedAugmentations.length; ++i) {
            res.push(Player.queuedAugmentations[i].name);
          }
        }
        return res;
      },
    getOwnedSourceFiles: () => (): SourceFileLvl[] => {
      const res: SourceFileLvl[] = [];
      for (let i = 0; i < Player.sourceFiles.length; ++i) {
        res.push({
          n: Player.sourceFiles[i].n,
          lvl: Player.sourceFiles[i].lvl,
        });
      }
      return res;
    },
    getAugmentationsFromFaction: (ctx: NetscriptContext) =>
      function (_facName: unknown): string[] {
        helpers.checkSingularityAccess(ctx);
        const facName = helpers.string(ctx, "facName", _facName);
        const faction = getFaction(ctx, facName);

        return getFactionAugmentationsFiltered(faction);
      },
    getAugmentationCost: (ctx: NetscriptContext) =>
      function (_augName: unknown): [number, number] {
        helpers.checkSingularityAccess(ctx);
        const augName = helpers.string(ctx, "augName", _augName);
        const aug = getAugmentation(ctx, augName);
        const costs = aug.getCost();
        return [costs.repCost, costs.moneyCost];
      },
    getAugmentationPrereq: (ctx: NetscriptContext) =>
      function (_augName: unknown): string[] {
        helpers.checkSingularityAccess(ctx);
        const augName = helpers.string(ctx, "augName", _augName);
        const aug = getAugmentation(ctx, augName);
        return aug.prereqs.slice();
      },
    getAugmentationBasePrice: (ctx: NetscriptContext) =>
      function (_augName: unknown): number {
        helpers.checkSingularityAccess(ctx);
        const augName = helpers.string(ctx, "augName", _augName);
        const aug = getAugmentation(ctx, augName);
        return aug.baseCost * BitNodeMultipliers.AugmentationMoneyCost;
      },
    getAugmentationPrice: (ctx: NetscriptContext) =>
      function (_augName: unknown): number {
        helpers.checkSingularityAccess(ctx);
        const augName = helpers.string(ctx, "augName", _augName);
        const aug = getAugmentation(ctx, augName);
        return aug.getCost().moneyCost;
      },
    getAugmentationRepReq: (ctx: NetscriptContext) =>
      function (_augName: unknown): number {
        helpers.checkSingularityAccess(ctx);
        const augName = helpers.string(ctx, "augName", _augName);
        const aug = getAugmentation(ctx, augName);
        return aug.getCost().repCost;
      },
    getAugmentationStats: (ctx: NetscriptContext) =>
      function (_augName: unknown): Multipliers {
        helpers.checkSingularityAccess(ctx);
        const augName = helpers.string(ctx, "augName", _augName);
        const aug = getAugmentation(ctx, augName);
        return Object.assign({}, aug.mults);
      },
    purchaseAugmentation: (ctx: NetscriptContext) =>
      function (_facName: unknown, _augName: unknown): boolean {
        helpers.checkSingularityAccess(ctx);
        const facName = helpers.string(ctx, "facName", _facName);
        const augName = helpers.string(ctx, "augName", _augName);
        const fac = getFaction(ctx, facName);
        const aug = getAugmentation(ctx, augName);

        const augs = getFactionAugmentationsFiltered(fac);

        if (!Player.factions.includes(fac.name)) {
          helpers.log(ctx, () => `You can't purchase augmentations from '${facName}' because you aren't a member`);
          return false;
        }

        if (!augs.includes(augName)) {
          helpers.log(ctx, () => `Faction '${facName}' does not have the '${augName}' augmentation.`);
          return false;
        }

        const isNeuroflux = aug.name === AugmentationNames.NeuroFluxGovernor;
        if (!isNeuroflux) {
          for (let j = 0; j < Player.queuedAugmentations.length; ++j) {
            if (Player.queuedAugmentations[j].name === aug.name) {
              helpers.log(ctx, () => `You already have the '${augName}' augmentation.`);
              return false;
            }
          }
          for (let j = 0; j < Player.augmentations.length; ++j) {
            if (Player.augmentations[j].name === aug.name) {
              helpers.log(ctx, () => `You already have the '${augName}' augmentation.`);
              return false;
            }
          }
        }

        if (fac.playerReputation < aug.getCost().repCost) {
          helpers.log(ctx, () => `You do not have enough reputation with '${fac.name}'.`);
          return false;
        }

        const res = purchaseAugmentation(aug, fac, true);
        helpers.log(ctx, () => res);
        if (isString(res) && res.startsWith("You purchased")) {
          Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain * 10);
          return true;
        } else {
          return false;
        }
      },
    softReset: (ctx: NetscriptContext) =>
      function (_cbScript: unknown = ""): void {
        helpers.checkSingularityAccess(ctx);
        const cbScript = helpers.string(ctx, "cbScript", _cbScript);

        helpers.log(ctx, () => "Soft resetting. This will cause this script to be killed");
        setTimeout(() => {
          installAugmentations(true);
          runAfterReset(cbScript);
        }, 0);

        killWorkerScript(ctx.workerScript);
      },
    installAugmentations: (ctx: NetscriptContext) =>
      function (_cbScript: unknown = ""): boolean {
        helpers.checkSingularityAccess(ctx);
        const cbScript = helpers.string(ctx, "cbScript", _cbScript);

        if (Player.queuedAugmentations.length === 0) {
          helpers.log(ctx, () => "You do not have any Augmentations to be installed.");
          return false;
        }
        Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain * 10);
        helpers.log(ctx, () => "Installing Augmentations. This will cause this script to be killed");
        setTimeout(() => {
          installAugmentations();
          runAfterReset(cbScript);
        }, 0);

        killWorkerScript(ctx.workerScript);
        return true;
      },

    goToLocation: (ctx: NetscriptContext) =>
      function (_locationName: unknown): boolean {
        helpers.checkSingularityAccess(ctx);
        const locationName = helpers.string(ctx, "locationName", _locationName);
        const location = Object.values(Locations).find((l) => l.name === locationName);
        if (!location) {
          helpers.log(ctx, () => `No location named ${locationName}`);
          return false;
        }
        if (location.city && Player.city !== location.city) {
          helpers.log(ctx, () => `No location named ${locationName} in ${Player.city}`);
          return false;
        }
        if (location.name === LocationName.TravelAgency) {
          Router.toTravel();
        } else if (location.name === LocationName.WorldStockExchange) {
          Router.toStockMarket();
        } else {
          Router.toLocation(location);
        }
        Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain / 50000);
        return true;
      },
    universityCourse: (ctx: NetscriptContext) =>
      function (_universityName: unknown, _className: unknown, _focus: unknown = true): boolean {
        helpers.checkSingularityAccess(ctx);
        const universityName = helpers.string(ctx, "universityName", _universityName);
        const className = helpers.string(ctx, "className", _className);
        const focus = !!_focus;
        const wasFocusing = Player.focus;

        switch (universityName.toLowerCase()) {
          case LocationName.AevumSummitUniversity.toLowerCase():
            if (Player.city != CityName.Aevum) {
              helpers.log(
                ctx,
                () => `You cannot study at 'Summit University' because you are not in '${CityName.Aevum}'.`,
              );
              return false;
            }
            Player.gotoLocation(LocationName.AevumSummitUniversity);
            break;
          case LocationName.Sector12RothmanUniversity.toLowerCase():
            if (Player.city != CityName.Sector12) {
              helpers.log(
                ctx,
                () => `You cannot study at 'Rothman University' because you are not in '${CityName.Sector12}'.`,
              );
              return false;
            }
            Player.location = LocationName.Sector12RothmanUniversity;
            break;
          case LocationName.VolhavenZBInstituteOfTechnology.toLowerCase():
            if (Player.city != CityName.Volhaven) {
              helpers.log(
                ctx,
                () => `You cannot study at 'ZB Institute of Technology' because you are not in '${CityName.Volhaven}'.`,
              );
              return false;
            }
            Player.location = LocationName.VolhavenZBInstituteOfTechnology;
            break;
          default:
            helpers.log(ctx, () => `Invalid university name: '${universityName}'.`);
            return false;
        }

        let task: ClassType;
        switch (className.toLowerCase()) {
          case "Study Computer Science".toLowerCase():
            task = ClassType.StudyComputerScience;
            break;
          case "Data Structures".toLowerCase():
            task = ClassType.DataStructures;
            break;
          case "Networks".toLowerCase():
            task = ClassType.Networks;
            break;
          case "Algorithms".toLowerCase():
            task = ClassType.Algorithms;
            break;
          case "Management".toLowerCase():
            task = ClassType.Management;
            break;
          case "Leadership".toLowerCase():
            task = ClassType.Leadership;
            break;
          default:
            helpers.log(ctx, () => `Invalid class name: ${className}.`);
            return false;
        }
        Player.startWork(
          new ClassWork({
            classType: task,
            location: Player.location,
            singularity: true,
          }),
        );
        if (focus) {
          Player.startFocusing();
          Router.toWork();
        } else if (wasFocusing) {
          Player.stopFocusing();
          Router.toTerminal();
        }
        helpers.log(ctx, () => `Started ${task} at ${universityName}`);
        return true;
      },

    gymWorkout: (ctx: NetscriptContext) =>
      function (_gymName: unknown, _stat: unknown, _focus: unknown = true): boolean {
        helpers.checkSingularityAccess(ctx);
        const gymName = helpers.string(ctx, "gymName", _gymName);
        const stat = helpers.string(ctx, "stat", _stat);
        const focus = !!_focus;
        const wasFocusing = Player.focus;

        switch (gymName.toLowerCase()) {
          case LocationName.AevumCrushFitnessGym.toLowerCase():
            if (Player.city != CityName.Aevum) {
              helpers.log(
                ctx,
                () =>
                  `You cannot workout at '${LocationName.AevumCrushFitnessGym}' because you are not in '${CityName.Aevum}'.`,
              );
              return false;
            }
            Player.location = LocationName.AevumCrushFitnessGym;
            break;
          case LocationName.AevumSnapFitnessGym.toLowerCase():
            if (Player.city != CityName.Aevum) {
              helpers.log(
                ctx,
                () =>
                  `You cannot workout at '${LocationName.AevumSnapFitnessGym}' because you are not in '${CityName.Aevum}'.`,
              );
              return false;
            }
            Player.location = LocationName.AevumSnapFitnessGym;
            break;
          case LocationName.Sector12IronGym.toLowerCase():
            if (Player.city != CityName.Sector12) {
              helpers.log(
                ctx,
                () =>
                  `You cannot workout at '${LocationName.Sector12IronGym}' because you are not in '${CityName.Sector12}'.`,
              );
              return false;
            }
            Player.location = LocationName.Sector12IronGym;
            break;
          case LocationName.Sector12PowerhouseGym.toLowerCase():
            if (Player.city != CityName.Sector12) {
              helpers.log(
                ctx,
                () =>
                  `You cannot workout at '${LocationName.Sector12PowerhouseGym}' because you are not in '${CityName.Sector12}'.`,
              );
              return false;
            }
            Player.location = LocationName.Sector12PowerhouseGym;
            break;
          case LocationName.VolhavenMilleniumFitnessGym.toLowerCase():
            if (Player.city != CityName.Volhaven) {
              helpers.log(
                ctx,
                () =>
                  `You cannot workout at '${LocationName.VolhavenMilleniumFitnessGym}' because you are not in '${CityName.Volhaven}'.`,
              );
              return false;
            }
            Player.location = LocationName.VolhavenMilleniumFitnessGym;
            break;
          default:
            helpers.log(ctx, () => `Invalid gym name: ${gymName}. gymWorkout() failed`);
            return false;
        }

        switch (stat.toLowerCase()) {
          case "strength".toLowerCase():
          case "str".toLowerCase():
            Player.startWork(
              new ClassWork({ classType: ClassType.GymStrength, location: Player.location, singularity: true }),
            );
            break;
          case "defense".toLowerCase():
          case "def".toLowerCase():
            Player.startWork(
              new ClassWork({ classType: ClassType.GymDefense, location: Player.location, singularity: true }),
            );
            break;
          case "dexterity".toLowerCase():
          case "dex".toLowerCase():
            Player.startWork(
              new ClassWork({ classType: ClassType.GymDexterity, location: Player.location, singularity: true }),
            );
            break;
          case "agility".toLowerCase():
          case "agi".toLowerCase():
            Player.startWork(
              new ClassWork({ classType: ClassType.GymAgility, location: Player.location, singularity: true }),
            );
            break;
          default:
            helpers.log(ctx, () => `Invalid stat: ${stat}.`);
            return false;
        }
        if (focus) {
          Player.startFocusing();
          Router.toWork();
        } else if (wasFocusing) {
          Player.stopFocusing();
          Router.toTerminal();
        }
        helpers.log(ctx, () => `Started training ${stat} at ${gymName}`);
        return true;
      },

    travelToCity: (ctx: NetscriptContext) =>
      function (_cityName: unknown): boolean {
        helpers.checkSingularityAccess(ctx);
        const cityName = helpers.city(ctx, "cityName", _cityName);

        switch (cityName) {
          case CityName.Aevum:
          case CityName.Chongqing:
          case CityName.Sector12:
          case CityName.NewTokyo:
          case CityName.Ishima:
          case CityName.Volhaven:
            if (Player.money < CONSTANTS.TravelCost) {
              helpers.log(ctx, () => "Not enough money to travel.");
              return false;
            }
            Player.loseMoney(CONSTANTS.TravelCost, "other");
            Player.city = cityName;
            helpers.log(ctx, () => `Traveled to ${cityName}`);
            Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain / 50000);
            return true;
          default:
            throw helpers.makeRuntimeErrorMsg(ctx, `Invalid city name: '${cityName}'.`);
        }
      },

    purchaseTor: (ctx: NetscriptContext) =>
      function (): boolean {
        helpers.checkSingularityAccess(ctx);

        if (Player.hasTorRouter()) {
          helpers.log(ctx, () => "You already have a TOR router!");
          return true;
        }

        if (Player.money < CONSTANTS.TorRouterCost) {
          helpers.log(ctx, () => "You cannot afford to purchase a Tor router.");
          return false;
        }
        Player.loseMoney(CONSTANTS.TorRouterCost, "other");

        const darkweb = GetServer(SpecialServers.DarkWeb);
        if (!darkweb) throw helpers.makeRuntimeErrorMsg(ctx, "DarkWeb was not a server but should have been");

        Player.getHomeComputer().serversOnNetwork.push(darkweb.hostname);
        darkweb.serversOnNetwork.push(Player.getHomeComputer().hostname);
        Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain / 500);
        helpers.log(ctx, () => "You have purchased a Tor router!");
        return true;
      },
    purchaseProgram: (ctx: NetscriptContext) =>
      function (_programName: unknown): boolean {
        helpers.checkSingularityAccess(ctx);
        const programName = helpers.string(ctx, "programName", _programName).toLowerCase();

        if (!Player.hasTorRouter()) {
          helpers.log(ctx, () => "You do not have the TOR router.");
          return false;
        }

        const item = Object.values(DarkWebItems).find((i) => i.program.toLowerCase() === programName);
        if (item == null) {
          helpers.log(ctx, () => `Invalid program name: '${programName}.`);
          return false;
        }

        if (Player.money < item.price) {
          helpers.log(
            ctx,
            () => `Not enough money to purchase '${item.program}'. Need ${numeralWrapper.formatMoney(item.price)}`,
          );
          return false;
        }

        if (Player.hasProgram(item.program)) {
          helpers.log(ctx, () => `You already have the '${item.program}' program`);
          return true;
        }

        Player.getHomeComputer().pushProgram(item.program);
        // Cancel if the program is in progress of writing
        if (isCreateProgramWork(Player.currentWork) && Player.currentWork.programName === item.program) {
          Player.finishWork(true);
        }

        Player.loseMoney(item.price, "other");
        helpers.log(
          ctx,
          () => `You have purchased the '${item.program}' program. The new program can be found on your home computer.`,
        );
        Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain / 5000);
        return true;
      },
    getCurrentServer: (ctx: NetscriptContext) =>
      function (): string {
        helpers.checkSingularityAccess(ctx);
        return Player.getCurrentServer().hostname;
      },
    connect: (ctx: NetscriptContext) =>
      function (_hostname: unknown): boolean {
        helpers.checkSingularityAccess(ctx);
        const hostname = helpers.string(ctx, "hostname", _hostname);
        if (!hostname) {
          throw helpers.makeRuntimeErrorMsg(ctx, `Invalid hostname: '${hostname}'`);
        }

        const target = GetServer(hostname);
        if (target == null) {
          throw helpers.makeRuntimeErrorMsg(ctx, `Invalid hostname: '${hostname}'`);
        }

        //Home case
        if (hostname === "home") {
          Player.getCurrentServer().isConnectedTo = false;
          Player.currentServer = Player.getHomeComputer().hostname;
          Player.getCurrentServer().isConnectedTo = true;
          Terminal.setcwd("/");
          return true;
        }

        //Adjacent server case
        const server = Player.getCurrentServer();
        for (let i = 0; i < server.serversOnNetwork.length; i++) {
          const other = getServerOnNetwork(server, i);
          if (other === null) continue;
          if (other.hostname == hostname) {
            Player.getCurrentServer().isConnectedTo = false;
            Player.currentServer = target.hostname;
            Player.getCurrentServer().isConnectedTo = true;
            Terminal.setcwd("/");
            return true;
          }
        }

        //Backdoor case
        const other = GetServer(hostname);
        if (other !== null && other instanceof Server && other.backdoorInstalled) {
          Player.getCurrentServer().isConnectedTo = false;
          Player.currentServer = target.hostname;
          Player.getCurrentServer().isConnectedTo = true;
          Terminal.setcwd("/");
          return true;
        }

        //Failure case
        return false;
      },
    manualHack: (ctx: NetscriptContext) =>
      function (): Promise<number> {
        helpers.checkSingularityAccess(ctx);
        const server = Player.getCurrentServer();
        return helpers.hack(ctx, server.hostname, true);
      },
    installBackdoor: (ctx: NetscriptContext) => async (): Promise<void> => {
      helpers.checkSingularityAccess(ctx);
      const baseserver = Player.getCurrentServer();
      if (!(baseserver instanceof Server)) {
        helpers.log(ctx, () => "cannot backdoor this kind of server");
        return Promise.resolve();
      }
      const server = baseserver;
      const installTime = (calculateHackingTime(server, Player) / 4) * 1000;

      // No root access or skill level too low
      const canHack = netscriptCanHack(server);
      if (!canHack.res) {
        throw helpers.makeRuntimeErrorMsg(ctx, canHack.msg || "");
      }

      helpers.log(
        ctx,
        () => `Installing backdoor on '${server.hostname}' in ${convertTimeMsToTimeElapsedString(installTime, true)}`,
      );

      return helpers.netscriptDelay(ctx, installTime).then(function () {
        helpers.log(ctx, () => `Successfully installed backdoor on '${server.hostname}'`);

        server.backdoorInstalled = true;

        if (SpecialServers.WorldDaemon === server.hostname) {
          Router.toBitVerse(false, false);
        }
        return Promise.resolve();
      });
    },
    isFocused: (ctx: NetscriptContext) =>
      function (): boolean {
        helpers.checkSingularityAccess(ctx);
        return Player.focus;
      },
    setFocus: (ctx: NetscriptContext) =>
      function (_focus: unknown): boolean {
        helpers.checkSingularityAccess(ctx);
        const focus = !!_focus;
        if (Player.currentWork === null) {
          throw helpers.makeRuntimeErrorMsg(ctx, "Not currently working");
        }

        if (!Player.focus && focus) {
          Player.startFocusing();
          Router.toWork();
          return true;
        } else if (Player.focus && !focus) {
          Player.stopFocusing();
          Router.toTerminal();
          return true;
        }
        return false;
      },
    hospitalize: (ctx: NetscriptContext) =>
      function (): void {
        helpers.checkSingularityAccess(ctx);
        if (Player.currentWork || Router.page() === Page.Infiltration || Router.page() === Page.BitVerse) {
          helpers.log(ctx, () => "Cannot go to the hospital because the player is busy.");
          return;
        }
        Player.hospitalize();
      },
    isBusy: (ctx: NetscriptContext) =>
      function (): boolean {
        helpers.checkSingularityAccess(ctx);
        return Player.currentWork !== null || Router.page() === Page.Infiltration || Router.page() === Page.BitVerse;
      },
    stopAction: (ctx: NetscriptContext) =>
      function (): boolean {
        helpers.checkSingularityAccess(ctx);
        const wasWorking = Player.currentWork !== null;
        Player.finishWork(true);
        return wasWorking;
      },
    upgradeHomeCores: (ctx: NetscriptContext) =>
      function (): boolean {
        helpers.checkSingularityAccess(ctx);

        // Check if we're at max cores
        const homeComputer = Player.getHomeComputer();
        if (homeComputer.cpuCores >= 8) {
          helpers.log(ctx, () => `Your home computer is at max cores.`);
          return false;
        }

        const cost = Player.getUpgradeHomeCoresCost();
        if (Player.money < cost) {
          helpers.log(ctx, () => `You don't have enough money. Need ${numeralWrapper.formatMoney(cost)}`);
          return false;
        }

        homeComputer.cpuCores += 1;
        Player.loseMoney(cost, "servers");

        Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain * 2);
        helpers.log(
          ctx,
          () => `Purchased an additional core for home computer! It now has ${homeComputer.cpuCores} cores.`,
        );
        return true;
      },
    getUpgradeHomeCoresCost: (ctx: NetscriptContext) =>
      function (): number {
        helpers.checkSingularityAccess(ctx);

        return Player.getUpgradeHomeCoresCost();
      },
    upgradeHomeRam: (ctx: NetscriptContext) =>
      function (): boolean {
        helpers.checkSingularityAccess(ctx);

        // Check if we're at max RAM
        const homeComputer = Player.getHomeComputer();
        if (homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
          helpers.log(ctx, () => `Your home computer is at max RAM.`);
          return false;
        }

        const cost = Player.getUpgradeHomeRamCost();
        if (Player.money < cost) {
          helpers.log(ctx, () => `You don't have enough money. Need ${numeralWrapper.formatMoney(cost)}`);
          return false;
        }

        homeComputer.maxRam *= 2;
        Player.loseMoney(cost, "servers");

        Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain * 2);
        helpers.log(
          ctx,
          () =>
            `Purchased additional RAM for home computer! It now has ${numeralWrapper.formatRAM(
              homeComputer.maxRam,
            )} of RAM.`,
        );
        return true;
      },
    getUpgradeHomeRamCost: (ctx: NetscriptContext) =>
      function (): number {
        helpers.checkSingularityAccess(ctx);

        return Player.getUpgradeHomeRamCost();
      },
    workForCompany: (ctx: NetscriptContext) =>
      function (_companyName: unknown, _focus: unknown = true): boolean {
        helpers.checkSingularityAccess(ctx);
        const companyName = helpers.string(ctx, "companyName", _companyName);
        const focus = !!_focus;

        // Make sure its a valid company
        if (companyName == null || companyName === "" || !Companies[companyName]) {
          helpers.log(ctx, () => `Invalid company: '${companyName}'`);
          return false;
        }

        // Make sure player is actually employed at the company
        if (!Object.keys(Player.jobs).includes(companyName)) {
          helpers.log(ctx, () => `You do not have a job at '${companyName}'`);
          return false;
        }

        // Check to make sure company position data is valid
        const companyPositionName = Player.jobs[companyName];
        const companyPosition = CompanyPositions[companyPositionName];
        if (companyPositionName === "" || !companyPosition) {
          helpers.log(ctx, () => "You do not have a job");
          return false;
        }

        const wasFocused = Player.focus;

        Player.startWork(
          new CompanyWork({
            singularity: true,
            companyName: companyName,
          }),
        );
        if (focus) {
          Player.startFocusing();
          Router.toWork();
        } else if (wasFocused) {
          Player.stopFocusing();
          Router.toTerminal();
        }
        const a = aOrAn(companyPositionName);
        helpers.log(ctx, () => `Began working at '${companyName}' as ${a} '${companyPositionName}'`);
        return true;
      },
    applyToCompany: (ctx: NetscriptContext) =>
      function (_companyName: unknown, _field: unknown): boolean {
        helpers.checkSingularityAccess(ctx);
        const companyName = helpers.string(ctx, "companyName", _companyName);
        const field = helpers.string(ctx, "field", _field);
        getCompany(ctx, companyName);

        Player.location = companyName as LocationName;
        let res;
        switch (field.toLowerCase()) {
          case "software":
            res = Player.applyForSoftwareJob(true);
            break;
          case "software consultant":
            res = Player.applyForSoftwareConsultantJob(true);
            break;
          case "it":
            res = Player.applyForItJob(true);
            break;
          case "security engineer":
            res = Player.applyForSecurityEngineerJob(true);
            break;
          case "network engineer":
            res = Player.applyForNetworkEngineerJob(true);
            break;
          case "business":
            res = Player.applyForBusinessJob(true);
            break;
          case "business consultant":
            res = Player.applyForBusinessConsultantJob(true);
            break;
          case "security":
            res = Player.applyForSecurityJob(true);
            break;
          case "agent":
            res = Player.applyForAgentJob(true);
            break;
          case "employee":
            res = Player.applyForEmployeeJob(true);
            break;
          case "part-time employee":
            res = Player.applyForPartTimeEmployeeJob(true);
            break;
          case "waiter":
            res = Player.applyForWaiterJob(true);
            break;
          case "part-time waiter":
            res = Player.applyForPartTimeWaiterJob(true);
            break;
          default:
            helpers.log(ctx, () => `Invalid job: '${field}'.`);
            return false;
        }
        // TODO https://github.com/danielyxie/bitburner/issues/1378
        // The player object's applyForJob function can return string with special error messages
        // if (isString(res)) {
        //   helpers.log(ctx,"applyToCompany",()=> res);
        //   return false;
        // }
        if (res) {
          const a = aOrAn(Player.jobs[companyName]);
          helpers.log(
            ctx,
            () => `You were offered a new job at '${companyName}' as ${a} '${Player.jobs[companyName]}'`,
          );
        } else {
          helpers.log(ctx, () => `You failed to get a new job/promotion at '${companyName}' in the '${field}' field.`);
        }
        return res;
      },
    quitJob: (ctx: NetscriptContext) =>
      function (_companyName: unknown): void {
        helpers.checkSingularityAccess(ctx);
        const companyName = helpers.string(ctx, "companyName", _companyName);
        Player.quitJob(companyName);
      },
    getCompanyRep: (ctx: NetscriptContext) =>
      function (_companyName: unknown): number {
        helpers.checkSingularityAccess(ctx);
        const companyName = helpers.string(ctx, "companyName", _companyName);
        const company = getCompany(ctx, companyName);
        return company.playerReputation;
      },
    getCompanyFavor: (ctx: NetscriptContext) =>
      function (_companyName: unknown): number {
        helpers.checkSingularityAccess(ctx);
        const companyName = helpers.string(ctx, "companyName", _companyName);
        const company = getCompany(ctx, companyName);
        return company.favor;
      },
    getCompanyFavorGain: (ctx: NetscriptContext) =>
      function (_companyName: unknown): number {
        helpers.checkSingularityAccess(ctx);
        const companyName = helpers.string(ctx, "companyName", _companyName);
        const company = getCompany(ctx, companyName);
        return company.getFavorGain();
      },
    checkFactionInvitations: (ctx: NetscriptContext) =>
      function (): string[] {
        helpers.checkSingularityAccess(ctx);
        // Make a copy of player.factionInvitations
        return Player.factionInvitations.slice();
      },
    joinFaction: (ctx: NetscriptContext) =>
      function (_facName: unknown): boolean {
        helpers.checkSingularityAccess(ctx);
        const facName = helpers.string(ctx, "facName", _facName);
        getFaction(ctx, facName);

        if (!Player.factionInvitations.includes(facName)) {
          helpers.log(ctx, () => `You have not been invited by faction '${facName}'`);
          return false;
        }
        const fac = Factions[facName];
        joinFaction(fac);

        // Update Faction Invitation list to account for joined + banned factions
        for (let i = 0; i < Player.factionInvitations.length; ++i) {
          if (Player.factionInvitations[i] == facName || Factions[Player.factionInvitations[i]].isBanned) {
            Player.factionInvitations.splice(i, 1);
            i--;
          }
        }
        Player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain * 5);
        helpers.log(ctx, () => `Joined the '${facName}' faction.`);
        return true;
      },
    workForFaction: (ctx: NetscriptContext) =>
      function (_facName: unknown, _type: unknown, _focus: unknown = true): boolean {
        helpers.checkSingularityAccess(ctx);
        const facName = helpers.string(ctx, "facName", _facName);
        const type = helpers.string(ctx, "type", _type);
        const focus = !!_focus;
        const faction = getFaction(ctx, facName);

        // if the player is in a gang and the target faction is any of the gang faction, fail
        if (Player.gang && faction.name === Player.getGangFaction().name) {
          helpers.log(ctx, () => `You can't work for '${facName}' because youre managing a gang for it`);
          return false;
        }

        if (!Player.factions.includes(facName)) {
          helpers.log(ctx, () => `You are not a member of '${facName}'`);
          return false;
        }

        const wasFocusing = Player.focus;

        switch (type.toLowerCase()) {
          case "hacking":
          case "hacking contracts":
          case "hackingcontracts":
            if (!FactionInfos[faction.name].offerHackingWork) {
              helpers.log(ctx, () => `Faction '${faction.name}' do not need help with hacking contracts.`);
              return false;
            }
            Player.startWork(
              new FactionWork({
                singularity: true,
                factionWorkType: FactionWorkType.HACKING,
                faction: faction.name,
              }),
            );
            if (focus) {
              Player.startFocusing();
              Router.toWork();
            } else if (wasFocusing) {
              Player.stopFocusing();
              Router.toTerminal();
            }
            helpers.log(ctx, () => `Started carrying out hacking contracts for '${faction.name}'`);
            return true;
          case "field":
          case "fieldwork":
          case "field work":
            if (!FactionInfos[faction.name].offerFieldWork) {
              helpers.log(ctx, () => `Faction '${faction.name}' do not need help with field missions.`);
              return false;
            }
            Player.startWork(
              new FactionWork({
                singularity: true,
                factionWorkType: FactionWorkType.FIELD,
                faction: faction.name,
              }),
            );
            if (focus) {
              Player.startFocusing();
              Router.toWork();
            } else if (wasFocusing) {
              Player.stopFocusing();
              Router.toTerminal();
            }
            helpers.log(ctx, () => `Started carrying out field missions for '${faction.name}'`);
            return true;
          case "security":
          case "securitywork":
          case "security work":
            if (!FactionInfos[faction.name].offerSecurityWork) {
              helpers.log(ctx, () => `Faction '${faction.name}' do not need help with security work.`);
              return false;
            }
            Player.startWork(
              new FactionWork({
                singularity: true,
                factionWorkType: FactionWorkType.SECURITY,
                faction: faction.name,
              }),
            );
            if (focus) {
              Player.startFocusing();
              Router.toWork();
            } else if (wasFocusing) {
              Player.stopFocusing();
              Router.toTerminal();
            }
            helpers.log(ctx, () => `Started carrying out security work for '${faction.name}'`);
            return true;
          default:
            helpers.log(ctx, () => `Invalid work type: '${type}`);
            return false;
        }
      },
    getFactionRep: (ctx: NetscriptContext) =>
      function (_facName: unknown): number {
        helpers.checkSingularityAccess(ctx);
        const facName = helpers.string(ctx, "facName", _facName);
        const faction = getFaction(ctx, facName);
        return faction.playerReputation;
      },
    getFactionFavor: (ctx: NetscriptContext) =>
      function (_facName: unknown): number {
        helpers.checkSingularityAccess(ctx);
        const facName = helpers.string(ctx, "facName", _facName);
        const faction = getFaction(ctx, facName);
        return faction.favor;
      },
    getFactionFavorGain: (ctx: NetscriptContext) =>
      function (_facName: unknown): number {
        helpers.checkSingularityAccess(ctx);
        const facName = helpers.string(ctx, "facName", _facName);
        const faction = getFaction(ctx, facName);
        return faction.getFavorGain();
      },
    donateToFaction: (ctx: NetscriptContext) =>
      function (_facName: unknown, _amt: unknown): boolean {
        helpers.checkSingularityAccess(ctx);
        const facName = helpers.string(ctx, "facName", _facName);
        const amt = helpers.number(ctx, "amt", _amt);
        const faction = getFaction(ctx, facName);
        if (!Player.factions.includes(faction.name)) {
          helpers.log(ctx, () => `You can't donate to '${facName}' because you aren't a member`);
          return false;
        }
        if (Player.gang && faction.name === Player.getGangFaction().name) {
          helpers.log(ctx, () => `You can't donate to '${facName}' because youre managing a gang for it`);
          return false;
        }
        if (faction.name === FactionNames.ChurchOfTheMachineGod || faction.name === FactionNames.Bladeburners) {
          helpers.log(ctx, () => `You can't donate to '${facName}' because they do not accept donations`);
          return false;
        }
        if (typeof amt !== "number" || amt <= 0 || isNaN(amt)) {
          helpers.log(ctx, () => `Invalid donation amount: '${amt}'.`);
          return false;
        }
        if (Player.money < amt) {
          helpers.log(
            ctx,
            () => `You do not have enough money to donate ${numeralWrapper.formatMoney(amt)} to '${facName}'`,
          );
          return false;
        }
        const repNeededToDonate = Math.floor(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
        if (faction.favor < repNeededToDonate) {
          helpers.log(
            ctx,
            () =>
              `You do not have enough favor to donate to this faction. Have ${faction.favor}, need ${repNeededToDonate}`,
          );
          return false;
        }
        const repGain = (amt / CONSTANTS.DonateMoneyToRepDivisor) * Player.mults.faction_rep;
        faction.playerReputation += repGain;
        Player.loseMoney(amt, "other");
        helpers.log(
          ctx,
          () =>
            `${numeralWrapper.formatMoney(amt)} donated to '${facName}' for ${numeralWrapper.formatReputation(
              repGain,
            )} reputation`,
        );
        return true;
      },
    createProgram: (ctx: NetscriptContext) =>
      function (_programName: unknown, _focus: unknown = true): boolean {
        helpers.checkSingularityAccess(ctx);
        const programName = helpers.string(ctx, "programName", _programName).toLowerCase();
        const focus = !!_focus;

        const wasFocusing = Player.focus;

        const p = Object.values(Programs).find((p) => p.name.toLowerCase() === programName);

        if (p == null) {
          helpers.log(ctx, () => `The specified program does not exist: '${programName}`);
          return false;
        }

        if (Player.hasProgram(p.name)) {
          helpers.log(ctx, () => `You already have the '${p.name}' program`);
          return false;
        }

        const create = p.create;
        if (create === null) {
          helpers.log(ctx, () => `You cannot create the '${p.name}' program`);
          return false;
        }

        if (!create.req()) {
          helpers.log(ctx, () => `Hacking level is too low to create '${p.name}' (level ${create.level} req)`);
          return false;
        }

        Player.startWork(
          new CreateProgramWork({
            programName: p.name,
            singularity: true,
          }),
        );
        if (focus) {
          Player.startFocusing();
          Router.toWork();
        } else if (wasFocusing) {
          Player.stopFocusing();
          Router.toTerminal();
        }
        helpers.log(ctx, () => `Began creating program: '${programName}'`);
        return true;
      },
    commitCrime: (ctx: NetscriptContext) =>
      function (_crimeRoughName: unknown, _focus: unknown = true): number {
        helpers.checkSingularityAccess(ctx);
        const crimeRoughName = helpers.string(ctx, "crimeRoughName", _crimeRoughName);
        const focus = !!_focus;
        const wasFocusing = Player.focus;

        if (Player.currentWork !== null) {
          Player.finishWork(true);
        }

        // Set Location to slums
        Player.gotoLocation(LocationName.Slums);

        const crime = findCrime(crimeRoughName.toLowerCase());
        if (crime == null) {
          // couldn't find crime
          throw helpers.makeRuntimeErrorMsg(ctx, `Invalid crime: '${crimeRoughName}'`);
        }
        helpers.log(ctx, () => `Attempting to commit ${crime.name}...`);
        const crimeTime = crime.commit(1, ctx.workerScript);
        if (focus) {
          Player.startFocusing();
          Router.toWork();
        } else if (wasFocusing) {
          Player.stopFocusing();
          Router.toTerminal();
        }
        return crimeTime;
      },
    getCrimeChance: (ctx: NetscriptContext) =>
      function (_crimeRoughName: unknown): number {
        helpers.checkSingularityAccess(ctx);
        const crimeRoughName = helpers.string(ctx, "crimeRoughName", _crimeRoughName);

        const crime = findCrime(crimeRoughName.toLowerCase());
        if (crime == null) {
          throw helpers.makeRuntimeErrorMsg(ctx, `Invalid crime: ${crimeRoughName}`);
        }

        return crime.successRate(Player);
      },
    getCrimeStats: (ctx: NetscriptContext) =>
      function (_crimeRoughName: unknown): CrimeStats {
        helpers.checkSingularityAccess(ctx);
        const crimeRoughName = helpers.string(ctx, "crimeRoughName", _crimeRoughName);

        const crime = findCrime(crimeRoughName.toLowerCase());
        if (crime == null) {
          throw helpers.makeRuntimeErrorMsg(ctx, `Invalid crime: ${crimeRoughName}`);
        }

        const crimeStatsWithMultipliers = calculateCrimeWorkStats(crime);

        return Object.assign({}, crime, {
          money: crimeStatsWithMultipliers.money,
          reputation: crimeStatsWithMultipliers.reputation,
          hacking_exp: crimeStatsWithMultipliers.hackExp,
          strength_exp: crimeStatsWithMultipliers.strExp,
          defense_exp: crimeStatsWithMultipliers.defExp,
          dexterity_exp: crimeStatsWithMultipliers.dexExp,
          agility_exp: crimeStatsWithMultipliers.agiExp,
          charisma_exp: crimeStatsWithMultipliers.chaExp,
          intelligence_exp: crimeStatsWithMultipliers.intExp,
        });
      },
    getDarkwebPrograms: (ctx: NetscriptContext) =>
      function (): string[] {
        helpers.checkSingularityAccess(ctx);

        // If we don't have Tor, log it and return [] (empty list)
        if (!Player.hasTorRouter()) {
          helpers.log(ctx, () => "You do not have the TOR router.");
          return [];
        }
        return Object.values(DarkWebItems).map((p) => p.program);
      },
    getDarkwebProgramCost: (ctx: NetscriptContext) =>
      function (_programName: unknown): number {
        helpers.checkSingularityAccess(ctx);
        const programName = helpers.string(ctx, "programName", _programName).toLowerCase();

        // If we don't have Tor, log it and return -1
        if (!Player.hasTorRouter()) {
          helpers.log(ctx, () => "You do not have the TOR router.");
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
          throw helpers.makeRuntimeErrorMsg(
            ctx,
            `No such exploit ('${programName}') found on the darkweb! ` +
              `\nThis function is not case-sensitive. Did you perhaps forget .exe at the end?`,
          );
        }

        if (Player.hasProgram(item.program)) {
          helpers.log(ctx, () => `You already have the '${item.program}' program`);
          return 0;
        }
        return item.price;
      },
    b1tflum3:
      (ctx: NetscriptContext) =>
      (_nextBN: unknown, _callbackScript: unknown = ""): void => {
        helpers.checkSingularityAccess(ctx);
        const nextBN = helpers.number(ctx, "nextBN", _nextBN);
        const callbackScript = helpers.string(ctx, "callbackScript", _callbackScript);
        helpers.checkSingularityAccess(ctx);
        enterBitNode(true, Player.bitNodeN, nextBN);
        if (callbackScript)
          setTimeout(() => {
            runAfterReset(callbackScript);
          }, 0);
      },
    destroyW0r1dD43m0n:
      (ctx: NetscriptContext) =>
      (_nextBN: unknown, _callbackScript: unknown = ""): void => {
        helpers.checkSingularityAccess(ctx);
        const nextBN = helpers.number(ctx, "nextBN", _nextBN);
        const callbackScript = helpers.string(ctx, "callbackScript", _callbackScript);

        const wd = GetServer(SpecialServers.WorldDaemon);
        if (!(wd instanceof Server)) throw new Error("WorldDaemon was not a normal server. This is a bug contact dev.");
        const hackingRequirements = (): boolean => {
          if (Player.skills.hacking < wd.requiredHackingSkill) return false;
          if (!wd.hasAdminRights) return false;
          return true;
        };
        const bladeburnerRequirements = (): boolean => {
          if (!Player.inBladeburner()) return false;
          if (!Player.bladeburner) return false;
          return Player.bladeburner.blackops[BlackOperationNames.OperationDaedalus];
        };

        if (!hackingRequirements() && !bladeburnerRequirements()) {
          helpers.log(ctx, () => "Requirements not met to destroy the world daemon");
          return;
        }

        wd.backdoorInstalled = true;
        calculateAchievements();
        enterBitNode(false, Player.bitNodeN, nextBN);
        if (callbackScript)
          setTimeout(() => {
            runAfterReset(callbackScript);
          }, 0);
      },
    getCurrentWork: () => (): any | null => {
      if (!Player.currentWork) return null;
      return Player.currentWork.APICopy();
    },
    exportGame: (ctx: NetscriptContext) => (): void => {
      helpers.checkSingularityAccess(ctx);
      onExport();
      return saveObject.exportGame();
    },
    exportGameBonus: (ctx: NetscriptContext) => (): boolean => {
      helpers.checkSingularityAccess(ctx);
      return canGetBonus();
    },
  };
}
