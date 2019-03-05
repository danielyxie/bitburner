import { CodingContract,
         CodingContractRewardType,
         CodingContractTypes }          from "./CodingContracts";
import { Factions }                     from "./Faction/Factions";
import { Player }                       from "./Player";
import { AllServers }                   from "./Server/AllServers";
import { GetServerByHostname }          from "./Server/ServerHelpers";

import { getRandomInt }                 from "../utils/helpers/getRandomInt";

export function generateRandomContract() {
    // First select a random problem type
    let problemType = getRandomProblemType();

    // Then select a random reward type. 'Money' will always be the last reward type
    const reward = getRandomReward();

    // Choose random server
    const randServer = getRandomServer();

    let contractFn = getRandomFilename(randServer, reward);
    let contract = new CodingContract(contractFn, problemType, reward);

    randServer.addContract(contract);
}

export function generateRandomContractOnHome() {
    // First select a random problem type
    let problemType = getRandomProblemType();

    // Then select a random reward type. 'Money' will always be the last reward type
    const reward = getRandomReward();

    // Choose random server
    const serv = Player.getHomeComputer();

    let contractFn = getRandomFilename(serv, reward);
    let contract = new CodingContract(contractFn, problemType, reward);

    serv.addContract(contract);
}

export function generateContract(params) {
    // Problem Type
    let problemType;
    const problemTypes = Object.keys(CodingContractTypes);
    if (params.problemType != null && problemTypes.includes(params.problemType)) {
        problemType = params.problemType;
    } else {
        problemType = getRandomProblemType();
    }

    // Reward Type - This is always random for now
    const reward = getRandomReward();

    // Server
    let server;
    if (params.server != null) {
        server = GetServerByHostname(params.server);
        if (server == null) {
            server = AllServers[param.server];
        }
        if (server == null) {
            server = getRandomServer();
        }
    } else {
        server = getRandomServer();
    }

    // Filename
    let fn;
    if (params.fn != null) {
        fn = params.fn;
    } else {
        fn = getRandomFilename(server, reward);
    }

    let contract = new CodingContract(fn, problemType, reward);
    server.addContract(contract);
}

// Ensures that a contract's reward type is valid
function sanitizeRewardType(rewardType) {
    let type = rewardType; // Create copy

    const factionsThatAllowHacking = Player.factions.filter((fac) => {
        try {
            return Factions[fac].getInfo().offerHackingWork;
        } catch (e) {
            console.error(`Error when trying to filter Hacking Factions for Coding Contract Generation: ${e}`);
            return false;
        }
    });
    if (type === CodingContractRewardType.FactionReputation && factionsThatAllowHacking.length === 0) {
        type = CodingContractRewardType.CompanyReputation;
    }
    if (type === CodingContractRewardType.FactionReputationAll && factionsThatAllowHacking.length === 0) {
        type = CodingContractRewardType.CompanyReputation;
    }
    if (type === CodingContractRewardType.CompanyReputation && Object.keys(Player.jobs).length === 0) {
        type = CodingContractRewardType.Money;
    }

    return type;
}

function getRandomProblemType() {
    const problemTypes = Object.keys(CodingContractTypes);
    let randIndex = getRandomInt(0, problemTypes.length - 1);

    return problemTypes[randIndex];
}

function getRandomReward() {
    let reward = {};
    reward.type = getRandomInt(0, CodingContractRewardType.Money);
    reward.type = sanitizeRewardType(reward.type);

    // Add additional information based on the reward type
    const factionsThatAllowHacking = Player.factions.filter((fac) => {
        try {
            return Factions[fac].getInfo().offerHackingWork;
        } catch (e) {
            console.error(`Error when trying to filter Hacking Factions for Coding Contract Generation: ${e}`);
            return false;
        }
    });

    switch (reward.type) {
        case CodingContractRewardType.FactionReputation:
            // Get a random faction that player is a part of. That
            // faction must allow hacking contracts
            var numFactions = factionsThatAllowHacking.length;
            var randFaction = factionsThatAllowHacking[getRandomInt(0, numFactions - 1)];
            reward.name = randFaction;
            break;
        case CodingContractRewardType.CompanyReputation:
            const allJobs = Object.keys(Player.jobs);
            if (allJobs.length > 0) {
                reward.name = allJobs[getRandomInt(0, allJobs.length - 1)];
            } else {
                reward.type = CodingContractRewardType.Money;
            }
            break;
        default:
            break;
    }

    return reward;
}

function getRandomServer() {
    const servers = Object.keys(AllServers);
    let randIndex = getRandomInt(0, servers.length - 1);
    let randServer = AllServers[servers[randIndex]];

    // An infinite loop shouldn't ever happen, but to be safe we'll use
    // a for loop with a limited number of tries
    for (let i = 0; i < 200; ++i) {
        if (randServer.purchasedByPlayer === false) { break; }
        randIndex = getRandomInt(0, servers.length - 1);
        randServer = AllServers[servers[randIndex]];
    }

    return randServer;
}

function getRandomFilename(server, reward) {
    let contractFn = `contract-${getRandomInt(0, 1e6)}`;

    for (let i = 0; i < 1000; ++i) {
        if (server.contracts.filter((c) => {return c.fn === contractFn}).length <= 0) { break; }
        contractFn = `contract-${getRandomInt(0, 1e6)}`;
    }

    if (reward.name) { contractFn += `-${reward.name.replace(/\s/g, "")}`; }

    return contractFn;
}
