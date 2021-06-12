import { Augmentation } from "../Augmentation/Augmentation";
import { Faction } from "../Faction/Faction";

export declare function getNextNeurofluxLevel(): number;
export declare function hasAugmentationPrereqs(aug: Augmentation): boolean;
export declare function purchaseAugmentationBoxCreate(aug: Augmentation, fac: Faction): void;
export declare function purchaseAugmentation(aug: Augmentation, fac: Faction, sing?: boolean): void;
export declare function joinFaction(fac: Faction): void;
export declare function displayFactionContent(factionName: string, initiallyOnAugmentationsPage=false);