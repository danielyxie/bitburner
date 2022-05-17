import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
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
import { InternalAPI, NetscriptContext } from "src/Netscript/APIWrapper";
import { BlackOperationNames } from "../Bladeburner/data/BlackOperationNames";
import { enterBitNode } from "../RedPill";
import { FactionNames } from "../Faction/data/FactionNames";
import { ClassType, PlayerFactionWorkType, WorkType } from "../Work/WorkType";
import {
  StartCompanyWorkParams,
  StartCreateProgramParams,
  StartFactionWorkParams,
  StartStudyClassParams,
} from "../Work/WorkInfo";

export function NetscriptSingularity(player: IPlayer, workerScript: WorkerScript): InternalAPI<ISingularity> {
  const getAugmentation = function (_ctx: NetscriptContext, name: string): Augmentation {
    if (!augmentationExists(name)) {
      throw _ctx.helper.makeRuntimeErrorMsg(`Invalid augmentation: '${name}'`);
    }

    return StaticAugmentations[name];
  };

  const getFaction = function (_ctx: NetscriptContext, name: string): Faction {
    if (!factionExists(name)) {
      throw _ctx.helper.makeRuntimeErrorMsg(`Invalid faction name: '${name}`);
    }

    return Factions[name];
  };

  const getCompany = function (_ctx: NetscriptContext, name: string): Company {
    const company = Companies[name];
    if (company == null || !(company instanceof Company)) {
      throw _ctx.helper.makeRuntimeErrorMsg(`Invalid company name: '${name}'`);
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
        if (ramUsage > ramAvailable + 0.001) {
          return; // Not enough RAM
        }
        const runningScriptObj = new RunningScript(script, []); // No args
        runningScriptObj.threads = 1; // Only 1 thread
        startWorkerScript(player, runningScriptObj, home);
      }
    }
  };

  return {
    getOwnedAugmentations: (_ctx: NetscriptContext) =>
      function (_purchased: unknown = false): string[] {
        _ctx.helper.checkSingularityAccess();
        const purchased = _ctx.helper.boolean(_purchased);
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
    getAugmentationsFromFaction: (_ctx: NetscriptContext) =>
      function (_facName: unknown): string[] {
        _ctx.helper.checkSingularityAccess();
        const facName = _ctx.helper.string("facName", _facName);
        const faction = getFaction(_ctx, facName);

        return getFactionAugmentationsFiltered(player, faction);
      },
    getAugmentationCost: (_ctx: NetscriptContext) =>
      function (_augName: unknown): [number, number] {
        _ctx.helper.checkSingularityAccess();
        const augName = _ctx.helper.string("augName", _augName);
        const aug = getAugmentation(_ctx, augName);
        const costs = aug.getCost(player);
        return [costs.repCost, costs.moneyCost];
      },
    getAugmentationPrereq: (_ctx: NetscriptContext) =>
      function (_augName: unknown): string[] {
        _ctx.helper.checkSingularityAccess();
        const augName = _ctx.helper.string("augName", _augName);
        const aug = getAugmentation(_ctx, augName);
        return aug.prereqs.slice();
      },
    getAugmentationPrice: (_ctx: NetscriptContext) =>
      function (_augName: unknown): number {
        _ctx.helper.checkSingularityAccess();
        const augName = _ctx.helper.string("augName", _augName);
        const aug = getAugmentation(_ctx, augName);
        return aug.getCost(player).moneyCost;
      },
    getAugmentationRepReq: (_ctx: NetscriptContext) =>
      function (_augName: unknown): number {
        _ctx.helper.checkSingularityAccess();
        const augName = _ctx.helper.string("augName", _augName);
        const aug = getAugmentation(_ctx, augName);
        return aug.getCost(player).repCost;
      },
    getAugmentationStats: (_ctx: NetscriptContext) =>
      function (_augName: unknown): AugmentationStats {
        _ctx.helper.checkSingularityAccess();
        const augName = _ctx.helper.string("augName", _augName);
        const aug = getAugmentation(_ctx, augName);
        return Object.assign({}, aug.mults);
      },
    purchaseAugmentation: (_ctx: NetscriptContext) =>
      function (_facName: unknown, _augName: unknown): boolean {
        _ctx.helper.checkSingularityAccess();
        const facName = _ctx.helper.string("facName", _facName);
        const augName = _ctx.helper.string("augName", _augName);
        const fac = getFaction(_ctx, facName);
        const aug = getAugmentation(_ctx, augName);

        const augs = getFactionAugmentationsFiltered(player, fac);

        if (!augs.includes(augName)) {
          _ctx.log(() => `Faction '${facName}' does not have the '${augName}' augmentation.`);
          return false;
        }

        const isNeuroflux = aug.name === AugmentationNames.NeuroFluxGovernor;
        if (!isNeuroflux) {
          for (let j = 0; j < player.queuedAugmentations.length; ++j) {
            if (player.queuedAugmentations[j].name === aug.name) {
              _ctx.log(() => `You already have the '${augName}' augmentation.`);
              return false;
            }
          }
          for (let j = 0; j < player.augmentations.length; ++j) {
            if (player.augmentations[j].name === aug.name) {
              _ctx.log(() => `You already have the '${augName}' augmentation.`);
              return false;
            }
          }
        }

        if (fac.playerReputation < aug.getCost(player).repCost) {
          _ctx.log(() => `You do not have enough reputation with '${fac.name}'.`);
          return false;
        }

        const res = purchaseAugmentation(aug, fac, true);
        _ctx.log(() => res);
        if (isString(res) && res.startsWith("You purchased")) {
          player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain * 10);
          return true;
        } else {
          return false;
        }
      },
    softReset: (_ctx: NetscriptContext) =>
      function (_cbScript: unknown = ""): void {
        _ctx.helper.checkSingularityAccess();
        const cbScript = _ctx.helper.string("cbScript", _cbScript);

        _ctx.log(() => "Soft resetting. This will cause this script to be killed");
        setTimeout(() => {
          installAugmentations(true);
          runAfterReset(cbScript);
        }, 0);

        // Prevent workerScript from "finishing execution naturally"
        workerScript.running = false;
        killWorkerScript(workerScript);
      },
    installAugmentations: (_ctx: NetscriptContext) =>
      function (_cbScript: unknown = ""): boolean {
        _ctx.helper.checkSingularityAccess();
        const cbScript = _ctx.helper.string("cbScript", _cbScript);

        if (player.queuedAugmentations.length === 0) {
          _ctx.log(() => "You do not have any Augmentations to be installed.");
          return false;
        }
        player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain * 10);
        _ctx.log(() => "Installing Augmentations. This will cause this script to be killed");
        setTimeout(() => {
          installAugmentations();
          runAfterReset(cbScript);
        }, 0);

        workerScript.running = false; // Prevent workerScript from "finishing execution naturally"
        killWorkerScript(workerScript);
        return true;
      },

    goToLocation: (_ctx: NetscriptContext) =>
      function (_locationName: unknown): boolean {
        _ctx.helper.checkSingularityAccess();
        const locationName = _ctx.helper.string("locationName", _locationName);
        const location = Object.values(Locations).find((l) => l.name === locationName);
        if (!location) {
          _ctx.log(() => `No location named ${locationName}`);
          return false;
        }
        if (player.city !== location.city) {
          _ctx.log(() => `No location named ${locationName} in ${player.city}`);
          return false;
        }
        Router.toLocation(location);
        player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain / 50000);
        return true;
      },
    universityCourse: (_ctx: NetscriptContext) =>
      function (_universityName: unknown, _className: unknown, _focus: unknown = true): boolean {
        _ctx.helper.checkSingularityAccess();
        const universityName = _ctx.helper.string("universityName", _universityName);
        const className = _ctx.helper.string("className", _className);
        const focus = _ctx.helper.boolean(_focus);
        const wasFocusing = player.focus;
        if (player.isWorking) {
          const txt = player.singularityStopWork();
          _ctx.log(() => txt);
        }

        let costMult, expMult;
        switch (universityName.toLowerCase()) {
          case LocationName.AevumSummitUniversity.toLowerCase():
            if (player.city != CityName.Aevum) {
              _ctx.log(() => `You cannot study at 'Summit University' because you are not in '${CityName.Aevum}'.`);
              return false;
            }
            player.gotoLocation(LocationName.AevumSummitUniversity);
            costMult = 4;
            expMult = 3;
            break;
          case LocationName.Sector12RothmanUniversity.toLowerCase():
            if (player.city != CityName.Sector12) {
              _ctx.log(() => `You cannot study at 'Rothman University' because you are not in '${CityName.Sector12}'.`);
              return false;
            }
            player.location = LocationName.Sector12RothmanUniversity;
            costMult = 3;
            expMult = 2;
            break;
          case LocationName.VolhavenZBInstituteOfTechnology.toLowerCase():
            if (player.city != CityName.Volhaven) {
              _ctx.log(
                () => `You cannot study at 'ZB Institute of Technology' because you are not in '${CityName.Volhaven}'.`,
              );
              return false;
            }
            player.location = LocationName.VolhavenZBInstituteOfTechnology;
            costMult = 5;
            expMult = 4;
            break;
          default:
            _ctx.log(() => `Invalid university name: '${universityName}'.`);
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
            _ctx.log(() => `Invalid class name: ${className}.`);
            return false;
        }
        player.workManager.start(WorkType.StudyClass, { className: task, costMult, expMult });
        if (focus) {
          player.startFocusing();
          Router.toWork();
        } else if (wasFocusing) {
          player.stopFocusing();
          Router.toTerminal();
        }
        _ctx.log(() => `Started ${task} at ${universityName}`);
        return true;
      },

    gymWorkout: (_ctx: NetscriptContext) =>
      function (_gymName: unknown, _stat: unknown, _focus: unknown = true): boolean {
        _ctx.helper.checkSingularityAccess();
        const gymName = _ctx.helper.string("gymName", _gymName);
        const stat = _ctx.helper.string("stat", _stat);
        const focus = _ctx.helper.boolean(_focus);
        const wasFocusing = player.focus;
        if (player.isWorking) {
          const txt = player.singularityStopWork();
          _ctx.log(() => txt);
        }
        let costMult, expMult;
        switch (gymName.toLowerCase()) {
          case LocationName.AevumCrushFitnessGym.toLowerCase():
            if (player.city != CityName.Aevum) {
              _ctx.log(
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
              _ctx.log(
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
              _ctx.log(
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
              _ctx.log(
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
              _ctx.log(
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
            _ctx.log(() => `Invalid gym name: ${gymName}. gymWorkout() failed`);
            return false;
        }

        let className: ClassType;
        switch (stat.toLowerCase()) {
          case "strength".toLowerCase():
          case "str".toLowerCase():
            className = ClassType.GymStrength;
            break;
          case "defense".toLowerCase():
          case "def".toLowerCase():
            className = ClassType.GymDefense;
            break;
          case "dexterity".toLowerCase():
          case "dex".toLowerCase():
            className = ClassType.GymDexterity;
            break;
          case "agility".toLowerCase():
          case "agi".toLowerCase():
            className = ClassType.GymAgility;
            break;
          default:
            _ctx.log(() => `Invalid stat: ${stat}.`);
            return false;
        }

        player.workManager.start(WorkType.StudyClass, <StartStudyClassParams>{
          className,
          costMult,
          expMult,
        });
        if (focus) {
          player.startFocusing();
          Router.toWork();
        } else if (wasFocusing) {
          player.stopFocusing();
          Router.toTerminal();
        }
        _ctx.log(() => `Started training ${stat} at ${gymName}`);
        return true;
      },

    travelToCity: (_ctx: NetscriptContext) =>
      function (_cityName: unknown): boolean {
        _ctx.helper.checkSingularityAccess();
        const cityName = _ctx.helper.city("cityName", _cityName);

        switch (cityName) {
          case CityName.Aevum:
          case CityName.Chongqing:
          case CityName.Sector12:
          case CityName.NewTokyo:
          case CityName.Ishima:
          case CityName.Volhaven:
            if (player.money < CONSTANTS.TravelCost) {
              _ctx.log(() => "Not enough money to travel.");
              return false;
            }
            player.loseMoney(CONSTANTS.TravelCost, "other");
            player.city = cityName;
            _ctx.log(() => `Traveled to ${cityName}`);
            player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain / 50000);
            return true;
          default:
            throw _ctx.helper.makeRuntimeErrorMsg(`Invalid city name: '${cityName}'.`);
        }
      },

    purchaseTor: (_ctx: NetscriptContext) =>
      function (): boolean {
        _ctx.helper.checkSingularityAccess();

        if (player.hasTorRouter()) {
          _ctx.log(() => "You already have a TOR router!");
          return true;
        }

        if (player.money < CONSTANTS.TorRouterCost) {
          _ctx.log(() => "You cannot afford to purchase a Tor router.");
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
        _ctx.log(() => "You have purchased a Tor router!");
        return true;
      },
    purchaseProgram: (_ctx: NetscriptContext) =>
      function (_programName: unknown): boolean {
        _ctx.helper.checkSingularityAccess();
        const programName = _ctx.helper.string("programName", _programName).toLowerCase();

        if (!player.hasTorRouter()) {
          _ctx.log(() => "You do not have the TOR router.");
          return false;
        }

        const item = Object.values(DarkWebItems).find((i) => i.program.toLowerCase() === programName);
        if (item == null) {
          _ctx.log(() => `Invalid program name: '${programName}.`);
          return false;
        }

        if (player.money < item.price) {
          _ctx.log(
            () => `Not enough money to purchase '${item.program}'. Need ${numeralWrapper.formatMoney(item.price)}`,
          );
          return false;
        }

        if (player.hasProgram(item.program)) {
          _ctx.log(() => `You already have the '${item.program}' program`);
          return true;
        }

        player.getHomeComputer().pushProgram(item.program);
        // Cancel if the program is in progress of writing
        if (player.createProgramName === item.program) {
          player.workManager.reset();
        }

        player.loseMoney(item.price, "other");
        _ctx.log(
          () => `You have purchased the '${item.program}' program. The new program can be found on your home computer.`,
        );
        player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain / 5000);
        return true;
      },
    getCurrentServer: (_ctx: NetscriptContext) =>
      function (): string {
        _ctx.helper.checkSingularityAccess();
        return player.getCurrentServer().hostname;
      },
    connect: (_ctx: NetscriptContext) =>
      function (_hostname: unknown): boolean {
        _ctx.helper.checkSingularityAccess();
        const hostname = _ctx.helper.string("hostname", _hostname);
        if (!hostname) {
          throw _ctx.helper.makeRuntimeErrorMsg(`Invalid hostname: '${hostname}'`);
        }

        const target = GetServer(hostname);
        if (target == null) {
          throw _ctx.helper.makeRuntimeErrorMsg(`Invalid hostname: '${hostname}'`);
        }

        //Home case
        if (hostname === "home") {
          player.getCurrentServer().isConnectedTo = false;
          player.currentServer = player.getHomeComputer().hostname;
          player.getCurrentServer().isConnectedTo = true;
          Terminal.setcwd("/");
          return true;
        }

        //Adjacent server case
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

        //Backdoor case
        const other = GetServer(hostname);
        if (other !== null && other instanceof Server && other.backdoorInstalled) {
          player.getCurrentServer().isConnectedTo = false;
          player.currentServer = target.hostname;
          player.getCurrentServer().isConnectedTo = true;
          Terminal.setcwd("/");
          return true;
        }

        //Failure case
        return false;
      },
    manualHack: (_ctx: NetscriptContext) =>
      function (): Promise<number> {
        _ctx.helper.checkSingularityAccess();
        const server = player.getCurrentServer();
        return _ctx.helper.hack(server.hostname, true);
      },
    installBackdoor: (_ctx: NetscriptContext) =>
      function (): Promise<void> {
        _ctx.helper.checkSingularityAccess();
        const baseserver = player.getCurrentServer();
        if (!(baseserver instanceof Server)) {
          _ctx.log(() => "cannot backdoor this kind of server");
          return Promise.resolve();
        }
        const server = baseserver as Server;
        const installTime = (calculateHackingTime(server, player) / 4) * 1000;

        // No root access or skill level too low
        const canHack = netscriptCanHack(server, player);
        if (!canHack.res) {
          throw _ctx.helper.makeRuntimeErrorMsg(canHack.msg || "");
        }

        _ctx.log(
          () => `Installing backdoor on '${server.hostname}' in ${convertTimeMsToTimeElapsedString(installTime, true)}`,
        );

        return netscriptDelay(installTime, workerScript).then(function () {
          _ctx.log(() => `Successfully installed backdoor on '${server.hostname}'`);

          server.backdoorInstalled = true;

          if (SpecialServers.WorldDaemon === server.hostname) {
            Router.toBitVerse(false, false);
          }
          return Promise.resolve();
        });
      },
    isFocused: (_ctx: NetscriptContext) =>
      function (): boolean {
        _ctx.helper.checkSingularityAccess();
        return player.focus;
      },
    setFocus: (_ctx: NetscriptContext) =>
      function (_focus: unknown): boolean {
        _ctx.helper.checkSingularityAccess();
        const focus = _ctx.helper.boolean(_focus);
        if (!player.isWorking) {
          throw _ctx.helper.makeRuntimeErrorMsg("Not currently working");
        }
        if (
          !(
            player.workType === WorkType.Faction ||
            player.workType === WorkType.Company ||
            player.workType === WorkType.CompanyPartTime ||
            player.workType === WorkType.CreateProgram ||
            player.workType === WorkType.StudyClass
          )
        ) {
          throw _ctx.helper.makeRuntimeErrorMsg("Cannot change focus for current job");
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
    getStats: (_ctx: NetscriptContext) =>
      function (): PlayerSkills {
        _ctx.helper.checkSingularityAccess();
        _ctx.log(() => `getStats is deprecated, please use getplayer`);

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
    getCharacterInformation: (_ctx: NetscriptContext) =>
      function (): CharacterInfo {
        _ctx.helper.checkSingularityAccess();
        _ctx.log(() => `getCharacterInformation is deprecated, please use getplayer`);

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
            charisma: player.charisma,
            charismaExp: player.charisma_exp,
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
    hospitalize: (_ctx: NetscriptContext) =>
      function (): void {
        _ctx.helper.checkSingularityAccess();
        if (player.isWorking || Router.page() === Page.Infiltration || Router.page() === Page.BitVerse) {
          _ctx.log(() => "Cannot go to the hospital because the player is busy.");
          return;
        }
        player.hospitalize();
      },
    isBusy: (_ctx: NetscriptContext) =>
      function (): boolean {
        _ctx.helper.checkSingularityAccess();
        return player.isWorking || Router.page() === Page.Infiltration || Router.page() === Page.BitVerse;
      },
    stopAction: (_ctx: NetscriptContext) =>
      function (): boolean {
        _ctx.helper.checkSingularityAccess();
        if (player.isWorking) {
          if (player.focus) {
            player.stopFocusing();
            Router.toTerminal();
          }
          const txt = player.singularityStopWork();
          _ctx.log(() => txt);
          return true;
        }
        return false;
      },
    upgradeHomeCores: (_ctx: NetscriptContext) =>
      function (): boolean {
        _ctx.helper.checkSingularityAccess();

        // Check if we're at max cores
        const homeComputer = player.getHomeComputer();
        if (homeComputer.cpuCores >= 8) {
          _ctx.log(() => `Your home computer is at max cores.`);
          return false;
        }

        const cost = player.getUpgradeHomeCoresCost();
        if (player.money < cost) {
          _ctx.log(() => `You don't have enough money. Need ${numeralWrapper.formatMoney(cost)}`);
          return false;
        }

        homeComputer.cpuCores += 1;
        player.loseMoney(cost, "servers");

        player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain * 2);
        _ctx.log(() => `Purchased an additional core for home computer! It now has ${homeComputer.cpuCores} cores.`);
        return true;
      },
    getUpgradeHomeCoresCost: (_ctx: NetscriptContext) =>
      function (): number {
        _ctx.helper.checkSingularityAccess();

        return player.getUpgradeHomeCoresCost();
      },
    upgradeHomeRam: (_ctx: NetscriptContext) =>
      function (): boolean {
        _ctx.helper.checkSingularityAccess();

        // Check if we're at max RAM
        const homeComputer = player.getHomeComputer();
        if (homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
          _ctx.log(() => `Your home computer is at max RAM.`);
          return false;
        }

        const cost = player.getUpgradeHomeRamCost();
        if (player.money < cost) {
          _ctx.log(() => `You don't have enough money. Need ${numeralWrapper.formatMoney(cost)}`);
          return false;
        }

        homeComputer.maxRam *= 2;
        player.loseMoney(cost, "servers");

        player.gainIntelligenceExp(CONSTANTS.IntelligenceSingFnBaseExpGain * 2);
        _ctx.log(
          () =>
            `Purchased additional RAM for home computer! It now has ${numeralWrapper.formatRAM(
              homeComputer.maxRam,
            )} of RAM.`,
        );
        return true;
      },
    getUpgradeHomeRamCost: (_ctx: NetscriptContext) =>
      function (): number {
        _ctx.helper.checkSingularityAccess();

        return player.getUpgradeHomeRamCost();
      },
    workForCompany: (_ctx: NetscriptContext) =>
      function (_companyName: unknown, _focus: unknown = true): boolean {
        _ctx.helper.checkSingularityAccess();
        let companyName = _ctx.helper.string("companyName", _companyName);
        const focus = _ctx.helper.boolean(_focus);

        // Sanitize input
        if (companyName == null) {
          companyName = player.companyName;
        }

        // Make sure its a valid company
        if (companyName == null || companyName === "" || !(Companies[companyName] instanceof Company)) {
          _ctx.log(() => `Invalid company: '${companyName}'`);
          return false;
        }

        // Make sure player is actually employed at the comapny
        if (!Object.keys(player.jobs).includes(companyName)) {
          _ctx.log(() => `You do not have a job at '${companyName}'`);
          return false;
        }

        // Check to make sure company position data is valid
        const companyPositionName = player.jobs[companyName];
        const companyPosition = CompanyPositions[companyPositionName];
        if (companyPositionName === "" || !(companyPosition instanceof CompanyPosition)) {
          _ctx.log(() => "You do not have a job");
          return false;
        }

        const wasFocused = player.focus;
        if (player.isWorking) {
          const txt = player.singularityStopWork();
          _ctx.log(() => txt);
        }

        player.workManager.start(companyPosition.isPartTimeJob() ? WorkType.CompanyPartTime : WorkType.Company, <
          StartCompanyWorkParams
        >{ company: companyName });

        if (focus) {
          player.startFocusing();
          Router.toWork();
        } else if (wasFocused) {
          player.stopFocusing();
          Router.toTerminal();
        }
        _ctx.log(() => `Began working at '${player.companyName}' as a '${companyPositionName}'`);
        return true;
      },
    applyToCompany: (_ctx: NetscriptContext) =>
      function (_companyName: unknown, _field: unknown): boolean {
        _ctx.helper.checkSingularityAccess();
        const companyName = _ctx.helper.string("companyName", _companyName);
        const field = _ctx.helper.string("field", _field);
        getCompany(_ctx, companyName);

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
            _ctx.log(() => `Invalid job: '${field}'.`);
            return false;
        }
        // TODO https://github.com/danielyxie/bitburner/issues/1378
        // The player object's applyForJob function can return string with special error messages
        // if (isString(res)) {
        //   _ctx.log("applyToCompany",()=> res);
        //   return false;
        // }
        if (res) {
          _ctx.log(() => `You were offered a new job at '${companyName}' as a '${player.jobs[companyName]}'`);
        } else {
          _ctx.log(() => `You failed to get a new job/promotion at '${companyName}' in the '${field}' field.`);
        }
        return res;
      },
    quitJob: (_ctx: NetscriptContext) =>
      function (_companyName: unknown): void {
        _ctx.helper.checkSingularityAccess();
        const companyName = _ctx.helper.string("companyName", _companyName);
        player.quitJob(companyName);
      },
    getCompanyRep: (_ctx: NetscriptContext) =>
      function (_companyName: unknown): number {
        _ctx.helper.checkSingularityAccess();
        const companyName = _ctx.helper.string("companyName", _companyName);
        const company = getCompany(_ctx, companyName);
        return company.playerReputation;
      },
    getCompanyFavor: (_ctx: NetscriptContext) =>
      function (_companyName: unknown): number {
        _ctx.helper.checkSingularityAccess();
        const companyName = _ctx.helper.string("companyName", _companyName);
        const company = getCompany(_ctx, companyName);
        return company.favor;
      },
    getCompanyFavorGain: (_ctx: NetscriptContext) =>
      function (_companyName: unknown): number {
        _ctx.helper.checkSingularityAccess();
        const companyName = _ctx.helper.string("companyName", _companyName);
        const company = getCompany(_ctx, companyName);
        return company.getFavorGain();
      },
    checkFactionInvitations: (_ctx: NetscriptContext) =>
      function (): string[] {
        _ctx.helper.checkSingularityAccess();
        // Make a copy of player.factionInvitations
        return player.factionInvitations.slice();
      },
    joinFaction: (_ctx: NetscriptContext) =>
      function (_facName: unknown): boolean {
        _ctx.helper.checkSingularityAccess();
        const facName = _ctx.helper.string("facName", _facName);
        getFaction(_ctx, facName);

        if (!player.factionInvitations.includes(facName)) {
          _ctx.log(() => `You have not been invited by faction '${facName}'`);
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
        _ctx.log(() => `Joined the '${facName}' faction.`);
        return true;
      },
    workForFaction: (_ctx: NetscriptContext) =>
      function (_facName: unknown, _type: unknown, _focus: unknown = true): boolean {
        _ctx.helper.checkSingularityAccess();
        const facName = _ctx.helper.string("facName", _facName);
        const type = _ctx.helper.string("type", _type);
        const focus = _ctx.helper.boolean(_focus);
        const faction = getFaction(_ctx, facName);

        // if the player is in a gang and the target faction is any of the gang faction, fail
        if (player.inGang() && faction.name === player.getGangFaction().name) {
          _ctx.log(() => `You can't work for '${facName}' because youre managing a gang for it`);
          return false;
        }

        if (!player.factions.includes(facName)) {
          _ctx.log(() => `You are not a member of '${facName}'`);
          return false;
        }

        const wasFocusing = player.focus;
        if (player.isWorking) {
          const txt = player.singularityStopWork();
          _ctx.log(() => txt);
        }

        switch (type.toLowerCase()) {
          case "hacking":
          case "hacking contracts":
          case "hackingcontracts":
            if (!FactionInfos[faction.name].offerHackingWork) {
              _ctx.log(() => `Faction '${faction.name}' do not need help with hacking contracts.`);
              return false;
            }
            player.workManager.start(WorkType.Faction, <StartFactionWorkParams>{
              faction,
              workType: PlayerFactionWorkType.Hacking,
            });
            if (focus) {
              player.startFocusing();
              Router.toWork();
            } else if (wasFocusing) {
              player.stopFocusing();
              Router.toTerminal();
            }
            _ctx.log(() => `Started carrying out hacking contracts for '${faction.name}'`);
            return true;
          case "field":
          case "fieldwork":
          case "field work":
            if (!FactionInfos[faction.name].offerFieldWork) {
              _ctx.log(() => `Faction '${faction.name}' do not need help with field missions.`);
              return false;
            }
            player.workManager.start(WorkType.Faction, <StartFactionWorkParams>{
              faction,
              workType: PlayerFactionWorkType.Field,
            });
            if (focus) {
              player.startFocusing();
              Router.toWork();
            } else if (wasFocusing) {
              player.stopFocusing();
              Router.toTerminal();
            }
            _ctx.log(() => `Started carrying out field missions for '${faction.name}'`);
            return true;
          case "security":
          case "securitywork":
          case "security work":
            if (!FactionInfos[faction.name].offerSecurityWork) {
              _ctx.log(() => `Faction '${faction.name}' do not need help with security work.`);
              return false;
            }
            player.workManager.start(WorkType.Faction, <StartFactionWorkParams>{
              faction,
              workType: PlayerFactionWorkType.Security,
            });
            if (focus) {
              player.startFocusing();
              Router.toWork();
            } else if (wasFocusing) {
              player.stopFocusing();
              Router.toTerminal();
            }
            _ctx.log(() => `Started carrying out security work for '${faction.name}'`);
            return true;
          default:
            _ctx.log(() => `Invalid work type: '${type}`);
            return false;
        }
      },
    getFactionRep: (_ctx: NetscriptContext) =>
      function (_facName: unknown): number {
        _ctx.helper.checkSingularityAccess();
        const facName = _ctx.helper.string("facName", _facName);
        const faction = getFaction(_ctx, facName);
        return faction.playerReputation;
      },
    getFactionFavor: (_ctx: NetscriptContext) =>
      function (_facName: unknown): number {
        _ctx.helper.checkSingularityAccess();
        const facName = _ctx.helper.string("facName", _facName);
        const faction = getFaction(_ctx, facName);
        return faction.favor;
      },
    getFactionFavorGain: (_ctx: NetscriptContext) =>
      function (_facName: unknown): number {
        _ctx.helper.checkSingularityAccess();
        const facName = _ctx.helper.string("facName", _facName);
        const faction = getFaction(_ctx, facName);
        return faction.getFavorGain();
      },
    donateToFaction: (_ctx: NetscriptContext) =>
      function (_facName: unknown, _amt: unknown): boolean {
        _ctx.helper.checkSingularityAccess();
        const facName = _ctx.helper.string("facName", _facName);
        const amt = _ctx.helper.number("amt", _amt);
        const faction = getFaction(_ctx, facName);
        if (!player.factions.includes(faction.name)) {
          _ctx.log(() => `You can't donate to '${facName}' because you aren't a member`);
          return false;
        }
        if (player.inGang() && faction.name === player.getGangFaction().name) {
          _ctx.log(() => `You can't donate to '${facName}' because youre managing a gang for it`);
          return false;
        }
        if (faction.name === FactionNames.ChurchOfTheMachineGod || faction.name === FactionNames.Bladeburners) {
          _ctx.log(() => `You can't donate to '${facName}' because they do not accept donations`);
          return false;
        }
        if (typeof amt !== "number" || amt <= 0 || isNaN(amt)) {
          _ctx.log(() => `Invalid donation amount: '${amt}'.`);
          return false;
        }
        if (player.money < amt) {
          _ctx.log(() => `You do not have enough money to donate ${numeralWrapper.formatMoney(amt)} to '${facName}'`);
          return false;
        }
        const repNeededToDonate = Math.floor(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
        if (faction.favor < repNeededToDonate) {
          _ctx.log(
            () =>
              `You do not have enough favor to donate to this faction. Have ${faction.favor}, need ${repNeededToDonate}`,
          );
          return false;
        }
        const repGain = (amt / CONSTANTS.DonateMoneyToRepDivisor) * player.faction_rep_mult;
        faction.playerReputation += repGain;
        player.loseMoney(amt, "other");
        _ctx.log(
          () =>
            `${numeralWrapper.formatMoney(amt)} donated to '${facName}' for ${numeralWrapper.formatReputation(
              repGain,
            )} reputation`,
        );
        return true;
      },
    createProgram: (_ctx: NetscriptContext) =>
      function (_programName: unknown, _focus: unknown = true): boolean {
        _ctx.helper.checkSingularityAccess();
        const programName = _ctx.helper.string("programName", _programName).toLowerCase();
        const focus = _ctx.helper.boolean(_focus);

        const wasFocusing = player.focus;
        if (player.isWorking) {
          const txt = player.singularityStopWork();
          _ctx.log(() => txt);
        }

        const p = Object.values(Programs).find((p) => p.name.toLowerCase() === programName);

        if (p == null) {
          _ctx.log(() => `The specified program does not exist: '${programName}`);
          return false;
        }

        if (player.hasProgram(p.name)) {
          _ctx.log(() => `You already have the '${p.name}' program`);
          return false;
        }

        const create = p.create;
        if (create === null) {
          _ctx.log(() => `You cannot create the '${p.name}' program`);
          return false;
        }

        if (!create.req(player)) {
          _ctx.log(() => `Hacking level is too low to create '${p.name}' (level ${create.level} req)`);
          return false;
        }

        player.workManager.start(WorkType.CreateProgram, <StartCreateProgramParams>{
          program: p.name,
          time: create.time,
          requiredLevel: create.level,
        });
        if (focus) {
          player.startFocusing();
          Router.toWork();
        } else if (wasFocusing) {
          player.stopFocusing();
          Router.toTerminal();
        }
        _ctx.log(() => `Began creating program: '${programName}'`);
        return true;
      },
    commitCrime: (_ctx: NetscriptContext) =>
      function (_crimeRoughName: unknown): number {
        _ctx.helper.checkSingularityAccess();
        const crimeRoughName = _ctx.helper.string("crimeRoughName", _crimeRoughName);

        if (player.isWorking) {
          const txt = player.singularityStopWork();
          _ctx.log(() => txt);
        }

        // Set Location to slums
        player.gotoLocation(LocationName.Slums);

        const crime = findCrime(crimeRoughName.toLowerCase());
        if (crime == null) {
          // couldn't find crime
          throw _ctx.helper.makeRuntimeErrorMsg(`Invalid crime: '${crimeRoughName}'`);
        }
        _ctx.log(() => `Attempting to commit ${crime.name}...`);
        return crime.commit(Router, player, 1, workerScript);
      },
    getCrimeChance: (_ctx: NetscriptContext) =>
      function (_crimeRoughName: unknown): number {
        _ctx.helper.checkSingularityAccess();
        const crimeRoughName = _ctx.helper.string("crimeRoughName", _crimeRoughName);

        const crime = findCrime(crimeRoughName.toLowerCase());
        if (crime == null) {
          throw _ctx.helper.makeRuntimeErrorMsg(`Invalid crime: ${crimeRoughName}`);
        }

        return crime.successRate(player);
      },
    getCrimeStats: (_ctx: NetscriptContext) =>
      function (_crimeRoughName: unknown): CrimeStats {
        _ctx.helper.checkSingularityAccess();
        const crimeRoughName = _ctx.helper.string("crimeRoughName", _crimeRoughName);

        const crime = findCrime(crimeRoughName.toLowerCase());
        if (crime == null) {
          throw _ctx.helper.makeRuntimeErrorMsg(`Invalid crime: ${crimeRoughName}`);
        }

        return Object.assign({}, crime);
      },
    getDarkwebPrograms: (_ctx: NetscriptContext) =>
      function (): string[] {
        _ctx.helper.checkSingularityAccess();

        // If we don't have Tor, log it and return [] (empty list)
        if (!player.hasTorRouter()) {
          _ctx.log(() => "You do not have the TOR router.");
          return [];
        }
        return Object.values(DarkWebItems).map((p) => p.program);
      },
    getDarkwebProgramCost: (_ctx: NetscriptContext) =>
      function (_programName: unknown): number {
        _ctx.helper.checkSingularityAccess();
        const programName = _ctx.helper.string("programName", _programName).toLowerCase();

        // If we don't have Tor, log it and return -1
        if (!player.hasTorRouter()) {
          _ctx.log(() => "You do not have the TOR router.");
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
          throw _ctx.helper.makeRuntimeErrorMsg(
            `No such exploit ('${programName}') found on the darkweb! ` +
              `\nThis function is not case-sensitive. Did you perhaps forget .exe at the end?`,
          );
        }

        if (player.hasProgram(item.program)) {
          _ctx.log(() => `You already have the '${item.program}' program`);
          return 0;
        }
        return item.price;
      },
    b1tflum3:
      (_ctx: NetscriptContext) =>
      (_nextBN: unknown, _callbackScript: unknown = ""): void => {
        _ctx.helper.checkSingularityAccess();
        const nextBN = _ctx.helper.number("nextBN", _nextBN);
        const callbackScript = _ctx.helper.string("callbackScript", _callbackScript);
        _ctx.helper.checkSingularityAccess();
        enterBitNode(Router, true, player.bitNodeN, nextBN);
        if (callbackScript)
          setTimeout(() => {
            runAfterReset(callbackScript);
          }, 0);
      },
    destroyW0r1dD43m0n:
      (_ctx: NetscriptContext) =>
      (_nextBN: unknown, _callbackScript: unknown = ""): void => {
        _ctx.helper.checkSingularityAccess();
        const nextBN = _ctx.helper.number("nextBN", _nextBN);
        const callbackScript = _ctx.helper.string("callbackScript", _callbackScript);
        _ctx.helper.checkSingularityAccess();

        const hackingRequirements = (): boolean => {
          const wd = GetServer(SpecialServers.WorldDaemon);
          if (!(wd instanceof Server))
            throw new Error("WorldDaemon was not a normal server. This is a bug contact dev.");
          if (player.hacking < wd.requiredHackingSkill) return false;
          if (!wd.hasAdminRights) return false;
          return true;
        };
        const bladeburnerRequirements = (): boolean => {
          if (!player.inBladeburner()) return false;
          if (!player.bladeburner) return false;
          return player.bladeburner.blackops[BlackOperationNames.OperationDaedalus];
        };

        if (!hackingRequirements() && !bladeburnerRequirements()) {
          _ctx.log(() => "Requirements not met to destroy the world daemon");
          return;
        }

        enterBitNode(Router, false, player.bitNodeN, nextBN);
        if (callbackScript)
          setTimeout(() => {
            runAfterReset(callbackScript);
          }, 0);
      },
  };
}
