import { IPerson } from "src/PersonObjects/IPerson";
import { IPlayer } from "../PersonObjects/IPlayer";

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

interface newWorkStatsParams {
  money?: number;
  reputation?: number;
  hackExp?: number;
  strExp?: number;
  defExp?: number;
  dexExp?: number;
  agiExp?: number;
  chaExp?: number;
  intExp?: number;
}

export const newWorkStats = (params?: newWorkStatsParams): WorkStats => {
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

export const applyWorkStats = (
  player: IPlayer,
  target: IPerson,
  workStats: WorkStats,
  cycles: number,
  source: string,
): WorkStats => {
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
  player.gainMoney(gains.money, source);

  return gains;
};

export const applyWorkStatsExp = (target: IPerson, workStats: WorkStats, cycles: number): WorkStats => {
  const gains = {
    money: 0,
    reputation: 0,
    hackExp: workStats.hackExp * cycles,
    strExp: workStats.strExp * cycles,
    defExp: workStats.defExp * cycles,
    dexExp: workStats.dexExp * cycles,
    agiExp: workStats.agiExp * cycles,
    chaExp: workStats.chaExp * cycles,
    intExp: workStats.intExp * cycles,
  };
  target.gainHackingExp(gains.hackExp);
  target.gainStrengthExp(gains.strExp);
  target.gainDefenseExp(gains.defExp);
  target.gainDexterityExp(gains.dexExp);
  target.gainAgilityExp(gains.agiExp);
  target.gainCharismaExp(gains.chaExp);
  target.gainIntelligenceExp(gains.intExp);
  return gains;
};
