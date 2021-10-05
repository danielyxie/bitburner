export function CalculateCharge(ram: number, boost: number): number {
  const extraCharge = ram * Math.pow(boost, 2);
  return extraCharge;
}
