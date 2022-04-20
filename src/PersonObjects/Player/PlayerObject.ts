import * as augmentationMethods from "./PlayerObjectAugmentationMethods";
import * as bladeburnerMethods from "./PlayerObjectBladeburnerMethods";
import * as corporationMethods from "./PlayerObjectCorporationMethods";
import * as gangMethods from "./PlayerObjectGangMethods";
import * as generalMethods from "./PlayerObjectGeneralMethods";
import * as serverMethods from "./PlayerObjectServerMethods";

import { IMap } from "../../types";
import { Sleeve } from "../Sleeve/Sleeve";
import { IPlayerOwnedSourceFile } from "../../SourceFile/PlayerOwnedSourceFile";
import { Exploit } from "../../Exploits/Exploit";
import { WorkerScript } from "../../Netscript/WorkerScript";
import { CompanyPosition } from "../../Company/CompanyPosition";
import { Server } from "../../Server/Server";
import { BaseServer } from "../../Server/BaseServer";
import { HacknetServer } from "../../Hacknet/HacknetServer";
import { Faction } from "../../Faction/Faction";
import { Company } from "../../Company/Company";
import { Augmentation } from "../../Augmentation/Augmentation";
import { IRouter } from "../../ui/Router";
import { ICodingContractReward } from "../../CodingContracts";

import { IPlayer } from "../IPlayer";
import { LocationName } from "../../Locations/data/LocationNames";
import { IPlayerOwnedAugmentation } from "../../Augmentation/PlayerOwnedAugmentation";
import { ICorporation } from "../../Corporation/ICorporation";
import { IGang } from "../../Gang/IGang";
import { IBladeburner } from "../../Bladeburner/IBladeburner";
import { HacknetNode } from "../../Hacknet/HacknetNode";

import { HashManager } from "../../Hacknet/HashManager";
import { CityName } from "../../Locations/data/CityNames";

import { MoneySourceTracker } from "../../utils/MoneySourceTracker";
import { Reviver, Generic_toJSON, Generic_fromJSON } from "../../utils/JSONReviver";
import { ISkillProgress } from "../formulas/skill";
import { PlayerAchievement } from "../../Achievements/Achievements";
import { cyrb53 } from "../../utils/StringHelperFunctions";
import { getRandomInt } from "../../utils/helpers/getRandomInt";
import { CONSTANTS } from "../../Constants";

export class PlayerObject implements IPlayer {
  // Class members
  augmentations: IPlayerOwnedAugmentation[];
  bitNodeN: number;
  city: CityName;
  companyName: string;
  corporation: ICorporation | null;
  gang: IGang | null;
  bladeburner: IBladeburner | null;
  currentServer: string;
  factions: string[];
  factionInvitations: string[];
  hacknetNodes: (HacknetNode | string)[]; // HacknetNode object or IP of Hacknet Server
  has4SData: boolean;
  has4SDataTixApi: boolean;
  hashManager: HashManager;
  hasTixApiAccess: boolean;
  hasWseAccount: boolean;
  hp: number;
  jobs: IMap<string>;
  init: () => void;
  isWorking: boolean;
  karma: number;
  numPeopleKilled: number;
  location: LocationName;
  max_hp: number;
  money: number;
  moneySourceA: MoneySourceTracker;
  moneySourceB: MoneySourceTracker;
  playtimeSinceLastAug: number;
  playtimeSinceLastBitnode: number;
  purchasedServers: any[];
  queuedAugmentations: IPlayerOwnedAugmentation[];
  scriptProdSinceLastAug: number;
  sleeves: Sleeve[];
  sleevesFromCovenant: number;
  sourceFiles: IPlayerOwnedSourceFile[];
  exploits: Exploit[];
  achievements: PlayerAchievement[];
  terminalCommandHistory: string[];
  identifier: string;
  lastUpdate: number;
  lastSave: number;
  totalPlaytime: number;

  // Stats
  hacking: number;
  strength: number;
  defense: number;
  dexterity: number;
  agility: number;
  charisma: number;
  intelligence: number;

