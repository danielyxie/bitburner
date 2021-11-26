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

  return {
    createGang: function (faction: string): boolean {
      helper.updateDynamicRam("createGang", getRamCost("gang", "createGang"));
      // this list is copied from Faction/ui/Root.tsx
      const GangNames = [
        "Slum Snakes",
        "Tetrads",
        "The Syndicate",
        "The Dark Army",
        "Speakers for the Dead",
        "NiteSec",
        "The Black Hand",
      ];
      if (!player.canAccessGang() || !GangNames.includes(faction)) return false;
      if (player.inGang()) return false;
      if (!player.factions.includes(faction)) return false;

      const isHacking = faction === "NiteSec" || faction === "The Black Hand";
      player.startGang(faction, isHacking);
      return true;
    },
    inGang: function (): boolean {
      helper.updateDynamicRam("inGang", getRamCost("gang", "inGang"));
      return player.inGang();
    },
    getMemberNames: function (): string[] {
      helper.updateDynamicRam("getMemberNames", getRamCost("gang", "getMemberNames"));
      checkGangApiAccess("getMemberNames");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      return gang.members.map((member) => member.name);
    },
    getGangInformation: function (): GangGenInfo {
      helper.updateDynamicRam("getGangInformation", getRamCost("gang", "getGangInformation"));
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
      };
    },
    getOtherGangInformation: function (): GangOtherInfo {
      helper.updateDynamicRam("getOtherGangInformation", getRamCost("gang", "getOtherGangInformation"));
      checkGangApiAccess("getOtherGangInformation");
      const cpy: any = {};
      for (const gang in AllGangs) {
        cpy[gang] = Object.assign({}, AllGangs[gang]);
      }

      return cpy;
    },
    getMemberInformation: function (name: any): GangMemberInfo {
      helper.updateDynamicRam("getMemberInformation", getRamCost("gang", "getMemberInformation"));
      checkGangApiAccess("getMemberInformation");
      const member = getGangMember("getMemberInformation", name);
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
      };
    },
    canRecruitMember: function (): boolean {
      helper.updateDynamicRam("canRecruitMember", getRamCost("gang", "canRecruitMember"));
      checkGangApiAccess("canRecruitMember");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      return gang.canRecruitMember();
    },
    recruitMember: function (name: any): boolean {
      helper.updateDynamicRam("recruitMember", getRamCost("gang", "recruitMember"));
      checkGangApiAccess("recruitMember");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      const recruited = gang.recruitMember(name);
      if (recruited) {
        workerScript.log("recruitMember", () => `Successfully recruited Gang Member '${name}'`);
      } else {
        workerScript.log("recruitMember", () => `Failed to recruit Gang Member '${name}'`);
      }

      return recruited;
    },
    getTaskNames: function (): string[] {
      helper.updateDynamicRam("getTaskNames", getRamCost("gang", "getTaskNames"));
      checkGangApiAccess("getTaskNames");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      const tasks = gang.getAllTaskNames();
      tasks.unshift("Unassigned");
      return tasks;
    },
    setMemberTask: function (memberName: any, taskName: any): boolean {
      helper.updateDynamicRam("setMemberTask", getRamCost("gang", "setMemberTask"));
      checkGangApiAccess("setMemberTask");
      const member = getGangMember("setMemberTask", memberName);
      const success = member.assignToTask(taskName);
      if (success) {
        workerScript.log(
          "setMemberTask",
          () => `Successfully assigned Gang Member '${memberName}' to '${taskName}' task`,
        );
      } else {
        workerScript.log(
          "setMemberTask",
          () => `Failed to assign Gang Member '${memberName}' to '${taskName}' task. '${memberName}' is now Unassigned`,
        );
      }

      return success;
    },
    getTaskStats: function (taskName: any): GangTaskStats {
      helper.updateDynamicRam("getTaskStats", getRamCost("gang", "getTaskStats"));
      checkGangApiAccess("getTaskStats");
      const task = getGangTask("getTaskStats", taskName);
      const copy = Object.assign({}, task);
      copy.territory = Object.assign({}, task.territory);
      return copy;
    },
    getEquipmentNames: function (): string[] {
      helper.updateDynamicRam("getEquipmentNames", getRamCost("gang", "getEquipmentNames"));
      checkGangApiAccess("getEquipmentNames");
      return Object.keys(GangMemberUpgrades);
    },
    getEquipmentCost: function (equipName: any): number {
      helper.updateDynamicRam("getEquipmentCost", getRamCost("gang", "getEquipmentCost"));
      checkGangApiAccess("getEquipmentCost");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      const upg = GangMemberUpgrades[equipName];
      if (upg === null) return Infinity;
      return gang.getUpgradeCost(upg);
    },
    getEquipmentType: function (equipName: any): string {
      helper.updateDynamicRam("getEquipmentType", getRamCost("gang", "getEquipmentType"));
      checkGangApiAccess("getEquipmentType");
      const upg = GangMemberUpgrades[equipName];
      if (upg == null) return "";
      return upg.getType();
    },
    getEquipmentStats: function (equipName: any): EquipmentStats {
      helper.updateDynamicRam("getEquipmentStats", getRamCost("gang", "getEquipmentStats"));
      checkGangApiAccess("getEquipmentStats");
      const equipment = GangMemberUpgrades[equipName];
      if (!equipment) {
        throw helper.makeRuntimeErrorMsg("getEquipmentStats", `Invalid equipment: ${equipName}`);
      }
      const typecheck: EquipmentStats = equipment.mults;
      return Object.assign({}, typecheck) as any;
    },
    purchaseEquipment: function (memberName: any, equipName: any): boolean {
      helper.updateDynamicRam("purchaseEquipment", getRamCost("gang", "purchaseEquipment"));
      checkGangApiAccess("purchaseEquipment");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      const member = getGangMember("purchaseEquipment", memberName);
      const equipment = GangMemberUpgrades[equipName];
      if (!equipment) return false;
      const res = member.buyUpgrade(equipment, player, gang);
      if (res) {
        workerScript.log("purchaseEquipment", () => `Purchased '${equipName}' for Gang member '${memberName}'`);
      } else {
        workerScript.log(
          "purchaseEquipment",
          () => `Failed to purchase '${equipName}' for Gang member '${memberName}'`,
        );
      }

      return res;
    },
    ascendMember: function (name: any): GangMemberAscension | undefined {
      helper.updateDynamicRam("ascendMember", getRamCost("gang", "ascendMember"));
      checkGangApiAccess("ascendMember");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      const member = getGangMember("ascendMember", name);
      if (!member.canAscend()) return;
      return gang.ascendMember(member, workerScript);
    },
    setTerritoryWarfare: function (engage: any): void {
      helper.updateDynamicRam("setTerritoryWarfare", getRamCost("gang", "setTerritoryWarfare"));
      checkGangApiAccess("setTerritoryWarfare");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      if (engage) {
        gang.territoryWarfareEngaged = true;
        workerScript.log("setTerritoryWarfare", () => "Engaging in Gang Territory Warfare");
      } else {
        gang.territoryWarfareEngaged = false;
        workerScript.log("setTerritoryWarfare", () => "Disengaging in Gang Territory Warfare");
      }
    },
    getChanceToWinClash: function (otherGang: any): number {
      helper.updateDynamicRam("getChanceToWinClash", getRamCost("gang", "getChanceToWinClash"));
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
      helper.updateDynamicRam("getBonusTime", getRamCost("gang", "getBonusTime"));
      checkGangApiAccess("getBonusTime");
      const gang = player.gang;
      if (gang === null) throw new Error("Should not be called without Gang");
      return Math.round(gang.storedCycles / 5);
    },
  };
}
