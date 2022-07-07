import React from "react";
import { Reviver, Generic_toJSON, Generic_fromJSON } from "../utils/JSONReviver";
import { Crime } from "../Crime/Crime";
import { CONSTANTS } from "../Constants";
import { determineCrimeSuccess } from "../Crime/CrimeHelpers";
import { Crimes } from "../Crime/Crimes";
import { IPlayer } from "../PersonObjects/IPlayer";
import { numeralWrapper } from "../ui/numeralFormat";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { Money } from "../ui/React/Money";
import { CrimeType } from "../utils/WorkType";
import { Work, WorkType } from "./Work";

interface CrimeWorkParams {
  crimeType: CrimeType;
  singularity: boolean;
}

export const isCrimeWork = (w: Work | null): w is CrimeWork => w !== null && w.type === WorkType.CRIME;

export class CrimeWork extends Work {
  type = WorkType.CRIME;

  crimeType: CrimeType;
  cyclesWorked: number;
  singularity: boolean;

  constructor(params?: CrimeWorkParams) {
    super();
    this.crimeType = params?.crimeType ?? CrimeType.Shoplift;
    this.singularity = params?.singularity ?? false;
    this.cyclesWorked = 0;
  }

  getCrime(): Crime {
    const crime = Object.values(Crimes).find((c) => c.type === this.crimeType);
    if (!crime) throw new Error("CrimeWork object constructed with invalid crime type");
    return crime;
  }

  process(player: IPlayer, cycles = 1): boolean {
    this.cyclesWorked += cycles;
    const time = Object.values(Crimes).find((c) => c.type === this.crimeType)?.time ?? 0;
    return this.cyclesWorked * CONSTANTS._idleSpeed >= time;
  }

  finish(player: IPlayer, cancelled: boolean): void {
    if (cancelled) return;
    let crime = null;
    for (const i of Object.keys(Crimes)) {
      if (Crimes[i].type == this.crimeType) {
        crime = Crimes[i];
        break;
      }
    }
    if (crime == null) {
      dialogBoxCreate(
        `ERR: Unrecognized crime type (${this.crimeType}). This is probably a bug please contact the developer`,
      );
      return;
    }
    // exp times 2 because were trying to maintain the same numbers as before the conversion
    // Technically the definition of Crimes should have the success numbers and failure should divide by 4
    let hackExp = crime.hacking_exp * 2;
    let StrExp = crime.strength_exp * 2;
    let DefExp = crime.defense_exp * 2;
    let DexExp = crime.dexterity_exp * 2;
    let AgiExp = crime.agility_exp * 2;
    let ChaExp = crime.charisma_exp * 2;
    let karma = crime.karma;
    const success = determineCrimeSuccess(player, crime.type);
    if (success) {
      player.gainMoney(crime.money, "crime");
      player.numPeopleKilled += crime.kills;
      player.gainIntelligenceExp(crime.intelligence_exp);
    } else {
      hackExp /= 4;
      StrExp /= 4;
      DefExp /= 4;
      DexExp /= 4;
      AgiExp /= 4;
      ChaExp /= 4;
      karma /= 4;
    }

    player.gainHackingExp(hackExp);
    player.gainStrengthExp(StrExp);
    player.gainDefenseExp(DefExp);
    player.gainDexterityExp(DexExp);
    player.gainAgilityExp(AgiExp);
    player.gainCharismaExp(ChaExp);
    player.karma -= karma;

    if (!this.singularity) {
      dialogBoxCreate(
        <>
          Crime {success ? "successful" : "failed"}!
          <br />
          <br />
          You gained:
          {success && (
            <>
              <br />
              <Money money={crime.money} />
            </>
          )}
          <br />
          {numeralWrapper.formatExp(hackExp)} hacking experience <br />
          {numeralWrapper.formatExp(StrExp)} strength experience
          <br />
          {numeralWrapper.formatExp(DefExp)} defense experience
          <br />
          {numeralWrapper.formatExp(DexExp)} dexterity experience
          <br />
          {numeralWrapper.formatExp(AgiExp)} agility experience
          <br />
          {numeralWrapper.formatExp(ChaExp)} charisma experience
        </>,
      );
    }
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): any {
    return Generic_toJSON("CrimeWork", this);
  }

  /**
   * Initiatizes a CrimeWork object from a JSON save state.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): CrimeWork {
    return Generic_fromJSON(CrimeWork, value.data);
  }
}

Reviver.constructors.CrimeWork = CrimeWork;
