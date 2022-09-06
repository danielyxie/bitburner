import { IActionIdentifier } from "./IActionIdentifier";
import { City } from "./City";
import { Skill } from "./Skill";
import { IAction } from "./IAction";
import { IPerson } from "../PersonObjects/IPerson";
import { ITaskTracker } from "../PersonObjects/ITaskTracker";
import { WorkerScript } from "../Netscript/WorkerScript";
import { Contract } from "./Contract";
import { Operation } from "./Operation";
import { IReviverValue } from "../utils/JSONReviver";
import { BlackOpsAttempt } from "./Bladeburner";

export interface IBladeburner {
  numHosp: number;
  moneyLost: number;
  rank: number;
  maxRank: number;

  skillPoints: number;
  totalSkillPoints: number;

  teamSize: number;
  sleeveSize: number;
  teamLost: number;
  hpLost: number;

  storedCycles: number;

  randomEventCounter: number;

  actionTimeToComplete: number;
  actionTimeCurrent: number;
  actionTimeOverflow: number;

  action: IActionIdentifier;

  cities: Record<string, City>;
  city: string;
  skills: Record<string, number>;
  skillMultipliers: Record<string, number>;
  staminaBonus: number;
  maxStamina: number;
  stamina: number;
  contracts: Record<string, Contract>;
  operations: Record<string, Operation>;
  blackops: Record<string, boolean>;
  logging: {
    general: boolean;
    contracts: boolean;
    ops: boolean;
    blackops: boolean;
    events: boolean;
  };
  automateEnabled: boolean;
  automateActionHigh: IActionIdentifier;
  automateThreshHigh: number;
  automateActionLow: IActionIdentifier;
  automateThreshLow: number;
  consoleHistory: string[];
  consoleLogs: string[];

  getCurrentCity(): City;
  calculateStaminaPenalty(): number;
  canAttemptBlackOp(actionId: IActionIdentifier): BlackOpsAttempt;
  startAction(action: IActionIdentifier): void;
  upgradeSkill(skill: Skill): void;
  executeConsoleCommands(command: string): void;
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
  startActionNetscriptFn(type: string, name: string, workerScript: WorkerScript): boolean;
  getActionTimeNetscriptFn(person: IPerson, type: string, name: string): number | string;
  getActionEstimatedSuccessChanceNetscriptFn(person: IPerson, type: string, name: string): [number, number] | string;
  getActionCountRemainingNetscriptFn(type: string, name: string, workerScript: WorkerScript): number;
  getSkillLevelNetscriptFn(skillName: string, workerScript: WorkerScript): number;
  getSkillUpgradeCostNetscriptFn(skillName: string, count: number, workerScript: WorkerScript): number;
  upgradeSkillNetscriptFn(skillName: string, count: number, workerScript: WorkerScript): boolean;
  getTeamSizeNetscriptFn(type: string, name: string, workerScript: WorkerScript): number;
  setTeamSizeNetscriptFn(type: string, name: string, size: number, workerScript: WorkerScript): number;
  joinBladeburnerFactionNetscriptFn(workerScript: WorkerScript): boolean;
  getActionIdFromTypeAndName(type: string, name: string): IActionIdentifier | null;
  executeStartConsoleCommand(args: string[]): void;
  executeSkillConsoleCommand(args: string[]): void;
  executeLogConsoleCommand(args: string[]): void;
  executeHelpConsoleCommand(args: string[]): void;
  executeAutomateConsoleCommand(args: string[]): void;
  parseCommandArguments(command: string): string[];
  executeConsoleCommand(command: string): void;
  triggerMigration(sourceCityName: string): void;
  triggerPotentialMigration(sourceCityName: string, chance: number): void;
  randomEvent(): void;
  getDiplomacyEffectiveness(person: IPerson): number;
  getRecruitmentSuccessChance(person: IPerson): number;
  getRecruitmentTime(person: IPerson): number;
  resetSkillMultipliers(): void;
  updateSkillMultipliers(): void;
  completeOperation(success: boolean): void;
  getActionObject(actionId: IActionIdentifier): IAction | null;
  completeContract(success: boolean, actionIdent: IActionIdentifier): void;
  completeAction(person: IPerson, actionIdent: IActionIdentifier, isPlayer?: boolean): ITaskTracker;
  infiltrateSynthoidCommunities(): void;
  changeRank(person: IPerson, change: number): void;
  processAction(seconds: number): void;
  calculateStaminaGainPerSecond(): number;
  calculateMaxStamina(): void;
  create(): void;
  process(): void;
  getActionStats(action: IAction, person: IPerson, success: boolean): ITaskTracker;
  sleeveSupport(joining: boolean): void;
  toJSON():IReviverValue;
}
