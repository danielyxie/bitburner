import { StanekConstants } from "../data/Constants";

export function CalculateCharge(ram: number): number {
  return ram * Math.pow(1 + Math.log2(ram) * StanekConstants.RAMBonus, 0.7);
}
