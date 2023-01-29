/**
 * Checks that a variable is a valid number. A valid number
 * must be a "number" type and cannot be NaN
 */
export function isValidNumber(n: number): boolean {
  return typeof n === "number" && !isNaN(n);
}
