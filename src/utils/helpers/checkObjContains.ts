// This works for both enums and regular objects.
export function checkObjContainsValue<T extends Record<string, string>>(
  obj: T,
  value: string,
): value is T[keyof T] {
  return Object.values(obj).includes(value);
}
