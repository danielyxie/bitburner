import { CONSTANTS } from "../Constants";
import { IPlayer } from "../PersonObjects/IPlayer"

export function getHospitalizationCost(p: IPlayer): number {
	let money;
	if (typeof p.money === 'number') {
		money = p.money;
	} else {
		money = p.money.toNumber();
	}

	if (money < 0) {
		return 0;
	}

	return Math.min(money*0.1, (p.max_hp - p.hp) * CONSTANTS.HospitalCostPerHp);
}

export function calculateHospitalizationCost(p: IPlayer, damage: number): number {
	const oldhp = p.hp;
	p.hp -= damage
	if (p.hp < 0) p.hp = 0;
	const cost = getHospitalizationCost(p);
	p.hp = oldhp;
	return cost;
}