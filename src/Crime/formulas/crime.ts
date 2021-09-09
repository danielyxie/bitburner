import { calculateIntelligenceBonus } from "../../PersonObjects/formulas/intelligence";
import { CONSTANTS } from "../../Constants";

export interface ICrime {
  hacking_success_weight: number;
  strength_success_weight: number;
  defense_success_weight: number;
  dexterity_success_weight: number;
  agility_success_weight: number;
  charisma_success_weight: number;
  difficulty: number;
}

export interface IPerson {
  hacking_skill: number;
  strength: number;
  defense: number;
  dexterity: number;
  agility: number;
  charisma: number;
  intelligence: number;
  crime_success_mult: number;
}

export function calculateCrimeSuccessChance(crime: ICrime, person: IPerson): number {
  let chance: number =
    crime.hacking_success_weight * person.hacking_skill +
    crime.strength_success_weight * person.strength +
    crime.defense_success_weight * person.defense +
    crime.dexterity_success_weight * person.dexterity +
    crime.agility_success_weight * person.agility +
    crime.charisma_success_weight * person.charisma +
    CONSTANTS.IntelligenceCrimeWeight * person.intelligence;
  chance /= CONSTANTS.MaxSkillLevel;
  chance /= crime.difficulty;
  chance *= person.crime_success_mult;
  chance *= calculateIntelligenceBonus(person.intelligence);

  return Math.min(chance, 1);
}
