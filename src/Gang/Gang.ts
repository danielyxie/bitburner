/**
 * TODO
 * Add police clashes
 * balance point to keep them from running out of control
 */

import { Faction } from "../Faction/Faction";
import { Factions } from "../Faction/Factions";

import { dialogBoxCreate } from "../ui/React/DialogBox";
import { Reviver, Generic_toJSON, Generic_fromJSON } from "../utils/JSONReviver";

import { exceptionAlert } from "../utils/helpers/exceptionAlert";
import { getRandomInt } from "../utils/helpers/getRandomInt";

import { GangMemberUpgrade } from "./GangMemberUpgrade";
import { GangConstants } from "./data/Constants";
import { CONSTANTS } from "../Constants";
import { GangMemberTasks } from "./GangMemberTasks";
import { IAscensionResult } from "./IAscensionResult";

import { AllGangs } from "./AllGangs";
import { GangMember } from "./GangMember";

import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { PowerMultiplier } from "./data/power";

export class Gang {
  facName: string;
  members: GangMember[];
  wanted: number;
  respect: number;

  isHackingGang: boolean;

  respectGainRate: number;
  wantedGainRate: number;
  moneyGainRate: number;

  storedCycles: number;

  storedTerritoryAndPowerCycles: number;

  territoryClashChance: number;
  territoryWarfareEngaged: boolean;

  notifyMemberDeath: boolean;

  constructor(facName = "", hacking = false) {
    this.facName = facName;
    this.members = [];
    this.wanted = 1;
    this.respect = 1;

    this.isHackingGang = hacking;

    this.respectGainRate = 0;
    this.wantedGainRate = 0;
    this.moneyGainRate = 0;

    // When processing gains, this stores the number of cycles until some
    // limit is reached, and then calculates and applies the gains only at that limit
    this.storedCycles = 0;

    // Separate variable to keep track of cycles for Territry + Power gang, which
    // happens on a slower "clock" than normal processing
    this.storedTerritoryAndPowerCycles = 0;

    this.territoryClashChance = 0;
    this.territoryWarfareEngaged = false;

    this.notifyMemberDeath = true;
  }

  getPower(): number {
    return AllGangs[this.facName].power;
  }

  getTerritory(): number {
    return AllGangs[this.facName].territory;
  }

  process(numCycles = 1, player: IPlayer): void {
    const CyclesPerSecond = 1000 / CONSTANTS._idleSpeed;

    if (isNaN(numCycles)) {
      console.error(`NaN passed into Gang.process(): ${numCycles}`);
    }
    this.storedCycles += numCycles;

    // Only process if there are at least 2 seconds, and at most 5 seconds
    if (this.storedCycles < 2 * CyclesPerSecond) return;
    const cycles = Math.min(this.storedCycles, 5 * CyclesPerSecond);

    try {
      this.processGains(cycles, player);
      this.processExperienceGains(cycles);
      this.processTerritoryAndPowerGains(cycles);
      this.storedCycles -= cycles;
    } catch (e: any) {
      console.error(`Exception caught when processing Gang: ${e}`);
    }
  }

  processGains(numCycles = 1, player: IPlayer): void {
    // Get gains per cycle
    let moneyGains = 0;
    let respectGains = 0;
    let wantedLevelGains = 0;
    let justice = 0;
    for (let i = 0; i < this.members.length; ++i) {
      respectGains += this.members[i].calculateRespectGain(this);
      moneyGains += this.members[i].calculateMoneyGain(this);
      const wantedLevelGain = this.members[i].calculateWantedLevelGain(this);
      wantedLevelGains += wantedLevelGain;
      if (this.members[i].getTask().baseWanted < 0) justice++; // this member is lowering wanted.
    }
    this.respectGainRate = respectGains;
    this.wantedGainRate = wantedLevelGains;
    this.moneyGainRate = moneyGains;
    const gain = respectGains * numCycles;
    this.respect += gain;
    // Faction reputation gains is respect gain divided by some constant
    const fac = Factions[this.facName];
    if (!(fac instanceof Faction)) {
      dialogBoxCreate(
        "ERROR: Could not get Faction associates with your gang. This is a bug, please report to game dev",
      );
      throw new Error("Could not find the faction associated with this gang.");
    }
    const favorMult = 1 + fac.favor / 100;

    fac.playerReputation += (player.faction_rep_mult * gain * favorMult) / GangConstants.GangRespectToReputationRatio;

    // Keep track of respect gained per member
    for (let i = 0; i < this.members.length; ++i) {
      this.members[i].recordEarnedRespect(numCycles, this);
    }
    if (!(this.wanted === 1 && wantedLevelGains < 0)) {
      const oldWanted = this.wanted;
      let newWanted = oldWanted + wantedLevelGains * numCycles;
      newWanted = newWanted * (1 - justice * 0.001); // safeguard
      // Prevent overflow
      if (wantedLevelGains <= 0 && newWanted > oldWanted) newWanted = 1;

      this.wanted = newWanted;
      if (this.wanted < 1) this.wanted = 1;
    }
    player.gainMoney(moneyGains * numCycles, "gang");
  }

