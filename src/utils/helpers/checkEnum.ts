/** Verifies that a supplied value is a member of the provided object/enum. Works for enums as well as enum-like objects (const {} as const). */
export function checkEnum<T extends Record<string, unknown>>(obj: T, value: unknown): value is T[keyof T] {
  return Object.values(obj).includes(value);
}
