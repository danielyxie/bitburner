import { FactionNames } from "../Faction/data/FactionNames";
import { GangConstants } from "../Gang/data/Constants";
import { INetscriptHelper } from "./INetscriptHelper";
import { IPlayer } from "../PersonObjects/IPlayer";
import { getRamCost } from "../Netscript/RamCostGenerator";
import { Gang } from "../Gang/Gang";
import { AllGangs } from "../Gang/AllGangs";
import { GangMemberTasks } from "../Gang/GangMemberTasks";
import { GangMemberUpgrades } from "../Gang/GangMemberUpgrades";
import { WorkerScript } from "../Netscript/WorkerScript";
import { GangMember } from "../Gang/GangMember";
import { GangMemberTask } from "../Gang/GangMemberTask";

import {
  Gang as IGang,
  GangGenInfo,
  GangOtherInfo,
  GangMemberInfo,
  GangMemberAscension,
  EquipmentStats,
  GangTaskStats,
} from "../ScriptEditor/NetscriptDefinitions";

export function NetscriptGang(player: IPlayer, workerScript: WorkerScript, helper: INetscriptHelper): IGang {
  const checkGangApiAccess = function (func: string): void {
    const gang = player.gang;
    if (gang === null) throw new Error("Must have joined gang");
    const hasAccess = gang instanceof Gang;
    if (!hasAccess) {
      throw helper.makeRuntimeErrorMsg(`gang.${func}`, `You do not currently have a Gang`);
    }
  };

  const getGangMember = function (func: string, name: string): GangMember {
    const gang = player.gang;
    if (gang === null) throw new Error("Must have joined gang");
    for (const member of gang.members) if (member.name === name) return member;
    throw helper.makeRuntimeErrorMsg(`gang.${func}`, `Invalid gang member: '${name}'`);
  };

  const getGangTask = function (func: string, name: string): GangMemberTask {
    const task = GangMemberTasks[name];
    if (!task) {
      throw helper.makeRuntimeErrorMsg(`gang.${func}`, `Invalid task: '${name}'`);
    }

    return task;
  };

  const updateRam = (funcName: string): void => helper.updateDynamicRam(funcName, getRamCost(player, "gang", funcName));

  return {
    createGang: function (_faction: unknown): boolean {
      updateRam("createGang");
      const faction = helper.string("createGang", "faction", _faction);
      // this list is copied from Faction/ui/Root.tsx

      if (!player.canAccessGang() || !GangConstants.Names.includes(faction)) return false;
      if (player.inGang()) return false;
      if (!player.factions.includes(faction)) return false;

      const isHacking = faction === FactionNames.NiteSec || faction === FactionNames.TheBlackHand;
      player.startGang(faction, isHacking);
      return true;
    },
    inGang: function (): boolean {
      updateRam("inGang");
      return player.inGang();
    },
    getMemberNames: function (): string[] {
      updateRam("getMemberNames");
      checkGangApiAccess("getMemberNames");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      return gang.members.map((member) => member.name);
    },
    getGangInformation: function (): GangGenInfo {
      updateRam("getGangInformation");
      checkGangApiAccess("getGangInformation");
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
    getOtherGangInformation: function (): GangOtherInfo {
      updateRam("getOtherGangInformation");
      checkGangApiAccess("getOtherGangInformation");
      const cpy: any = {};
      for (const gang of Object.keys(AllGangs)) {
        cpy[gang] = Object.assign({}, AllGangs[gang]);
      }

      return cpy;
    },
    getMemberInformation: function (_memberName: unknown): GangMemberInfo {
      updateRam("getMemberInformation");
      const memberName = helper.string("getMemberInformation", "memberName", _memberName);
      checkGangApiAccess("getMemberInformation");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      const member = getGangMember("getMemberInformation", memberName);
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
    canRecruitMember: function (): boolean {
      updateRam("canRecruitMember");
      checkGangApiAccess("canRecruitMember");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      return gang.canRecruitMember();
    },
    recruitMember: function (_memberName: unknown): boolean {
      updateRam("recruitMember");
      const memberName = helper.string("recruitMember", "memberName", _memberName);
      checkGangApiAccess("recruitMember");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      const recruited = gang.recruitMember(memberName);
      if (recruited) {
        workerScript.log("gang.recruitMember", () => `Successfully recruited Gang Member '${memberName}'`);
      } else {
        workerScript.log("gang.recruitMember", () => `Failed to recruit Gang Member '${memberName}'`);
      }

      return recruited;
    },
    getTaskNames: function (): string[] {
      updateRam("getTaskNames");
      checkGangApiAccess("getTaskNames");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      const tasks = gang.getAllTaskNames();
      tasks.unshift("Unassigned");
      return tasks;
    },
    setMemberTask: function (_memberName: unknown, _taskName: unknown): boolean {
      updateRam("setMemberTask");
      const memberName = helper.string("setMemberTask", "memberName", _memberName);
      const taskName = helper.string("setMemberTask", "taskName", _taskName);
      checkGangApiAccess("setMemberTask");
      const member = getGangMember("setMemberTask", memberName);
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      if (!gang.getAllTaskNames().includes(taskName)) {
        workerScript.log(
          "gang.setMemberTask",
          () =>
            `Failed to assign Gang Member '${memberName}' to Invalid task '${taskName}'. '${memberName}' is now Unassigned`,
        );
        return member.assignToTask("Unassigned");
      }
      const success = member.assignToTask(taskName);
      if (success) {
        workerScript.log(
          "gang.setMemberTask",
          () => `Successfully assigned Gang Member '${memberName}' to '${taskName}' task`,
        );
      } else {
        workerScript.log(
          "gang.setMemberTask",
          () => `Failed to assign Gang Member '${memberName}' to '${taskName}' task. '${memberName}' is now Unassigned`,
        );
      }

      return success;
    },
    getTaskStats: function (_taskName: unknown): GangTaskStats {
      updateRam("getTaskStats");
      const taskName = helper.string("getTaskStats", "taskName", _taskName);
      checkGangApiAccess("getTaskStats");
      const task = getGangTask("getTaskStats", taskName);
      const copy = Object.assign({}, task);
      copy.territory = Object.assign({}, task.territory);
      return copy;
    },
    getEquipmentNames: function (): string[] {
      updateRam("getEquipmentNames");
      checkGangApiAccess("getEquipmentNames");
      return Object.keys(GangMemberUpgrades);
    },
    getEquipmentCost: function (_equipName: any): number {
      updateRam("getEquipmentCost");
      const equipName = helper.string("getEquipmentCost", "equipName", _equipName);
      checkGangApiAccess("getEquipmentCost");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      const upg = GangMemberUpgrades[equipName];
      if (upg === null) return Infinity;
      return gang.getUpgradeCost(upg);
    },
    getEquipmentType: function (_equipName: unknown): string {
      updateRam("getEquipmentType");
      const equipName = helper.string("getEquipmentType", "equipName", _equipName);
      checkGangApiAccess("getEquipmentType");
      const upg = GangMemberUpgrades[equipName];
      if (upg == null) return "";
      return upg.getType();
    },
    getEquipmentStats: function (_equipName: unknown): EquipmentStats {
      updateRam("getEquipmentStats");
      const equipName = helper.string("getEquipmentStats", "equipName", _equipName);
      checkGangApiAccess("getEquipmentStats");
      const equipment = GangMemberUpgrades[equipName];
      if (!equipment) {
        throw helper.makeRuntimeErrorMsg("getEquipmentStats", `Invalid equipment: ${equipName}`);
      }
      const typecheck: EquipmentStats = equipment.mults;
      return Object.assign({}, typecheck) as any;
    },
    purchaseEquipment: function (_memberName: unknown, _equipName: unknown): boolean {
      updateRam("purchaseEquipment");
      const memberName = helper.string("purchaseEquipment", "memberName", _memberName);
      const equipName = helper.string("purchaseEquipment", "equipName", _equipName);
      checkGangApiAccess("purchaseEquipment");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      const member = getGangMember("purchaseEquipment", memberName);
      const equipment = GangMemberUpgrades[equipName];
      if (!equipment) return false;
      const res = member.buyUpgrade(equipment, player, gang);
      if (res) {
        workerScript.log("gang.purchaseEquipment", () => `Purchased '${equipName}' for Gang member '${memberName}'`);
      } else {
        workerScript.log(
          "gang.purchaseEquipment",
          () => `Failed to purchase '${equipName}' for Gang member '${memberName}'`,
        );
      }

      return res;
    },
    ascendMember: function (_memberName: unknown): GangMemberAscension | undefined {
      updateRam("ascendMember");
      const memberName = helper.string("ascendMember", "memberName", _memberName);
      checkGangApiAccess("ascendMember");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      const member = getGangMember("ascendMember", memberName);
      if (!member.canAscend()) return;
      return gang.ascendMember(member, workerScript);
    },
    getAscensionResult: function (_memberName: unknown): GangMemberAscension | undefined {
      updateRam("getAscensionResult");
      const memberName = helper.string("getAscensionResult", "memberName", _memberName);
      checkGangApiAccess("getAscensionResult");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      const member = getGangMember("getAscensionResult", memberName);
      if (!member.canAscend()) return;
      return {
        respect: member.earnedRespect,
        ...member.getAscensionResults(),
      };
    },
    setTerritoryWarfare: function (_engage: unknown): void {
      updateRam("setTerritoryWarfare");
      const engage = helper.boolean(_engage);
      checkGangApiAccess("setTerritoryWarfare");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      if (engage) {
        gang.territoryWarfareEngaged = true;
        workerScript.log("gang.setTerritoryWarfare", () => "Engaging in Gang Territory Warfare");
      } else {
        gang.territoryWarfareEngaged = false;
        workerScript.log("gang.setTerritoryWarfare", () => "Disengaging in Gang Territory Warfare");
      }
    },
    getChanceToWinClash: function (_otherGang: unknown): number {
      updateRam("getChanceToWinClash");
      const otherGang = helper.string("getChanceToWinClash", "otherGang", _otherGang);
      checkGangApiAccess("getChanceToWinClash");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      if (AllGangs[otherGang] == null) {
        throw helper.makeRuntimeErrorMsg(`gang.getChanceToWinClash`, `Invalid gang: ${otherGang}`);
      }

      const playerPower = AllGangs[gang.facName].power;
      const otherPower = AllGangs[otherGang].power;

      return playerPower / (otherPower + playerPower);
    },
    getBonusTime: function (): number {
      updateRam("getBonusTime");
      checkGangApiAccess("getBonusTime");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      return Math.round(gang.storedCycles / 5);
    },
  };
}
