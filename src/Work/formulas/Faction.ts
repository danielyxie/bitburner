import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
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

export function calculateFactionExp(player: IPlayer, tpe: FactionWorkType): WorkStats {
  const baseStats = FactionWorkStats[tpe];
  return {
    money: 0,
    hackExp: (baseStats.hackExp * player.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain) / gameCPS,
    strExp: (baseStats.strExp * player.strength_exp_mult * BitNodeMultipliers.FactionWorkExpGain) / gameCPS,
    defExp: (baseStats.defExp * player.defense_exp_mult * BitNodeMultipliers.FactionWorkExpGain) / gameCPS,
    dexExp: (baseStats.dexExp * player.dexterity_exp_mult * BitNodeMultipliers.FactionWorkExpGain) / gameCPS,
    agiExp: (baseStats.agiExp * player.agility_exp_mult * BitNodeMultipliers.FactionWorkExpGain) / gameCPS,
    chaExp: (baseStats.chaExp * player.charisma_exp_mult * BitNodeMultipliers.FactionWorkExpGain) / gameCPS,
    intExp: 0,
  };
}
