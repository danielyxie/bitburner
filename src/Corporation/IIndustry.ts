import { Material } from "./Material";
import { Warehouse } from "./Warehouse";
import { ICorporation } from "./ICorporation";
import { OfficeSpace } from "./OfficeSpace";
import { Product } from "./Product";
import { IndustryUpgrade } from "./IndustryUpgrades";

export interface IIndustry {
    name: string;
    type: string;
    sciResearch: Material;
    researched: any;
    reqMats: any;

    prodMats: string[];

    products: any;
    makesProducts: boolean;

    awareness: number;
    popularity: number;
    startingCost: number;

    reFac: number;
    sciFac: number;
    hwFac: number;
    robFac: number;
    aiFac: number;
    advFac: number;

    prodMult: number;

    // Decimal
    lastCycleRevenue: any;
    lastCycleExpenses: any;
    thisCycleRevenue: any;
    thisCycleExpenses: any;

    upgrades: number[];

    state: string;
    newInd: boolean;
    warehouses: any;
    offices: any;


    init(): void;
    getProductDescriptionText(): string;
    getMaximumNumberProducts(): number;
    hasMaximumNumberProducts(): boolean;
    calculateProductionFactors(): void;
    updateWarehouseSizeUsed(warehouse: Warehouse): void;
    process(marketCycles: number, state: string, corporation: ICorporation): void;
    processMaterialMarket(): void;
    processProductMarket(marketCycles: number): void;
    processMaterials(marketCycles: number, corporation: ICorporation): [number, number];
    processProducts(marketCycles: number, corporation: ICorporation): [number, number];
    processProduct(marketCycles: number, product: Product, corporation: ICorporation): number;
    discontinueProduct(product: Product): void;
    upgrade(upgrade: IndustryUpgrade, refs: {corporation: any; office: OfficeSpace}): void;
    getOfficeProductivity(office: OfficeSpace, params?: any): number;
    getBusinessFactor(office: OfficeSpace): number;
    getAdvertisingFactors(): [number, number, number, number];
    getMarketFactor(mat: {dmd: number; cmp: number}): number;
    hasResearch(name: string): boolean;
    updateResearchTree(): void;
    getAdvertisingMultiplier(): number;
    getEmployeeChaMultiplier(): number;
    getEmployeeCreMultiplier(): number;
    getEmployeeEffMultiplier(): number;
    getEmployeeIntMultiplier(): number;
    getProductionMultiplier(): number;
    getProductProductionMultiplier(): number;
    getSalesMultiplier(): number;
    getScientificResearchMultiplier(): number;
    getStorageMultiplier(): number;
    toJSON(): any;
}