import React from "react";
import { Work, WorkType } from "./Work";
import { Reviver, Generic_toJSON, Generic_fromJSON, IReviverValue } from "../utils/JSONReviver";
import { IPlayer } from "../PersonObjects/IPlayer";
import { FactionNames } from "../Faction/data/FactionNames";
import { Factions } from "../Faction/Factions";
import { Faction } from "../Faction/Faction";
import { applyWorkStats, WorkStats } from "./WorkStats";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { Reputation } from "../ui/React/Reputation";
import {
  getFactionFieldWorkRepGain,
  getFactionSecurityWorkRepGain,
  getHackingWorkRepGain,
} from "../PersonObjects/formulas/reputation";
import { CONSTANTS } from "../Constants";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { calculateFactionExp } from "./formulas/Faction";
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
    const faction = this.getFaction();
    const repFormulas = {
      [FactionWorkType.HACKING]: getHackingWorkRepGain,
      [FactionWorkType.FIELD]: getFactionFieldWorkRepGain,
      [FactionWorkType.SECURITY]: getFactionSecurityWorkRepGain,
    };
    const rep = repFormulas[this.factionWorkType](player, faction);
    let focusBonus = 1;
    if (!player.hasAugmentation(AugmentationNames.NeuroreceptorManager)) {
      focusBonus = player.focus ? 1 : CONSTANTS.BaseFocusBonus;
    }
    return rep * focusBonus;
  }

  getExpRates(player: IPlayer): WorkStats {
    return calculateFactionExp(player, this.factionWorkType);
  }

  process(player: IPlayer, cycles: number): boolean {
    this.cyclesWorked += cycles;
    this.getFaction().playerReputation += this.getReputationRate(player) * cycles;

    const rate = this.getExpRates(player);
    applyWorkStats(player, rate, cycles, "class");

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

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): IReviverValue {
    return Generic_toJSON("FactionWork", this);
  }

  /**
   * Initiatizes a FactionWork object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): FactionWork {
    return Generic_fromJSON(FactionWork, value.data);
  }
}

Reviver.constructors.FactionWork = FactionWork;
