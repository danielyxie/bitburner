import { CONSTANTS } from "../Constants";
import { IPerson } from "../PersonObjects/IPerson";

export function getHospitalizationCost(p: IPerson): number {
  if (p.money < 0) {
    return 0;
  }

  return Math.min(p.money * 0.1, (p.max_hp - p.hp) * CONSTANTS.HospitalCostPerHp);
}

export function calculateHospitalizationCost(p: IPerson, damage: number): number {
  const oldhp = p.hp;
  p.hp -= damage;
  const cost = getHospitalizationCost(p);
  p.hp = oldhp;
  return cost;
}
