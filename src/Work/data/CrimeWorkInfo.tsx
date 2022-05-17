import { merge } from "lodash";
import React from "react";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../../Constants";
import { determineCrimeSuccess } from "../../Crime/CrimeHelpers";
import { Crimes } from "../../Crime/Crimes";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Money } from "../../ui/React/Money";
import { CrimeWorkInfo } from "../WorkInfo";
import { WorkManager, WorkRates } from "../WorkManager";
import { CrimeType } from "../WorkType";

export const baseCrimeWorkInfo: CrimeWorkInfo = {
  crimeType: CrimeType.None,
  singularity: false,
  workerScript: null,

  start: function (workManager: WorkManager, { router, crimeType, exp, money, time, workerScript }): void {
    workManager.player.focus = true;

    // If initiated via script, set the relevant properties
    if (workerScript !== null) {
      merge(workManager.info.crime, {
        singularity: true,
        workerScript: workerScript,
      } as CrimeWorkInfo);
    }

    // Crime sets the gains from the get-go, and modifies them after calculating success
    merge(
      workManager.gains,
      Object.fromEntries(
        Object.entries({
          hackExp: exp.hack * workManager.player.hacking_exp_mult,
          strExp: exp.str * workManager.player.strength_exp_mult,
          defExp: exp.def * workManager.player.defense_exp_mult,
          dexExp: exp.dex * workManager.player.dexterity_exp_mult,
          agiExp: exp.agi * workManager.player.agility_exp_mult,
          chaExp: exp.cha * workManager.player.agility_exp_mult,
        } as WorkRates).map(([k, v]) => [k, v * BitNodeMultipliers.CrimeExpGain]),
      ),
      {
        money: money * workManager.player.crime_money_mult * BitNodeMultipliers.CrimeMoney,
      },
    );

    // Update other data
    workManager.info.crime.crimeType = crimeType;
    workManager.timeToCompletion = time;

    // Go to the work in progress screen
    router.toWork();
  },

  process: function (workManager: WorkManager, numCycles: number): boolean {
    workManager.timeWorked += CONSTANTS._idleSpeed * numCycles;

    // If crime is done, finish through the manager
    if (workManager.timeWorked >= workManager.timeToCompletion) {
      workManager.finish({ cancelled: false });
      return true;
    }

    return false;
  },

  finish: function (
    workManager: WorkManager,
    options: { singularity?: boolean | undefined; cancelled: boolean },
  ): string {
    // Setup crime type
    const currentCrimeType = workManager.info.crime.crimeType,
      // Calculate success
      success = determineCrimeSuccess(workManager.player, currentCrimeType),
      // Alias player
      player = workManager.player,
      // Alias gains
      gains = workManager.gains,
      // Alias worker script
      script = workManager.info.crime.workerScript;

    let statusText = "";

    // If the crime was completed fully, do the magic
    if (!options.cancelled) {
      // On success
      if (success) {
        // If we can't find the crime from its type, there's a bug and something is wrong
        const crime = Object.values(Crimes).find((v) => v.type === currentCrimeType);
        if (!crime) {
          dialogBoxCreate(
            `Error: Unrecognized crime type ${currentCrimeType}. Please report this, it's probably a bug!`,
          );
          return "";
        }

        // Update money, karma, INT, etc
        player.gainMoney(workManager.gains.money, "crime");
        player.karma -= crime.karma;
        player.numPeopleKilled += crime.kills;
        if (crime.intelligence_exp > 0) {
          player.gainIntelligenceExp(crime.intelligence_exp);
        }

        // Double exp gains on success
        gains.hackExp *= 2;
        gains.strExp *= 2;
        gains.defExp *= 2;
        gains.dexExp *= 2;
        gains.agiExp *= 2;
        gains.chaExp *= 2;

        // Success text to return
        statusText =
          workManager.info.crime.singularity && script ? "SUCCESS: Crime successful! Gained " : "Crime successful!";
      } else {
        // Halve exp gains on failure
        gains.hackExp /= 2;
        gains.strExp /= 2;
        gains.defExp /= 2;
        gains.dexExp /= 2;
        gains.agiExp /= 2;
        gains.chaExp /= 2;

        // Failure text to return
        statusText = workManager.info.crime.singularity && script ? "FAIL: Crime failed! Gained " : "Crime failed!";
      }

      // If initiated via API, return info in text
      if (workManager.info.crime.singularity && script) {
        if (!script.disableLogs.ALL && !script.disableLogs.commitCrime) {
          script.scriptRef.log(
            statusText +
              // Money is not gained on failure, so handle that
              (success ? numeralWrapper.formatMoney(gains.money) + ", " : "") +
              numeralWrapper.formatExp(gains.hackExp) +
              " hack exp, " +
              numeralWrapper.formatExp(gains.strExp) +
              " str exp, " +
              numeralWrapper.formatExp(gains.defExp) +
              " def exp, " +
              numeralWrapper.formatExp(gains.dexExp) +
              " dex exp, " +
              numeralWrapper.formatExp(gains.agiExp) +
              " agi exp, " +
              numeralWrapper.formatExp(gains.chaExp) +
              " cha exp.",
          );
        }
      } else {
        // If initiated through UI, show status in UI
        dialogBoxCreate(
          <>
            {statusText}
            <br />
            <br />
            You gained: {/* Money is not gained on failure, so handle that */}
            {success && (
              <>
                <Money money={gains.money} />
                <br />
              </>
            )}
            <br />
            {numeralWrapper.formatExp(gains.hackExp)} hacking experience
            <br />
            {numeralWrapper.formatExp(gains.strExp)} strength experience
            <br />
            {numeralWrapper.formatExp(gains.defExp)} defense experience
            <br />
            {numeralWrapper.formatExp(gains.dexExp)} dexterity experience
            <br />
            {numeralWrapper.formatExp(gains.agiExp)} agility experience
            <br />
            {numeralWrapper.formatExp(gains.chaExp)} charisma experience
          </>,
        );
      }

      // Update player exp
      player.gainHackingExp(gains.hackExp);
      player.gainStrengthExp(gains.strExp);
      player.gainDefenseExp(gains.defExp);
      player.gainDexterityExp(gains.dexExp);
      player.gainAgilityExp(gains.agiExp);
      player.gainCharismaExp(gains.chaExp);
    }

    return "";
  },
};
