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
  DividendMaxPercentage: number;
  EmployeeSalaryMultiplier: number;
  CyclesPerEmployeeRaise: number;
  EmployeeRaiseAmount: number;
  BaseMaxProducts: number;
  AllCorporationStates: string[];
  AllMaterials: string[];
} = {
  INITIALSHARES: 1e9, //Total number of shares you have at your company
  SHARESPERPRICEUPDATE: 1e6, //When selling large number of shares, price is dynamically updated for every batch of this amount
  IssueNewSharesCooldown: 216e3, // 12 Hour in terms of game cycles
  SellSharesCooldown: 18e3, // 1 Hour in terms of game cycles

  CyclesPerMarketCycle: CyclesPerMarketCycle,
  CyclesPerIndustryStateCycle: CyclesPerMarketCycle / AllCorporationStates.length,
  SecsPerMarketCycle: CyclesPerMarketCycle / 5,

  Cities: ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"],

  WarehouseInitialCost: 5e9, //Initial purchase cost of warehouse
  WarehouseInitialSize: 100,
  WarehouseUpgradeBaseCost: 1e9,

  OfficeInitialCost: 4e9,
  OfficeInitialSize: 3,
  OfficeUpgradeBaseCost: 1e9,

  BribeThreshold: 100e12, //Money needed to be able to bribe for faction rep
  BribeToRepRatio: 1e9, //Bribe Value divided by this = rep gain

  ProductProductionCostRatio: 5, //Ratio of material cost of a product to its production cost

  DividendMaxPercentage: 1,

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
};
