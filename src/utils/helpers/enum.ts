import { getRandomInt } from "./getRandomInt";

/** Verifies that a supplied value is a member of the provided object/enum. Works for enums as well as enum-like objects (const {} as const). */
export function checkEnum<T extends object>(obj: T, value: unknown): value is T[keyof T] {
  return Object.values(obj).includes(value);
}

export function findEnumMember<T extends Record<string, string>>(obj: T, value: string): T[keyof T] | undefined {
  const lowerValue = value.toLowerCase().replace(/ /g, "");
  for (const member of Object.values(obj) as T[keyof T][]) {
    if (lowerValue.includes(member.toLowerCase().replace(/ /g, ""))) return member;
  }
}

export function getRandomMember<T extends Record<string, string>>(obj: T): T[keyof T] {
  const array = Object.values(obj);
  const index = getRandomInt(0, array.length - 1);
  return array[index] as T[keyof T];
}
