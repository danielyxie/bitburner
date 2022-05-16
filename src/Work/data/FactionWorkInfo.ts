import { merge } from "lodash";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../../Constants";
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

  start: function (workManager: WorkManager, { faction, workType }): void {
    // Calculate bonus from favor
    let favorMult = 1 + faction.favor / 100;
    if (isNaN(favorMult)) favorMult = 1;

    // Determine rates based on work type
    switch (workType) {
      // Hacking contracts
      case PlayerFactionWorkType.Hacking:
        // Rates are 15% of player hacking exp mult * faction work exp BN mult
        merge(workManager.rates, <WorkRates>{
          hackExp: 0.15 * workManager.player.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain,
          rep: getHackingWorkRepGain(workManager.player, faction),
        });

        // Update descriptions
        merge(workManager.info.faction, <FactionWorkInfo>{
          jobType: PlayerFactionWorkType.Hacking,
          jobDescription: "carrying out hacking contracts",
        });
        break;

      // Field work
      case PlayerFactionWorkType.Field:
        // Rates are 10% of player exp mult * faction work exp BN mult
        // For all skill stats
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

        // Update descriptions
        merge(workManager.info.faction, <FactionWorkInfo>{
          jobType: PlayerFactionWorkType.Field,
          jobDescription: "carrying out field missions",
        });
        break;

      // Security detail
      case PlayerFactionWorkType.Security:
        // Rates are 15% of player exp mult * faction work exp BN mult
        // For combat stats only
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
          // Hack exp gained at 5% of hacking mult * faction work exp BN mult
          {
            hackExp: 0.05 * workManager.player.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain,
            rep: getFactionSecurityWorkRepGain(workManager.player, faction),
          },
        );

        // Update description
        merge(workManager.info.faction, <FactionWorkInfo>{
          jobType: PlayerFactionWorkType.Security,
          jobDescription: "performing security detail",
        });
        break;
    }

    // Update manager data with the rest of the info
    workManager.rates.rep *= favorMult * BitNodeMultipliers.FactionWorkRepGain;
    workManager.workType = WorkType.Faction;
    workManager.info.faction.factionName = faction.name;
    workManager.timeToCompletion = CONSTANTS.MillisecondsPer20Hours;
  },

  process: function (workManager: WorkManager, numCycles: number): boolean {
    const faction = Factions[workManager.info.faction.factionName];
    if (!faction) return false;

    // Update rep gain rate
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
    // TODO: Investigate whether favor mult is missing here
    workManager.rates.rep *= BitNodeMultipliers.FactionWorkRepGain;

    // Check if player has worked a full "shift"
    let overMax = false;
    if (workManager.timeWorked + CONSTANTS._idleSpeed * numCycles >= CONSTANTS.MillisecondsPer20Hours) {
      overMax = true;
      numCycles = Math.round((CONSTANTS.MillisecondsPer20Hours - workManager.timeWorked) / CONSTANTS._idleSpeed);
    }
    // Update manager time worked
    workManager.timeWorked += CONSTANTS._idleSpeed * numCycles;

    // Process earnings
    workManager.processWorkEarnings(numCycles);

    // If a full shift is done, finish task through manager
    if (overMax || workManager.timeWorked >= CONSTANTS.MillisecondsPer20Hours) {
      workManager.finish({ cancelled: false });
      return true;
    }
    return false;
  },

  finish: function (workManager: WorkManager, options: { singularity?: boolean; cancelled: boolean }): string {
    const faction = Factions[workManager.info.faction.factionName];
    if (!faction) return "";

    // Update player's rep with faction
    faction.playerReputation += workManager.gains.rep;

    // Update player skills
    workManager.player.updateSkillLevels();

    if (!options?.singularity) {
      // TODO: Dialog box stuff
    } else {
      // TODO: Return stuff for NS
    }
    return "";
  },
};
