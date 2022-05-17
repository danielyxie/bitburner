/**
 * Interface for an object that represents the player (PlayerObject)
 * Used because at the time of implementation, the PlayerObject
 * cant be converted to TypeScript.
 */
import { PlayerAchievement } from "../Achievements/Achievements";
import { Augmentation } from "../Augmentation/Augmentation";
import { IPlayerOwnedAugmentation } from "../Augmentation/PlayerOwnedAugmentation";
import { IBladeburner } from "../Bladeburner/IBladeburner";
import { ICodingContractReward } from "../CodingContracts";
import { Company } from "../Company/Company";
import { CompanyPosition } from "../Company/CompanyPosition";
import { ICorporation } from "../Corporation/ICorporation";
import { Exploit } from "../Exploits/Exploit";
import { Faction } from "../Faction/Faction";
import { IGang } from "../Gang/IGang";
import { HacknetNode } from "../Hacknet/HacknetNode";
import { HacknetServer } from "../Hacknet/HacknetServer";
import { HashManager } from "../Hacknet/HashManager";
import { CityName } from "../Locations/data/CityNames";
import { LocationName } from "../Locations/data/LocationNames";
import { BaseServer } from "../Server/BaseServer";
import { Server } from "../Server/Server";
import { IPlayerOwnedSourceFile } from "../SourceFile/PlayerOwnedSourceFile";
import { IMap } from "../types";
import { IRouter } from "../ui/Router";
import { MoneySourceTracker } from "../utils/MoneySourceTracker";
import { WorkManager } from "../Work/WorkManager";
import { ISkillProgress } from "./formulas/skill";
import { Sleeve } from "./Sleeve/Sleeve";

export interface IPlayer {
  // Class members
  augmentations: IPlayerOwnedAugmentation[];
  bitNodeN: number;
  city: CityName;
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

  workManager: WorkManager;
  focus: boolean;

  entropy: number;

  // Methods
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
  gainHackingExp(exp: number): void;
  gainStrengthExp(exp: number): void;
  gainDefenseExp(exp: number): void;
  gainDexterityExp(exp: number): void;
  gainAgilityExp(exp: number): void;
  gainCharismaExp(exp: number): void;
  gainIntelligenceExp(exp: number): void;
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
  process(router: IRouter, numCycles?: number): void;
  reapplyAllAugmentations(resetMultipliers?: boolean): void;
  reapplyAllSourceFiles(): void;
  regenerateHp(amt: number): void;
  setMoney(amt: number): void;
  singularityStopWork(): string;
  startBladeburner(p: any): void;
  startCorporation(corpName: string, additionalShares?: number): void;
  startFocusing(): void;
  startGang(facName: string, isHacking: boolean): void;
  takeDamage(amt: number): boolean;
  travel(to: CityName): boolean;
  giveExploit(exploit: Exploit): void;
  giveAchievement(achievementId: string): void;
  queryStatFromString(str: string): number;
  getIntelligenceBonus(weight: number): number;
  getCasinoWinnings(): number;
  quitJob(company: string): void;
  hasJob(): boolean;
  createHacknetServer(): HacknetServer;
  queueAugmentation(augmentationName: string): void;
  receiveInvite(factionName: string): void;
  updateSkillLevels(): void;
  gainCodingContractReward(reward: ICodingContractReward, difficulty?: number): string;
  stopFocusing(): void;
  cancelationPenalty(): number;
  resetMultipliers(): void;
  prestigeAugmentation(): void;
  prestigeSourceFile(): void;
  calculateSkill(exp: number, mult?: number): number;
  calculateSkillProgress(exp: number, mult?: number): ISkillProgress;
  hospitalize(): void;
  checkForFactionInvitations(): Faction[];
  setBitNodeNumber(n: number): void;
  getMult(name: string): number;
  setMult(name: string, mult: number): void;
  canAccessCotMG(): boolean;
  sourceFileLvl(n: number): number;
  applyEntropy(stacks?: number): void;
  getCompanyName(): string;
}
