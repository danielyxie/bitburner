import { IPlayer } from '../IPlayer';
import { Faction } from '../../Faction/Faction';
import { CONSTANTS } from '../../Constants';
import { BitNodeMultipliers } from '../../BitNode/BitNodeMultipliers';

function mult(f: Faction): number {
	let favorMult = 1 + (f.favor / 100);
	if (isNaN(favorMult)) {favorMult = 1;}
	return favorMult * BitNodeMultipliers.FactionWorkRepGain;
}

export function getHackingWorkRepGain(p: IPlayer, f: Faction): number {
	return (p.hacking_skill + p.intelligence/3) /
		CONSTANTS.MaxSkillLevel * p.faction_rep_mult *
		p.getIntelligenceBonus(1) * mult(f);
}

export function getFactionSecurityWorkRepGain(p: IPlayer, f: Faction): number {
	const t = 0.9 * (p.hacking_skill  / CONSTANTS.MaxSkillLevel +
				   p.strength       / CONSTANTS.MaxSkillLevel +
				   p.defense        / CONSTANTS.MaxSkillLevel +
				   p.dexterity      / CONSTANTS.MaxSkillLevel +
				   p.agility        / CONSTANTS.MaxSkillLevel +
				   p.intelligence   / CONSTANTS.MaxSkillLevel) / 4.5;
	return t * p.faction_rep_mult * mult(f) * p.getIntelligenceBonus(1);
}

export function getFactionFieldWorkRepGain(p: IPlayer, f: Faction): number {
	const t = 0.9 * (p.hacking_skill  / CONSTANTS.MaxSkillLevel +
				   p.strength       / CONSTANTS.MaxSkillLevel +
				   p.defense        / CONSTANTS.MaxSkillLevel +
				   p.dexterity      / CONSTANTS.MaxSkillLevel +
				   p.agility        / CONSTANTS.MaxSkillLevel +
				   p.charisma       / CONSTANTS.MaxSkillLevel +
				   p.intelligence   / CONSTANTS.MaxSkillLevel) / 5.5;
	return t * p.faction_rep_mult * mult(f) * p.getIntelligenceBonus(1);
}
