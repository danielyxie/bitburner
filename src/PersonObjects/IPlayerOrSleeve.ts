// Interface that represents either the player (PlayerObject) or
// a Sleeve. Used for functions that need to take in both.

export interface IPlayerOrSleeve {
  // Stats
  hacking: number;
  strength: number;
  defense: number;
  dexterity: number;
  agility: number;
  charisma: number;
  intelligence: number;

  // Experience
  hacking_exp: number;
  strength_exp: number;
  defense_exp: number;
  dexterity_exp: number;
  agility_exp: number;
  charisma_exp: number;

  // Multipliers
  mults: {
    crime_success: number;
  };

  getIntelligenceBonus(weight: number): number;
}
