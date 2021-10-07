export function CalculateEffect(charge: number, power: number, boost: number): number {
  return 1 + (Math.log(charge + 1) / (Math.log(3) * 100)) * power * boost;
}
