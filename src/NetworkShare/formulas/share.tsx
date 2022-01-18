export function CalculateShareMult(power: number): number {
  const x = 1 + Math.log(power) / (8 * Math.log(1000));
  if (isNaN(x) || !isFinite(x)) return 1;
  return x;
}
