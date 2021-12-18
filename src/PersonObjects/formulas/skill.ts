export function calculateSkill(exp: number, mult = 1): number {
  return Math.max(Math.floor(mult * (32 * Math.log(exp + 534.5) - 200)), 1);
}

export function calculateExp(skill: number, mult = 1): number {
  return Math.exp((skill / mult + 200) / 32) - 534.6;
}

export function calculateSkillProgress(exp: number, mult = 1): ISkillProgress {
  const currentSkill = calculateSkill(exp, mult);
  const nextSkill = currentSkill + 1;
  let baseExperience = calculateExp(currentSkill, mult);
  if (baseExperience < 0) baseExperience = 0;
  const nextExperience = calculateExp(nextSkill, mult)

  return {
    currentSkill,
    nextSkill,
    baseExperience,
    experience: exp,
    nextExperience,
    progress: exp / nextExperience,
  }
}

export interface ISkillProgress {
  currentSkill: number;
  nextSkill: number;
  baseExperience: number;
  experience: number;
  nextExperience: number;
  progress: number;
}

export function getEmptySkillProgress() {
  return {
    currentSkill: 0, nextSkill: 0,
    baseExperience: 0, experience: 0, nextExperience: 0,
    progress: 0,
  };
}