  // Experience
  hacking_exp: number;
  strength_exp: number;
  defense_exp: number;
  dexterity_exp: number;
  agility_exp: number;
  charisma_exp: number;
  intelligence_exp: number;

  hacknet_node_core_cost_mult: number;
  hacknet_node_level_cost_mult: number;
  company_rep_mult: number;
  faction_rep_mult: number;
  work_money_mult: number;
  crime_success_mult: number;
  crime_money_mult: number;
  bladeburner_max_stamina_mult: number;
  bladeburner_stamina_gain_mult: number;
  bladeburner_analysis_mult: number;
  bladeburner_success_chance_mult: number;

  mults: {
    hacking_chance: number;
    hacking_speed: number;
    hacking_money: number;
    hacking_grow: number;

    hacking: number;
    hacking_exp: number;

    strength: number;
    strength_exp: number;

    defense: number;
    defense_exp: number;

    dexterity: number;
    dexterity_exp: number;

    agility: number;
    agility_exp: number;

    charisma: number;
    charisma_exp: number;

    hacknet_node_money: number;
    hacknet_node_purchase_cost: number;
    hacknet_node_ram_cost: number;
    hacknet_node_core_cost: number;
    hacknet_node_level_cost: number;

    company_rep: number;
    faction_rep: number;
    work_money: number;

    crime_success: number;
    crime_money: number;

    bladeburner_max_stamina: number;
    bladeburner_stamina_gain: number;
    bladeburner_analysis: number;
    bladeburner_success_chance: number;
  };

  createProgramReqLvl: number;
  factionWorkType: string;
  createProgramName: string;
  timeWorkedCreateProgram: number;
  graftAugmentationName: string;
  timeWorkedGraftAugmentation: number;
  crimeType: string;
  committingCrimeThruSingFn: boolean;
  singFnCrimeWorkerScript: WorkerScript | null;
  timeNeededToCompleteWork: number;
  focus: boolean;
  className: string;
  currentWorkFactionName: string;
  workType: string;
  workCostMult: number;
  workExpMult: number;
  currentWorkFactionDescription: string;
  timeWorked: number;
  workMoneyGained: number;
  workMoneyGainRate: number;
  workRepGained: number;
  workRepGainRate: number;
  workHackExpGained: number;
  workHackExpGainRate: number;
  workStrExpGained: number;
  workStrExpGainRate: number;
  workDefExpGained: number;
  workDefExpGainRate: number;
  workDexExpGained: number;
  workDexExpGainRate: number;
  workAgiExpGained: number;
  workAgiExpGainRate: number;
  workChaExpGained: number;
  workChaExpGainRate: number;
  workMoneyLossRate: number;

  entropy: number;

