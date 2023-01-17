/**
 * Does a shallow compare of two arrays to determine if they are equal.
 * @param a1 The first array
 * @param a2 The second array
 */
export function compareArrays<T>(a1: T[], a2: T[]): boolean {
  if (a1.length !== a2.length) {
    return false;
  }

  for (let i = 0; i < a1.length; ++i) {
    const v1 = a1[i];
    const v2 = a2[i];
    if (Array.isArray(v1)) {
      // If the other element is not an array, then these cannot be equal
      if (!Array.isArray(v2)) {
        return false;
      }

      if (!compareArrays(v1, v2)) {
        return false;
      }
    } else if (v1 !== v2 && !(Number.isNaN(v1) && Number.isNaN(v2))) {
      // strict (in)equality considers NaN not equal to itself
      return false;
    }
  }

  return true;
}
