/**
 * React Component for displaying a list of the player's Source-Files
 * on the Augmentations UI
 */
import * as React from "react";

import { Player } from "../../Player";
import { Augmentations } from "../../Augmentation/Augmentations";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Settings } from "../../Settings/Settings";
import { OwnedAugmentationsOrderSetting } from "../../Settings/SettingEnums";

import { AugmentationAccordion } from "../../ui/React/AugmentationAccordion";

export function OwnedSourceFiles(): React.ReactElement {
    const sourceAugs = Player.augmentations.slice();

    if (Settings.OwnedAugmentationsOrder === OwnedAugmentationsOrderSetting.Alphabetically) {
        sourceAugs.sort((aug1, aug2) => {
            return aug1.name <= aug2.name ? -1 : 1;
        });
    }

    const augs = sourceAugs.map((e) => {
        const aug = Augmentations[e.name];

        let level = null;
        if (e.name === AugmentationNames.NeuroFluxGovernor) {
            level = e.level;
        }

        return (
            <AugmentationAccordion aug={aug} key={e.name} level={level} />
        )
    });

    return (
        <ul>{augs}</ul>
    )
}
