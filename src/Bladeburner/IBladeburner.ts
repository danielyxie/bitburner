import { IActionIdentifier } from "./IActionIdentifier";
import { City } from "./City";
import { Skill } from "./Skill";
import { IAction } from "./IAction";
import { IPlayer } from "../PersonObjects/IPlayer";
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
  startActionNetscriptFn(
    player: IPlayer,
    type: string,
    name: string,
    workerScript: WorkerScript,
  ): boolean;
  getActionTimeNetscriptFn(
    player: IPlayer,
    type: string,
    name: string,
    workerScript: WorkerScript,
  ): number;
  getActionEstimatedSuccessChanceNetscriptFn(
    player: IPlayer,
    type: string,
    name: string,
    workerScript: WorkerScript,
  ): number[];
  getActionCountRemainingNetscriptFn(
    type: string,
    name: string,
    workerScript: WorkerScript,
  ): number;
  getSkillLevelNetscriptFn(
    skillName: string,
    workerScript: WorkerScript,
  ): number;
  getSkillUpgradeCostNetscriptFn(
    skillName: string,
    workerScript: WorkerScript,
  ): number;
  upgradeSkillNetscriptFn(
    skillName: string,
    workerScript: WorkerScript,
  ): boolean;
  getTeamSizeNetscriptFn(
    type: string,
    name: string,
    workerScript: WorkerScript,
  ): number;
  setTeamSizeNetscriptFn(
    type: string,
    name: string,
    size: number,
    workerScript: WorkerScript,
  ): number;
  joinBladeburnerFactionNetscriptFn(workerScript: WorkerScript): boolean;
  getActionIdFromTypeAndName(
    type: string,
    name: string,
  ): IActionIdentifier | null;
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
  gainActionStats(player: IPlayer, action: IAction, success: boolean): void;
  getDiplomacyEffectiveness(player: IPlayer): number;
  getRecruitmentSuccessChance(player: IPlayer): number;
  getRecruitmentTime(player: IPlayer): number;
  resetSkillMultipliers(): void;
  updateSkillMultipliers(): void;
  completeOperation(success: boolean): void;
  getActionObject(actionId: IActionIdentifier): IAction | null;
  completeContract(success: boolean): void;
  completeAction(player: IPlayer): void;
  changeRank(player: IPlayer, change: number): void;
  processAction(player: IPlayer, seconds: number): void;
  calculateStaminaGainPerSecond(player: IPlayer): number;
  calculateMaxStamina(player: IPlayer): void;
  create(): void;
  process(player: IPlayer): void;
}
