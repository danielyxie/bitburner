export function checkEnum<T extends string, TEnumValue extends string>(
  enumVariable: { [key in T]: TEnumValue },
  value: string,
): value is TEnumValue {
  return Object.values(enumVariable).includes(value);
}
