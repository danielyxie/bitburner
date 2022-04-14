import type { WorkerScript } from "../Netscript/WorkerScript";
import type { IPlayer } from "../PersonObjects/IPlayer";

import type { GangMember } from "./GangMember";
import type { GangMemberUpgrade } from "./GangMemberUpgrade";
import type { IAscensionResult } from "./IAscensionResult";

export interface IGang {
  facName: string;
  members: GangMember[];
  wanted: number;
  respect: number;

  isHackingGang: boolean;

  respectGainRate: number;
  wantedGainRate: number;
  moneyGainRate: number;

  storedCycles: number;

  storedTerritoryAndPowerCycles: number;

  territoryClashChance: number;
  territoryWarfareEngaged: boolean;

  notifyMemberDeath: boolean;

  getPower(): number;
  getTerritory(): number;
  process(numCycles: number, player: IPlayer): void;
  processGains(numCycles: number, player: IPlayer): void;
  processTerritoryAndPowerGains(numCycles: number): void;
  processExperienceGains(numCycles: number): void;
  clash(won: boolean): void;
  canRecruitMember(): boolean;
  getRespectNeededToRecruitMember(): number;
  recruitMember(name: string): boolean;
  getWantedPenalty(): number;
  calculatePower(): number;
  killMember(member: GangMember): void;
  ascendMember(member: GangMember, workerScript?: WorkerScript): IAscensionResult;
  getDiscount(): number;
  getAllTaskNames(): string[];
  getUpgradeCost(upg: GangMemberUpgrade): number;
  toJSON(): any;
}
