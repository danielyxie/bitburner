import { Skill } from "./Skill";
import { SkillNames } from "./data/SkillNames";
import { IMap } from "../types";

export const Skills: IMap<Skill> = {};

(function () {
  Skills[SkillNames.BladesIntuition] = new Skill({
    name: SkillNames.BladesIntuition,
    desc:
      "Each level of this skill increases your success chance " +
      "for all Contracts, Operations, and BlackOps by 3%",
    baseCost: 3,
    costInc: 2.1,
    successChanceAll: 3,
  });
  Skills[SkillNames.Cloak] = new Skill({
    name: SkillNames.Cloak,
    desc:
      "Each level of this skill increases your " +
      "success chance in stealth-related Contracts, Operations, and BlackOps by 5.5%",
    baseCost: 2,
    costInc: 1.1,
    successChanceStealth: 5.5,
  });
  Skills[SkillNames.ShortCircuit] = new Skill({
    name: SkillNames.ShortCircuit,
    desc:
      "Each level of this skill increases your success chance " +
      "in Contracts, Operations, and BlackOps that involve retirement by 5.5%",
    baseCost: 2,
    costInc: 2.1,
    successChanceKill: 5.5,
  });
  Skills[SkillNames.DigitalObserver] = new Skill({
    name: SkillNames.DigitalObserver,
    desc:
      "Each level of this skill increases your success chance in " +
      "all Operations and BlackOps by 4%",
    baseCost: 2,
    costInc: 2.1,
    successChanceOperation: 4,
  });
  Skills[SkillNames.Tracer] = new Skill({
    name: SkillNames.Tracer,
    desc:
      "Each level of this skill increases your success chance in " +
      "all Contracts by 4%",
    baseCost: 2,
    costInc: 2.1,
    successChanceContract: 4,
  });
  Skills[SkillNames.Overclock] = new Skill({
    name: SkillNames.Overclock,
    desc:
      "Each level of this skill decreases the time it takes " +
      "to attempt a Contract, Operation, and BlackOp by 1% (Max Level: 90)",
    baseCost: 3,
    costInc: 1.4,
    maxLvl: 90,
    actionTime: 1,
  });
  Skills[SkillNames.Reaper] = new Skill({
    name: SkillNames.Reaper,
    desc: "Each level of this skill increases your effective combat stats for Bladeburner actions by 2%",
    baseCost: 2,
    costInc: 2.1,
    effStr: 2,
    effDef: 2,
    effDex: 2,
    effAgi: 2,
  });
  Skills[SkillNames.EvasiveSystem] = new Skill({
    name: SkillNames.EvasiveSystem,
    desc:
      "Each level of this skill increases your effective " +
      "dexterity and agility for Bladeburner actions by 4%",
    baseCost: 2,
    costInc: 2.1,
    effDex: 4,
    effAgi: 4,
  });
  Skills[SkillNames.Datamancer] = new Skill({
    name: SkillNames.Datamancer,
    desc:
      "Each level of this skill increases your effectiveness in " +
      "synthoid population analysis and investigation by 5%. " +
      "This affects all actions that can potentially increase " +
      "the accuracy of your synthoid population/community estimates.",
    baseCost: 3,
    costInc: 1,
    successChanceEstimate: 5,
  });
  Skills[SkillNames.CybersEdge] = new Skill({
    name: SkillNames.CybersEdge,
    desc: "Each level of this skill increases your max stamina by 2%",
    baseCost: 1,
    costInc: 3,
    stamina: 2,
  });
  Skills[SkillNames.HandsOfMidas] = new Skill({
    name: SkillNames.HandsOfMidas,
    desc: "Each level of this skill increases the amount of money you receive from Contracts by 10%",
    baseCost: 2,
    costInc: 2.5,
    money: 10,
  });
  Skills[SkillNames.Hyperdrive] = new Skill({
    name: SkillNames.Hyperdrive,
    desc: "Each level of this skill increases the experience earned from Contracts, Operations, and BlackOps by 10%",
    baseCost: 1,
    costInc: 2.5,
    expGain: 10,
  });
})();
