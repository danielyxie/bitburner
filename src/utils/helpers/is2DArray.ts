export function isArray(arr: unknown): arr is unknown[] {
  return Array.isArray(arr);
}

// Checks whether an array is a 2D array.
// For this, a 2D array is an array which contains only other arrays.
// If one element in the array is a number or string, it is NOT a 2D array
export function is2DArray(arr: unknown): arr is unknown[][] {
  return isArray(arr) && arr.every((u) => isArray(u));
}