  // Methods
  work: (numCycles: number) => boolean;
  workPartTime: (numCycles: number) => boolean;
  workForFaction: (numCycles: number) => boolean;
  applyForAgentJob: (sing?: boolean) => boolean;
  applyForBusinessConsultantJob: (sing?: boolean) => boolean;
  applyForBusinessJob: (sing?: boolean) => boolean;
  applyForEmployeeJob: (sing?: boolean) => boolean;
  applyForItJob: (sing?: boolean) => boolean;
  applyForJob: (entryPosType: CompanyPosition, sing?: boolean) => boolean;
  applyForNetworkEngineerJob: (sing?: boolean) => boolean;
  applyForPartTimeEmployeeJob: (sing?: boolean) => boolean;
  applyForPartTimeWaiterJob: (sing?: boolean) => boolean;
  applyForSecurityEngineerJob: (sing?: boolean) => boolean;
  applyForSecurityJob: (sing?: boolean) => boolean;
  applyForSoftwareConsultantJob: (sing?: boolean) => boolean;
  applyForSoftwareJob: (sing?: boolean) => boolean;
  applyForWaiterJob: (sing?: boolean) => boolean;
  canAccessBladeburner: () => boolean;
  canAccessCorporation: () => boolean;
  canAccessGang: () => boolean;
  canAccessGrafting: () => boolean;
  canAfford: (cost: number) => boolean;
  gainHackingExp: (exp: number) => void;
  gainStrengthExp: (exp: number) => void;
  gainDefenseExp: (exp: number) => void;
  gainDexterityExp: (exp: number) => void;
  gainAgilityExp: (exp: number) => void;
  gainCharismaExp: (exp: number) => void;
  gainIntelligenceExp: (exp: number) => void;
  gainMoney: (money: number, source: string) => void;
  getCurrentServer: () => BaseServer;
  getGangFaction: () => Faction;
  getGangName: () => string;
  getHomeComputer: () => Server;
  getNextCompanyPosition: (company: Company, entryPosType: CompanyPosition) => CompanyPosition | null;
  getUpgradeHomeRamCost: () => number;
  getUpgradeHomeCoresCost: () => number;
  gotoLocation: (to: LocationName) => boolean;
  hasAugmentation: (aug: string | Augmentation, installed?: boolean) => boolean;
  hasCorporation: () => boolean;
  hasGangWith: (facName: string) => boolean;
  hasTorRouter: () => boolean;
  hasProgram: (program: string) => boolean;
  inBladeburner: () => boolean;
  inGang: () => boolean;
  isQualified: (company: Company, position: CompanyPosition) => boolean;
  loseMoney: (money: number, source: string) => void;
  reapplyAllAugmentations: (resetMultipliers?: boolean) => void;
  reapplyAllSourceFiles: () => void;
  regenerateHp: (amt: number) => void;
  recordMoneySource: (amt: number, source: string) => void;
  setMoney: (amt: number) => void;
  singularityStopWork: () => string;
  startBladeburner: (p: any) => void;
  startFactionWork: (faction: Faction) => void;
  startClass: (costMult: number, expMult: number, className: string) => void;
  startCorporation: (corpName: string, additionalShares?: number) => void;
  startCrime: (
    router: IRouter,
    crimeType: string,
    hackExp: number,
    strExp: number,
    defExp: number,
    dexExp: number,
    agiExp: number,
    chaExp: number,
    money: number,
    time: number,
    singParams: any,
  ) => void;
  startFactionFieldWork: (faction: Faction) => void;
  startFactionHackWork: (faction: Faction) => void;
  startFactionSecurityWork: (faction: Faction) => void;
  startFocusing: () => void;
  startGang: (facName: string, isHacking: boolean) => void;
  startWork: (companyName: string) => void;
  startWorkPartTime: (companyName: string) => void;
  takeDamage: (amt: number) => boolean;
  travel: (to: CityName) => boolean;
  giveExploit: (exploit: Exploit) => void;
  giveAchievement: (achievementId: string) => void;
  queryStatFromString: (str: string) => number;
  getIntelligenceBonus: (weight: number) => number;
  getCasinoWinnings: () => number;
  quitJob: (company: string) => void;
  hasJob: () => boolean;
  process: (router: IRouter, numCycles?: number) => void;
  createHacknetServer: () => HacknetServer;
  startCreateProgramWork: (programName: string, time: number, reqLevel: number) => void;
  queueAugmentation: (augmentationName: string) => void;
  receiveInvite: (factionName: string) => void;
  updateSkillLevels: () => void;
  gainCodingContractReward: (reward: ICodingContractReward, difficulty?: number) => string;
  stopFocusing: () => void;
  finishFactionWork: (cancelled: boolean, sing?: boolean) => string;
  finishClass: (sing?: boolean) => string;
  finishWork: (cancelled: boolean, sing?: boolean) => string;
  cancelationPenalty: () => number;
  finishWorkPartTime: (sing?: boolean) => string;
  finishCrime: (cancelled: boolean) => string;
  finishCreateProgramWork: (cancelled: boolean) => string;
  resetMultipliers: () => void;
  prestigeAugmentation: () => void;
  prestigeSourceFile: () => void;
  calculateSkill: (exp: number, mult?: number) => number;
  calculateSkillProgress: (exp: number, mult?: number) => ISkillProgress;
  resetWorkStatus: (generalType?: string, group?: string, workType?: string) => void;
  getWorkHackExpGain: () => number;
  getWorkStrExpGain: () => number;
  getWorkDefExpGain: () => number;
  getWorkDexExpGain: () => number;
  getWorkAgiExpGain: () => number;
  getWorkChaExpGain: () => number;
  getWorkRepGain: () => number;
  getWorkMoneyGain: () => number;
  processWorkEarnings: (cycles: number) => void;
  hospitalize: () => void;
  createProgramWork: (numCycles: number) => boolean;
  takeClass: (numCycles: number) => boolean;
  commitCrime: (numCycles: number) => boolean;
  checkForFactionInvitations: () => Faction[];
  setBitNodeNumber: (n: number) => void;
  getMult: (name: string) => number;
  setMult: (name: string, mult: number) => void;
  canAccessCotMG: () => boolean;
  sourceFileLvl: (n: number) => number;
  startGraftAugmentationWork: (augmentationName: string, time: number) => void;
  graftAugmentationWork: (numCycles: number) => boolean;
  finishGraftAugmentationWork: (cancelled: boolean) => string;
  applyEntropy: (stacks?: number) => void;

