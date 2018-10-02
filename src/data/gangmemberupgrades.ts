export interface IGangMemberUpgradeMetadata {
    cost: number;
    mults: any;
    name: string;
    upgType: string;
}

export const gangMemberUpgradesMetadata: IGangMemberUpgradeMetadata[] = [
    {
        cost: 1e6,
        mults: {str: 1.04, def: 1.04},
        name: "Baseball Bat",
        upgType: "w",
    },
    {
        cost: 12e6,
        mults: {str: 1.08, def: 1.08, dex: 1.08},
        name: "Katana",
        upgType: "w",
    },
    {
        cost: 25e6,
        mults: {str: 1.10, def: 1.10, dex: 1.10, agi: 1.10},
        name: "Glock 18C",
        upgType: "w",
    },
    {
        cost: 50e6,
        mults: {str: 1.12, def: 1.12, agi: 1.10},
        name: "P90C",
        upgType: "w",
    },
    {
        cost: 60e6,
        mults: {str: 1.20, def: 1.20},
        name: "Steyr AUG",
        upgType: "w",
    },
    {
        cost: 100e6,
        mults: {str: 1.25, def: 1.25},
        name: "AK-47",
        upgType: "w",
    },
    {
        cost: 150e6,
        mults: {str: 1.30, def: 1.30},
        name: "M15A10 Assault Rifle",
        upgType: "w",
    },
    {
        cost: 225e6,
        mults: {str: 1.30, dex: 1.30, agi: 1.30},
        name: "AWM Sniper Rifle",
        upgType: "w",
    },
    {
        cost: 2e6,
        mults: {def: 1.04},
        name: "Bulletproof Vest",
        upgType: "a",
    },
    {
        cost: 5e6,
        mults: {def: 1.08},
        name: "Full Body Armor",
        upgType: "a",
    },
    {
        cost: 25e6,
        mults: {def: 1.15, agi: 1.15},
        name: "Liquid Body Armor",
        upgType: "a",
    },
    {
        cost: 40e6,
        mults: {def: 1.20},
        name: "Graphene Plating Armor",
        upgType: "a",
    },
    {
        cost: 3e6,
        mults: {agi: 1.04, cha: 1.04},
        name: "Ford Flex V20",
        upgType: "v",
    },
    {
        cost: 9e6,
        mults: {agi: 1.08, cha: 1.08},
        name: "ATX1070 Superbike",
        upgType: "v",
    },
    {
        cost: 18e6,
        mults: {agi: 1.12, cha: 1.12},
        name: "Mercedes-Benz S9001",
        upgType: "v",
    },
    {
        cost: 30e6,
        mults: {agi: 1.16, cha: 1.16},
        name: "White Ferrari",
        upgType: "v",
    },
    {
        cost: 5e6,
        mults: {hack: 1.05},
        name: "NUKE Rootkit",
        upgType: "r",
    },
    {
        cost: 15e6,
        mults: {hack: 1.10},
        name: "Soulstealer Rootkit",
        upgType: "r",
    },
    {
        cost: 50e6,
        mults: {hack: 1.15},
        name: "Demon Rootkit",
        upgType: "r",
    },
    {
        cost: 10e9,
        mults: {str: 1.30, dex: 1.30},
        name: "Bionic Arms",
        upgType: "g",
    },
    {
        cost: 10e9,
        mults: {agi: 1.60},
        name: "Bionic Legs",
        upgType: "g",
    },
    {
        cost: 15e9,
        mults: {str: 1.15, def: 1.15, dex: 1.15, agi: 1.15},
        name: "Bionic Spine",
        upgType: "g",
    },
    {
        cost: 20e9,
        mults: {str: 1.40, def: 1.40},
        name: "BrachiBlades",
        upgType: "g",
    },
    {
        cost: 12e9,
        mults: {str: 1.20, def: 1.20},
        name: "Nanofiber Weave",
        upgType: "g",
    },
    {
        cost: 25e9,
        mults: {str: 1.50, agi: 1.50},
        name: "Synthetic Heart",
        upgType: "g",
    },
    {
        cost: 15e9,
        mults: {str: 1.30, def:1.30},
        name: "Synfibril Muscle",
        upgType: "g",
    },
    {
        cost: 5e9,
        mults: {hack: 1.05},
        name: "BitWire",
        upgType: "g",
    },
    {
        cost: 10e9,
        mults: {hack: 1.15},
        name: "Neuralstimulator",
        upgType: "g",
    },
    {
        cost: 50e9,
        mults: {str: 1.70, def: 1.70},
        name: "Graphene Bone Lacings",
        upgType: "g",
    },
];
