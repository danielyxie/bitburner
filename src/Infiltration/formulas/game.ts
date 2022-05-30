import { IPlayer } from "../../PersonObjects/IPlayer";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
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
    calculateSkill(
      player.strength_exp_mult * xpMult,
      player.strength_mult * BitNodeMultipliers.StrengthLevelMultiplier,
    ) +
    calculateSkill(player.defense_exp_mult * xpMult, player.defense_mult * BitNodeMultipliers.DefenseLevelMultiplier) +
    calculateSkill(
      player.dexterity_exp_mult * xpMult,
      player.dexterity_mult * BitNodeMultipliers.DexterityLevelMultiplier,
    ) +
    calculateSkill(player.agility_exp_mult * xpMult, player.agility_mult * BitNodeMultipliers.AgilityLevelMultiplier) +
    calculateSkill(
      player.charisma_exp_mult * xpMult,
      player.charisma_mult * BitNodeMultipliers.CharismaLevelMultiplier,
    );
  return calculateRawDiff(player, total, startingSecurityLevel);
}
