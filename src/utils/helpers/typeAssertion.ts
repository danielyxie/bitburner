// Various functions for asserting types.

/** Function for providing custom error message to throw for a type assertion.
 * @param v: Value to assert type of
 * @param assertFn: Typechecking function to use for asserting type of v.
 * @param msgFn: Function to use to generate an error message if an error is produced. */
export function assert<T>(
  v: unknown,
  assertFn: (v: unknown) => asserts v is T,
  msgFn: (type: string) => string,
): asserts v is T {
  try {
    assertFn(v);
  } catch (type: unknown) {
    if (typeof type !== "string") type = "unknown";
    throw msgFn(type as string);
  }
}

/** Returns the friendlyType of v. arrays are "array" and null is "null". */
export function getFriendlyType(v: unknown): string {
  return v === null ? "null" : Array.isArray(v) ? "array" : typeof v;
}

//All assertion functions used here should return the friendlyType of the input.

/** For non-objects, and for array/null, throws the friendlyType of v. */
export function objectAssert(v: unknown): asserts v is Partial<Record<string, unknown>> {
  const type = getFriendlyType(v);
  if (type !== "object") throw type;
}

/** For non-string, throws the friendlyType of v. */
export function stringAssert(v: unknown): asserts v is string {
  const type = getFriendlyType(v);
  if (type !== "string") throw type;
}

/** For non-array, throws the friendlyType of v. */
export function arrayAssert(v: unknown): asserts v is unknown[] {
  if (!Array.isArray(v)) throw getFriendlyType(v);
}
