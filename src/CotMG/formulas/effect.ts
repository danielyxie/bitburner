export function CalculateEffect(charge: number, power: number): number {
    return Math.pow((power/1000)+1, Math.log(charge+1)/Math.log(8))
}