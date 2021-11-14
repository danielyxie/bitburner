export function CalculateEffect(avgCharge: number, numCharge: number, power: number, boost: number): number {
  return 1 + (Math.log(avgCharge + 1) / (Math.log(1.8) * 100)) * Math.pow((numCharge + 1) / 5, 0.07) * power * boost;
}
