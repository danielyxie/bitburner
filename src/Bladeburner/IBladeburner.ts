import { IActionIdentifier } from "./IActionIdentifier";
import { City } from "./City";
import { Skill } from "./Skill";
import { IAction } from "./IAction";
import { IPlayer } from "../PersonObjects/IPlayer";
import { IPerson } from "../PersonObjects/IPerson";
import { ITaskTracker } from "../PersonObjects/ITaskTracker";
import { IRouter } from "../ui/Router";
import { WorkerScript } from "../Netscript/WorkerScript";

export interface IBladeburner {
  numHosp: number;
  moneyLost: number;
  rank: number;
  maxRank: number;

  skillPoints: number;
  totalSkillPoints: number;

  teamSize: number;
  teamLost: number;
  hpLost: number;

  storedCycles: number;

  randomEventCounter: number;

  actionTimeToComplete: number;
  actionTimeCurrent: number;
  actionTimeOverflow: number;

  action: IActionIdentifier;

  cities: any;
  city: string;
  skills: any;
  skillMultipliers: any;
  staminaBonus: number;
  maxStamina: number;
  stamina: number;
  contracts: any;
  operations: any;
  blackops: any;
  logging: any;
  automateEnabled: boolean;
  automateActionHigh: IActionIdentifier;
  automateThreshHigh: number;
  automateActionLow: IActionIdentifier;
  automateThreshLow: number;
  consoleHistory: string[];
  consoleLogs: string[];

  getCurrentCity(): City;
  calculateStaminaPenalty(): number;
  startAction(player: IPlayer, action: IActionIdentifier): void;
  upgradeSkill(skill: Skill): void;
  executeConsoleCommands(player: IPlayer, command: string): void;
  postToConsole(input: string, saveToLogs?: boolean): void;
  log(input: string): void;
  resetAction(): void;
  clearConsole(): void;

  prestige(): void;
  storeCycles(numCycles?: number): void;
  getTypeAndNameFromActionId(actionId: IActionIdentifier): {
    type: string;
    name: string;
  };
  getContractNamesNetscriptFn(): string[];
  getOperationNamesNetscriptFn(): string[];
  getBlackOpNamesNetscriptFn(): string[];
  getGeneralActionNamesNetscriptFn(): string[];
  getSkillNamesNetscriptFn(): string[];
  startActionNetscriptFn(player: IPlayer, type: string, name: string, workerScript: WorkerScript): boolean;
  getActionTimeNetscriptFn(person: IPerson, type: string, name: string): number | string;
  getActionEstimatedSuccessChanceNetscriptFn(person: IPerson, type: string, name: string): [number, number] | string;
  getActionCountRemainingNetscriptFn(type: string, name: string, workerScript: WorkerScript): number;
  getSkillLevelNetscriptFn(skillName: string, workerScript: WorkerScript): number;
  getSkillUpgradeCostNetscriptFn(skillName: string, workerScript: WorkerScript): number;
  upgradeSkillNetscriptFn(skillName: string, workerScript: WorkerScript): boolean;
  getTeamSizeNetscriptFn(type: string, name: string, workerScript: WorkerScript): number;
  setTeamSizeNetscriptFn(type: string, name: string, size: number, workerScript: WorkerScript): number;
  joinBladeburnerFactionNetscriptFn(workerScript: WorkerScript): boolean;
  getActionIdFromTypeAndName(type: string, name: string): IActionIdentifier | null;
  executeStartConsoleCommand(player: IPlayer, args: string[]): void;
  executeSkillConsoleCommand(args: string[]): void;
  executeLogConsoleCommand(args: string[]): void;
  executeHelpConsoleCommand(args: string[]): void;
  executeAutomateConsoleCommand(args: string[]): void;
  parseCommandArguments(command: string): string[];
  executeConsoleCommand(player: IPlayer, command: string): void;
  triggerMigration(sourceCityName: string): void;
  triggerPotentialMigration(sourceCityName: string, chance: number): void;
  randomEvent(): void;
  getDiplomacyEffectiveness(player: IPlayer): number;
  getRecruitmentSuccessChance(player: IPerson): number;
  getRecruitmentTime(player: IPerson): number;
  resetSkillMultipliers(): void;
  updateSkillMultipliers(): void;
  completeOperation(success: boolean, player: IPlayer): void;
  getActionObject(actionId: IActionIdentifier): IAction | null;
  completeContract(success: boolean, actionIdent: IActionIdentifier): void;
  completeAction(player: IPlayer, person: IPerson, actionIdent: IActionIdentifier, isPlayer?: boolean): ITaskTracker;
  infiltrateSynthoidCommunities(p: IPlayer): void;
  changeRank(player: IPlayer, change: number): void;
  processAction(router: IRouter, player: IPlayer, seconds: number): void;
  calculateStaminaGainPerSecond(player: IPlayer): number;
  calculateMaxStamina(player: IPlayer): void;
  create(): void;
  process(router: IRouter, player: IPlayer): void;
  getActionStats(action: IAction, success: boolean): ITaskTracker;
  sleeveSupport(joining: boolean): void;
}
