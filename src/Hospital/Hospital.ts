import { Player } from "../Player";
import { CONSTANTS } from "../Constants";

export function getHospitalizationCost(): number {
  if (Player.money < 0) {
    return 0;
  }

  return Math.min(Player.money * 0.1, (Player.hp.max - Player.hp.current) * CONSTANTS.HospitalCostPerHp);
}

export function calculateHospitalizationCost(damage: number): number {
  const oldhp = Player.hp.current;
  Player.hp.current -= damage;
  const cost = getHospitalizationCost();
  Player.hp.current = oldhp;
  return cost;
}
