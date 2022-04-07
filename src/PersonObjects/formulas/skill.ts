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

  let nextExperience = calculateExp(nextSkill, mult);
  if (nextExperience < 0) nextExperience = 0;

  const normalize = (value: number): number => ((value - baseExperience) * 100) / (nextExperience - baseExperience);
  let progress = nextExperience - baseExperience !== 0 ? normalize(exp) : 99.99;

  // Clamp progress: When sleeves are working out, the player gets way too much progress
  if (progress < 0) progress = 0;
  if (progress > 100) progress = 100;

  // Clamp floating point imprecisions
  let currentExperience = exp - baseExperience;
  let remainingExperience = nextExperience - exp;
  if (currentExperience < 0) currentExperience = 0;
  if (remainingExperience < 0) remainingExperience = 0;

  return {
    currentSkill,
    nextSkill,
    baseExperience,
    experience: exp,
    nextExperience,
    currentExperience,
    remainingExperience,
    progress,
  };
}

export interface ISkillProgress {
  currentSkill: number;
  nextSkill: number;
  baseExperience: number;
  experience: number;
  nextExperience: number;
  currentExperience: number;
  remainingExperience: number;
  progress: number;
}

export function getEmptySkillProgress(): ISkillProgress {
  return {
    currentSkill: 0,
    nextSkill: 0,
    baseExperience: 0,
    experience: 0,
    nextExperience: 0,
    currentExperience: 0,
    remainingExperience: 0,
    progress: 0,
  };
}
