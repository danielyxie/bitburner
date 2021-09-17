import { Augmentation } from "../Augmentation/Augmentation";
import { Faction } from "../Faction/Faction";

export declare function getNextNeurofluxLevel(): number;
export declare function hasAugmentationPrereqs(aug: Augmentation): boolean;
export declare function purchaseAugmentation(aug: Augmentation, fac: Faction, sing?: boolean): void;
export declare function joinFaction(faction: Faction): void;
export declare function startHackingMission(faction: Faction): void;
