import { CONSTANTS } from "../Constants";
import { IPlayer } from "../PersonObjects/IPlayer";

export function getHospitalizationCost(p: IPlayer): number {
  if (p.money < 0) {
    return 0;
  }

  return Math.min(p.money * 0.1, (p.max_hp - p.hp) * CONSTANTS.HospitalCostPerHp);
}

export function calculateHospitalizationCost(p: IPlayer, damage: number): number {
  const oldhp = p.hp;
  p.hp -= damage;
  const cost = getHospitalizationCost(p);
  p.hp = oldhp;
  return cost;
}
