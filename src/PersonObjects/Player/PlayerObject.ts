import * as augmentationMethods from "./PlayerObjectAugmentationMethods";
import * as bladeburnerMethods from "./PlayerObjectBladeburnerMethods";
import * as corporationMethods from "./PlayerObjectCorporationMethods";
import * as gangMethods from "./PlayerObjectGangMethods";
import * as generalMethods from "./PlayerObjectGeneralMethods";
import * as serverMethods from "./PlayerObjectServerMethods";

import { IMap } from "../../types";
import { Resleeve } from "../Resleeving/Resleeve";
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
  money: any;
  moneySourceA: MoneySourceTracker;
  moneySourceB: MoneySourceTracker;
  playtimeSinceLastAug: number;
  playtimeSinceLastBitnode: number;
  purchasedServers: any[];
  queuedAugmentations: IPlayerOwnedAugmentation[];
  resleeves: Resleeve[];
  scriptProdSinceLastAug: number;
  sleeves: Sleeve[];
  sleevesFromCovenant: number;
  sourceFiles: IPlayerOwnedSourceFile[];
  exploits: Exploit[];
  lastUpdate: number;
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

  // Multipliers
  hacking_chance_mult: number;
  hacking_speed_mult: number;
  hacking_money_mult: number;
  hacking_grow_mult: number;
  hacking_mult: number;
  hacking_exp_mult: number;
  strength_mult: number;
  strength_exp_mult: number;
  defense_mult: number;
  defense_exp_mult: number;
  dexterity_mult: number;
  dexterity_exp_mult: number;
  agility_mult: number;
  agility_exp_mult: number;
  charisma_mult: number;
  charisma_exp_mult: number;
  hacknet_node_money_mult: number;
  hacknet_node_purchase_cost_mult: number;
  hacknet_node_ram_cost_mult: number;
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

  createProgramReqLvl: number;
  factionWorkType: string;
  createProgramName: string;
  timeWorkedCreateProgram: number;
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
  canAccessResleeving: () => boolean;
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
  hasAugmentation: (aug: string | Augmentation) => boolean;
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
  startFactionWork: (router: IRouter, faction: Faction) => void;
  startClass: (router: IRouter, costMult: number, expMult: number, className: string) => void;
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
  startFactionFieldWork: (router: IRouter, faction: Faction) => void;
  startFactionHackWork: (router: IRouter, faction: Faction) => void;
  startFactionSecurityWork: (router: IRouter, faction: Faction) => void;
  startFocusing: () => void;
  startGang: (facName: string, isHacking: boolean) => void;
  startWork: (router: IRouter, companyName: string) => void;
  startWorkPartTime: (router: IRouter, companyName: string) => void;
  takeDamage: (amt: number) => boolean;
  travel: (to: CityName) => boolean;
  giveExploit: (exploit: Exploit) => void;
  queryStatFromString: (str: string) => number;
  getIntelligenceBonus: (weight: number) => number;
  getCasinoWinnings: () => number;
  quitJob: (company: string) => void;
  process: (router: IRouter, numCycles?: number) => void;
  createHacknetServer: () => HacknetServer;
  startCreateProgramWork: (router: IRouter, programName: string, time: number, reqLevel: number) => void;
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
  sourceFileLvl: (n: number) => number;

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

    //Hacking multipliers
    this.hacking_chance_mult = 1;
    this.hacking_speed_mult = 1;
    this.hacking_money_mult = 1;
    this.hacking_grow_mult = 1;

    //Experience and multipliers
    this.hacking_exp = 0;
    this.strength_exp = 0;
    this.defense_exp = 0;
    this.dexterity_exp = 0;
    this.agility_exp = 0;
    this.charisma_exp = 0;
    this.intelligence_exp = 0;

    this.hacking_mult = 1;
    this.strength_mult = 1;
    this.defense_mult = 1;
    this.dexterity_mult = 1;
    this.agility_mult = 1;
    this.charisma_mult = 1;

    this.hacking_exp_mult = 1;
    this.strength_exp_mult = 1;
    this.defense_exp_mult = 1;
    this.dexterity_exp_mult = 1;
    this.agility_exp_mult = 1;
    this.charisma_exp_mult = 1;

    this.company_rep_mult = 1;
    this.faction_rep_mult = 1;

    //Money
    this.money = 1000;

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
    this.currentServer = ""; //IP address of Server currently being accessed through termina;
    this.purchasedServers = []; //IP Addresses of purchased server;

    // Hacknet Nodes/Servers
    this.hacknetNodes = []; // Note= For Hacknet Servers, this array holds the IP addresses of the server;
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

    this.className = "";

    this.crimeType = "";

    this.timeWorked = 0; //in m;
    this.timeWorkedCreateProgram = 0;
    this.timeNeededToCompleteWork = 0;

    this.work_money_mult = 1;

    //Hacknet Node multipliers
    this.hacknet_node_money_mult = 1;
    this.hacknet_node_purchase_cost_mult = 1;
    this.hacknet_node_ram_cost_mult = 1;
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
    this.resleeves = [];
    this.sleevesFromCovenant = 0; // # of Duplicate sleeves purchased from the covenan;
    //bitnode
    this.bitNodeN = 1;

    //Used to store the last update time.
    this.lastUpdate = 0;
    this.totalPlaytime = 0;
    this.playtimeSinceLastAug = 0;
    this.playtimeSinceLastBitnode = 0;

    // Keep track of where money comes from
    this.moneySourceA = new MoneySourceTracker(); // Where money comes from since last-installed Augmentatio;
    this.moneySourceB = new MoneySourceTracker(); // Where money comes from for this entire BitNode ru;
    // Production since last Augmentation installation
    this.scriptProdSinceLastAug = 0;

    this.exploits = [];

    this.init = generalMethods.init;
    this.prestigeAugmentation = generalMethods.prestigeAugmentation;
    this.prestigeSourceFile = generalMethods.prestigeSourceFile;
    this.receiveInvite = generalMethods.receiveInvite;
    this.calculateSkill = generalMethods.calculateSkill;
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
    this.canAccessResleeving = generalMethods.canAccessResleeving;
    this.giveExploit = generalMethods.giveExploit;
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
    this.sourceFileLvl = generalMethods.sourceFileLvl;
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
