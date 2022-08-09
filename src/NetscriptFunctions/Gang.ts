import { FactionNames } from "../Faction/data/FactionNames";
import { GangConstants } from "../Gang/data/Constants";
import { Player as player } from "../Player";
import { Gang } from "../Gang/Gang";
import { AllGangs } from "../Gang/AllGangs";
import { GangMemberTasks } from "../Gang/GangMemberTasks";
import { GangMemberUpgrades } from "../Gang/GangMemberUpgrades";
import { GangMember } from "../Gang/GangMember";
import { GangMemberTask } from "../Gang/GangMemberTask";
import { helpers } from "../Netscript/NetscriptHelpers";

import {
  Gang as IGang,
  GangGenInfo,
  GangOtherInfo,
  GangMemberInfo,
  GangMemberAscension,
  EquipmentStats,
  GangTaskStats,
  GangOtherInfoObject,
} from "../ScriptEditor/NetscriptDefinitions";
import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";

export function NetscriptGang(): InternalAPI<IGang> {
  const checkGangApiAccess = function (ctx: NetscriptContext): void {
    const gang = player.gang;
    if (gang === null) throw new Error("Must have joined gang");
    const hasAccess = gang instanceof Gang;
    if (!hasAccess) {
      throw helpers.makeRuntimeErrorMsg(ctx, `You do not currently have a Gang`);
    }
  };

  const getGangMember = function (ctx: NetscriptContext, name: string): GangMember {
    const gang = player.gang;
    if (gang === null) throw new Error("Must have joined gang");
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
    createGang:
      (ctx: NetscriptContext) =>
      (_faction: unknown): boolean => {
        const faction = helpers.string(ctx, "faction", _faction);
        // this list is copied from Faction/ui/Root.tsx

        if (!player.canAccessGang() || !GangConstants.Names.includes(faction)) return false;
        if (player.inGang()) return false;
        if (!player.factions.includes(faction)) return false;

        const isHacking = faction === FactionNames.NiteSec || faction === FactionNames.TheBlackHand;
        player.startGang(faction, isHacking);
        return true;
      },
    inGang: () => (): boolean => {
      return player.inGang();
    },
    getMemberNames: (ctx: NetscriptContext) => (): string[] => {
      checkGangApiAccess(ctx);
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      return gang.members.map((member) => member.name);
    },
    getGangInformation: (ctx: NetscriptContext) => (): GangGenInfo => {
      checkGangApiAccess(ctx);
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
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
    getOtherGangInformation: (ctx: NetscriptContext) => (): GangOtherInfo => {
      checkGangApiAccess(ctx);
      const cpy: Record<string, GangOtherInfoObject> = {};
      for (const gang of Object.keys(AllGangs)) {
        cpy[gang] = Object.assign({}, AllGangs[gang]);
      }

      return cpy;
    },
    getMemberInformation:
      (ctx: NetscriptContext) =>
      (_memberName: unknown): GangMemberInfo => {
        const memberName = helpers.string(ctx, "memberName", _memberName);
        checkGangApiAccess(ctx);
        const gang = player.gang;
        if (gang === null) throw new Error("Should not be called without Gang");
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
    canRecruitMember: (ctx: NetscriptContext) => (): boolean => {
      checkGangApiAccess(ctx);
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      return gang.canRecruitMember();
    },
    recruitMember:
      (ctx: NetscriptContext) =>
      (_memberName: unknown): boolean => {
        const memberName = helpers.string(ctx, "memberName", _memberName);
        checkGangApiAccess(ctx);
        const gang = player.gang;
        if (gang === null) throw new Error("Should not be called without Gang");
        const recruited = gang.recruitMember(memberName);
        if (recruited) {
          ctx.workerScript.log("gang.recruitMember", () => `Successfully recruited Gang Member '${memberName}'`);
        } else {
          ctx.workerScript.log("gang.recruitMember", () => `Failed to recruit Gang Member '${memberName}'`);
        }

        return recruited;
      },
    getTaskNames: (ctx: NetscriptContext) => (): string[] => {
      checkGangApiAccess(ctx);
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      const tasks = gang.getAllTaskNames();
      tasks.unshift("Unassigned");
      return tasks;
    },
    setMemberTask:
      (ctx: NetscriptContext) =>
      (_memberName: unknown, _taskName: unknown): boolean => {
        const memberName = helpers.string(ctx, "memberName", _memberName);
        const taskName = helpers.string(ctx, "taskName", _taskName);
        checkGangApiAccess(ctx);
        const member = getGangMember(ctx, memberName);
        const gang = player.gang;
        if (gang === null) throw new Error("Should not be called without Gang");
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
            () =>
              `Failed to assign Gang Member '${memberName}' to '${taskName}' task. '${memberName}' is now Unassigned`,
          );
        }

        return success;
      },
    getTaskStats:
      (ctx: NetscriptContext) =>
      (_taskName: unknown): GangTaskStats => {
        const taskName = helpers.string(ctx, "taskName", _taskName);
        checkGangApiAccess(ctx);
        const task = getGangTask(ctx, taskName);
        const copy = Object.assign({}, task);
        copy.territory = Object.assign({}, task.territory);
        return copy;
      },
    getEquipmentNames: (ctx: NetscriptContext) => (): string[] => {
      checkGangApiAccess(ctx);
      return Object.keys(GangMemberUpgrades);
    },
    getEquipmentCost:
      (ctx: NetscriptContext) =>
      (_equipName: unknown): number => {
        const equipName = helpers.string(ctx, "equipName", _equipName);
        checkGangApiAccess(ctx);
        const gang = player.gang;
        if (gang === null) throw new Error("Should not be called without Gang");
        const upg = GangMemberUpgrades[equipName];
        if (upg === null) return Infinity;
        return gang.getUpgradeCost(upg);
      },
    getEquipmentType:
      (ctx: NetscriptContext) =>
      (_equipName: unknown): string => {
        const equipName = helpers.string(ctx, "equipName", _equipName);
        checkGangApiAccess(ctx);
        const upg = GangMemberUpgrades[equipName];
        if (upg == null) return "";
        return upg.getType();
      },
    getEquipmentStats:
      (ctx: NetscriptContext) =>
      (_equipName: unknown): EquipmentStats => {
        const equipName = helpers.string(ctx, "equipName", _equipName);
        checkGangApiAccess(ctx);
        const equipment = GangMemberUpgrades[equipName];
        if (!equipment) {
          throw helpers.makeRuntimeErrorMsg(ctx, `Invalid equipment: ${equipName}`);
        }
        const typecheck: EquipmentStats = equipment.mults;
        return Object.assign({}, typecheck) as any;
      },
    purchaseEquipment:
      (ctx: NetscriptContext) =>
      (_memberName: unknown, _equipName: unknown): boolean => {
        const memberName = helpers.string(ctx, "memberName", _memberName);
        const equipName = helpers.string(ctx, "equipName", _equipName);
        checkGangApiAccess(ctx);
        const gang = player.gang;
        if (gang === null) throw new Error("Should not be called without Gang");
        const member = getGangMember(ctx, memberName);
        const equipment = GangMemberUpgrades[equipName];
        if (!equipment) return false;
        const res = member.buyUpgrade(equipment, player, gang);
        if (res) {
          ctx.workerScript.log("gang.purchaseEquipment", () => `Purchased '${equipName}' for Gang member '${memberName}'`);
        } else {
          ctx.workerScript.log(
            "gang.purchaseEquipment",
            () => `Failed to purchase '${equipName}' for Gang member '${memberName}'`,
          );
        }

        return res;
      },
    ascendMember:
      (ctx: NetscriptContext) =>
      (_memberName: unknown): GangMemberAscension | undefined => {
        const memberName = helpers.string(ctx, "memberName", _memberName);
        checkGangApiAccess(ctx);
        const gang = player.gang;
        if (gang === null) throw new Error("Should not be called without Gang");
        const member = getGangMember(ctx, memberName);
        if (!member.canAscend()) return;
        return gang.ascendMember(member, ctx.workerScript);
      },
    getAscensionResult:
      (ctx: NetscriptContext) =>
      (_memberName: unknown): GangMemberAscension | undefined => {
        const memberName = helpers.string(ctx, "memberName", _memberName);
        checkGangApiAccess(ctx);
        const gang = player.gang;
        if (gang === null) throw new Error("Should not be called without Gang");
        const member = getGangMember(ctx, memberName);
        if (!member.canAscend()) return;
        return {
          respect: member.earnedRespect,
          ...member.getAscensionResults(),
        };
      },
    setTerritoryWarfare:
      (ctx: NetscriptContext) =>
      (_engage: unknown): void => {
        const engage = !!_engage;
        checkGangApiAccess(ctx);
        const gang = player.gang;
        if (gang === null) throw new Error("Should not be called without Gang");
        if (engage) {
          gang.territoryWarfareEngaged = true;
          ctx.workerScript.log("gang.setTerritoryWarfare", () => "Engaging in Gang Territory Warfare");
        } else {
          gang.territoryWarfareEngaged = false;
          ctx.workerScript.log("gang.setTerritoryWarfare", () => "Disengaging in Gang Territory Warfare");
        }
      },
    getChanceToWinClash:
      (ctx: NetscriptContext) =>
      (_otherGang: unknown): number => {
        const otherGang = helpers.string(ctx, "otherGang", _otherGang);
        checkGangApiAccess(ctx);
        const gang = player.gang;
        if (gang === null) throw new Error("Should not be called without Gang");
        if (AllGangs[otherGang] == null) {
          throw helpers.makeRuntimeErrorMsg(ctx, `Invalid gang: ${otherGang}`);
        }

        const playerPower = AllGangs[gang.facName].power;
        const otherPower = AllGangs[otherGang].power;

        return playerPower / (otherPower + playerPower);
      },
    getBonusTime: (ctx: NetscriptContext) => (): number => {
      checkGangApiAccess(ctx);
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      return Math.round(gang.storedCycles / 5) * 1000;
    },
  };
}
