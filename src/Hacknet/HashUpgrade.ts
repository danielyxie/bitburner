/**
 * Object representing an upgrade that can be purchased with hashes
 */
export interface IConstructorParams {
    cost?: number;
    costPerLevel: number;
    desc: string;
    hasTargetServer?: boolean;
    name: string;
    value: number;
}

export class HashUpgrade {
    /**
     * If the upgrade has a flat cost (never increases), it goes here
     * Otherwise, this property should be undefined
     *
     * This property overrides the 'costPerLevel' property
     */
    cost?: number;

    /**
     * Base cost for this upgrade. Every time the upgrade is purchased,
     * its cost increases by this same amount (so its 1x, 2x, 3x, 4x, etc.)
     */
    costPerLevel = 0;

    /**
     * Description of what the upgrade does
     */
    desc = "";

    /**
     * Boolean indicating that this upgrade's effect affects a single server,
     * the "target" server
     */
    hasTargetServer = false;

    // Name of upgrade
    name = "";

    // Generic value used to indicate the potency/amount of this upgrade's effect
    // The meaning varies between different upgrades
    value = 0;

    constructor(p: IConstructorParams) {
        if (p.cost != null) { this.cost = p.cost; }

        this.costPerLevel = p.costPerLevel;
        this.desc = p.desc;
        this.hasTargetServer = p.hasTargetServer ? p.hasTargetServer : false;
        this.name = p.name;
        this.value = p.value;
    }

    getCost(levels: number): number {
        if (typeof this.cost === "number") { return this.cost; }

        return Math.round((levels + 1) * this.costPerLevel);
    }
}
