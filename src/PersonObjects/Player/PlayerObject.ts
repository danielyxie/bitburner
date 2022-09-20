import * as augmentationMethods from "./PlayerObjectAugmentationMethods";
import * as bladeburnerMethods from "./PlayerObjectBladeburnerMethods";
import * as corporationMethods from "./PlayerObjectCorporationMethods";
import * as gangMethods from "./PlayerObjectGangMethods";
import * as generalMethods from "./PlayerObjectGeneralMethods";
import * as serverMethods from "./PlayerObjectServerMethods";
import * as workMethods from "./PlayerObjectWorkMethods";

import { IMap } from "../../types";
import { Sleeve } from "../Sleeve/Sleeve";
import { IPlayerOwnedSourceFile } from "../../SourceFile/PlayerOwnedSourceFile";
import { Exploit } from "../../Exploits/Exploit";

import { IPerson } from "../IPerson";
import { LocationName } from "../../Locations/data/LocationNames";
import { IPlayerOwnedAugmentation } from "../../Augmentation/PlayerOwnedAugmentation";
import { ICorporation } from "../../Corporation/ICorporation";
import { IGang } from "../../Gang/IGang";
import { IBladeburner } from "../../Bladeburner/IBladeburner";
import { HacknetNode } from "../../Hacknet/HacknetNode";

import { HashManager } from "../../Hacknet/HashManager";
import { CityName } from "../../Locations/data/CityNames";

import { MoneySourceTracker } from "../../utils/MoneySourceTracker";
import { Reviver, Generic_toJSON, Generic_fromJSON, IReviverValue } from "../../utils/JSONReviver";
import { PlayerAchievement } from "../../Achievements/Achievements";
import { cyrb53 } from "../../utils/StringHelperFunctions";
import { getRandomInt } from "../../utils/helpers/getRandomInt";
import { CONSTANTS } from "../../Constants";
import { Work } from "src/Work/Work";
import { defaultMultipliers } from "../Multipliers";
import { HP } from "../HP";
import { Skills } from "../Skills";

export class PlayerObject implements IPerson {
  // Class members
  augmentations: IPlayerOwnedAugmentation[] = [];
  bitNodeN = 1; //current bitnode
  city = CityName.Sector12;
  corporation: ICorporation | null = null;
  gang: IGang | null = null;
  bladeburner: IBladeburner | null = null;
  currentServer = "";
  factions: string[] = [];
  factionInvitations: string[] = [];
  hacknetNodes: (HacknetNode | string)[] = []; // HacknetNode object or hostname of Hacknet Server
  has4SData = false;
  has4SDataTixApi = false;
  hashManager = new HashManager();
  hasTixApiAccess = false;
  hasWseAccount = false;
  jobs: IMap<string> = {};
  karma = 0;
  numPeopleKilled = 0;
  location = LocationName.TravelAgency;
  money = 1000 + CONSTANTS.Donations;
  moneySourceA = new MoneySourceTracker();
  moneySourceB = new MoneySourceTracker();
  playtimeSinceLastAug = 0;
  playtimeSinceLastBitnode = 0;
  purchasedServers: string[] = [];
  queuedAugmentations: IPlayerOwnedAugmentation[] = [];
  scriptProdSinceLastAug = 0;
  sleeves: Sleeve[] = [];
  sleevesFromCovenant = 0;
  sourceFiles: IPlayerOwnedSourceFile[] = [];
  exploits: Exploit[] = [];
  achievements: PlayerAchievement[] = [];
  terminalCommandHistory: string[] = [];
  identifier: string;
  lastUpdate = 0;
  lastSave = 0;
  totalPlaytime = 0;

  hp: HP = { current: 10, max: 10 };
  skills: Skills = {
    hacking: 1,
    strength: 1,
    defense: 1,
    dexterity: 1,
    agility: 1,
    charisma: 1,
    intelligence: 0,
  };
  exp: Skills = {
    hacking: 0,
    strength: 0,
    defense: 0,
    dexterity: 0,
    agility: 0,
    charisma: 0,
    intelligence: 0,
  };

  mults = defaultMultipliers();

  currentWork: Work | null = null;
  focus = false;

  entropy = 0;

