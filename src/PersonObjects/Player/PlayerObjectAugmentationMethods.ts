/**
 * Augmentation-related methods for the Player class (PlayerObject)
 */
import { IPlayer } from "../IPlayer";

import { Augmentation } from "../../Augmentation/Augmentation";

export function hasAugmentation(this: IPlayer, aug: string | Augmentation): boolean {
    const augName: string = (aug instanceof Augmentation) ? aug.name : aug;

    for (const owned of this.augmentations) {
        if (owned.name === augName) { return true; }
    }

    for (const owned of this.queuedAugmentations) {
        if (owned.name === augName) { return true; }
    }

    return false;
}
