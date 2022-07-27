import { IPlayer } from "../IPlayer";
import { Faction } from "../../Faction/Faction";
import { CONSTANTS } from "../../Constants";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { CalculateShareMult } from "../../NetworkShare/Share";

function mult(f: Faction): number {
  let favorMult = 1 + f.favor / 100;
  if (isNaN(favorMult)) {
    favorMult = 1;
  }
  return favorMult * BitNodeMultipliers.FactionWorkRepGain;
}

export function getHackingWorkRepGain(p: IPlayer, f: Faction): number {
  return (
    ((p.skills.hacking + p.skills.intelligence / 3) / CONSTANTS.MaxSkillLevel) *
    p.mults.faction_rep *
    p.getIntelligenceBonus(1) *
    mult(f) *
    CalculateShareMult()
  );
}

export function getFactionSecurityWorkRepGain(p: IPlayer, f: Faction): number {
  const t =
    (0.9 *
      (p.skills.strength +
        p.skills.defense +
        p.skills.dexterity +
        p.skills.agility +
        (p.skills.hacking + p.skills.intelligence) * CalculateShareMult())) /
    CONSTANTS.MaxSkillLevel /
    4.5;
  return t * p.mults.faction_rep * mult(f) * p.getIntelligenceBonus(1);
}

export function getFactionFieldWorkRepGain(p: IPlayer, f: Faction): number {
  const t =
    (0.9 *
      (p.skills.strength +
        p.skills.defense +
        p.skills.dexterity +
        p.skills.agility +
        p.skills.charisma +
        (p.skills.hacking + p.skills.intelligence) * CalculateShareMult())) /
    CONSTANTS.MaxSkillLevel /
    5.5;
  return t * p.mults.faction_rep * mult(f) * p.getIntelligenceBonus(1);
}
