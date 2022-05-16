import { merge } from "lodash";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../../Constants";
import { Faction } from "../../Faction/Faction";
import { Factions } from "../../Faction/Factions";
import {
  getFactionFieldWorkRepGain,
  getFactionSecurityWorkRepGain,
  getHackingWorkRepGain,
} from "../../PersonObjects/formulas/reputation";
import { FactionWorkInfo } from "../WorkInfo";
import { WorkManager, WorkRates } from "../WorkManager";
import { PlayerFactionWorkType, WorkType } from "../WorkType";

export const baseFactionWorkInfo: FactionWorkInfo = {
  factionName: "",
  jobDescription: "",
  jobType: PlayerFactionWorkType.None,

  start: function (workManager: WorkManager, faction: Faction, workType: PlayerFactionWorkType): void {
    let favorMult = 1 + faction.favor / 100;
    if (isNaN(favorMult)) favorMult = 1;

    switch (workType) {
      case PlayerFactionWorkType.Hacking:
        merge(workManager.rates, <WorkRates>{
          hackExp: 0.15 * workManager.player.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain,
          rep: getHackingWorkRepGain(workManager.player, faction),
        });

        merge(workManager.info.faction, <FactionWorkInfo>{
          jobType: PlayerFactionWorkType.Hacking,
          jobDescription: "carrying out hacking contracts",
        });
        break;

      case PlayerFactionWorkType.Field:
        merge(
          workManager.rates,
          Object.fromEntries(
            Object.entries(<WorkRates>{
              hackExp: workManager.player.hacking_exp_mult,
              strExp: workManager.player.strength_exp_mult,
              defExp: workManager.player.defense_exp_mult,
              dexExp: workManager.player.dexterity_exp_mult,
              agiExp: workManager.player.agility_exp_mult,
              chaExp: workManager.player.charisma_exp_mult,
            }).map(([k, v]) => [k, 0.1 * v * BitNodeMultipliers.FactionWorkExpGain]),
          ),
          { rep: getFactionFieldWorkRepGain(workManager.player, faction) },
        );

        merge(workManager.info.faction, <FactionWorkInfo>{
          jobType: PlayerFactionWorkType.Field,
          jobDescription: "carrying out field missions",
        });
        break;

      case PlayerFactionWorkType.Security:
        merge(
          workManager.rates,
          Object.fromEntries(
            Object.entries(<WorkRates>{
              strExp: workManager.player.strength_exp_mult,
              defExp: workManager.player.defense_exp_mult,
              dexExp: workManager.player.dexterity_exp_mult,
              agiExp: workManager.player.charisma_exp_mult,
            }).map(([k, v]) => [k, 0.15 * v * BitNodeMultipliers.FactionWorkExpGain]),
          ),
          {
            hackExp: 0.05 * workManager.player.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain,
            rep: getFactionSecurityWorkRepGain(workManager.player, faction),
          },
        );

        merge(workManager.info.faction, <FactionWorkInfo>{
          jobType: PlayerFactionWorkType.Security,
          jobDescription: "performing security detail",
        });
        break;
    }

    workManager.rates.rep *= favorMult * BitNodeMultipliers.FactionWorkRepGain;
    workManager.workType = WorkType.Faction;
    workManager.info.faction.factionName = faction.name;
    workManager.timeToCompletion = CONSTANTS.MillisecondsPer20Hours;
  },

  process: function (workManager: WorkManager, numCycles: number): boolean {
    const faction = Factions[workManager.info.faction.factionName];
    if (!faction) return false;

    switch (workManager.info.faction.jobType) {
      case PlayerFactionWorkType.Hacking:
        workManager.rates.rep = getHackingWorkRepGain(workManager.player, faction);
        break;
      case PlayerFactionWorkType.Field:
        workManager.rates.rep = getFactionFieldWorkRepGain(workManager.player, faction);
        break;
      case PlayerFactionWorkType.Security:
        workManager.rates.rep = getFactionSecurityWorkRepGain(workManager.player, faction);
        break;
    }
    workManager.rates.rep *= BitNodeMultipliers.FactionWorkRepGain;

    let overMax = false;
    if (workManager.timeWorked + CONSTANTS._idleSpeed * numCycles >= CONSTANTS.MillisecondsPer20Hours) {
      overMax = true;
      numCycles = Math.round((CONSTANTS.MillisecondsPer20Hours - workManager.timeWorked) / CONSTANTS._idleSpeed);
    }
    workManager.timeWorked += CONSTANTS._idleSpeed * numCycles;

    workManager.processWorkEarnings(numCycles);

    if (overMax || workManager.timeWorked >= CONSTANTS.MillisecondsPer20Hours) {
      this.finish(workManager, { cancelled: false });
      return true;
    }
    return false;
  },

  finish: function (workManager: WorkManager, options: { singularity?: boolean; cancelled: boolean }): string {
    const faction = Factions[workManager.info.faction.factionName];
    if (!faction) return "";

    faction.playerReputation += workManager.gains.rep;

    workManager.player.updateSkillLevels();

    // Need to reset work status somewhere around this point

    if (!options?.singularity) {
      // TODO: Dialog box stuff
    } else {
      // TODO: Return stuff for NS
    }
    return "";
  },
};
