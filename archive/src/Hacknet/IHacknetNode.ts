// Interface for a Hacknet Node. Implemented by both a basic Hacknet Node,
// and the upgraded Hacknet Server in BitNode-9
export interface IHacknetNode {
  cores: number;
  level: number;
  onlineTimeSeconds: number;

  calculateCoreUpgradeCost: (levels: number, costMult: number) => number;
  calculateLevelUpgradeCost: (levels: number, costMult: number) => number;
  calculateRamUpgradeCost: (levels: number, costMult: number) => number;
  upgradeCore: (levels: number, prodMult: number) => void;
  upgradeLevel: (levels: number, prodMult: number) => void;
  upgradeRam: (levels: number, prodMult: number) => void;
}
