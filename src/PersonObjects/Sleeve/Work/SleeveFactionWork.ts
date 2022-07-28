import { IPlayer } from "../../IPlayer";
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
    return repFormulas[this.factionWorkType](sleeve, faction) * sleeve.shockBonus();
  }

  getFaction(): Faction {
    const f = Factions[this.factionName];
    if (!f) throw new Error(`Faction work started with invalid / unknown faction: '${this.factionName}'`);
    return f;
  }

  process(player: IPlayer, sleeve: Sleeve, cycles: number): number {
    if (player.gang) {
      if (this.factionName === player.gang.facName) {
        sleeve.stopWork(player);
        return 0;
      }
    }

    const exp = this.getExpRates(sleeve);
    applySleeveGains(player, sleeve, exp, cycles);
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
