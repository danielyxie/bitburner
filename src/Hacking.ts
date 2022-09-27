import { BitNodeMultipliers } from "./BitNode/BitNodeMultipliers";
import { Person } from "./PersonObjects/Person";
import { calculateIntelligenceBonus } from "./PersonObjects/formulas/intelligence";
import { Server } from "./Server/Server";

/**
 * Returns the chance the person has to successfully hack a server
 */
export function calculateHackingChance(server: Server, person: Person): number {
  const hackFactor = 1.75;
  const difficultyMult = (100 - server.hackDifficulty) / 100;
  const skillMult = hackFactor * person.skills.hacking;
  const skillChance = (skillMult - server.requiredHackingSkill) / skillMult;
  const chance =
    skillChance *
    difficultyMult *
    person.mults.hacking_chance *
    calculateIntelligenceBonus(person.skills.intelligence, 1);
  if (chance > 1) {
    return 1;
  }
  if (chance < 0) {
    return 0;
  }

  return chance;
}

/**
 * Returns the amount of hacking experience the person will gain upon
 * successfully hacking a server
 */
export function calculateHackingExpGain(server: Server, person: Person): number {
  const baseExpGain = 3;
  const diffFactor = 0.3;
  if (server.baseDifficulty == null) {
    server.baseDifficulty = server.hackDifficulty;
  }
  let expGain = baseExpGain;
  expGain += server.baseDifficulty * diffFactor;

  return expGain * person.mults.hacking_exp * BitNodeMultipliers.HackExpGain;
}

/**
 * Returns the percentage of money that will be stolen from a server if
 * it is successfully hacked (returns the decimal form, not the actual percent value)
 */
export function calculatePercentMoneyHacked(server: Server, person: Person): number {
  // Adjust if needed for balancing. This is the divisor for the final calculation
  const balanceFactor = 240;

  const difficultyMult = (100 - server.hackDifficulty) / 100;
  const skillMult = (person.skills.hacking - (server.requiredHackingSkill - 1)) / person.skills.hacking;
  const percentMoneyHacked =
    (difficultyMult * skillMult * person.mults.hacking_money * BitNodeMultipliers.ScriptHackMoney) / balanceFactor;
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
export function calculateHackingTime(server: Server, person: Person): number {
  const difficultyMult = server.requiredHackingSkill * server.hackDifficulty;

  const baseDiff = 500;
  const baseSkill = 50;
  const diffFactor = 2.5;
  let skillFactor = diffFactor * difficultyMult + baseDiff;
  // tslint:disable-next-line
  skillFactor /= person.skills.hacking + baseSkill;

  const hackTimeMultiplier = 5;
  const hackingTime =
    (hackTimeMultiplier * skillFactor) /
    (person.mults.hacking_speed * calculateIntelligenceBonus(person.skills.intelligence, 1));

  return hackingTime;
}

/**
 * Returns time it takes to complete a grow operation on a server, in seconds
 */
export function calculateGrowTime(server: Server, person: Person): number {
  const growTimeMultiplier = 3.2; // Relative to hacking time. 16/5 = 3.2

  return growTimeMultiplier * calculateHackingTime(server, person);
}

/**
 * Returns time it takes to complete a weaken operation on a server, in seconds
 */
export function calculateWeakenTime(server: Server, person: Person): number {
  const weakenTimeMultiplier = 4; // Relative to hacking time

  return weakenTimeMultiplier * calculateHackingTime(server, person);
}
