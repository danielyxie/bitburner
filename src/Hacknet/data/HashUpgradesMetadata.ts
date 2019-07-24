// Metadata used to construct all Hash Upgrades
import { IConstructorParams } from "../HashUpgrade";

export const HashUpgradesMetadata: IConstructorParams[] = [
    {
        cost: 4,
        costPerLevel: 4,
        desc: "Sell hashes for $1m",
        name: "Sell for Money",
        value: 1e6,
    },
    {
        costPerLevel: 100,
        desc: "Sell hashes for $1b in Corporation funds",
        name: "Sell for Corporation Funds",
        value: 1e9,
    },
    {
        costPerLevel: 50,
        desc: "Use hashes to decrease the minimum security of a single server by 2%. " +
              "Note that a server's minimum security cannot go below 1. This effect persists " +
              "until you install Augmentations (since servers are reset at that time).",
        hasTargetServer: true,
        name: "Reduce Minimum Security",
        value: 0.98,
    },
    {
        costPerLevel: 50,
        desc: "Use hashes to increase the maximum amount of money on a single server by 2%. " +
              "This effect persists until you install Augmentations (since servers " +
              "are reset at that time).",
        hasTargetServer: true,
        name: "Increase Maximum Money",
        value: 1.02,
    },
    {
        costPerLevel: 50,
        desc: "Use hashes to improve the experience earned when studying at a university by 20%. " +
              "This effect persists until you install Augmentations",
        name: "Improve Studying",
        value: 20, // Improves studying by value%
    },
    {
        costPerLevel: 50,
        desc: "Use hashes to improve the experience earned when training at the gym by 20%. This effect " +
              "persists until you install Augmentations",
        name: "Improve Gym Training",
        value: 20, // Improves training by value%
    },
    {
        costPerLevel: 200,
        desc: "Exchange hashes for 1k Scientific Research in all of your Corporation's Industries",
        name: "Exchange for Corporation Research",
        value: 1000,
    },
    {
        costPerLevel: 250,
        desc: "Exchange hashes for 100 Bladeburner Rank",
        name: "Exchange for Bladeburner Rank",
        value: 100,
    },
    {
        costPerLevel: 250,
        desc: "Exchanges hashes for 10 Bladeburner Skill Points",
        name: "Exchange for Bladeburner SP",
        value: 10,
    },
    {
        costPerLevel: 200,
        desc: "Generate a random Coding Contract somewhere on the network",
        name: "Generate Coding Contract",
        value: 1,
    },
];
