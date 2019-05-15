/**
 * React component for displaying all of the player's purchased (but not installed)
 * Augmentations on the Augmentations UI.
 */
import * as React from "react";

import { Augmentations } from "../../Augmentation/Augmentations";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Player } from "../../Player";

import { AugmentationAccordion } from "../../ui/React/AugmentationAccordion";

export function PurchasedAugmentations(): React.ReactElement {
    const augs: React.ReactElement[] = [];
    for (const ownedAug of Player.queuedAugmentations) {
        const aug = Augmentations[ownedAug.name];
        let level = null;
        if (ownedAug.name === AugmentationNames.NeuroFluxGovernor) {
            level = ownedAug.level;
        }

        augs.push(
            <AugmentationAccordion aug={aug} key={ownedAug.name} level={level} />
        )
    }

    return (
        <ul className="augmentations-list">{augs}</ul>
    )
}