  constructor() {
    //Skills and stats
    this.hacking = 1;

    //Combat stats
    this.hp = 10;
    this.max_hp = 10;
    this.strength = 1;
    this.defense = 1;
    this.dexterity = 1;
    this.agility = 1;

    //Labor stats
    this.charisma = 1;

    //Special stats
    this.intelligence = 0;

    //Experience and multipliers
    this.hacking_exp = 0;
    this.strength_exp = 0;
    this.defense_exp = 0;
    this.dexterity_exp = 0;
    this.agility_exp = 0;
    this.charisma_exp = 0;
    this.intelligence_exp = 0;

    this.company_rep_mult = 1;
    this.faction_rep_mult = 1;

    this.mults = {
      // Hacking multipliers
      hacking_chance: 1,
      hacking_speed: 1,
      hacking_money: 1,
      hacking_grow: 1,

      // Hacking skill and exp multipliers
      hacking: 1,
      hacking_exp: 1,
  
      // Strength skill and exp multipliers
      strength: 1,
      strength_exp: 1,
  
      // Defense skill and exp multipliers
      defense: 1,
      defense_exp: 1,
  
      // Dexterity skill and exp multipliers
      dexterity: 1,
      dexterity_exp: 1,
  
      // Agility skill and exp multipliers
      agility: 1,
      agility_exp: 1,
  
      // Charisma skill and exp multipliers
      charisma: 1,
      charisma_exp: 1,
  
      // Hacknet multipliers
      hacknet_node_money: 1,
      hacknet_node_purchase_cost: 1,
      hacknet_node_ram_cost: 1,
      hacknet_node_core_cost: 1,
      hacknet_node_level_cost: 1,
  
      // Company/Faction rep and work money multipliers
      company_rep: 1,
      faction_rep: 1,
      work_money: 1,
  
      // Crime multipliers
      crime_success: 1,
      crime_money: 1,
  
      // Bladeburner multipliers
      bladeburner_max_stamina: 1,
      bladeburner_stamina_gain: 1,
      bladeburner_analysis: 1,
      bladeburner_success_chance: 1,
    };

    //Money
    this.money = 1000 + CONSTANTS.Donations;

    //Location information
    this.city = CityName.Sector12;
    this.location = LocationName.TravelAgency;

    // Jobs that the player holds
    // Map of company name (key) -> name of company position (value. Just the name, not the CompanyPosition object)
    // The CompanyPosition name must match a key value in CompanyPositions
    this.jobs = {};

    // Company at which player is CURRENTLY working (only valid when the player is actively working)
    this.companyName = ""; // Name of Company. Must match a key value in Companies ma;

    // Servers
    this.currentServer = ""; //hostname of Server currently being accessed through termina;
    this.purchasedServers = []; //hostnames of purchased server;

    // Hacknet Nodes/Servers
    this.hacknetNodes = []; // Note= For Hacknet Servers, this array holds the hostnames of the server;
    this.hashManager = new HashManager();

    //Factions
    this.factions = []; //Names of all factions player has joine;
    this.factionInvitations = []; //Outstanding faction invitation;

    //Augmentations
    this.queuedAugmentations = [];
    this.augmentations = [];

    this.sourceFiles = [];

    //Crime statistics
    this.numPeopleKilled = 0;
    this.karma = 0;

    this.crime_money_mult = 1;
    this.crime_success_mult = 1;

    //Flags/variables for working (Company, Faction, Creating Program, Taking Class)
    this.isWorking = false;
    this.focus = false;
    this.workType = "";
    this.workCostMult = 1;
    this.workExpMult = 1;

    this.currentWorkFactionName = "";
    this.currentWorkFactionDescription = "";

    this.workHackExpGainRate = 0;
    this.workStrExpGainRate = 0;
    this.workDefExpGainRate = 0;
    this.workDexExpGainRate = 0;
    this.workAgiExpGainRate = 0;
    this.workChaExpGainRate = 0;
    this.workRepGainRate = 0;
    this.workMoneyGainRate = 0;
    this.workMoneyLossRate = 0;

    this.workHackExpGained = 0;
    this.workStrExpGained = 0;
    this.workDefExpGained = 0;
    this.workDexExpGained = 0;
    this.workAgiExpGained = 0;
    this.workChaExpGained = 0;
    this.workRepGained = 0;
    this.workMoneyGained = 0;

    this.createProgramName = "";
    this.createProgramReqLvl = 0;

    this.graftAugmentationName = "";
    this.timeWorkedGraftAugmentation = 0;

    this.className = "";

    this.crimeType = "";

    this.timeWorked = 0; //in m;
    this.timeWorkedCreateProgram = 0;
    this.timeNeededToCompleteWork = 0;

    this.work_money_mult = 1;

    this.hacknet_node_core_cost_mult = 1;
    this.hacknet_node_level_cost_mult = 1;

    //Stock Market
    this.hasWseAccount = false;
    this.hasTixApiAccess = false;
    this.has4SData = false;
    this.has4SDataTixApi = false;

    //Gang
    this.gang = null;

    //Corporation
    this.corporation = null;

    //Bladeburner
    this.bladeburner = null;
    this.bladeburner_max_stamina_mult = 1;
    this.bladeburner_stamina_gain_mult = 1;
    this.bladeburner_analysis_mult = 1; //Field Analysis Onl;
    this.bladeburner_success_chance_mult = 1;

    // Sleeves & Re-sleeving
    this.sleeves = [];
    this.sleevesFromCovenant = 0; // # of Duplicate sleeves purchased from the covenan;
    //bitnode
    this.bitNodeN = 1;

    this.entropy = 0;

    //Used to store the last update time.
    this.lastUpdate = 0;
    this.lastSave = 0;
    this.totalPlaytime = 0;

    this.playtimeSinceLastAug = 0;
    this.playtimeSinceLastBitnode = 0;

    // Keep track of where money comes from
    this.moneySourceA = new MoneySourceTracker(); // Where money comes from since last-installed Augmentatio;
    this.moneySourceB = new MoneySourceTracker(); // Where money comes from for this entire BitNode ru;
    // Production since last Augmentation installation
    this.scriptProdSinceLastAug = 0;

    this.exploits = [];
    this.achievements = [];
    this.terminalCommandHistory = [];

    // Let's get a hash of some semi-random stuff so we have something unique.
    this.identifier = cyrb53(
      "I-" +
        new Date().getTime() +
        navigator.userAgent +
        window.innerWidth +
        window.innerHeight +
        getRandomInt(100, 999),
    );

    this.init = generalMethods.init;
    this.prestigeAugmentation = generalMethods.prestigeAugmentation;
    this.prestigeSourceFile = generalMethods.prestigeSourceFile;
    this.receiveInvite = generalMethods.receiveInvite;
    this.calculateSkill = generalMethods.calculateSkill;
    this.calculateSkillProgress = generalMethods.calculateSkillProgress;
    this.updateSkillLevels = generalMethods.updateSkillLevels;
    this.resetMultipliers = generalMethods.resetMultipliers;
    this.hasProgram = generalMethods.hasProgram;
    this.setMoney = generalMethods.setMoney;
    this.gainMoney = generalMethods.gainMoney;
    this.loseMoney = generalMethods.loseMoney;
    this.canAfford = generalMethods.canAfford;
    this.recordMoneySource = generalMethods.recordMoneySource;
    this.gainHackingExp = generalMethods.gainHackingExp;
    this.gainStrengthExp = generalMethods.gainStrengthExp;
    this.gainDefenseExp = generalMethods.gainDefenseExp;
    this.gainDexterityExp = generalMethods.gainDexterityExp;
    this.gainAgilityExp = generalMethods.gainAgilityExp;
    this.gainCharismaExp = generalMethods.gainCharismaExp;
    this.gainIntelligenceExp = generalMethods.gainIntelligenceExp;
    this.queryStatFromString = generalMethods.queryStatFromString;
    this.resetWorkStatus = generalMethods.resetWorkStatus;
    this.processWorkEarnings = generalMethods.processWorkEarnings;
    this.startWork = generalMethods.startWork;
    this.cancelationPenalty = generalMethods.cancelationPenalty;
    this.work = generalMethods.work;
    this.finishWork = generalMethods.finishWork;
    this.startWorkPartTime = generalMethods.startWorkPartTime;
    this.workPartTime = generalMethods.workPartTime;
    this.finishWorkPartTime = generalMethods.finishWorkPartTime;
    this.startFocusing = generalMethods.startFocusing;
    this.stopFocusing = generalMethods.stopFocusing;
    this.startFactionWork = generalMethods.startFactionWork;
    this.startFactionHackWork = generalMethods.startFactionHackWork;
    this.startFactionFieldWork = generalMethods.startFactionFieldWork;
    this.startFactionSecurityWork = generalMethods.startFactionSecurityWork;
    this.workForFaction = generalMethods.workForFaction;
    this.finishFactionWork = generalMethods.finishFactionWork;
    this.getWorkMoneyGain = generalMethods.getWorkMoneyGain;
    this.getWorkHackExpGain = generalMethods.getWorkHackExpGain;
    this.getWorkStrExpGain = generalMethods.getWorkStrExpGain;
    this.getWorkDefExpGain = generalMethods.getWorkDefExpGain;
    this.getWorkDexExpGain = generalMethods.getWorkDexExpGain;
    this.getWorkAgiExpGain = generalMethods.getWorkAgiExpGain;
    this.getWorkChaExpGain = generalMethods.getWorkChaExpGain;
    this.getWorkRepGain = generalMethods.getWorkRepGain;
    this.process = generalMethods.process;
    this.startCreateProgramWork = generalMethods.startCreateProgramWork;
    this.createProgramWork = generalMethods.createProgramWork;
    this.finishCreateProgramWork = generalMethods.finishCreateProgramWork;
    this.startGraftAugmentationWork = generalMethods.startGraftAugmentationWork;
    this.graftAugmentationWork = generalMethods.craftAugmentationWork;
    this.finishGraftAugmentationWork = generalMethods.finishGraftAugmentationWork;
    this.startClass = generalMethods.startClass;
    this.takeClass = generalMethods.takeClass;
    this.finishClass = generalMethods.finishClass;
    this.startCrime = generalMethods.startCrime;
    this.commitCrime = generalMethods.commitCrime;
    this.finishCrime = generalMethods.finishCrime;
    this.singularityStopWork = generalMethods.singularityStopWork;
    this.takeDamage = generalMethods.takeDamage;
    this.regenerateHp = generalMethods.regenerateHp;
    this.hospitalize = generalMethods.hospitalize;
    this.applyForJob = generalMethods.applyForJob;
    this.getNextCompanyPosition = generalMethods.getNextCompanyPosition;
    this.quitJob = generalMethods.quitJob;
    this.hasJob = generalMethods.hasJob;
    this.applyForSoftwareJob = generalMethods.applyForSoftwareJob;
    this.applyForSoftwareConsultantJob = generalMethods.applyForSoftwareConsultantJob;
    this.applyForItJob = generalMethods.applyForItJob;
    this.applyForSecurityEngineerJob = generalMethods.applyForSecurityEngineerJob;
    this.applyForNetworkEngineerJob = generalMethods.applyForNetworkEngineerJob;
    this.applyForBusinessJob = generalMethods.applyForBusinessJob;
    this.applyForBusinessConsultantJob = generalMethods.applyForBusinessConsultantJob;
    this.applyForSecurityJob = generalMethods.applyForSecurityJob;
    this.applyForAgentJob = generalMethods.applyForAgentJob;
    this.applyForEmployeeJob = generalMethods.applyForEmployeeJob;
    this.applyForPartTimeEmployeeJob = generalMethods.applyForPartTimeEmployeeJob;
    this.applyForWaiterJob = generalMethods.applyForWaiterJob;
    this.applyForPartTimeWaiterJob = generalMethods.applyForPartTimeWaiterJob;
    this.isQualified = generalMethods.isQualified;
    this.reapplyAllAugmentations = generalMethods.reapplyAllAugmentations;
    this.reapplyAllSourceFiles = generalMethods.reapplyAllSourceFiles;
    this.checkForFactionInvitations = generalMethods.checkForFactionInvitations;
    this.setBitNodeNumber = generalMethods.setBitNodeNumber;
    this.queueAugmentation = generalMethods.queueAugmentation;
    this.gainCodingContractReward = generalMethods.gainCodingContractReward;
    this.travel = generalMethods.travel;
    this.gotoLocation = generalMethods.gotoLocation;
    this.canAccessGrafting = generalMethods.canAccessGrafting;
    this.giveExploit = generalMethods.giveExploit;
    this.giveAchievement = generalMethods.giveAchievement;
    this.getIntelligenceBonus = generalMethods.getIntelligenceBonus;
    this.getCasinoWinnings = generalMethods.getCasinoWinnings;
    this.hasAugmentation = augmentationMethods.hasAugmentation;
    this.canAccessBladeburner = bladeburnerMethods.canAccessBladeburner;
    this.inBladeburner = bladeburnerMethods.inBladeburner;
    this.startBladeburner = bladeburnerMethods.startBladeburner;
    this.canAccessCorporation = corporationMethods.canAccessCorporation;
    this.hasCorporation = corporationMethods.hasCorporation;
    this.startCorporation = corporationMethods.startCorporation;
    this.canAccessGang = gangMethods.canAccessGang;
    this.getGangFaction = gangMethods.getGangFaction;
    this.getGangName = gangMethods.getGangName;
    this.hasGangWith = gangMethods.hasGangWith;
    this.inGang = gangMethods.inGang;
    this.startGang = gangMethods.startGang;

    this.hasTorRouter = serverMethods.hasTorRouter;
    this.getCurrentServer = serverMethods.getCurrentServer;
    this.getHomeComputer = serverMethods.getHomeComputer;
    this.getUpgradeHomeRamCost = serverMethods.getUpgradeHomeRamCost;
    this.getUpgradeHomeCoresCost = serverMethods.getUpgradeHomeCoresCost;
    this.createHacknetServer = serverMethods.createHacknetServer;
    this.factionWorkType = "";
    this.committingCrimeThruSingFn = false;
    this.singFnCrimeWorkerScript = null;

    this.getMult = generalMethods.getMult;
    this.setMult = generalMethods.setMult;

    this.canAccessCotMG = generalMethods.canAccessCotMG;
    this.sourceFileLvl = generalMethods.sourceFileLvl;

    this.applyEntropy = augmentationMethods.applyEntropy;
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): any {
    return Generic_toJSON("PlayerObject", this);
  }

  /**
   * Initiatizes a PlayerObject object from a JSON save state.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): PlayerObject {
    return Generic_fromJSON(PlayerObject, value.data);
  }
}

Reviver.constructors.PlayerObject = PlayerObject;
