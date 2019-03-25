// Interface for an object that represents the player (PlayerObject)
// Used because at the time of implementation, the PlayerObject
// cant be converted to TypeScript.
//
// Only contains the needed properties for Sleeve implementation
import { Resleeve } from "./Resleeving/Resleeve";
import { Sleeve } from "./Sleeve/Sleeve";

import { IMap } from "../types";

import { IPlayerOwnedAugmentation } from "../Augmentation/PlayerOwnedAugmentation";
import { HacknetNode } from "../Hacknet/HacknetNode";
import { HacknetServer } from "../Hacknet/HacknetServer";
import { IPlayerOwnedSourceFile } from "../SourceFile/PlayerOwnedSourceFile";
import { MoneySourceTracker } from "../utils/MoneySourceTracker";

export interface IPlayer {
    // Class members
    augmentations: IPlayerOwnedAugmentation[];
    bladeburner: any;
    bitNodeN: number;
    city: string;
    companyName: string;
    corporation: any;
    currentServer: string;
    factions: string[];
    hacknetNodes: (HacknetNode | HacknetServer)[];
    hasWseAccount: boolean;
    jobs: IMap<string>;
    karma: number;
    money: any;
    moneySourceA: MoneySourceTracker;
    moneySourceB: MoneySourceTracker;
    playtimeSinceLastAug: number;
    playtimeSinceLastBitnode: number;
    purchasedServers: any[];
    queuedAugmentations: IPlayerOwnedAugmentation[];
    resleeves: Resleeve[];
    sleeves: Sleeve[];
    sleevesFromCovenant: number;
    sourceFiles: IPlayerOwnedSourceFile[];
    totalPlaytime: number;

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
    hacking_chance_mult: number;
    hacking_speed_mult: number;
    hacking_money_mult: number;
    hacking_grow_mult: number;
    hacking_mult: number;
    hacking_exp_mult: number;
    strength_mult: number;
    strength_exp_mult: number;
    defense_mult: number;
    defense_exp_mult: number;
    dexterity_mult: number;
    dexterity_exp_mult: number;
    agility_mult: number;
    agility_exp_mult: number;
    charisma_mult: number;
    charisma_exp_mult: number;
    hacknet_node_money_mult: number;
    hacknet_node_purchase_cost_mult: number;
    hacknet_node_ram_cost_mult: number;
    hacknet_node_core_cost_mult: number;
    hacknet_node_level_cost_mult: number;
    company_rep_mult: number;
    faction_rep_mult: number;
    work_money_mult: number;
    crime_success_mult: number;
    crime_money_mult: number;

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
    recordMoneySource(amt: number, source: string): void;
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
