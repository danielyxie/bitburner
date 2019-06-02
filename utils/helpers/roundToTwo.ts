/**
 * Rounds a number to two decimal places.
 * @param decimal A decimal value to trim to two places.
 */
export function roundToTwo(decimal: number) {
    const leftShift: number = Math.round(parseFloat(`${decimal}e+2`));

    return +(`${leftShift}e-2`);
}
