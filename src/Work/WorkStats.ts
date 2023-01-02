import { Person } from "src/PersonObjects/Person";
import { Player } from "@player";
import { Multipliers } from "../PersonObjects/Multipliers";

export interface WorkStats {
  money: number;
  reputation: number;
  hackExp: number;
  strExp: number;
  defExp: number;
  dexExp: number;
  agiExp: number;
  chaExp: number;
  intExp: number;
}

export const newWorkStats = (params?: Partial<WorkStats>): WorkStats => {
  return {
    money: params?.money ?? 0,
    reputation: params?.reputation ?? 0,
    hackExp: params?.hackExp ?? 0,
    strExp: params?.strExp ?? 0,
    defExp: params?.defExp ?? 0,
    dexExp: params?.dexExp ?? 0,
    agiExp: params?.agiExp ?? 0,
    chaExp: params?.chaExp ?? 0,
    intExp: params?.intExp ?? 0,
  };
};

/** Add two workStats objects */
export const sumWorkStats = (w0: WorkStats, w1: WorkStats): WorkStats => {
  return {
    money: w0.money + w1.money,
    reputation: w0.reputation + w1.reputation,
    hackExp: w0.hackExp + w1.hackExp,
    strExp: w0.strExp + w1.strExp,
    defExp: w0.defExp + w1.defExp,
    dexExp: w0.dexExp + w1.dexExp,
    agiExp: w0.agiExp + w1.agiExp,
    chaExp: w0.chaExp + w1.chaExp,
    intExp: w0.intExp + w1.intExp,
  };
};

/** Scale all stats on a WorkStats object by a number. Money scaling optional but defaults to true. */
export const scaleWorkStats = (w: WorkStats, n: number, scaleMoney = true): WorkStats => {
  const m = scaleMoney ? n : 1;
  return {
    money: w.money * m,
    reputation: w.reputation * n,
    hackExp: w.hackExp * n,
    strExp: w.strExp * n,
    defExp: w.defExp * n,
    dexExp: w.dexExp * n,
    agiExp: w.agiExp * n,
    chaExp: w.chaExp * n,
    intExp: w.intExp * n,
  };
};

export const applyWorkStats = (target: Person, workStats: WorkStats, cycles: number, source: string): WorkStats => {
  const expStats = applyWorkStatsExp(target, workStats, cycles);
  const gains = {
    money: workStats.money * cycles,
    reputation: 0,
    hackExp: expStats.hackExp,
    strExp: expStats.strExp,
    defExp: expStats.defExp,
    dexExp: expStats.dexExp,
    agiExp: expStats.agiExp,
    chaExp: expStats.chaExp,
    intExp: expStats.intExp,
  };
  Player.gainMoney(gains.money, source);

  return gains;
};

export const applyWorkStatsExp = (target: Person, workStats: WorkStats, mult = 1): WorkStats => {
  const gains = scaleWorkStats(workStats, mult, false);
  gains.money = 0;
  gains.reputation = 0;
  target.gainHackingExp(gains.hackExp);
  target.gainStrengthExp(gains.strExp);
  target.gainDefenseExp(gains.defExp);
  target.gainDexterityExp(gains.dexExp);
  target.gainAgilityExp(gains.agiExp);
  target.gainCharismaExp(gains.chaExp);
  target.gainIntelligenceExp(gains.intExp);
  return gains;
};

/** Calculate the application of a person's multipliers to a WorkStats object */
export function multWorkStats(workStats: Partial<WorkStats>, mults: Multipliers, moneyMult = 1, repMult = 1) {
  return {
    money: (workStats.money ?? 0) * moneyMult,
    reputation: (workStats.reputation ?? 0) * repMult,
    hackExp: (workStats.hackExp ?? 0) * mults.hacking_exp,
    strExp: (workStats.strExp ?? 0) * mults.strength_exp,
    defExp: (workStats.defExp ?? 0) * mults.defense_exp,
    dexExp: (workStats.dexExp ?? 0) * mults.dexterity_exp,
    agiExp: (workStats.agiExp ?? 0) * mults.agility_exp,
    chaExp: (workStats.chaExp ?? 0) * mults.charisma_exp,
    intExp: workStats.intExp ?? 0,
  };
}
