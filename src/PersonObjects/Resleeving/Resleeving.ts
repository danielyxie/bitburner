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
import { IPlayer } from "../IPlayer";
import { Resleeve } from "./Resleeve";

import { Augmentation } from "../../Augmentation/Augmentation";
import { Augmentations } from "../../Augmentation/Augmentations";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { IPlayerOwnedAugmentation,
         PlayerOwnedAugmentation } from "../../Augmentation/PlayerOwnedAugmentation";

import { getRandomInt } from "../../../utils/helpers/getRandomInt";

// Executes the actual re-sleeve when one is purchased
export function purchaseResleeve(r: Resleeve, p: IPlayer): boolean {
    const cost: number = r.getCost();
    if (!p.canAfford(cost)) {
        return false;
    }
    p.loseMoney(cost);

    // Set the player's exp
    p.hacking_exp = r.hacking_exp;
    p.strength_exp = r.strength_exp;
    p.defense_exp = r.defense_exp;
    p.dexterity_exp = r.dexterity_exp;
    p.agility_exp = r.agility_exp;
    p.charisma_exp = r.charisma_exp;

    // Reset Augmentation "owned" data
    for (const augKey in Augmentations) {
        Augmentations[augKey].owned = false;
    }

    // Clear all of the player's augmentations, except the NeuroFlux Governor
    // which is kept
    for (let i = p.augmentations.length - 1; i >= 0; --i) {
        if (p.augmentations[i].name !== AugmentationNames.NeuroFluxGovernor) {
            p.augmentations.splice(i, 1);
        } else {
            // NeuroFlux Governor
            Augmentations[AugmentationNames.NeuroFluxGovernor].owned = true;
        }
    }

    for (let i = 0; i < r.augmentations.length; ++i) {
        p.augmentations.push(new PlayerOwnedAugmentation(r.augmentations[i].name));
        Augmentations[r.augmentations[i].name].owned = true;
    }

    // The player's purchased Augmentations should remain the same, but any purchased
    // Augmentations that are given by the resleeve should be removed so there are no duplicates
    for (let i = p.queuedAugmentations.length - 1; i >= 0; --i) {
        const name: string = p.queuedAugmentations[i].name;

        if (p.augmentations.filter((e: IPlayerOwnedAugmentation) => e.name !== AugmentationNames.NeuroFluxGovernor && e.name === name).length >= 1) {
            p.queuedAugmentations.splice(i, 1);
        }
    }

    p.reapplyAllAugmentations(true);
    p.reapplyAllSourceFiles(); // Multipliers get reset, so have to re-process source files too
    return true;
}

// Creates all of the Re-sleeves that will be available for purchase at VitaLife
export function generateResleeves(): Resleeve[] {
    const NumResleeves: number = 40; // Total number of Resleeves to generate

    const ret: Resleeve[] = [];
    for (let i = 0; i < NumResleeves; ++i) {
        // i will be a number indicating how "powerful" the Re-sleeve should be
        const r: Resleeve = new Resleeve();

        // Generate experience
        const expMult: number = (5 * i) + 1;
        r.hacking_exp = expMult * getRandomInt(1000, 5000);
        r.strength_exp = expMult * getRandomInt(1000, 5000);
        r.defense_exp = expMult * getRandomInt(1000, 5000);
        r.dexterity_exp = expMult * getRandomInt(1000, 5000);
        r.agility_exp = expMult * getRandomInt(1000, 5000);
        r.charisma_exp = expMult * getRandomInt(1000, 5000);

        // Generate Augs
        // Augmentation prequisites will be ignored for this
        const baseNumAugs: number = Math.max(2, Math.ceil((i + 3) / 2));
        const numAugs: number = getRandomInt(baseNumAugs, baseNumAugs + 2);
        const augKeys: string[] = Object.keys(Augmentations);
        for (let a = 0; a < numAugs; ++a) {
            // Get a random aug
            const randIndex: number = getRandomInt(0, augKeys.length - 1);
            const randKey: string = augKeys[randIndex];

            // Forbidden augmentations
            if (randKey === AugmentationNames.TheRedPill || randKey === AugmentationNames.NeuroFluxGovernor) {
                continue;
            }

            const randAug: Augmentation | null = Augmentations[randKey];
            r.augmentations.push({name: randAug.name, level: 1});
            r.applyAugmentation(Augmentations[randKey]);
            r.updateStatLevels();

            // Remove Augmentation so that there are no duplicates
            augKeys.splice(randIndex, 1);
        }

        ret.push(r);
    }

    return ret;
}
