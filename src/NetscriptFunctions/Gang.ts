import { FactionNames } from "../Faction/data/FactionNames";
import { GangConstants } from "../Gang/data/Constants";
import { Player } from "@player";
import { Gang } from "../Gang/Gang";
import { AllGangs } from "../Gang/AllGangs";
import { GangMemberTasks } from "../Gang/GangMemberTasks";
import { GangMemberUpgrades } from "../Gang/GangMemberUpgrades";
import { GangMember } from "../Gang/GangMember";
import { GangMemberTask } from "../Gang/GangMemberTask";
import { helpers } from "../Netscript/NetscriptHelpers";

import { Gang as IGang, EquipmentStats, GangOtherInfoObject } from "../ScriptEditor/NetscriptDefinitions";
import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";

export function NetscriptGang(): InternalAPI<IGang> {
  /** Functions as an API check and also returns the gang object */
  const getGang = function (ctx: NetscriptContext): Gang {
    if (!Player.gang) throw helpers.makeRuntimeErrorMsg(ctx, "Must have joined gang", "API ACCESS");
    return Player.gang;
  };

  const getGangMember = function (ctx: NetscriptContext, name: string): GangMember {
    const gang = getGang(ctx);
    for (const member of gang.members) if (member.name === name) return member;
    throw helpers.makeRuntimeErrorMsg(ctx, `Invalid gang member: '${name}'`);
  };

  const getGangTask = function (ctx: NetscriptContext, name: string): GangMemberTask {
    const task = GangMemberTasks[name];
    if (!task) {
      throw helpers.makeRuntimeErrorMsg(ctx, `Invalid task: '${name}'`);
    }

    return task;
  };

  return {
    createGang: (ctx) => (_faction) => {
      const faction = helpers.string(ctx, "faction", _faction);
      // this list is copied from Faction/ui/Root.tsx

      if (!Player.canAccessGang() || !GangConstants.Names.includes(faction)) return false;
      if (Player.gang) return false;
      if (!Player.factions.includes(faction)) return false;

      const isHacking = faction === FactionNames.NiteSec || faction === FactionNames.TheBlackHand;
      Player.startGang(faction, isHacking);
      return true;
    },
    inGang: () => () => {
      return Player.gang ? true : false;
    },
    getMemberNames: (ctx) => () => {
      const gang = getGang(ctx);
      return gang.members.map((member) => member.name);
    },
    getGangInformation: (ctx) => () => {
      const gang = getGang(ctx);
      return {
        faction: gang.facName,
        isHacking: gang.isHackingGang,
        moneyGainRate: gang.moneyGainRate,
        power: gang.getPower(),
        respect: gang.respect,
        respectGainRate: gang.respectGainRate,
        territory: gang.getTerritory(),
        territoryClashChance: gang.territoryClashChance,
        territoryWarfareEngaged: gang.territoryWarfareEngaged,
        wantedLevel: gang.wanted,
        wantedLevelGainRate: gang.wantedGainRate,
        wantedPenalty: gang.getWantedPenalty(),
      };
    },
    getOtherGangInformation: (ctx) => () => {
      getGang(ctx);
      const cpy: Record<string, GangOtherInfoObject> = {};
      for (const gang of Object.keys(AllGangs)) {
        cpy[gang] = Object.assign({}, AllGangs[gang]);
      }

      return cpy;
    },
    getMemberInformation: (ctx) => (_memberName) => {
      const memberName = helpers.string(ctx, "memberName", _memberName);
      const gang = getGang(ctx);
      const member = getGangMember(ctx, memberName);
      return {
        name: member.name,
        task: member.task,
        earnedRespect: member.earnedRespect,
        hack: member.hack,
        str: member.str,
        def: member.def,
        dex: member.dex,
        agi: member.agi,
        cha: member.cha,

        hack_exp: member.hack_exp,
        str_exp: member.str_exp,
        def_exp: member.def_exp,
        dex_exp: member.dex_exp,
        agi_exp: member.agi_exp,
        cha_exp: member.cha_exp,

        hack_mult: member.hack_mult,
        str_mult: member.str_mult,
        def_mult: member.def_mult,
        dex_mult: member.dex_mult,
        agi_mult: member.agi_mult,
        cha_mult: member.cha_mult,

        hack_asc_mult: member.calculateAscensionMult(member.hack_asc_points),
        str_asc_mult: member.calculateAscensionMult(member.str_asc_points),
        def_asc_mult: member.calculateAscensionMult(member.def_asc_points),
        dex_asc_mult: member.calculateAscensionMult(member.dex_asc_points),
        agi_asc_mult: member.calculateAscensionMult(member.agi_asc_points),
        cha_asc_mult: member.calculateAscensionMult(member.cha_asc_points),

        hack_asc_points: member.hack_asc_points,
        str_asc_points: member.str_asc_points,
        def_asc_points: member.def_asc_points,
        dex_asc_points: member.dex_asc_points,
        agi_asc_points: member.agi_asc_points,
        cha_asc_points: member.cha_asc_points,

        upgrades: member.upgrades.slice(),
        augmentations: member.augmentations.slice(),

        respectGain: member.calculateRespectGain(gang),
        wantedLevelGain: member.calculateWantedLevelGain(gang),
        moneyGain: member.calculateMoneyGain(gang),
      };
    },
    canRecruitMember: (ctx) => () => {
      const gang = getGang(ctx);
      return gang.canRecruitMember();
    },
    recruitMember: (ctx) => (_memberName) => {
      const memberName = helpers.string(ctx, "memberName", _memberName);
      const gang = getGang(ctx);
      const recruited = gang.recruitMember(memberName);
      if (recruited) {
        ctx.workerScript.log("gang.recruitMember", () => `Successfully recruited Gang Member '${memberName}'`);
      } else {
        ctx.workerScript.log("gang.recruitMember", () => `Failed to recruit Gang Member '${memberName}'`);
      }

      return recruited;
    },
    getTaskNames: (ctx) => () => {
      const gang = getGang(ctx);
      const tasks = gang.getAllTaskNames();
      tasks.unshift("Unassigned");
      return tasks;
    },
    setMemberTask: (ctx) => (_memberName, _taskName) => {
      const memberName = helpers.string(ctx, "memberName", _memberName);
      const taskName = helpers.string(ctx, "taskName", _taskName);
      const gang = getGang(ctx);
      const member = getGangMember(ctx, memberName);
      if (!gang.getAllTaskNames().includes(taskName)) {
        ctx.workerScript.log(
          "gang.setMemberTask",
          () =>
            `Failed to assign Gang Member '${memberName}' to Invalid task '${taskName}'. '${memberName}' is now Unassigned`,
        );
        return member.assignToTask("Unassigned");
      }
      const success = member.assignToTask(taskName);
      if (success) {
        ctx.workerScript.log(
          "gang.setMemberTask",
          () => `Successfully assigned Gang Member '${memberName}' to '${taskName}' task`,
        );
      } else {
        ctx.workerScript.log(
          "gang.setMemberTask",
          () => `Failed to assign Gang Member '${memberName}' to '${taskName}' task. '${memberName}' is now Unassigned`,
        );
      }

      return success;
    },
    getTaskStats: (ctx) => (_taskName) => {
      const taskName = helpers.string(ctx, "taskName", _taskName);
      getGang(ctx);
      const task = getGangTask(ctx, taskName);
      const copy = Object.assign({}, task);
      copy.territory = Object.assign({}, task.territory);
      return copy;
    },
    getEquipmentNames: (ctx) => () => {
      getGang(ctx);
      return Object.keys(GangMemberUpgrades);
    },
    getEquipmentCost: (ctx) => (_equipName) => {
      const equipName = helpers.string(ctx, "equipName", _equipName);
      const gang = getGang(ctx);
      const upg = GangMemberUpgrades[equipName];
      if (upg === null) return Infinity;
      return gang.getUpgradeCost(upg);
    },
    getEquipmentType: (ctx) => (_equipName) => {
      const equipName = helpers.string(ctx, "equipName", _equipName);
      getGang(ctx);
      const upg = GangMemberUpgrades[equipName];
      if (upg == null) return "";
      return upg.getType();
    },
    getEquipmentStats: (ctx) => (_equipName) => {
      const equipName = helpers.string(ctx, "equipName", _equipName);
      getGang(ctx);
      const equipment = GangMemberUpgrades[equipName];
      if (!equipment) {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid equipment: ${equipName}`);
      }
      const typecheck: EquipmentStats = equipment.mults;
      return Object.assign({}, typecheck);
    },
    purchaseEquipment: (ctx) => (_memberName, _equipName) => {
      const memberName = helpers.string(ctx, "memberName", _memberName);
      const equipName = helpers.string(ctx, "equipName", _equipName);
      getGang(ctx);
      const member = getGangMember(ctx, memberName);
      const equipment = GangMemberUpgrades[equipName];
      if (!equipment) return false;
      const res = member.buyUpgrade(equipment);
      if (res) {
        ctx.workerScript.log(
          "gang.purchaseEquipment",
          () => `Purchased '${equipName}' for Gang member '${memberName}'`,
        );
      } else {
        ctx.workerScript.log(
          "gang.purchaseEquipment",
          () => `Failed to purchase '${equipName}' for Gang member '${memberName}'`,
        );
      }

      return res;
    },
    ascendMember: (ctx) => (_memberName) => {
      const memberName = helpers.string(ctx, "memberName", _memberName);
      const gang = getGang(ctx);
      const member = getGangMember(ctx, memberName);
      if (!member.canAscend()) return;
      return gang.ascendMember(member, ctx.workerScript);
    },
    getAscensionResult: (ctx) => (_memberName) => {
      const memberName = helpers.string(ctx, "memberName", _memberName);
      getGang(ctx);
      const member = getGangMember(ctx, memberName);
      if (!member.canAscend()) return;
      return {
        respect: member.earnedRespect,
        ...member.getAscensionResults(),
      };
    },
    setTerritoryWarfare: (ctx) => (_engage) => {
      const engage = !!_engage;
      const gang = getGang(ctx);
      if (engage) {
        gang.territoryWarfareEngaged = true;
        ctx.workerScript.log("gang.setTerritoryWarfare", () => "Engaging in Gang Territory Warfare");
      } else {
        gang.territoryWarfareEngaged = false;
        ctx.workerScript.log("gang.setTerritoryWarfare", () => "Disengaging in Gang Territory Warfare");
      }
    },
    getChanceToWinClash: (ctx) => (_otherGang) => {
      const otherGang = helpers.string(ctx, "otherGang", _otherGang);
      const gang = getGang(ctx);
      if (AllGangs[otherGang] == null) {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid gang: ${otherGang}`);
      }

      const playerPower = AllGangs[gang.facName].power;
      const otherPower = AllGangs[otherGang].power;

      return playerPower / (otherPower + playerPower);
    },
    getBonusTime: (ctx) => () => {
      const gang = getGang(ctx);
      return Math.round(gang.storedCycles / 5) * 1000;
    },
  };
}
