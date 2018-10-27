import {CodingContract,
        CodingContractRewardType,
        CodingContractTypes}        from "./CodingContracts";
import {Factions}                   from "./Faction";
import {Player}                     from "./Player";
import {AllServers}                 from "./Server";

import {getRandomInt}               from "../utils/helpers/getRandomInt";

export function generateRandomContract() {
    // First select a random problem type
    const problemTypes = Object.keys(CodingContractTypes);
    let randIndex = getRandomInt(0, problemTypes.length - 1);
    let problemType = problemTypes[randIndex];

    // Then select a random reward type. 'Money' will always be the last reward type
    var reward = {};
    reward.type = getRandomInt(0, CodingContractRewardType.Money);

    // Change type based on certain conditions
    var factionsThatAllowHacking = Player.factions.filter((fac) => {
        try {
            return Factions[fac].getInfo().offerHackingWork;
        } catch (e) {
            console.error(`Error when trying to filter Hacking Factions for Coding Contract Generation: ${e}`);
            return false;
        }
    });
    if (reward.type === CodingContractRewardType.FactionReputation && factionsThatAllowHacking.length === 0) {
        reward.type = CodingContractRewardType.CompanyReputation;
    }
    if (reward.type === CodingContractRewardType.FactionReputationAll && factionsThatAllowHacking.length === 0) {
        reward.type = CodingContractRewardType.CompanyReputation;
    }
    if (reward.type === CodingContractRewardType.CompanyReputation && Player.companyName === "") {
        reward.type = CodingContractRewardType.Money;
    }

    // Add additional information based on the reward type
    switch (reward.type) {
        case CodingContractRewardType.FactionReputation:
            // Get a random faction that player is a part of. That
            // faction must allow hacking contracts
            var numFactions = factionsThatAllowHacking.length;
            var randFaction = factionsThatAllowHacking[getRandomInt(0, numFactions - 1)];
            reward.name = randFaction;
            break;
        case CodingContractRewardType.CompanyReputation:
            if (Player.companyName !== "") {
                reward.name = Player.companyName;
            } else {
                reward.type = CodingContractRewardType.Money;
            }
            break;
        default:
            break;
    }

    // Choose random server
    const servers = Object.keys(AllServers);
    randIndex = getRandomInt(0, servers.length - 1);
    var randServer = AllServers[servers[randIndex]];
    while (randServer.purchasedByPlayer === true) {
        randIndex = getRandomInt(0, servers.length - 1);
        randServer = AllServers[servers[randIndex]];
    }

    let contractFn = `contract-${getRandomInt(0, 1e6)}`;
    while (randServer.contracts.filter((c) => {return c.fn === contractFn}).length > 0) {
        contractFn = `contract-${getRandomInt(0, 1e6)}`;
    }
    if (reward.name) { contractFn += `-${reward.name.replace(/\s/g, "")}`; }
    let contract = new CodingContract(contractFn, problemType, reward);

    randServer.addContract(contract);
}
