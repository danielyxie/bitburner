/**
 * Implements the Re-sleeving mechanic for BitNode-10.
 * This allows the player to purchase and "use" new sleeves at VitaLife.
 * These new sleeves come with different starting experience and Augmentations
 * The cost of these new sleeves scales based on the exp and Augs.
 *
 * Note that this is different from the "Sleeve mechanic". The "Sleeve" mechanic
 * provides new sleeves, essentially clones. This Re-sleeving mechanic lets
 * the player purchase a new body with pre-existing Augmentations and experience
 *
 * As of right now, this feature is only available in BitNode 10
 */
import { Resleeve } from "./Resleeve";
import { IPlayer } from "../IPlayer";

import { Augmentation } from "../../Augmentation/Augmentation";
import { Augmentations } from "../../Augmentation/Augmentations";
import { IPlayerOwnedAugmentation,
         PlayerOwnedAugmentation } from "../../Augmentation/PlayerOwnedAugmentation";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";

import { getRandomInt } from "../../../utils/helpers/getRandomInt";


// Executes the actual re-sleeve when one is purchased
export function purchaseResleeve(r: Resleeve, p: IPlayer):void {
    // Set the player's exp
    p.hacking_exp = r.hacking_exp;
    p.strength_exp = r.strength_exp;
    p.defense_exp = r.defense_exp;
    p.dexterity_exp = r.dexterity_exp;
    p.agility_exp = r.agility_exp;
    p.charisma_exp = r.charisma_exp;

    // Clear all of the player's augmentations, except the NeuroFlux Governor
    // which is kept
    for (let i = p.augmentations.length - 1; i >= 0; --i) {
        if (p.augmentations[i].name !== AugmentationNames.NeuroFluxGovernor) {
            p.augmentations.splice(i, 1);
        }
    }

    for (let i = 0; i < r.augmentations.length; ++i) {
        p.augmentations.push(new PlayerOwnedAugmentation(r.augmentations[i].name));
    }

    // The player's purchased Augmentations should remain the same, but any purchased
    // Augmentations that are given by the resleeve should be removed so there are no duplicates
    for (let i = p.queuedAugmentations.length - 1; i >= 0; --i) {
        const name: string = p.queuedAugmentations[i].name;

        if (p.augmentations.filter((e: IPlayerOwnedAugmentation) => {e.name !== AugmentationNames.NeuroFluxGovernor && e.name === name}).length >= 1) {
            p.queuedAugmentations.splice(i, 1);
        }
    }

    p.reapplyAllAugmentations(true);
}

// Creates all of the Re-sleeves that will be available for purchase at VitaLife
export function generateResleeves(): Resleeve[] {
    const NumResleeves: number = 40; // Total number of Resleeves to generate

    let ret: Resleeve[] = [];
    for (let i = 0; i < NumResleeves; ++i) {
        // i will be a number indicating how "powerful" the Re-sleeve should be
        let r: Resleeve = new Resleeve();

        // Generate experience
        const expMult: number = i + 1;
        r.hacking_exp = expMult * getRandomInt(500, 1500);
        r.strength_exp = expMult * getRandomInt(500, 1500);
        r.defense_exp = expMult * getRandomInt(500, 1500);
        r.dexterity_exp = expMult * getRandomInt(500, 1500);
        r.agility_exp = expMult * getRandomInt(500, 1500);
        r.charisma_exp = expMult * getRandomInt(500, 1500);

        // Generate Augs
        const baseNumAugs: number = Math.ceil((i + 1) / 2);
        const numAugs: number = getRandomInt(baseNumAugs, baseNumAugs + 2);
        for (let a = 0; a < numAugs; ++a) {
            // We'll ignore Aug prerequisites for this
            const augKeys: string[] = Object.keys(Augmentations);
            const randKey: string = augKeys[getRandomInt(0, augKeys.length - 1)];
            const randAug: Augmentation | null = Augmentations[randKey];
            r.augmentations.push({name: randAug!.name, level: 1});
        }

        ret.push(r);
    }

    return ret;
}
