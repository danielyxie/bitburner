import { FactionInfo, FactionInfos } from "./FactionInfo";
import { favorToRep, repToFavor } from "./formulas/favor";
import {
  Generic_fromJSON,
  Generic_toJSON,
  Reviver,
} from "../../utils/JSONReviver";

export class Faction {
  /**
   * Flag signalling whether the player has already received an invitation
   * to this faction
   */
  alreadyInvited = false;

  /**
   * Holds names of all augmentations that this Faction offers
   */
  augmentations: string[] = [];

  /**
   * Amount of favor the player has with this faction.
   */
  favor = 0;

  /**
   * Flag signalling whether player has been banned from this faction
   */
  isBanned = false;

  /**
   * Flag signalling whether player is a member of this faction
   */
  isMember = false;

  /**
   * Name of faction
   */
  name = "";

  /**
   * Amount of reputation player has with this faction
   */
  playerReputation = 0;

  /**
   * Reputation from the last "prestige" that was not converted to favor.
   * This reputation rolls over and is used for the next favor calculation
   */
  rolloverRep = 0;

  constructor(name = "") {
    this.name = name;
  }

  getInfo(): FactionInfo {
    const info = FactionInfos[this.name];
    if (info == null) {
      throw new Error(
        `Missing faction from FactionInfos: ${this.name} this probably means the faction got corrupted somehow`,
      );
    }

    return info;
  }

  gainFavor(): void {
    if (this.favor == null) {
      this.favor = 0;
    }
    if (this.rolloverRep == null) {
      this.rolloverRep = 0;
    }
    const res = this.getFavorGain();
    if (res.length !== 2) {
      console.error("Invalid result from getFavorGain() function");
      return;
    }
    this.favor += res[0];
    this.rolloverRep = res[1];
  }

  //Returns an array with [How much favor would be gained, how much rep would be left over]
  getFavorGain(): number[] {
    if (this.favor == null) {
      this.favor = 0;
    }
    if (this.rolloverRep == null) {
      this.rolloverRep = 0;
    }
    const storedRep = Math.max(0, favorToRep(this.favor - 1));
    const totalRep = storedRep + this.rolloverRep + this.playerReputation;
    const newFavor = Math.floor(repToFavor(totalRep));
    const newRep = favorToRep(newFavor);
    return [newFavor - this.favor + 1, totalRep - newRep];
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): any {
    return Generic_toJSON("Faction", this);
  }

  /**
   * Initiatizes a Faction object from a JSON save state.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): Faction {
    return Generic_fromJSON(Faction, value.data);
  }
}

Reviver.constructors.Faction = Faction;
