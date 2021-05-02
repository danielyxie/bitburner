/**
 * Implements the Resleeve class, which defines a new body
 * that the player can "re-sleeve" into.
 */
import { Person } from "../Person";

import { Augmentation } from "../../Augmentation/Augmentation";
import { Augmentations } from "../../Augmentation/Augmentations";

import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../../utils/JSONReviver";

export class Resleeve extends Person {

    constructor() {
        super();
    }

    getCost(): number {
        // Each experience point adds this to the cost
        const CostPerExp = 25e3;

        // Final cost is multiplied by this constant ^ # Augs
        const NumAugsExponent = 1.2;

        // Get total exp in this re-sleeve
        const totalExp: number = this.hacking_exp +
                               this.strength_exp +
                               this.defense_exp +
                               this.dexterity_exp +
                               this.agility_exp +
                               this.charisma_exp;

        // Get total base Augmentation cost for this re-sleeve
        let totalAugmentationCost = 0;
        for (let i = 0; i < this.augmentations.length; ++i) {
            const aug: Augmentation | null = Augmentations[this.augmentations[i].name];
            if (aug == null) {
                console.error(`Could not find Augmentation ${this.augmentations[i].name}`);
                continue;
            }
            totalAugmentationCost += aug.startingCost;
        }

        return (totalExp * CostPerExp) + (totalAugmentationCost * Math.pow(NumAugsExponent, this.augmentations.length));
    }

    /**
     * Serialize the current object to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("Resleeve", this);
    }

    /**
     * Initiatizes a Resleeve object from a JSON save state.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static fromJSON(value: any): Resleeve {
        return Generic_fromJSON(Resleeve, value.data);
    }
}

Reviver.constructors.Resleeve = Resleeve;
