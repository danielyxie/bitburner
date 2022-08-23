import { CityName } from "./../../Locations/data/CityNames";
const CyclesPerMarketCycle = 50;
const AllCorporationStates = ["START", "PURCHASE", "PRODUCTION", "SALE", "EXPORT"];
export const CorporationConstants: {
  INITIALSHARES: number;
  SHARESPERPRICEUPDATE: number;
  IssueNewSharesCooldown: number;
  SellSharesCooldown: number;
  CyclesPerMarketCycle: number;
  CyclesPerIndustryStateCycle: number;
  SecsPerMarketCycle: number;
  Cities: string[];
  WarehouseInitialCost: number;
  WarehouseInitialSize: number;
  WarehouseUpgradeBaseCost: number;
  OfficeInitialCost: number;
  OfficeInitialSize: number;
  OfficeUpgradeBaseCost: number;
  BribeThreshold: number;
  BribeToRepRatio: number;
  ProductProductionCostRatio: number;
  DividendMaxRate: number;
  EmployeeSalaryMultiplier: number;
  CyclesPerEmployeeRaise: number;
  EmployeeRaiseAmount: number;
  BaseMaxProducts: number;
  AllCorporationStates: string[];
  AllMaterials: string[];
  AllIndustryTypes: string[];
  AllUnlocks: string[];
  AllUpgrades: string[];
  AllResearch: string[];
  FundingRoundShares: number[];
  FundingRoundMultiplier: number[];
  AvgProfitLength: number;
} = {
  INITIALSHARES: 1e9, //Total number of shares you have at your company
  SHARESPERPRICEUPDATE: 1e6, //When selling large number of shares, price is dynamically updated for every batch of this amount
  IssueNewSharesCooldown: 216e3, // 12 Hour in terms of game cycles
  SellSharesCooldown: 18e3, // 1 Hour in terms of game cycles

  CyclesPerMarketCycle: CyclesPerMarketCycle,
  CyclesPerIndustryStateCycle: CyclesPerMarketCycle / AllCorporationStates.length,
  SecsPerMarketCycle: CyclesPerMarketCycle / 5,

  Cities: [
    CityName.Aevum,
    CityName.Chongqing,
    CityName.Sector12,
    CityName.NewTokyo,
    CityName.Ishima,
    CityName.Volhaven,
  ],

  WarehouseInitialCost: 5e9, //Initial purchase cost of warehouse
  WarehouseInitialSize: 100,
  WarehouseUpgradeBaseCost: 1e9,

  OfficeInitialCost: 4e9,
  OfficeInitialSize: 3,
  OfficeUpgradeBaseCost: 1e9,

  BribeThreshold: 100e12, //Money needed to be able to bribe for faction rep
  BribeToRepRatio: 1e9, //Bribe Value divided by this = rep gain

  ProductProductionCostRatio: 5, //Ratio of material cost of a product to its production cost

  DividendMaxRate: 1,

  EmployeeSalaryMultiplier: 3, // Employee stats multiplied by this to determine initial salary
  CyclesPerEmployeeRaise: 400, // All employees get a raise every X market cycles
  EmployeeRaiseAmount: 50, // Employee salary increases by this (additive)

  BaseMaxProducts: 3, // Initial value for maximum number of products allowed
  AllCorporationStates: AllCorporationStates,
  AllMaterials: [
    "Water",
    "Energy",
    "Food",
    "Plants",
    "Metal",
    "Hardware",
    "Chemicals",
    "Drugs",
    "Robots",
    "AI Cores",
    "Real Estate",
  ],
  AllIndustryTypes: [
    "Energy",
    "Utilities",
    "Agriculture",
    "Fishing",
    "Mining",
    "Food",
    "Tobacco",
    "Chemical",
    "Pharmaceutical",
    "Hardware",
    "Robotics",
    "Software",
    "Healthcare",
    "RealEstate",
  ],
  AllUnlocks: [
    "Export",
    "Smart Supply",
    "Market Research - Demand",
    "Market Data - Competition",
    "VeChain",
    "Shady Accounting",
    "Government Partnership",
    "Warehouse API",
    "Office API",
  ],
  AllUpgrades: [
    "Smart Factories",
    "Smart Storage",
    "DreamSense",
    "Wilson Analytics",
    "Nuoptimal Nootropic Injector Implants",
    "Speech Processor Implants",
    "Neural Accelerators",
    "FocusWires",
    "ABC SalesBots",
    "Project Insight",
  ],
  AllResearch: [
    "Hi-Tech R&D Laboratory",
    "AutoBrew",
    "AutoPartyManager",
    "Automatic Drug Administration",
    "Bulk Purchasing",
    "CPH4 Injections",
    "Drones",
    "Drones - Assembly",
    "Drones - Transport",
    "Go-Juice",
    "HRBuddy-Recruitment",
    "HRBuddy-Training",
    "JoyWire",
    "Market-TA.I",
    "Market-TA.II",
    "Overclock",
    "Self-Correcting Assemblers",
    "Sti.mu",
    "sudo.Assist",
    "uPgrade: Capacity.I",
    "uPgrade: Capacity.II",
    "uPgrade: Dashboard",
    "uPgrade: Fulcrum",
  ],
  FundingRoundShares: [0.1, 0.35, 0.25, 0.2],
  FundingRoundMultiplier: [4, 3, 3, 2.5],

  AvgProfitLength: 1,
};
