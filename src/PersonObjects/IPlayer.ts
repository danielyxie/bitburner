/**
 * Interface for an object that represents the player (PlayerObject)
 * Used because at the time of implementation, the PlayerObject
 * cant be converted to TypeScript.
 */
import { Resleeve } from "./Resleeving/Resleeve";
import { Sleeve } from "./Sleeve/Sleeve";

import { IMap } from "../types";

import { IPlayerOwnedAugmentation } from "../Augmentation/PlayerOwnedAugmentation";
import { Augmentation } from "../Augmentation/Augmentation";
import { Company } from "../Company/Company";
import { CompanyPosition } from "../Company/CompanyPosition";
import { CityName } from "../Locations/data/CityNames";
import { Faction } from "../Faction/Faction";
import { HashManager } from "../Hacknet/HashManager";
import { HacknetNode } from "../Hacknet/HacknetNode";
import { LocationName } from "../Locations/data/LocationNames";
import { Server } from "../Server/Server";
import { IPlayerOwnedSourceFile } from "../SourceFile/PlayerOwnedSourceFile";
import { MoneySourceTracker } from "../utils/MoneySourceTracker";
import { Exploit } from "../Exploits/Exploit";
import { ICorporation } from "../Corporation/ICorporation";
import { IGang } from "../Gang/IGang";
import { IBladeburner } from "../Bladeburner/IBladeburner";
import { ICodingContractReward } from "../CodingContracts";
import { IRouter } from "../ui/Router";
import { WorkerScript } from "../Netscript/WorkerScript";
import { HacknetServer } from "../Hacknet/HacknetServer";

export interface IPlayer {
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
  homeComputer: string;
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
  hacking_skill: number;
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
  work(numCycles: number): boolean;
  workPartTime(numCycles: number): boolean;
  workForFaction(numCycles: number): boolean;
  applyForAgentJob(sing?: boolean): boolean;
  applyForBusinessConsultantJob(sing?: boolean): boolean;
  applyForBusinessJob(sing?: boolean): boolean;
  applyForEmployeeJob(sing?: boolean): boolean;
  applyForItJob(sing?: boolean): boolean;
  applyForJob(entryPosType: CompanyPosition, sing?: boolean): boolean;
  applyForNetworkEngineerJob(sing?: boolean): boolean;
  applyForPartTimeEmployeeJob(sing?: boolean): boolean;
  applyForPartTimeWaiterJob(sing?: boolean): boolean;
  applyForSecurityEngineerJob(sing?: boolean): boolean;
  applyForSecurityJob(sing?: boolean): boolean;
  applyForSoftwareConsultantJob(sing?: boolean): boolean;
  applyForSoftwareJob(sing?: boolean): boolean;
  applyForWaiterJob(sing?: boolean): boolean;
  canAccessBladeburner(): boolean;
  canAccessCorporation(): boolean;
  canAccessGang(): boolean;
  canAccessResleeving(): boolean;
  canAfford(cost: number): boolean;
  gainHackingExp(exp: number): void;
  gainStrengthExp(exp: number): void;
  gainDefenseExp(exp: number): void;
  gainDexterityExp(exp: number): void;
  gainAgilityExp(exp: number): void;
  gainCharismaExp(exp: number): void;
  gainIntelligenceExp(exp: number): void;
  gainMoney(money: number): void;
  getCurrentServer(): Server | HacknetServer;
  getGangFaction(): Faction;
  getGangName(): string;
  getHomeComputer(): Server;
  getNextCompanyPosition(company: Company, entryPosType: CompanyPosition): CompanyPosition | null;
  getUpgradeHomeRamCost(): number;
  gotoLocation(to: LocationName): boolean;
  hasAugmentation(aug: string | Augmentation): boolean;
  hasCorporation(): boolean;
  hasGangWith(facName: string): boolean;
  hasTorRouter(): boolean;
  hasProgram(program: string): boolean;
  inBladeburner(): boolean;
  inGang(): boolean;
  isQualified(company: Company, position: CompanyPosition): boolean;
  loseMoney(money: number): void;
  reapplyAllAugmentations(resetMultipliers?: boolean): void;
  reapplyAllSourceFiles(): void;
  regenerateHp(amt: number): void;
  recordMoneySource(amt: number, source: string): void;
  setMoney(amt: number): void;
  singularityStopWork(): string;
  startBladeburner(p: any): void;
  startFactionWork(router: IRouter, faction: Faction): void;
  startClass(router: IRouter, costMult: number, expMult: number, className: string): void;
  startCorporation(corpName: string, additionalShares?: number): void;
  startCrime(
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
  ): void;
  startFactionFieldWork(router: IRouter, faction: Faction): void;
  startFactionHackWork(router: IRouter, faction: Faction): void;
  startFactionSecurityWork(router: IRouter, faction: Faction): void;
  startFocusing(): void;
  startGang(facName: string, isHacking: boolean): void;
  startWork(router: IRouter, companyName: string): void;
  startWorkPartTime(router: IRouter, companyName: string): void;
  takeDamage(amt: number): boolean;
  travel(to: CityName): boolean;
  giveExploit(exploit: Exploit): void;
  queryStatFromString(str: string): number;
  getIntelligenceBonus(weight: number): number;
  getCasinoWinnings(): number;
  quitJob(company: string): void;
  createHacknetServer(): HacknetServer;
  startCreateProgramWork(router: IRouter, programName: string, time: number, reqLevel: number): void;
  queueAugmentation(augmentationName: string): void;
  receiveInvite(factionName: string): void;
  updateSkillLevels(): void;
  gainCodingContractReward(reward: ICodingContractReward, difficulty?: number): string;
  stopFocusing(): void;
  finishFactionWork(cancelled: boolean, sing?: boolean): string;
  finishClass(sing?: boolean): string;
  finishWork(cancelled: boolean, sing?: boolean): string;
  cancelationPenalty(): number;
  finishWorkPartTime(sing?: boolean): string;
  finishCrime(cancelled: boolean): string;
  finishCreateProgramWork(cancelled: boolean): string;
  resetMultipliers(): void;
  prestigeAugmentation(): void;
  prestigeSourceFile(): void;
  calculateSkill(exp: number, mult?: number): number;
  resetWorkStatus(generalType?: string, group?: string, workType?: string): void;
  getWorkHackExpGain(): number;
  getWorkStrExpGain(): number;
  getWorkDefExpGain(): number;
  getWorkDexExpGain(): number;
  getWorkAgiExpGain(): number;
  getWorkChaExpGain(): number;
  getWorkRepGain(): number;
  getWorkMoneyGain(): number;
  processWorkEarnings(cycles: number): void;
  hospitalize(): void;
  createProgramWork(numCycles: number): boolean;
  takeClass(numCycles: number): boolean;
  commitCrime(numCycles: number): boolean;
  checkForFactionInvitations(): Faction[];
  setBitNodeNumber(n: number): void;
  getMult(name: string): number;
  setMult(name: string, mult: number): void;
}
