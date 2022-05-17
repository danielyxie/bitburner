import { merge } from "lodash";
import React from "react";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../../Constants";
import { Factions } from "../../Faction/Factions";
import {
  getFactionFieldWorkRepGain,
  getFactionSecurityWorkRepGain,
  getHackingWorkRepGain,
} from "../../PersonObjects/formulas/reputation";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Reputation } from "../../ui/React/Reputation";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { FactionWorkInfo } from "../WorkInfo";
import { WorkManager, WorkRates } from "../WorkManager";
import { PlayerFactionWorkType } from "../WorkType";

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
        merge(workManager.rates, {
          hackExp: 0.15 * workManager.player.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain,
          rep: getHackingWorkRepGain(workManager.player, faction),
        } as WorkRates);

        // Update descriptions
        merge(workManager.info.faction, {
          jobType: PlayerFactionWorkType.Hacking,
          jobDescription: "carrying out hacking contracts",
        } as FactionWorkInfo);
        break;

      // Field work
      case PlayerFactionWorkType.Field:
        // Rates are 10% of player exp mult * faction work exp BN mult
        // For all skill stats
        merge(
          workManager.rates,
          Object.fromEntries(
            Object.entries({
              hackExp: workManager.player.hacking_exp_mult,
              strExp: workManager.player.strength_exp_mult,
              defExp: workManager.player.defense_exp_mult,
              dexExp: workManager.player.dexterity_exp_mult,
              agiExp: workManager.player.agility_exp_mult,
              chaExp: workManager.player.charisma_exp_mult,
            } as WorkRates).map(([k, v]) => [k, 0.1 * v * BitNodeMultipliers.FactionWorkExpGain]),
          ),
          { rep: getFactionFieldWorkRepGain(workManager.player, faction) },
        );

        // Update descriptions
        merge(workManager.info.faction, {
          jobType: PlayerFactionWorkType.Field,
          jobDescription: "carrying out field missions",
        } as FactionWorkInfo);
        break;

      // Security detail
      case PlayerFactionWorkType.Security:
        // Rates are 15% of player exp mult * faction work exp BN mult
        // For combat stats only
        merge(
          workManager.rates,
          Object.fromEntries(
            Object.entries({
              strExp: workManager.player.strength_exp_mult,
              defExp: workManager.player.defense_exp_mult,
              dexExp: workManager.player.dexterity_exp_mult,
              agiExp: workManager.player.charisma_exp_mult,
            } as WorkRates).map(([k, v]) => [k, 0.15 * v * BitNodeMultipliers.FactionWorkExpGain]),
          ),
          // Hack exp gained at 5% of hacking mult * faction work exp BN mult
          {
            hackExp: 0.05 * workManager.player.hacking_exp_mult * BitNodeMultipliers.FactionWorkExpGain,
            rep: getFactionSecurityWorkRepGain(workManager.player, faction),
          },
        );

        // Update description
        merge(workManager.info.faction, {
          jobType: PlayerFactionWorkType.Security,
          jobDescription: "performing security detail",
        } as FactionWorkInfo);
        break;
    }

    // Update manager data with the rest of the info
    workManager.rates.rep *= favorMult * BitNodeMultipliers.FactionWorkRepGain;
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

    const gains = workManager.gains;

    if (!options?.singularity) {
      // If initiated via UI, show UI popup on completion
      dialogBoxCreate(
        <>
          You worked for your faction {faction.name} for a total of{" "}
          {convertTimeMsToTimeElapsedString(workManager.timeWorked)}
          <br />
          <br />
          You earned a total of:
          <br />
          <Reputation reputation={gains.rep} /> reputation for the faction
          <br />
          {numeralWrapper.formatExp(gains.hackExp)} hacking exp <br />
          {numeralWrapper.formatExp(gains.strExp)} strength exp <br />
          {numeralWrapper.formatExp(gains.defExp)} defense exp <br />
          {numeralWrapper.formatExp(gains.dexExp)} dexterity exp <br />
          {numeralWrapper.formatExp(gains.agiExp)} agility exp <br />
          {numeralWrapper.formatExp(gains.chaExp)} charisma exp
        </>,
      );
      return "";
    } else {
      // If initiated via API, return summary string
      const res =
        "You worked for your faction " +
        faction.name +
        " for a total of " +
        convertTimeMsToTimeElapsedString(workManager.timeWorked) +
        ". " +
        "You earned " +
        numeralWrapper.formatReputation(gains.rep) +
        "rep, " +
        numeralWrapper.formatExp(gains.hackExp) +
        " hacking exp, " +
        numeralWrapper.formatExp(gains.strExp) +
        " strength exp, " +
        numeralWrapper.formatExp(gains.defExp) +
        " defense exp, " +
        numeralWrapper.formatExp(gains.dexExp) +
        " dexterity exp, " +
        numeralWrapper.formatExp(gains.agiExp) +
        " agility exp, and " +
        numeralWrapper.formatExp(gains.chaExp) +
        " charisma exp";
      return res;
    }
  },
};
