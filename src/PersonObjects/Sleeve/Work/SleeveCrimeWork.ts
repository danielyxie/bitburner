import { IPlayer } from "../../IPlayer";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { applySleeveGains, Work, WorkType } from "./Work";
import { CrimeType } from "../../../utils/WorkType";
import { Crimes } from "../../../Crime/Crimes";
import { Crime } from "../../../Crime/Crime";
import { newWorkStats, scaleWorkStats, WorkStats } from "../../../Work/WorkStats";
import { CONSTANTS } from "../../../Constants";
import { BitNodeMultipliers } from "../../../BitNode/BitNodeMultipliers";

export const isSleeveCrimeWork = (w: Work | null): w is SleeveCrimeWork => w !== null && w.type === WorkType.CRIME;

export class SleeveCrimeWork extends Work {
  crimeType: CrimeType;
  cyclesWorked = 0;
  constructor(crimeType?: CrimeType) {
    super(WorkType.CRIME);
    this.crimeType = crimeType ?? CrimeType.SHOPLIFT;
  }

  getCrime(): Crime {
    const crime = Object.values(Crimes).find((crime) => crime.type === this.crimeType);
    if (!crime) throw new Error("crime should not be undefined");
    return crime;
  }

  getExp(): WorkStats {
    const crime = this.getCrime();
    return newWorkStats({
      money: crime.money * BitNodeMultipliers.CrimeMoney,
      hackExp: crime.hacking_exp * BitNodeMultipliers.CrimeExpGain,
      strExp: crime.strength_exp * BitNodeMultipliers.CrimeExpGain,
      defExp: crime.defense_exp * BitNodeMultipliers.CrimeExpGain,
      dexExp: crime.dexterity_exp * BitNodeMultipliers.CrimeExpGain,
      agiExp: crime.agility_exp * BitNodeMultipliers.CrimeExpGain,
      chaExp: crime.charisma_exp * BitNodeMultipliers.CrimeExpGain,
      intExp: crime.intelligence_exp * BitNodeMultipliers.CrimeExpGain,
    });
  }

  cyclesNeeded(): number {
    return this.getCrime().time / CONSTANTS._idleSpeed;
  }

  process(player: IPlayer, sleeve: Sleeve, cycles: number): number {
    this.cyclesWorked += cycles;

    const crime = this.getCrime();
    let gains = this.getExp();
    if (this.cyclesWorked >= this.cyclesNeeded()) {
      if (Math.random() < crime.successRate(sleeve)) {
        player.karma -= crime.karma * sleeve.syncBonus();
      } else {
        gains.money = 0;
        gains = scaleWorkStats(gains, 0.25);
      }
      applySleeveGains(player, sleeve, gains, cycles);
      this.cyclesWorked -= this.cyclesNeeded();
    }
    return 0;
  }

  APICopy(): Record<string, unknown> {
    return {
      type: this.type,
    };
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): IReviverValue {
    return Generic_toJSON("SleeveCrimeWork", this);
  }

  /**
   * Initiatizes a RecoveryWork object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): SleeveCrimeWork {
    return Generic_fromJSON(SleeveCrimeWork, value.data);
  }
}

Reviver.constructors.SleeveCrimeWork = SleeveCrimeWork;
