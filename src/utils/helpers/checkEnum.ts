// This works for both enums and regular objects.
export function checkEnum<T extends Record<string, unknown>>(obj: T, value: unknown): value is T[keyof T] {
  return Object.values(obj).includes(value);
}