  processTerritoryAndPowerGains(numCycles = 1): void {
    this.storedTerritoryAndPowerCycles += numCycles;
    if (this.storedTerritoryAndPowerCycles < GangConstants.CyclesPerTerritoryAndPowerUpdate) return;
    this.storedTerritoryAndPowerCycles -= GangConstants.CyclesPerTerritoryAndPowerUpdate;

    // Process power first
    const gangName = this.facName;
    for (const name in AllGangs) {
      if (AllGangs.hasOwnProperty(name)) {
        if (name == gangName) {
          AllGangs[name].power += this.calculatePower();
        } else {
          // All NPC gangs get random power gains
          const gainRoll = Math.random();
          if (gainRoll < 0.5) {
            // Multiplicative gain (50% chance)
            // This is capped per cycle, to prevent it from getting out of control
            const multiplicativeGain = AllGangs[name].power * 0.005;
            AllGangs[name].power += Math.min(0.85, multiplicativeGain);
          } else {
            // Additive gain (50% chance)
            const powerMult = PowerMultiplier[name];
            if (powerMult === undefined) throw new Error("Should not be undefined");
            const additiveGain = 0.75 * gainRoll * AllGangs[name].territory * powerMult;
            AllGangs[name].power += additiveGain;
          }
        }
      }
    }

    // Determine if territory should be processed
    if (this.territoryWarfareEngaged) {
      this.territoryClashChance = 1;
    } else if (this.territoryClashChance > 0) {
      // Engagement turned off, but still a positive clash chance. So there's
      // still a chance of clashing but it slowly goes down over time
      this.territoryClashChance = Math.max(0, this.territoryClashChance - 0.01);
    }

    // Then process territory
    const gangs = GangConstants.Names.filter((g) => AllGangs[g].territory > 0);
    if (gangs.length > 1) {
      for (let i = 0; i < gangs.length; ++i) {
        const others = gangs.filter((e) => {
          return e !== gangs[i];
        });
        const other = getRandomInt(0, others.length - 1);

        const thisGang = gangs[i];
        const otherGang = others[other];

        // If either of the gangs involved in this clash is the player, determine
        // whether to skip or process it using the clash chance
        if (thisGang === gangName || otherGang === gangName) {
          if (!(Math.random() < this.territoryClashChance)) continue;
        }

        const thisPwr = AllGangs[thisGang].power;
        const otherPwr = AllGangs[otherGang].power;
        const thisChance = thisPwr / (thisPwr + otherPwr);

        function calculateTerritoryGain(winGang: string, loseGang: string): number {
          const powerBonus = Math.max(
            1,
            1 + Math.log(AllGangs[winGang].power / AllGangs[loseGang].power) / Math.log(50),
          );
          const gains = Math.min(AllGangs[loseGang].territory, powerBonus * 0.0001 * (Math.random() + 0.5));
          return gains;
        }

        if (Math.random() < thisChance) {
          if (AllGangs[otherGang].territory <= 0) return;
          const territoryGain = calculateTerritoryGain(thisGang, otherGang);
          AllGangs[thisGang].territory += territoryGain;
          if (AllGangs[thisGang].territory > 1) AllGangs[thisGang].territory = 1;
          AllGangs[otherGang].territory -= territoryGain;
          if (AllGangs[thisGang].territory < 0) AllGangs[thisGang].territory = 0;
          if (thisGang === gangName) {
            this.clash(true); // Player won
            AllGangs[otherGang].power *= 1 / 1.01;
          } else if (otherGang === gangName) {
            this.clash(false); // Player lost
          } else {
            AllGangs[otherGang].power *= 1 / 1.01;
          }
        } else {
          if (AllGangs[thisGang].territory <= 0) return;
          const territoryGain = calculateTerritoryGain(otherGang, thisGang);
          AllGangs[thisGang].territory -= territoryGain;
          if (AllGangs[otherGang].territory < 0) AllGangs[otherGang].territory = 0;
          AllGangs[otherGang].territory += territoryGain;
          if (AllGangs[otherGang].territory > 1) AllGangs[otherGang].territory = 1;
          if (thisGang === gangName) {
            this.clash(false); // Player lost
          } else if (otherGang === gangName) {
            this.clash(true); // Player won
            AllGangs[thisGang].power *= 1 / 1.01;
          } else {
            AllGangs[thisGang].power *= 1 / 1.01;
          }
        }
      }
    }
  }

