export function calculateIntelligenceBonus(intelligence: number, weight = 1): number {
    return 1+(weight*Math.pow(intelligence, 0.8)/600);
}