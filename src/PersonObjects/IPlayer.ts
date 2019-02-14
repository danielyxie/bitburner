// Interface for an object that represents the player (PlayerObject)
// Used because at the time of implementation, the PlayerObject
// cant be converted to TypeScript.
//
// Only contains the needed properties for Sleeve implementation
import { Resleeve } from "./Resleeving/Resleeve";
import { Sleeve } from "./Sleeve/Sleeve";

import { IMap } from "../types";

import { IPlayerOwnedAugmentation } from "../Augmentation/PlayerOwnedAugmentation";
import { IPlayerOwnedSourceFile } from "../SourceFile/PlayerOwnedSourceFile";

export interface IPlayer {
    // Class members
    augmentations: IPlayerOwnedAugmentation[];
    bladeburner: any;
    bitNodeN: number;
    companyName: string;
    corporation: any;
    factions: string[];
    hasWseAccount: boolean;
    jobs: IMap<string>;
    money: any;
    queuedAugmentations: IPlayerOwnedAugmentation[];
    resleeves: Resleeve[];
    sleeves: Sleeve[];
    sleevesFromCovenant: number;
    sourceFiles: IPlayerOwnedSourceFile[];

    // Stats
    hacking_skill: number;
    strength: number;
    defense: number;
    dexterity: number;
    agility: number;
    charisma: number;
    intelligence: number;

    // Experience
    hacking_exp: number;
    strength_exp: number;
    defense_exp: number;
    dexterity_exp: number;
    agility_exp: number;
    charisma_exp: number;

    // Multipliers
    crime_success_mult: number;

    // Methods
    canAfford(cost: number): boolean;
    gainHackingExp(exp: number): void;
    gainStrengthExp(exp: number): void;
    gainDefenseExp(exp: number): void;
    gainDexterityExp(exp: number): void;
    gainAgilityExp(exp: number): void;
    gainCharismaExp(exp: number): void;
    gainMoney(money: number): void;
    hasCorporation(): boolean;
    inBladeburner(): boolean;
    inGang(): boolean;
    loseMoney(money: number): void;
    reapplyAllAugmentations(resetMultipliers: boolean): void;
    reapplyAllSourceFiles(): void;
    startCrime(crimeType: string,
               hackExp: number,
               strExp: number,
               defExp: number,
               dexExp: number,
               agiExp: number,
               chaExp: number,
               money: number,
               time: number,
               singParams: any): void;
}
