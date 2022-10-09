import { Person } from "./Person";
import { calculateSkill } from "./formulas/skill";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { Player } from "@player";
import { ITaskTracker } from "./ITaskTracker";

export function gainHackingExp(this: Person, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into Player.gainHackingExp()");
    return;
  }
  this.exp.hacking += exp;
  if (this.exp.hacking < 0) {
    this.exp.hacking = 0;
  }

  this.skills.hacking = calculateSkill(
    this.exp.hacking,
    this.mults.hacking * BitNodeMultipliers.HackingLevelMultiplier,
  );
}

export function gainStrengthExp(this: Person, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into Player.gainStrengthExp()");
    return;
  }
  this.exp.strength += exp;
  if (this.exp.strength < 0) {
    this.exp.strength = 0;
  }

  this.skills.strength = calculateSkill(
    this.exp.strength,
    this.mults.strength * BitNodeMultipliers.StrengthLevelMultiplier,
  );
}

export function gainDefenseExp(this: Person, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into player.gainDefenseExp()");
    return;
  }
  this.exp.defense += exp;
  if (this.exp.defense < 0) {
    this.exp.defense = 0;
  }

  this.skills.defense = calculateSkill(
    this.exp.defense,
    this.mults.defense * BitNodeMultipliers.DefenseLevelMultiplier,
  );
  const ratio = this.hp.current / this.hp.max;
  this.hp.max = Math.floor(10 + this.skills.defense / 10);
  this.hp.current = Math.round(this.hp.max * ratio);
}

export function gainDexterityExp(this: Person, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into Player.gainDexterityExp()");
    return;
  }
  this.exp.dexterity += exp;
  if (this.exp.dexterity < 0) {
    this.exp.dexterity = 0;
  }

  this.skills.dexterity = calculateSkill(
    this.exp.dexterity,
    this.mults.dexterity * BitNodeMultipliers.DexterityLevelMultiplier,
  );
}

export function gainAgilityExp(this: Person, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into Player.gainAgilityExp()");
    return;
  }
  this.exp.agility += exp;
  if (this.exp.agility < 0) {
    this.exp.agility = 0;
  }

  this.skills.agility = calculateSkill(
    this.exp.agility,
    this.mults.agility * BitNodeMultipliers.AgilityLevelMultiplier,
  );
}

export function gainCharismaExp(this: Person, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERR: NaN passed into Player.gainCharismaExp()");
    return;
  }
  this.exp.charisma += exp;
  if (this.exp.charisma < 0) {
    this.exp.charisma = 0;
  }

  this.skills.charisma = calculateSkill(
    this.exp.charisma,
    this.mults.charisma * BitNodeMultipliers.CharismaLevelMultiplier,
  );
}

export function gainIntelligenceExp(this: Person, exp: number): void {
  if (isNaN(exp)) {
    console.error("ERROR: NaN passed into Player.gainIntelligenceExp()");
    return;
  }
  if (Player.sourceFileLvl(5) > 0 || this.skills.intelligence > 0 || Player.bitNodeN === 5) {
    this.exp.intelligence += exp;
    this.skills.intelligence = Math.floor(this.calculateSkill(this.exp.intelligence, 1));
  }
}
export function gainStats(this: Person, retValue: ITaskTracker): void {
  this.gainHackingExp(retValue.hack * this.mults.hacking_exp);
  this.gainStrengthExp(retValue.str * this.mults.strength_exp);
  this.gainDefenseExp(retValue.def * this.mults.defense_exp);
  this.gainDexterityExp(retValue.dex * this.mults.dexterity_exp);
  this.gainAgilityExp(retValue.agi * this.mults.agility_exp);
  this.gainCharismaExp(retValue.cha * this.mults.charisma_exp);
  this.gainIntelligenceExp(retValue.int);
}

//Given a string expression like "str" or "strength", returns the given stat
export function queryStatFromString(this: Person, str: string): number {
  const tempStr = str.toLowerCase();
  if (tempStr.includes("hack")) {
    return this.skills.hacking;
  }
  if (tempStr.includes("str")) {
    return this.skills.strength;
  }
  if (tempStr.includes("def")) {
    return this.skills.defense;
  }
  if (tempStr.includes("dex")) {
    return this.skills.dexterity;
  }
  if (tempStr.includes("agi")) {
    return this.skills.agility;
  }
  if (tempStr.includes("cha")) {
    return this.skills.charisma;
  }
  if (tempStr.includes("int")) {
    return this.skills.intelligence;
  }
  return 0;
}

export function regenerateHp(this: Person, amt: number): void {
  if (typeof amt !== "number") {
    console.warn(`Player.regenerateHp() called without a numeric argument: ${amt}`);
    return;
  }
  this.hp.current += amt;
  if (this.hp.current > this.hp.max) {
    this.hp.current = this.hp.max;
  }
}

export function updateSkillLevels(this: Person): void {
  this.skills.hacking = Math.max(
    1,
    Math.floor(this.calculateSkill(this.exp.hacking, this.mults.hacking * BitNodeMultipliers.HackingLevelMultiplier)),
  );
  this.skills.strength = Math.max(
    1,
    Math.floor(
      this.calculateSkill(this.exp.strength, this.mults.strength * BitNodeMultipliers.StrengthLevelMultiplier),
    ),
  );
  this.skills.defense = Math.max(
    1,
    Math.floor(this.calculateSkill(this.exp.defense, this.mults.defense * BitNodeMultipliers.DefenseLevelMultiplier)),
  );
  this.skills.dexterity = Math.max(
    1,
    Math.floor(
      this.calculateSkill(this.exp.dexterity, this.mults.dexterity * BitNodeMultipliers.DexterityLevelMultiplier),
    ),
  );
  this.skills.agility = Math.max(
    1,
    Math.floor(this.calculateSkill(this.exp.agility, this.mults.agility * BitNodeMultipliers.AgilityLevelMultiplier)),
  );
  this.skills.charisma = Math.max(
    1,
    Math.floor(
      this.calculateSkill(this.exp.charisma, this.mults.charisma * BitNodeMultipliers.CharismaLevelMultiplier),
    ),
  );

  const ratio: number = this.hp.current / this.hp.max;
  this.hp.max = Math.floor(10 + this.skills.defense / 10);
  this.hp.current = Math.round(this.hp.max * ratio);
}

export function hasAugmentation(this: Person, augName: string, ignoreQueued = false) {
  if (this.augmentations.some((a) => a.name === augName)) {
    return true;
  }
  if (!ignoreQueued && this.queuedAugmentations.some((a) => a.name === augName)) {
    return true;
  }
  return false;
}
