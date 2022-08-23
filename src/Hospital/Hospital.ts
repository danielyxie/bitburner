import { IPlayer } from "../PersonObjects/IPlayer";
import { CONSTANTS } from "../Constants";

export function getHospitalizationCost(p: IPlayer): number {
  if (p.money < 0) {
    return 0;
  }

  return Math.min(p.money * 0.1, (p.hp.max - p.hp.current) * CONSTANTS.HospitalCostPerHp);
}

export function calculateHospitalizationCost(p: IPlayer, damage: number): number {
  const oldhp = p.hp.current;
  p.hp.current -= damage;
  const cost = getHospitalizationCost(p);
  p.hp.current = oldhp;
  return cost;
}
