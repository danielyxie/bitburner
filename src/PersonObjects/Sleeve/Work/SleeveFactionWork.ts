import { Player } from "@player";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { applySleeveGains, Work, WorkType } from "./Work";
import { FactionWorkType } from "../../../utils/enums";
import { FactionNames } from "../../../Faction/data/FactionNames";
import { Factions } from "../../../Faction/Factions";
import { calculateFactionExp, calculateFactionRep } from "../../../Work/Formulas";
import { Faction } from "../../../Faction/Faction";
import { scaleWorkStats, WorkStats } from "../../../Work/WorkStats";

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
    this.factionWorkType = params?.factionWorkType ?? FactionWorkType.hacking;
    this.factionName = params?.factionName ?? FactionNames.Sector12;
  }

  getExpRates(sleeve: Sleeve): WorkStats {
    return scaleWorkStats(calculateFactionExp(sleeve, this.factionWorkType), sleeve.shockBonus(), false);
  }

  getReputationRate(sleeve: Sleeve): number {
    return calculateFactionRep(sleeve, this.factionWorkType, this.getFaction().favor) * sleeve.shockBonus();
  }

  getFaction(): Faction {
    const f = Factions[this.factionName];
    if (!f) throw new Error(`Faction work started with invalid / unknown faction: '${this.factionName}'`);
    return f;
  }

  process(sleeve: Sleeve, cycles: number) {
    if (this.factionName === Player.gang?.facName) return sleeve.stopWork();

    const exp = this.getExpRates(sleeve);
    applySleeveGains(sleeve, exp, cycles);
    const rep = this.getReputationRate(sleeve);
    this.getFaction().playerReputation += rep * cycles;
  }

  APICopy(): Record<string, unknown> {
    return {
      type: this.type,
      factionWorkType: this.factionWorkType,
      factionName: this.factionName,
    };
  }

  /** Serialize the current object to a JSON save state. */
  toJSON(): IReviverValue {
    return Generic_toJSON("SleeveFactionWork", this);
  }

  /** Initializes a FactionWork object from a JSON save state. */
  static fromJSON(value: IReviverValue): SleeveFactionWork {
    return Generic_fromJSON(SleeveFactionWork, value.data);
  }
}

Reviver.constructors.SleeveFactionWork = SleeveFactionWork;
