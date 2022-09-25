import React from "react";
import { Work, WorkType } from "./Work";
import { Reviver, Generic_toJSON, Generic_fromJSON, IReviverValue } from "../utils/JSONReviver";
import { IPlayer } from "../PersonObjects/IPlayer";
import { FactionNames } from "../Faction/data/FactionNames";
import { Factions } from "../Faction/Factions";
import { Faction } from "../Faction/Faction";
import { applyWorkStats, scaleWorkStats, WorkStats } from "./WorkStats";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { Reputation } from "../ui/React/Reputation";
import { CONSTANTS } from "../Constants";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { calculateFactionExp, calculateFactionRep } from "./formulas/Faction";
import { FactionWorkType } from "./data/FactionWorkType";

interface FactionWorkParams {
  singularity: boolean;
  factionWorkType: FactionWorkType;
  faction: string;
}

export const isFactionWork = (w: Work | null): w is FactionWork => w !== null && w.type === WorkType.FACTION;

export class FactionWork extends Work {
  factionWorkType: FactionWorkType;
  factionName: string;

  constructor(params?: FactionWorkParams) {
    super(WorkType.FACTION, params?.singularity ?? true);
    this.factionWorkType = params?.factionWorkType ?? FactionWorkType.HACKING;
    this.factionName = params?.faction ?? FactionNames.Sector12;
  }

  getFaction(): Faction {
    const f = Factions[this.factionName];
    if (!f) throw new Error(`Faction work started with invalid / unknown faction: '${this.factionName}'`);
    return f;
  }

  getReputationRate(player: IPlayer): number {
    let focusBonus = 1;
    if (!player.hasAugmentation(AugmentationNames.NeuroreceptorManager, true)) {
      focusBonus = player.focus ? 1 : CONSTANTS.BaseFocusBonus;
    }
    return calculateFactionRep(player, this.factionWorkType, this.getFaction().favor) * focusBonus;
  }

  getExpRates(player: IPlayer): WorkStats {
    let focusBonus = 1;
    if (!player.hasAugmentation(AugmentationNames.NeuroreceptorManager, true)) {
      focusBonus = player.focus ? 1 : CONSTANTS.BaseFocusBonus;
    }
    const rate = calculateFactionExp(player, this.factionWorkType);
    return scaleWorkStats(rate, focusBonus, false);
  }

  process(player: IPlayer, cycles: number): boolean {
    this.cyclesWorked += cycles;
    this.getFaction().playerReputation += this.getReputationRate(player) * cycles;

    const rate = this.getExpRates(player);
    applyWorkStats(player, player, rate, cycles, "class");

    return false;
  }

  finish(): void {
    if (!this.singularity) {
      dialogBoxCreate(
        <>
          You worked for {this.getFaction().name}.
          <br />
          They now have a total of <Reputation reputation={this.getFaction().playerReputation} /> reputation.
        </>,
      );
    }
  }

  APICopy(): Record<string, unknown> {
    return {
      type: this.type,
      cyclesWorked: this.cyclesWorked,
      factionWorkType: this.factionWorkType,
      factionName: this.factionName,
    };
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): IReviverValue {
    return Generic_toJSON("FactionWork", this);
  }

  /**
   * Initializes a FactionWork object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): FactionWork {
    return Generic_fromJSON(FactionWork, value.data);
  }
}

Reviver.constructors.FactionWork = FactionWork;
