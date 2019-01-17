/**
 * Implements the Resleeve class, which defines a new body
 * that the player can "re-sleeve" into.
 */
import { Person } from "../Person";

import { Augmentation } from "../../Augmentation/Augmentation";
import { Augmentations } from "../../Augmentation/Augmentations";
import { CONSTANTS } from "../../Constants";

export class Resleeve extends Person {
    constructor() {
        super();
    }

    getCost(): number {
        // Each experience point adds this to the cost
        const CostPerExp: number = 5;

        // Final cost is multiplied by # Augs ^ this constant
        const NumAugsExponent: number = 1.05;

        // Get total exp in this re-sleeve
        let totalExp: number = this.hacking_exp +
                               this.strength_exp +
                               this.defense_exp +
                               this.dexterity_exp +
                               this.agility_exp +
                               this.charisma_exp;

        // Get total base Augmentation cost for this re-sleeve
        let totalAugmentationCost: number = 0;
        for (let i = 0; i < this.augmentations.length; ++i) {
            const aug: Augmentation | null = Augmentations[this.augmentations[i].name];
            if (aug == null) {
                console.error(`Could not find Augmentation ${this.augmentations[i].name}`);
                continue;
            }
            totalAugmentationCost += aug!.baseCost;
        }

        return (totalExp * CostPerExp) + (totalAugmentationCost * Math.pow(this.augmentations.length, NumAugsExponent));
    }

}