  // Methods
  init = generalMethods.init;
  startWork = workMethods.startWork;
  processWork = workMethods.processWork;
  finishWork = workMethods.finishWork;
  applyForSoftwareJob = generalMethods.applyForSoftwareJob;
  applyForSoftwareConsultantJob = generalMethods.applyForSoftwareConsultantJob;
  applyForItJob = generalMethods.applyForItJob;
  applyForSecurityEngineerJob = generalMethods.applyForSecurityEngineerJob;
  applyForNetworkEngineerJob = generalMethods.applyForNetworkEngineerJob;
  applyForBusinessJob = generalMethods.applyForBusinessJob;
  applyForBusinessConsultantJob = generalMethods.applyForBusinessConsultantJob;
  applyForSecurityJob = generalMethods.applyForSecurityJob;
  applyForAgentJob = generalMethods.applyForAgentJob;
  applyForEmployeeJob = generalMethods.applyForEmployeeJob;
  applyForPartTimeEmployeeJob = generalMethods.applyForPartTimeEmployeeJob;
  applyForWaiterJob = generalMethods.applyForWaiterJob;
  applyForPartTimeWaiterJob = generalMethods.applyForPartTimeWaiterJob;
  applyForJob = generalMethods.applyForJob;
  canAccessBladeburner = bladeburnerMethods.canAccessBladeburner;
  canAccessCorporation = corporationMethods.canAccessCorporation;
  canAccessGang = gangMethods.canAccessGang;
  canAccessGrafting = generalMethods.canAccessGrafting;
  canAfford = generalMethods.canAfford;
  gainHackingExp = generalMethods.gainHackingExp;
  gainStrengthExp = generalMethods.gainStrengthExp;
  gainDefenseExp = generalMethods.gainDefenseExp;
  gainDexterityExp = generalMethods.gainDexterityExp;
  gainAgilityExp = generalMethods.gainAgilityExp;
  gainCharismaExp = generalMethods.gainCharismaExp;
  gainIntelligenceExp = generalMethods.gainIntelligenceExp;
  gainStats = generalMethods.gainStats;
  gainMoney = generalMethods.gainMoney;
  getCurrentServer = serverMethods.getCurrentServer;
  getGangFaction = gangMethods.getGangFaction;
  getGangName = gangMethods.getGangName;
  getHomeComputer = serverMethods.getHomeComputer;
  getNextCompanyPosition = generalMethods.getNextCompanyPosition;
  getUpgradeHomeRamCost = serverMethods.getUpgradeHomeRamCost;
  getUpgradeHomeCoresCost = serverMethods.getUpgradeHomeCoresCost;
  gotoLocation = generalMethods.gotoLocation;
  hasAugmentation = augmentationMethods.hasAugmentation;
  hasCorporation = corporationMethods.hasCorporation;
  hasGangWith = gangMethods.hasGangWith;
  hasTorRouter = serverMethods.hasTorRouter;
  hasProgram = generalMethods.hasProgram;
  inBladeburner = bladeburnerMethods.inBladeburner;
  inGang = gangMethods.inGang;
  isAwareOfGang = gangMethods.isAwareOfGang;
  isQualified = generalMethods.isQualified;
  loseMoney = generalMethods.loseMoney;
  reapplyAllAugmentations = generalMethods.reapplyAllAugmentations;
  reapplyAllSourceFiles = generalMethods.reapplyAllSourceFiles;
  regenerateHp = generalMethods.regenerateHp;
  recordMoneySource = generalMethods.recordMoneySource;
  setMoney = generalMethods.setMoney;
  startBladeburner = bladeburnerMethods.startBladeburner;
  startCorporation = corporationMethods.startCorporation;
  startFocusing = generalMethods.startFocusing;
  startGang = gangMethods.startGang;
  takeDamage = generalMethods.takeDamage;
  travel = generalMethods.travel;
  giveExploit = generalMethods.giveExploit;
  giveAchievement = generalMethods.giveAchievement;
  queryStatFromString = generalMethods.queryStatFromString;
  getIntelligenceBonus = generalMethods.getIntelligenceBonus;
  getCasinoWinnings = generalMethods.getCasinoWinnings;
  quitJob = generalMethods.quitJob;
  hasJob = generalMethods.hasJob;
  createHacknetServer = serverMethods.createHacknetServer;
  queueAugmentation = generalMethods.queueAugmentation;
  receiveInvite = generalMethods.receiveInvite;
  updateSkillLevels = generalMethods.updateSkillLevels;
  gainCodingContractReward = generalMethods.gainCodingContractReward;
  stopFocusing = generalMethods.stopFocusing;
  resetMultipliers = generalMethods.resetMultipliers;
  prestigeAugmentation = generalMethods.prestigeAugmentation;
  prestigeSourceFile = generalMethods.prestigeSourceFile;
  calculateSkill = generalMethods.calculateSkill;
  calculateSkillProgress = generalMethods.calculateSkillProgress;
  hospitalize = generalMethods.hospitalize;
  checkForFactionInvitations = generalMethods.checkForFactionInvitations;
  setBitNodeNumber = generalMethods.setBitNodeNumber;
  canAccessCotMG = generalMethods.canAccessCotMG;
  sourceFileLvl = generalMethods.sourceFileLvl;
  applyEntropy = augmentationMethods.applyEntropy;
  focusPenalty = generalMethods.focusPenalty;

  constructor() {
    // Let's get a hash of some semi-random stuff so we have something unique.
    this.identifier = cyrb53(
      "I-" +
        new Date().getTime() +
        navigator.userAgent +
        window.innerWidth +
        window.innerHeight +
        getRandomInt(100, 999),
    );
  }

  whoAmI(): string {
    return "Player";
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): IReviverValue {
    return Generic_toJSON("PlayerObject", this);
  }

  /**
   * Initiatizes a PlayerObject object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): PlayerObject {
    return Generic_fromJSON(PlayerObject, value.data);
  }
}

Reviver.constructors.PlayerObject = PlayerObject;
