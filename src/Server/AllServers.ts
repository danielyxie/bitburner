import { ipExists } from "../../utils/IPAddress";

// Map of all Servers that exist in the game
// Key (string) = IP
// Value = Server object
let AllServers = {};

// Saftely add a Server to the AllServers map
export function AddToAllServers(server) {
    var serverIp = server.ip;
    if (ipExists(serverIp)) {
        console.log("IP of server that's being added: " + serverIp);
        console.log("Hostname of the server thats being added: " + server.hostname);
        console.log("The server that already has this IP is: " + AllServers[serverIp].hostname);
        throw new Error("Error: Trying to add a server with an existing IP");
        return;
    }
    AllServers[serverIp] = server;
}

export function initForeignServers() {
    /* Create a randomized network for all the foreign servers */
    //Groupings for creating a randomized network
    const networkLayers = [];
    for (let i = 0; i < 15; i++) {
        networkLayers.push([]);
    }

    // Essentially any property that is of type 'number | IMinMaxRange'
    const propertiesToPatternMatch = [
        "hackDifficulty",
        "moneyAvailable",
        "requiredHackingSkill",
        "serverGrowth"
    ];

    const toNumber = (value) => {
        switch (typeof value) {
            case 'number':
                return value;
            case 'object':
                return getRandomInt(value.min, value.max);
            default:
                throw Error(`Do not know how to convert the type '${typeof value}' to a number`);
        }
    }

    for (const metadata of serverMetadata) {
        const serverParams = {
            hostname: metadata.hostname,
            ip: createRandomIp(),
            numOpenPortsRequired: metadata.numOpenPortsRequired,
            organizationName: metadata.organizationName
        };

        if (metadata.maxRamExponent !== undefined) {
            serverParams.maxRam = Math.pow(2, toNumber(metadata.maxRamExponent));
        }

        for (const prop of propertiesToPatternMatch) {
            if (metadata[prop] !== undefined) {
                serverParams[prop] = toNumber(metadata[prop]);
            }
        }

        const server = new Server(serverParams);
        for (const filename of (metadata.literature || [])) {
            server.messages.push(filename);
        }

        if (metadata.specialName !== undefined) {
            SpecialServerIps.addIp(metadata.specialName, server.ip);
        }

        AddToAllServers(server);
        if (metadata.networkLayer !== undefined) {
            networkLayers[toNumber(metadata.networkLayer) - 1].push(server);
        }
    }

    /* Create a randomized network for all the foreign servers */
    const linkComputers = (server1, server2) => {
        server1.serversOnNetwork.push(server2.ip);
        server2.serversOnNetwork.push(server1.ip);
    };

    const getRandomArrayItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const linkNetworkLayers = (network1, selectServer) => {
        for (const server of network1) {
            linkComputers(server, selectServer());
        }
    };

    // Connect the first tier of servers to the player's home computer
    linkNetworkLayers(networkLayers[0], () => Player.getHomeComputer());
    for (let i = 1; i < networkLayers.length; i++) {
        linkNetworkLayers(networkLayers[i], () => getRandomArrayItem(networkLayers[i - 1]));
    }
}

export function prestigeAllServers() {
    for (var member in AllServers) {
        delete AllServers[member];
    }
    AllServers = {};
}

export function loadAllServers(saveString) {
    AllServers = JSON.parse(saveString, Reviver);
}
