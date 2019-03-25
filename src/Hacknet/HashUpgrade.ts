/**
 * Object representing an upgrade that can be purchased with hashes
 */
export interface IConstructorParams {
    costPerLevel: number;
    desc: string;
    hasTargetServer?: boolean;
    name: string;
    value: number;
}

export class HashUpgrade {
    /**
     * Base cost for this upgrade. Every time the upgrade is purchased,
     * its cost increases by this same amount (so its 1x, 2x, 3x, 4x, etc.)
     */
    costPerLevel: number = 0;

    /**
     * Description of what the upgrade does
     */
    desc: string = "";

    /**
     * Boolean indicating that this upgrade's effect affects a single server,
     * the "target" server
     */
    hasTargetServer: boolean = false;

    // Name of upgrade
    name: string = "";

    // Generic value used to indicate the potency/amount of this upgrade's effect
    // The meaning varies between different upgrades
    value: number = 0;

    constructor(p: IConstructorParams) {
        this.costPerLevel = p.costPerLevel;
        this.desc = p.desc;
        this.hasTargetServer = p.hasTargetServer ? p.hasTargetServer : false;
        this.name = p.name;
        this.value = p.value;
    }

    getCost(levels: number): number {
        return Math.round((levels + 1) * this.costPerLevel);
    }
}
