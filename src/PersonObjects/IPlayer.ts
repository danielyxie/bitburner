/**
 * Interface for an object that represents the player (PlayerObject)
 * Used because at the time of implementation, the PlayerObject
 * cant be converted to TypeScript.
 */
import { Resleeve } from "./Resleeving/Resleeve";
import { Sleeve } from "./Sleeve/Sleeve";

import { IMap } from "../types";

import { IPlayerOwnedAugmentation }     from "../Augmentation/PlayerOwnedAugmentation";
import { Company }                      from "../Company/Company";
import { CompanyPosition }              from "../Company/CompanyPosition";
import { CityName }                     from "../Locations/data/CityNames";
import { Faction }                      from "../Faction/Faction";
import { HashManager }                  from "../Hacknet/HashManager";
import { HacknetNode }                  from "../Hacknet/HacknetNode";
import { LocationName }                 from "../Locations/data/LocationNames";
import { Server }                       from "../Server/Server";
import { IPlayerOwnedSourceFile }       from "../SourceFile/PlayerOwnedSourceFile";
import { MoneySourceTracker }           from "../utils/MoneySourceTracker";
import { Exploit }                        from "../Exploits/Exploit";

export interface IPlayer {
    // Class members
    augmentations: IPlayerOwnedAugmentation[];
    bladeburner: any;
    bitNodeN: number;
    city: CityName;
    companyName: string;
    corporation: any;
    currentServer: string;
    factions: string[];
    firstProgramAvailable: boolean;
    firstTimeTraveled: boolean;
    hacknetNodes: (HacknetNode | string)[]; // HacknetNode object or IP of Hacknet Server
    has4SData: boolean;
    has4SDataTixApi: boolean;
    hashManager: HashManager;
    hasTixApiAccess: boolean;
    hasWseAccount: boolean;
    homeComputer: string;
    hp: number;
    jobs: IMap<string>;
    karma: number;
    location: LocationName;
    max_hp: number;
    money: any;
    moneySourceA: MoneySourceTracker;
    moneySourceB: MoneySourceTracker;
    playtimeSinceLastAug: number;
    playtimeSinceLastBitnode: number;
    purchasedServers: any[];
    queuedAugmentations: IPlayerOwnedAugmentation[];
    resleeves: Resleeve[];
    scriptProdSinceLastAug: number;
    sleeves: Sleeve[];
    sleevesFromCovenant: number;
    sourceFiles: IPlayerOwnedSourceFile[];
    exploits: Exploit[];
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
    bladeburner_max_stamina_mult: number;
    bladeburner_stamina_gain_mult: number;
    bladeburner_analysis_mult: number;
    bladeburner_success_chance_mult: number;

    // Methods
    applyForAgentJob(sing?: boolean): boolean | void;
    applyForBusinessConsultantJob(sing?: boolean): boolean | void;
    applyForBusinessJob(sing?: boolean): boolean | void;
    applyForEmployeeJob(sing?: boolean): boolean | void;
    applyForItJob(sing?: boolean): boolean | void;
    applyForJob(entryPosType: CompanyPosition, sing?: boolean): boolean | void;
    applyForNetworkEngineerJob(sing?: boolean): boolean | void;
    applyForPartTimeEmployeeJob(sing?: boolean): boolean | void;
    applyForPartTimeWaiterJob(sing?: boolean): boolean | void;
    applyForSecurityEngineerJob(sing?: boolean): boolean | void;
    applyForSecurityJob(sing?: boolean): boolean | void;
    applyForSoftwareConsultantJob(sing?: boolean): boolean | void;
    applyForSoftwareJob(sing?: boolean): boolean | void;
    applyForWaiterJob(sing?: boolean): boolean | void;
    canAccessBladeburner(): boolean;
    canAccessCorporation(): boolean;
    canAccessGang(): boolean;
    canAccessResleeving(): boolean;
    canAfford(cost: number): boolean;
    gainHackingExp(exp: number): void;
    gainStrengthExp(exp: number): void;
    gainDefenseExp(exp: number): void;
    gainDexterityExp(exp: number): void;
    gainAgilityExp(exp: number): void;
    gainCharismaExp(exp: number): void;
    gainMoney(money: number): void;
    getCurrentServer(): Server;
    getGangFaction(): Faction;
    getGangName(): string;
    getHomeComputer(): Server;
    getNextCompanyPosition(company: Company, entryPosType: CompanyPosition): CompanyPosition;
    getUpgradeHomeRamCost(): number;
    gotoLocation(to: LocationName): boolean;
    hasCorporation(): boolean;
    hasGangWith(facName: string): boolean;
    hasTorRouter(): boolean;
    hasProgram(program: string): boolean;
    inBladeburner(): boolean;
    inGang(): boolean;
    isQualified(company: Company, position: CompanyPosition): boolean;
    loseMoney(money: number): void;
    reapplyAllAugmentations(resetMultipliers: boolean): void;
    reapplyAllSourceFiles(): void;
    regenerateHp(amt: number): void;
    recordMoneySource(amt: number, source: string): void;
    setMoney(amt: number): void;
    startBladeburner(p: object): void;
    startClass(costMult: number, expMult: number, className: string): void;
    startCorporation(corpName: string, additionalShares?: number): void;
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
    startFactionFieldWork(faction: Faction): void;
    startFactionHackWork(faction: Faction): void;
    startFactionSecurityWork(faction: Faction): void;
    startGang(facName: string, isHacking: boolean): void;
    startWork(companyName: string): void;
    startWorkPartTime(companyName: string): void;
    travel(to: CityName): boolean;
    giveExploit(exploit: Exploit): void;
    queryStatFromString(str: string): number;
    getIntelligenceBonus(weight: number): number;
}
