import { Player } from "../../Player";
import { calculateSkill } from "../../PersonObjects/formulas/skill";

function calculateRawDiff(stats: number, startingDifficulty: number): number {
  const difficulty = startingDifficulty - Math.pow(stats, 0.9) / 250 - Player.skills.intelligence / 1600;
  if (difficulty < 0) return 0;
  if (difficulty > 3) return 3;
  return difficulty;
}

export function calculateDifficulty(startingSecurityLevel: number): number {
  const totalStats =
    Player.skills.strength +
    Player.skills.defense +
    Player.skills.dexterity +
    Player.skills.agility +
    Player.skills.charisma;
  return calculateRawDiff(totalStats, startingSecurityLevel);
}

export function calculateReward(startingSecurityLevel: number): number {
  const xpMult = 10 * 60 * 15;
  const total =
    calculateSkill(Player.mults.strength_exp * xpMult, Player.mults.strength) +
    calculateSkill(Player.mults.defense_exp * xpMult, Player.mults.defense) +
    calculateSkill(Player.mults.agility_exp * xpMult, Player.mults.agility) +
    calculateSkill(Player.mults.dexterity_exp * xpMult, Player.mults.dexterity) +
    calculateSkill(Player.mults.charisma_exp * xpMult, Player.mults.charisma);
  return calculateRawDiff(total, startingSecurityLevel);
}
