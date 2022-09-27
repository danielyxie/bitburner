import { Player } from "../../../Player";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { applySleeveGains, Work, WorkType } from "./Work";
import { FactionWorkType } from "../../../Work/data/FactionWorkType";
import { FactionNames } from "../../../Faction/data/FactionNames";
import { Factions } from "../../../Faction/Factions";
import { calculateFactionExp } from "../../../Work/formulas/Faction";
import { Faction } from "../../../Faction/Faction";
import {
  getFactionFieldWorkRepGain,
  getFactionSecurityWorkRepGain,
  getHackingWorkRepGain,
} from "../../../PersonObjects/formulas/reputation";
import { scaleWorkStats, WorkStats } from "../../../Work/WorkStats";
import { BitNodeMultipliers } from "../../../BitNode/BitNodeMultipliers";

interface SleeveFactionWorkParams {
  factionWorkType: FactionWorkType;
  factionName: string;
}

export const isSleeveFactionWork = (w: Work | null): w is SleeveFactionWork =>
  w !== null && w.type === WorkType.FACTION;

export class SleeveFactionWork extends Work {
  factionWorkType: FactionWorkType;
  factionName: string;

  constructor(params?: SleeveFactionWorkParams) {
    super(WorkType.FACTION);
    this.factionWorkType = params?.factionWorkType ?? FactionWorkType.HACKING;
    this.factionName = params?.factionName ?? FactionNames.Sector12;
  }

  getExpRates(sleeve: Sleeve): WorkStats {
    return scaleWorkStats(calculateFactionExp(sleeve, this.factionWorkType), sleeve.shockBonus());
  }

  getReputationRate(sleeve: Sleeve): number {
    const faction = this.getFaction();
    const repFormulas = {
      [FactionWorkType.HACKING]: getHackingWorkRepGain,
      [FactionWorkType.FIELD]: getFactionFieldWorkRepGain,
      [FactionWorkType.SECURITY]: getFactionSecurityWorkRepGain,
    };
    return (
      repFormulas[this.factionWorkType](sleeve, faction.favor) *
      sleeve.shockBonus() *
      BitNodeMultipliers.FactionWorkRepGain
    );
  }

  getFaction(): Faction {
    const f = Factions[this.factionName];
    if (!f) throw new Error(`Faction work started with invalid / unknown faction: '${this.factionName}'`);
    return f;
  }

  process(sleeve: Sleeve, cycles: number): number {
    if (this.factionName === Player.gang?.facName) {
      sleeve.stopWork();
      return 0;
    }

    const exp = this.getExpRates(sleeve);
    applySleeveGains(sleeve, exp, cycles);
    const rep = this.getReputationRate(sleeve);
    this.getFaction().playerReputation += rep;
    return 0;
  }

  APICopy(): Record<string, unknown> {
    return {
      type: this.type,
      factionWorkType: this.factionWorkType,
      factionName: this.factionName,
    };
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): IReviverValue {
    return Generic_toJSON("SleeveFactionWork", this);
  }

  /**
   * Initiatizes a FactionWork object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): SleeveFactionWork {
    return Generic_fromJSON(SleeveFactionWork, value.data);
  }
}

Reviver.constructors.SleeveFactionWork = SleeveFactionWork;
