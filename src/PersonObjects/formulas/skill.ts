export function calculateSkill(exp: number, mult = 1): number {
  return Math.max(Math.floor(mult * (32 * Math.log(exp + 534.5) - 200)), 1);
}

export function calculateExp(skill: number, mult = 1): number {
  return Math.exp((skill / mult + 200) / 32) - 534.6;
}
