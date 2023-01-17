/**
 * Determines if the number is a power of 2
 * @param n The number to check.
 */
export function isPowerOfTwo(n: number): boolean {
  if (isNaN(n)) {
    return false;
  }

  if (n === 0) {
    return false;
  }

  // Disabiling the bitwise rule because it's honestly the most effecient way to check for this.
  // tslint:disable-next-line:no-bitwise
  return (n & (n - 1)) === 0;
}
