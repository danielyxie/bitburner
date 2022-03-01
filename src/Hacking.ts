import { BitNodeMultipliers } from "./BitNode/BitNodeMultipliers";
import { IPlayer } from "./PersonObjects/IPlayer";
import { calculateIntelligenceBonus } from "./PersonObjects/formulas/intelligence";
import { Server } from "./Server/Server";

/**
 * Returns the chance the player has to successfully hack a server
 */
export function calculateHackingChance(server: Server, player: IPlayer): number {
  const hackFactor = 1.75;
  const difficultyMult = (100 - server.hackDifficulty) / 100;
  const skillMult = hackFactor * player.hacking;
  const skillChance = (skillMult - server.requiredHackingSkill) / skillMult;
  const chance =
    skillChance * difficultyMult * player.hacking_chance_mult * calculateIntelligenceBonus(player.intelligence, 1);
  if (chance > 1) {
    return 1;
  }
  if (chance < 0) {
    return 0;
  }

  return chance;
}

/**
 * Returns the amount of hacking experience the player will gain upon
 * successfully hacking a server
 */
export function calculateHackingExpGain(server: Server, player: IPlayer): number {
  const baseExpGain = 3;
  const diffFactor = 0.3;
  if (server.baseDifficulty == null) {
    server.baseDifficulty = server.hackDifficulty;
  }
  let expGain = baseExpGain;
  expGain += server.baseDifficulty * diffFactor;

  return expGain * player.hacking_exp_mult * BitNodeMultipliers.HackExpGain;
}

/**
 * Returns the percentage of money that will be stolen from a server if
 * it is successfully hacked (returns the decimal form, not the actual percent value)
 */
export function calculatePercentMoneyHacked(server: Server, player: IPlayer, hackOverride?: number): number {
  // Adjust if needed for balancing. This is the divisor for the final calculation
  const balanceFactor = 240;
  const hackSkill = hackOverride ? hackOverride : player.hacking;

  const difficultyMult = (100 - server.hackDifficulty) / 100;
  const skillMult = (hackSkill - (server.requiredHackingSkill - 1)) / hackSkill;
  const percentMoneyHacked =
    (difficultyMult * skillMult * player.hacking_money_mult * BitNodeMultipliers.ScriptHackMoney) / balanceFactor;
  if (percentMoneyHacked < 0) {
    return 0;
  }
  if (percentMoneyHacked > 1) {
    return 1;
  }

  return percentMoneyHacked;
}

/**
 * Returns time it takes to complete a hack on a server, in seconds
 */
export function calculateHackingTime(server: Server, player: IPlayer, hackOverride?: number): number {
  const difficultyMult = server.requiredHackingSkill * server.hackDifficulty;
  const hackSkill = hackOverride ? hackOverride : player.hacking;

  const baseDiff = 500;
  const baseSkill = 50;
  const diffFactor = 2.5;
  let skillFactor = diffFactor * difficultyMult + baseDiff;
  // tslint:disable-next-line
  skillFactor /= hackSkill + baseSkill;

  const hackTimeMultiplier = 5;
  const hackingTime =
    (hackTimeMultiplier * skillFactor) /
    (player.hacking_speed_mult * calculateIntelligenceBonus(player.intelligence, 1));

  return hackingTime;
}

/**
 * Returns hack level required to have a hack operation take a given time, in milliseconds
 */
export function calculateHackLevelForTime(server: Server, player: IPlayer, ms: number): number {
  const difficultyMult = server.requiredHackingSkill * server.hackDifficulty;

  const baseDiff = 500;
  const baseSkill = 50;
  const diffFactor = 2.5;
  const hackTimeMultiplier = 5;

  const speedFactor = player.hacking_speed_mult * calculateIntelligenceBonus(player.intelligence, 1);

  const hackSkill = (diffFactor * difficultyMult + baseDiff) / (ms * speedFactor) / hackTimeMultiplier - baseSkill;

  return hackSkill;
}

/**
 * Returns time it takes to complete a grow operation on a server, in seconds
 */
export function calculateGrowTime(server: Server, player: IPlayer, hackOverride?: number): number {
  const growTimeMultiplier = 3.2; // Relative to hacking time. 16/5 = 3.2

  return growTimeMultiplier * calculateHackingTime(server, player, hackOverride);
}

/**
 * Returns hack level required to have a hack operation take a given time, in milliseconds
 */
 export function calculateGrowLevelForTime(server: Server, player: IPlayer, ms: number): number {
  const difficultyMult = server.requiredHackingSkill * server.hackDifficulty;

  const baseDiff = 500;
  const baseSkill = 50;
  const diffFactor = 2.5;
	const growTimeMultiplier = 3.2;
  const hackTimeMultiplier = 5 * growTimeMultiplier;

  const speedFactor = player.hacking_speed_mult * calculateIntelligenceBonus(player.intelligence, 1);

  const hackSkill = (diffFactor * difficultyMult + baseDiff) / (ms * speedFactor) / hackTimeMultiplier - baseSkill;

  return hackSkill;
}

/**
 * Returns time it takes to complete a weaken operation on a server, in seconds
 */
export function calculateWeakenTime(server: Server, player: IPlayer, hackOverride?: number): number {
  const weakenTimeMultiplier = 4; // Relative to hacking time

  return weakenTimeMultiplier * calculateHackingTime(server, player, hackOverride);
}

/**
 * Returns hack level required to have a hack operation take a given time, in milliseconds
 */
 export function calculateWeakenLevelForTime(server: Server, player: IPlayer, ms: number): number {
  const difficultyMult = server.requiredHackingSkill * server.hackDifficulty;

  const baseDiff = 500;
  const baseSkill = 50;
  const diffFactor = 2.5;
	const weakenTimeMultiplier = 4;
  const hackTimeMultiplier = 5 * weakenTimeMultiplier;

  const speedFactor = player.hacking_speed_mult * calculateIntelligenceBonus(player.intelligence, 1);

  const hackSkill = (diffFactor * difficultyMult + baseDiff) / (ms * speedFactor) / hackTimeMultiplier - baseSkill;

  return hackSkill;
}
