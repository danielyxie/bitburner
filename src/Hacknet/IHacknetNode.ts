// Interface for a Hacknet Node. Implemented by both a basic Hacknet Node,
// and the upgraded Hacknet Server in BitNode-9
import { IPlayer } from "../PersonObjects/IPlayer";

export interface IHacknetNode {
    cores: number;
    level: number;
    onlineTimeSeconds: number;

    calculateCoreUpgradeCost: (levels: number, p: IPlayer) => number;
    calculateLevelUpgradeCost: (levels: number, p: IPlayer) => number;
    calculateRamUpgradeCost: (levels: number, p: IPlayer) => number;
    purchaseCoreUpgrade: (levels: number, p: IPlayer) => boolean;
    purchaseLevelUpgrade: (levels: number, p: IPlayer) => boolean;
    purchaseRamUpgrade: (levels: number, p: IPlayer) => boolean;
}
