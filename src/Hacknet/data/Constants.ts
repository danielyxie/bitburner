export const HacknetNodeConstants = {
  MoneyGainPerLevel: 1.5,

  BaseCost: 1000,
  LevelBaseCost: 1,
  RamBaseCost: 30e3,
  CoreBaseCost: 500e3,

  PurchaseNextMult: 1.85,
  UpgradeLevelMult: 1.04,
  UpgradeRamMult: 1.28,
  UpgradeCoreMult: 1.48,

  MaxLevel: 200,
  MaxRam: 64,
  MaxCores: 16,
};

export const PurchaseMultipliers: {
  [key: string]: number | "MAX" | undefined;
  x1: number;
  x5: number;
  x10: number;
  MAX: "MAX";
} = {
  x1: 1,
  x5: 5,
  x10: 10,
  MAX: "MAX",
};

export const HacknetServerConstants = {
  HashesPerLevel: 0.001,

  BaseCost: 50e3,
  RamBaseCost: 200e3,
  CoreBaseCost: 1e6,
  CacheBaseCost: 10e6,

  PurchaseMult: 3.2,
  UpgradeLevelMult: 1.1,
  UpgradeRamMult: 1.4,
  UpgradeCoreMult: 1.55,
  UpgradeCacheMult: 1.85,

  MaxServers: 20,

  MaxLevel: 300,
  MaxRam: 8192,
  MaxCores: 128,
  MaxCache: 15,
};
