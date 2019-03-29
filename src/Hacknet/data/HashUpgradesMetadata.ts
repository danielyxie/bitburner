// Metadata used to construct all Hash Upgrades
import { IConstructorParams } from "../HashUpgrade";

export const HashUpgradesMetadata: IConstructorParams[] = [
    {
        costPerLevel: 2,
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
        costPerLevel: 100,
        desc: "Use hashes to decrease the minimum security of a single server by 5%. " +
              "Note that a server's minimum security cannot go below 1.",
        hasTargetServer: true,
        name: "Reduce Minimum Security",
        value: 0.95,
    },
    {
        costPerLevel: 100,
        desc: "Use hashes to increase the maximum amount of money on a single server by 5%",
        hasTargetServer: true,
        name: "Increase Maximum Money",
        value: 1.05,
    },
    {
        costPerLevel: 100,
        desc: "Use hashes to improve the experience earned when studying at a university. " +
              "This effect persists until you install Augmentations",
        name: "Improve Studying",
        value: 20, // Improves studying by value%
    },
    {
        costPerLevel: 100,
        desc: "Use hashes to improve the experience earned when training at the gym. This effect " +
              "persists until you install Augmentations",
        name: "Improve Gym Training",
        value: 20, // Improves training by value%
    },
    {
        costPerLevel: 250,
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
        costPerLevel: 200,
        desc: "Generate a random Coding Contract on your home computer",
        name: "Generate Coding Contract",
        value: 1,
    },
]
