/**
 * Interface for an object that represents the player (PlayerObject)
 * Used because at the time of implementation, the PlayerObject
 * cant be converted to TypeScript.
 */
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
import { BaseServer } from "../Server/BaseServer";
import { IPlayerOwnedSourceFile } from "../SourceFile/PlayerOwnedSourceFile";
import { MoneySourceTracker } from "../utils/MoneySourceTracker";
import { Exploit } from "../Exploits/Exploit";
import { ICorporation } from "../Corporation/ICorporation";
import { IGang } from "../Gang/IGang";
import { IBladeburner } from "../Bladeburner/IBladeburner";
import { ICodingContractReward } from "../CodingContracts";
import { HacknetServer } from "../Hacknet/HacknetServer";
import { ISkillProgress } from "./formulas/skill";
import { PlayerAchievement } from "../Achievements/Achievements";
import { IPerson } from "./IPerson";
import { Work } from "src/Work/Work";

export interface IPlayer extends IPerson {
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
  karma: number;
  numPeopleKilled: number;
  location: LocationName;
  max_hp: number;
  readonly money: number;
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

  currentWork: Work | null;
  focus: boolean;

  entropy: number;

  // Methods
  init: () => void;
  startWork(w: Work): void;
  processWork(cycles: number): void;
  finishWork(cancelled: boolean): void;
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
  canAccessGrafting(): boolean;
  canAfford(cost: number): boolean;
  gainMoney(money: number, source: string): void;
  getCurrentServer(): BaseServer;
  getGangFaction(): Faction;
  getGangName(): string;
  getHomeComputer(): Server;
  getNextCompanyPosition(company: Company, entryPosType: CompanyPosition): CompanyPosition | null;
  getUpgradeHomeRamCost(): number;
  getUpgradeHomeCoresCost(): number;
  gotoLocation(to: LocationName): boolean;
  hasAugmentation(aug: string | Augmentation, installed?: boolean): boolean;
  hasCorporation(): boolean;
  hasGangWith(facName: string): boolean;
  hasTorRouter(): boolean;
  hasProgram(program: string): boolean;
  inBladeburner(): boolean;
  inGang(): boolean;
  isAwareOfGang(): boolean;
  isQualified(company: Company, position: CompanyPosition): boolean;
  loseMoney(money: number, source: string): void;
  reapplyAllAugmentations(resetMultipliers?: boolean): void;
  reapplyAllSourceFiles(): void;
  setMoney(amt: number): void;
  startBladeburner(p: any): void;
  startCorporation(corpName: string, additionalShares?: number): void;
  startFocusing(): void;
  startGang(facName: string, isHacking: boolean): void;
  travel(to: CityName): boolean;
  giveExploit(exploit: Exploit): void;
  giveAchievement(achievementId: string): void;
  getCasinoWinnings(): number;
  quitJob(company: string, sing?: boolean): void;
  hasJob(): boolean;
  createHacknetServer(): HacknetServer;
  queueAugmentation(augmentationName: string): void;
  receiveInvite(factionName: string): void;
  updateSkillLevels(): void;
  gainCodingContractReward(reward: ICodingContractReward, difficulty?: number): string;
  stopFocusing(): void;
  resetMultipliers(): void;
  prestigeAugmentation(): void;
  prestigeSourceFile(): void;
  calculateSkillProgress(exp: number, mult?: number): ISkillProgress;
  hospitalize(): void;
  checkForFactionInvitations(): Faction[];
  setBitNodeNumber(n: number): void;
  getMult(name: string): number;
  setMult(name: string, mult: number): void;
  canAccessCotMG(): boolean;
  sourceFileLvl(n: number): number;
  applyEntropy(stacks?: number): void;
  focusPenalty(): number;
}
