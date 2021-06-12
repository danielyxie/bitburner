export function CalculateCharge(ram: number, currentHeat: number, boost: number, cool: number): number[] {
    const heatPenalty = Math.log(1+currentHeat)/Math.log(2);
    const extraCharge = ram*Math.pow(boost, 2)/(heatPenalty*cool);
    const extraHeat = ram;
    return [extraCharge, extraHeat];
}