import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";
import { CONSTANTS } from "../Constants";
import { FactionInfo,
         FactionInfos } from "./FactionInfo";

export class Faction {
    /**
     * Initiatizes a Faction object from a JSON save state.
     */
    static fromJSON(value: any): Faction {
        return Generic_fromJSON(Faction, value.data);
    }

    /**
     * Flag signalling whether the player has already received an invitation
     * to this faction
     */
    alreadyInvited: boolean = false;

    /**
     * Holds names of all augmentations that this Faction offers
     */
    augmentations: string[] = [];

    /**
     * Amount of favor the player has with this faction.
     */
    favor: number = 0;

    /**
     * Flag signalling whether player has been banned from this faction
     */
    isBanned: boolean = false;

    /**
     * Flag signalling whether player is a member of this faction
     */
    isMember: boolean = false;

    /**
     * Name of faction
     */
    name: string = "";

    /**
     * Amount of reputation player has with this faction
     */
    playerReputation: number = 0;

    /**
     * Reputation from the last "prestige" that was not converted to favor.
     * This reputation rolls over and is used for the next favor calculation
     */
    rolloverRep: number = 0;

    constructor(name: string= "") {
        this.name = name;
    }

    getInfo(): FactionInfo {
        const info = FactionInfos[this.name];
        if (info == null) {
            throw new Error(`Missing faction from FactionInfos: ${this.name} this probably means the faction got corrupted somehow`);
        }

        return info;
    }

    gainFavor(): void {
        if (this.favor == null) { this.favor = 0; }
        if (this.rolloverRep == null) { this.rolloverRep = 0; }
        const res = this.getFavorGain();
        if (res.length !== 2) {
            console.error("Invalid result from getFavorGain() function");
            return;
        }
        this.favor += res[0];
        this.rolloverRep = res[1];
    }

    // Returns an array with [How much favor would be gained, how much rep would be left over]
    getFavorGain(): number[] {
        if (this.favor == null) { this.favor = 0; }
        if (this.rolloverRep == null) { this.rolloverRep = 0; }
        let favorGain = 0, rep = this.playerReputation + this.rolloverRep;
        let reqdRep = CONSTANTS.FactionReputationToFavorBase *
                      Math.pow(CONSTANTS.FactionReputationToFavorMult, this.favor);
        while (rep > 0) {
            if (rep >= reqdRep) {
                ++favorGain;
                rep -= reqdRep;
            } else {
                break;
            }
            reqdRep *= CONSTANTS.FactionReputationToFavorMult;
        }
        return [favorGain, rep];
    }

    /**
     * Serialize the current object to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("Faction", this);
    }
}

Reviver.constructors.Faction = Faction;
