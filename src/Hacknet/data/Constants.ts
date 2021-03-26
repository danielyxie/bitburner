export const HacknetNodeConstants: {
    // Constants for Hacknet Node production
    MoneyGainPerLevel: number;

    // Constants for Hacknet Node purchase/upgrade costs
    BaseCost: number;
    LevelBaseCost: number;
    RamBaseCost: number;
    CoreBaseCost: number;

    PurchaseNextMult: number;
    UpgradeLevelMult: number;
    UpgradeRamMult: number;
    UpgradeCoreMult: number;

    // Constants for max upgrade levels for Hacknet Nodes
    MaxLevel: number;
    MaxRam: number;
    MaxCores: number;
} = {
    MoneyGainPerLevel: 1.6,

    BaseCost:       1000,
    LevelBaseCost:     1,
    RamBaseCost:    30e3,
    CoreBaseCost:  500e3,
    
    PurchaseNextMult: 1.85,
    UpgradeLevelMult: 1.04,
    UpgradeRamMult:   1.28,
    UpgradeCoreMult:  1.48,

    MaxLevel: 200,
    MaxRam:    64,
    MaxCores:  16,
}

export const HacknetServerConstants: {
    // Constants for Hacknet Server stats/production
    HashesPerLevel: number;

    // Constants for Hacknet Server purchase/upgrade costs
    BaseCost: number;
    RamBaseCost: number;
    CoreBaseCost: number;
    CacheBaseCost: number;

    PurchaseMult: number; // Multiplier for puchasing an additional Hacknet Server
    UpgradeLevelMult: number; // Multiplier for cost when upgrading level
    UpgradeRamMult: number; // Multiplier for cost when upgrading RAM
    UpgradeCoreMult: number; // Multiplier for cost when buying another core
    UpgradeCacheMult: number; // Multiplier for cost when upgrading cache
    MaxServers: number; // Max number of Hacknet Servers you can own

    // Constants for max upgrade levels for Hacknet Server
    MaxLevel: number;
    MaxRam: number;
    MaxCores: number;
    MaxCache: number;
} = {
    HashesPerLevel: 0.001,

    BaseCost:       50e3,
    RamBaseCost:   200e3,
    CoreBaseCost:    1e6,
    CacheBaseCost:  10e6,
    
    PurchaseMult:     3.20,
    UpgradeLevelMult: 1.10,
    UpgradeRamMult:   1.40,
    UpgradeCoreMult:  1.55,
    UpgradeCacheMult: 1.85,
    
    MaxServers: 20,

    MaxLevel:  300,
    MaxRam:   8192,
    MaxCores:  128,
    MaxCache:   15,
}