  processExperienceGains(numCycles = 1): void {
    for (let i = 0; i < this.members.length; ++i) {
      this.members[i].gainExperience(numCycles);
      this.members[i].updateSkillLevels();
    }
  }

  clash(won = false): void {
    // Determine if a gang member should die
    let baseDeathChance = 0.01;
    if (won) baseDeathChance /= 2;
    // If the clash was lost, the player loses a small percentage of power
    else AllGangs[this.facName].power *= 1 / 1.008;

    // Deaths can only occur during X% of clashes
    if (Math.random() < 0.65) return;

    for (let i = this.members.length - 1; i >= 0; --i) {
      const member = this.members[i];

      // Only members assigned to Territory Warfare can die
      if (member.task !== "Territory Warfare") continue;

      // Chance to die is decreased based on defense
      const modifiedDeathChance = baseDeathChance / Math.pow(member.def, 0.6);
      if (Math.random() < modifiedDeathChance) {
        this.killMember(member);
      }
    }
  }

  canRecruitMember(): boolean {
    if (this.members.length >= GangConstants.MaximumGangMembers) return false;
    return this.respect >= this.getRespectNeededToRecruitMember();
  }

  getRespectNeededToRecruitMember(): number {
    // First N gang members are free (can be recruited at 0 respect)
    const numFreeMembers = 3;
    if (this.members.length < numFreeMembers) return 0;

    const i = this.members.length - (numFreeMembers - 1);
    return Math.pow(5, i);
  }

  recruitMember(name: string): boolean {
    name = String(name);
    if (name === "" || !this.canRecruitMember()) return false;

    // Check for already-existing names
    const sameNames = this.members.filter((m) => m.name === name);
    if (sameNames.length >= 1) return false;

    const member = new GangMember(name);
    this.members.push(member);
    return true;
  }

  // Money and Respect gains multiplied by this number (< 1)
  getWantedPenalty(): number {
    return this.respect / (this.respect + this.wanted);
  }

  //Calculates power GAIN, which is added onto the Gang's existing power
  calculatePower(): number {
    let memberTotal = 0;
    for (let i = 0; i < this.members.length; ++i) {
      if (!GangMemberTasks.hasOwnProperty(this.members[i].task) || this.members[i].task !== "Territory Warfare")
        continue;
      memberTotal += this.members[i].calculatePower();
    }
    return 0.015 * Math.max(0.002, this.getTerritory()) * memberTotal;
  }

  killMember(member: GangMember): void {
    // Player loses a percentage of total respect, plus whatever respect that member has earned
    const totalRespect = this.respect;
    const lostRespect = 0.05 * totalRespect + member.earnedRespect;
    this.respect = Math.max(0, totalRespect - lostRespect);

    for (let i = 0; i < this.members.length; ++i) {
      if (member.name === this.members[i].name) {
        this.members.splice(i, 1);
        break;
      }
    }

    // Notify of death
    if (this.notifyMemberDeath) {
      dialogBoxCreate(`${member.name} was killed in a gang clash! You lost ${lostRespect} respect`);
    }
  }

  ascendMember(member: GangMember, workerScript?: WorkerScript): IAscensionResult {
    try {
      const res = member.ascend();
      this.respect = Math.max(1, this.respect - res.respect);
      if (workerScript) {
        workerScript.log("gang.ascend", () => `Ascended Gang member ${member.name}`);
      }
      return res;
    } catch (e: any) {
      if (workerScript == null) {
        exceptionAlert(e);
      }
      throw e; // Re-throw, will be caught in the Netscript Function
    }
  }

  // Cost of upgrade gets cheaper as gang increases in respect + power
  getDiscount(): number {
    const power = this.getPower();
    const respect = this.respect;

    const respectLinearFac = 5e6;
    const powerLinearFac = 1e6;
    const discount =
      Math.pow(respect, 0.01) + respect / respectLinearFac + Math.pow(power, 0.01) + power / powerLinearFac - 1;
    return Math.max(1, discount);
  }

  // Returns only valid tasks for this gang. Excludes 'Unassigned'
  getAllTaskNames(): string[] {
    return Object.keys(GangMemberTasks).filter((taskName: string) => {
      const task = GangMemberTasks[taskName];
      if (task == null) return false;
      if (task.name === "Unassigned") return false;
      // yes you need both checks
      return this.isHackingGang === task.isHacking || !this.isHackingGang === task.isCombat;
    });
  }

  getUpgradeCost(upg: GangMemberUpgrade | null): number {
    if (upg == null) {
      return Infinity;
    }
    return upg.cost / this.getDiscount();
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): any {
    return Generic_toJSON("Gang", this);
  }

  /**
   * Initiatizes a Gang object from a JSON save state.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): Gang {
    return Generic_fromJSON(Gang, value.data);
  }
}

Reviver.constructors.Gang = Gang;
