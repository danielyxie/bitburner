import { IPlayer } from "../../PersonObjects/IPlayer";
import { calculateSkill } from "../../PersonObjects/formulas/skill";

function calculateRawDiff(player: IPlayer, stats: number, startingDifficulty: number): number {
  const difficulty = startingDifficulty - Math.pow(stats, 0.9) / 250 - player.intelligence / 1600;
  if (difficulty < 0) return 0;
  if (difficulty > 3) return 3;
  return difficulty;
}

export function calculateDifficulty(player: IPlayer, startingSecurityLevel: number): number {
  const totalStats = player.strength + player.defense + player.dexterity + player.agility + player.charisma;
  return calculateRawDiff(player, totalStats, startingSecurityLevel);
}

export function calculateReward(player: IPlayer, startingSecurityLevel: number): number {
  const xpMult = 10 * 60 * 15;
  const total =
    calculateSkill(player.mults.strength_exp * xpMult, player.mults.strength) +
    calculateSkill(player.mults.defense_exp * xpMult, player.mults.defense) +
    calculateSkill(player.mults.agility_exp * xpMult, player.mults.agility) +
    calculateSkill(player.mults.dexterity_exp * xpMult, player.mults.dexterity) +
    calculateSkill(player.mults.charisma_exp * xpMult, player.mults.charisma);
  return calculateRawDiff(player, total, startingSecurityLevel);
}
