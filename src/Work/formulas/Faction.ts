import { IPerson } from "../../PersonObjects/IPerson";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../../Constants";
import { FactionWorkType } from "../data/FactionWorkType";
import { newWorkStats, WorkStats } from "../WorkStats";

const gameCPS = 1000 / CONSTANTS._idleSpeed; // 5 cycles per second

export const FactionWorkStats: Record<FactionWorkType, WorkStats> = {
  [FactionWorkType.HACKING]: newWorkStats({ hackExp: 15 }),
  [FactionWorkType.FIELD]: newWorkStats({
    hackExp: 10,
    strExp: 10,
    defExp: 10,
    dexExp: 10,
    agiExp: 10,
    chaExp: 10,
  }),
  [FactionWorkType.SECURITY]: newWorkStats({
    hackExp: 5,
    strExp: 15,
    defExp: 15,
    dexExp: 15,
    agiExp: 15,
  }),
};

export function calculateFactionExp(person: IPerson, tpe: FactionWorkType): WorkStats {
  const baseStats = FactionWorkStats[tpe];
  return {
    money: 0,
    reputation: 0,
    hackExp: (baseStats.hackExp * person.mults.hacking_exp * BitNodeMultipliers.FactionWorkExpGain) / gameCPS,
    strExp: (baseStats.strExp * person.mults.strength_exp * BitNodeMultipliers.FactionWorkExpGain) / gameCPS,
    defExp: (baseStats.defExp * person.mults.defense_exp * BitNodeMultipliers.FactionWorkExpGain) / gameCPS,
    dexExp: (baseStats.dexExp * person.mults.dexterity_exp * BitNodeMultipliers.FactionWorkExpGain) / gameCPS,
    agiExp: (baseStats.agiExp * person.mults.agility_exp * BitNodeMultipliers.FactionWorkExpGain) / gameCPS,
    chaExp: (baseStats.chaExp * person.mults.charisma_exp * BitNodeMultipliers.FactionWorkExpGain) / gameCPS,
    intExp: 0,
  };
}
