/**
 * This is a component that implements a mathematical formula used commonly throughout the
 * game. This formula is (typically) used to calculate the effect that various statistics
 * have on a game mechanic. It looks something like:
 *
 *  (stat ^ exponential factor) + (stat / linear factor)
 *
 * where the exponential factor is a number between 0 and 1 and the linear factor
 * is typically a relatively larger number.
 *
 * This formula ensures that the effects of the statistic that is being processed
 * has diminishing returns, but never loses its effectiveness as you continue
 * to raise it.
 */
export function calculateEffectWithFactors(n: number, expFac: number, linearFac: number): number {
  if (expFac <= 0 || expFac >= 1) {
    console.warn(`Exponential factor is ${expFac}. This is not an intended value for it`);
  }
  if (linearFac < 1) {
    console.warn(`Linear factor is ${linearFac}. This is not an intended value for it`);
  }

  return Math.pow(n, expFac) + n / linearFac;
}
