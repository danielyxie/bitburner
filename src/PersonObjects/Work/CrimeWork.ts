import { CrimeType } from "../../utils/WorkType";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";
import { IPlayer } from "../IPlayer";
import { Work, WorkType } from "./Work";
import { Crimes } from "../../Crime/Crimes";
import { Crime } from "../../Crime/Crime";
import { determineCrimeSuccess } from "../../Crime/CrimeHelpers";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";

export const isCrimeWork = (w: Work | undefined): w is CrimeWork => {
  return w !== undefined && w.type === WorkType.Crime;
};

export class CrimeWork extends Work {
  crimeType: CrimeType = CrimeType.None;

  constructor(c?: Crime) {
    super(WorkType.Crime);

    this.crimeType = c?.type ?? CrimeType.None;
  }

  getCrime(): Crime {
    const c = Object.values(Crimes).find((c) => c.type === this.crimeType);
    if (!c) throw new Error(`Crime work constructed with invalid ${this.crimeType}`);
    return c;
  }

  work(p: IPlayer, cycles: number): boolean {
    super.work(p, cycles);
    return this.getCrime().time <= this.cyclesWorked;
  }

  finish(p: IPlayer, cancelled: boolean): string {
    //Determine crime success/failure
    if (cancelled) return "";
    const crime = this.getCrime();
    const success = determineCrimeSuccess(p, this.crimeType);
    let hackExp = crime.hacking_exp;
    let strExp = crime.strength_exp;
    let defExp = crime.defense_exp;
    let dexExp = crime.dexterity_exp;
    let agiExp = crime.agility_exp;
    let chaExp = crime.charisma_exp;
    let intExp = crime.intelligence_exp;
    let money = crime.money * p.crime_money_mult * BitNodeMultipliers.CrimeMoney;

    if (success) {
      p.karma -= crime.karma;
      p.numPeopleKilled += crime.kills;
      const ws = this.singFnCrimeWorkerScript;
      if (this.committingCrimeThruSingFn && ws !== null) {
        if (ws.disableLogs.ALL == null && ws.disableLogs.commitCrime == null) {
          ws.scriptRef.log(
            "SUCCESS: Crime successful! Gained " +
              numeralWrapper.formatMoney(money) +
              ", " +
              numeralWrapper.formatExp(hackExp) +
              " hack exp, " +
              numeralWrapper.formatExp(strExp) +
              " str exp, " +
              numeralWrapper.formatExp(defExp) +
              " def exp, " +
              numeralWrapper.formatExp(dexExp) +
              " dex exp, " +
              numeralWrapper.formatExp(agiExp) +
              " agi exp, " +
              numeralWrapper.formatExp(chaExp) +
              " cha exp.",
          );
        }
      } else {
        dialogBoxCreate(
          <>
            Crime successful!
            <br />
            <br />
            You gained:
            <br />
            <Money money={money} />
            <br />
            {numeralWrapper.formatExp(hackExp)} hacking experience <br />
            {numeralWrapper.formatExp(strExp)} strength experience
            <br />
            {numeralWrapper.formatExp(defExp)} defense experience
            <br />
            {numeralWrapper.formatExp(dexExp)} dexterity experience
            <br />
            {numeralWrapper.formatExp(agiExp)} agility experience
            <br />
            {numeralWrapper.formatExp(chaExp)} charisma experience
          </>,
        );
      }
    } else {
      hackExp /= 4;
      strExp /= 4;
      defExp /= 4;
      dexExp /= 4;
      agiExp /= 4;
      chaExp /= 4;
      intExp = 0;
      money = 0;
      const ws = this.singFnCrimeWorkerScript;
      if (this.committingCrimeThruSingFn && ws !== null) {
        if (ws.disableLogs.ALL == null && ws.disableLogs.commitCrime == null) {
          ws.scriptRef.log(
            "FAIL: Crime failed! Gained " +
              numeralWrapper.formatExp(hackExp) +
              " hack exp, " +
              numeralWrapper.formatExp(strExp) +
              " str exp, " +
              numeralWrapper.formatExp(defExp) +
              " def exp, " +
              numeralWrapper.formatExp(dexExp) +
              " dex exp, " +
              numeralWrapper.formatExp(agiExp) +
              " agi exp, " +
              numeralWrapper.formatExp(chaExp) +
              " cha exp.",
          );
        }
      } else {
        dialogBoxCreate(
          <>
            Crime failed!
            <br />
            <br />
            You gained:
            <br />
            {numeralWrapper.formatExp(hackExp)} hacking experience <br />
            {numeralWrapper.formatExp(strExp)} strength experience
            <br />
            {numeralWrapper.formatExp(defExp)} defense experience
            <br />
            {numeralWrapper.formatExp(dexExp)} dexterity experience
            <br />
            {numeralWrapper.formatExp(agiExp)} agility experience
            <br />
            {numeralWrapper.formatExp(chaExp)} charisma experience
          </>,
        );
      }
    }

    p.gainHackingExp(hackExp);
    p.gainStrengthExp(strExp);
    p.gainDefenseExp(defExp);
    p.gainDexterityExp(dexExp);
    p.gainAgilityExp(agiExp);
    p.gainCharismaExp(chaExp);
    if (intExp) p.gainIntelligenceExp(intExp);
    if (money) p.gainMoney(money, "crime");

    return "";
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
