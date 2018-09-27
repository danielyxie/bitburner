import {BitNodeMultipliers}                         from "./BitNodeMultipliers";
import {CodingContract, ContractTypes}              from "./CodingContracts";
import {CONSTANTS}                                  from "./Constants";
import {Script, isScriptFilename}                   from "./Script";
import {Programs}                                   from "./CreateProgram";
import {Player}                                     from "./Player";
import {SpecialServerIps}                           from "./SpecialServerIps";
import {TextFile}                                   from "./TextFile";
import {getRandomInt}                               from "../utils/helpers/getRandomInt";
import {createRandomIp, ipExists}                   from "../utils/IPAddress";
import {serverMetadata}                             from "./data/servers";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                           from "../utils/JSONReviver";
import {isValidIPAddress}                           from "../utils/helpers/isValidIPAddress";

function Server(params={ip:createRandomIp(), hostname:""}) {
    /* Properties */
    //Connection information
    this.ip = params.ip ? params.ip : createRandomIp();

    var hostname = params.hostname;
    var i = 0;
    var suffix = "";
    while (GetServerByHostname(hostname+suffix) != null) {
        //Server already exists
        suffix = "-" + i;
        ++i;
    }
    this.hostname           =     hostname + suffix;
    this.organizationName   =     params.organizationName != null ? params.organizationName   : "";
    this.isConnectedTo      =     params.isConnectedTo  != null   ? params.isConnectedTo      : false;

    //Access information
    this.hasAdminRights     =    params.adminRights != null       ? params.adminRights        : false;
    this.purchasedByPlayer  =    params.purchasedByPlayer != null ? params.purchasedByPlayer  : false;
    this.manuallyHacked     =    false;  //Flag that tracks whether or not the server has been hacked at least once

    //RAM, CPU speed and Scripts
    this.maxRam     = params.maxRam != null ? params.maxRam : 0;  //GB
    this.ramUsed    = 0;
    this.cpuCores   = 1; //Max of 8, affects hacking times and Hacking Mission starting Cores

    this.scripts         = [];
    this.runningScripts  = [];   //Stores RunningScript objects
    this.programs        = [];
    this.messages        = [];
    this.textFiles       = [];
    this.contracts       = [];
    this.dir            = 0;    //new Directory(this, null, ""); TODO

    /* Hacking information (only valid for "foreign" aka non-purchased servers) */
    this.requiredHackingSkill   = params.requiredHackingSkill != null ? params.requiredHackingSkill : 1;
    this.moneyAvailable         = params.moneyAvailable != null       ? params.moneyAvailable * BitNodeMultipliers.ServerStartingMoney : 0;
    this.moneyMax               = 25 * this.moneyAvailable * BitNodeMultipliers.ServerMaxMoney;

    //Hack Difficulty is synonymous with server security. Base Difficulty = Starting difficulty
    this.hackDifficulty         = params.hackDifficulty != null ? params.hackDifficulty * BitNodeMultipliers.ServerStartingSecurity : 1;
    this.baseDifficulty         = this.hackDifficulty;
    this.minDifficulty          = Math.max(1, Math.round(this.hackDifficulty / 3));
    this.serverGrowth           = params.serverGrowth != null   ? params.serverGrowth : 1; //Integer from 0 to 100. Affects money increase from grow()

    //The IP's of all servers reachable from this one (what shows up if you run scan/netstat)
    //  NOTE: Only contains IP and not the Server objects themselves
    this.serversOnNetwork        = [];

    //Port information, required for porthacking servers to get admin rights
    this.numOpenPortsRequired = params.numOpenPortsRequired != null ? params.numOpenPortsRequired : 5;
    this.sshPortOpen          = false;    //Port 22
    this.ftpPortOpen          = false;    //Port 21
    this.smtpPortOpen         = false;    //Port 25
    this.httpPortOpen         = false;    //Port 80
    this.sqlPortOpen          = false;    //Port 1433
    this.openPortCount        = 0;
};

Server.prototype.setMaxRam = function(ram) {
    this.maxRam = ram;
}

//The serverOnNetwork array holds the IP of all the servers. This function
//returns the actual Server objects
Server.prototype.getServerOnNetwork = function(i) {
    if (i > this.serversOnNetwork.length) {
        console.log("Tried to get server on network that was out of range");
        return;
    }
    return AllServers[this.serversOnNetwork[i]];
}

//Given the name of the script, returns the corresponding
//script object on the server (if it exists)
Server.prototype.getScript = function(scriptName) {
    for (var i = 0; i < this.scripts.length; i++) {
        if (this.scripts[i].filename == scriptName) {
            return this.scripts[i];
        }
    }
    return null;
}

Server.prototype.capDifficulty = function() {
    if (this.hackDifficulty < this.minDifficulty) {this.hackDifficulty = this.minDifficulty;}
    if (this.hackDifficulty < 1) {this.hackDifficulty = 1;}
    //Place some arbitrarily limit that realistically should never happen unless someone is
    //screwing around with the game
    if (this.hackDifficulty > 1000000) {this.hackDifficulty = 1000000;}
}

//Strengthens a server's security level (difficulty) by the specified amount
Server.prototype.fortify = function(amt) {
    this.hackDifficulty += amt;
    this.capDifficulty();
}

Server.prototype.weaken = function(amt) {
    this.hackDifficulty -= (amt * BitNodeMultipliers.ServerWeakenRate);
    this.capDifficulty();
}

// Write to a script file
// Overwrites existing files. Creates new files if the script does not eixst
Server.prototype.writeToScriptFile = function(fn, code) {
    var ret = {success: false, overwritten: false};
    if (!isScriptFilename(fn)) { return ret; }

    //Check if the script already exists, and overwrite it if it does
    for (let i = 0; i < this.scripts.length; ++i) {
        if (fn === this.scripts[i].filename) {
            let script = this.scripts[i];
            script.code = code;
            script.updateRamUsage();
            script.module = "";
            ret.overwritten = true;
            ret.success = true;
            return ret;
        }
    }

    //Otherwise, create a new script
    var newScript = new Script();
    newScript.filename = fn;
    newScript.code = code;
    newScript.updateRamUsage();
    newScript.server = this.ip;
    this.scripts.push(newScript);
    ret.success = true;
    return ret;
}

// Write to a text file
// Overwrites existing files. Creates new files if the text file does not exist
Server.prototype.writeToTextFile = function(fn, txt) {
    var ret = {success: false, overwritten: false};
    if (!fn.endsWith("txt")) { return ret; }

    //Check if the text file already exists, and overwrite if it does
    for (let i = 0; i < this.textFiles.length; ++i) {
        if (this.textFiles[i].fn === fn) {
            ret.overwritten = true;
            this.textFiles[i].text = txt;
            ret.success = true;
            return ret;
        }
    }

    //Otherwise create a new text file
    var newFile = new TextFile(fn, txt);
    this.textFiles.push(newFile);
    ret.success = true;
    return ret;
}

Server.prototype.addContract = function(contract) {
    this.contracts.push(contract);
}

Server.prototype.removeContract = function(contract) {
    if (contract instanceof CodingContract) {
        this.contracts = this.contracts.filter((c) => {
            return c.fn !== contract.fn;
        });
    } else {
        this.contracts = this.contracts.filter((c) => {
            return c.fn !== contract;
        });
    }
}

Server.prototype.getContract = function(contractName) {
    for (const contract of this.contracts) {
        if (contract.fn === contractName) {
            return contract;
        }
    }
    return null;
}

//Functions for loading and saving a Server
Server.prototype.toJSON = function() {
    return Generic_toJSON("Server", this);
}

Server.fromJSON = function(value) {
    return Generic_fromJSON(Server, value.data);
}

Reviver.constructors.Server = Server;

function initForeignServers() {
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

function numCycleForGrowth(server, growth) {
    let ajdGrowthRate = 1 + (CONSTANTS.ServerBaseGrowthRate - 1) / server.hackDifficulty;
    if(ajdGrowthRate > CONSTANTS.ServerMaxGrowthRate) {
        ajdGrowthRate = CONSTANTS.ServerMaxGrowthRate;
    }

    const serverGrowthPercentage = server.serverGrowth / 100;

    const cycles = Math.log(growth)/(Math.log(ajdGrowthRate)*Player.hacking_grow_mult*serverGrowthPercentage);
    return cycles;
}

//Applied server growth for a single server. Returns the percentage growth
function processSingleServerGrowth(server, numCycles) {
    //Server growth processed once every 450 game cycles
    const numServerGrowthCycles = Math.max(Math.floor(numCycles / 450), 0);

    //Get adjusted growth rate, which accounts for server security
    const growthRate = CONSTANTS.ServerBaseGrowthRate;
    var adjGrowthRate = 1 + (growthRate - 1) / server.hackDifficulty;
    if (adjGrowthRate > CONSTANTS.ServerMaxGrowthRate) {adjGrowthRate = CONSTANTS.ServerMaxGrowthRate;}

    //Calculate adjusted server growth rate based on parameters
    const serverGrowthPercentage = server.serverGrowth / 100;
    const numServerGrowthCyclesAdjusted = numServerGrowthCycles * serverGrowthPercentage * BitNodeMultipliers.ServerGrowthRate;

    //Apply serverGrowth for the calculated number of growth cycles
    var serverGrowth = Math.pow(adjGrowthRate, numServerGrowthCyclesAdjusted * Player.hacking_grow_mult);
    if (serverGrowth < 1) {
        console.log("WARN: serverGrowth calculated to be less than 1");
        serverGrowth = 1;
    }

    const oldMoneyAvailable = server.moneyAvailable;
    server.moneyAvailable *= serverGrowth;

    // in case of data corruption
    if (server.moneyMax && isNaN(server.moneyAvailable)) {
        server.moneyAvailable = server.moneyMax;
    }

    // cap at max
    if (server.moneyMax && server.moneyAvailable > server.moneyMax) {
        server.moneyAvailable = server.moneyMax;
    }

    // if there was any growth at all, increase security
    if(oldMoneyAvailable !== server.moneyAvailable) {
        //Growing increases server security twice as much as hacking
        let usedCycles = numCycleForGrowth(server, server.moneyAvailable / oldMoneyAvailable);
        usedCycles = Math.max(0, usedCycles);
        server.fortify(2 * CONSTANTS.ServerFortifyAmount * Math.ceil(usedCycles));
    }
    return server.moneyAvailable / oldMoneyAvailable;
}

function prestigeHomeComputer(homeComp) {
    homeComp.programs.length = 0; //Remove programs
    homeComp.runningScripts = [];
    homeComp.serversOnNetwork = [];
    homeComp.isConnectedTo = true;
    homeComp.ramUsed = 0;
    homeComp.programs.push(Programs.NukeProgram.name);

    //Update RAM usage on all scripts
    homeComp.scripts.forEach(function(script) {
        script.updateRamUsage();
    });

    homeComp.messages.length = 0; //Remove .lit and .msg files
    homeComp.messages.push("hackers-starting-handbook.lit");
}

//List of all servers that exist in the game, indexed by their ip
let AllServers = {};

function prestigeAllServers() {
    for (var member in AllServers) {
        delete AllServers[member];
    }
    AllServers = {};
}

function loadAllServers(saveString) {
    AllServers = JSON.parse(saveString, Reviver);
}

function SizeOfAllServers() {
    var size = 0, key;
    for (key in AllServers) {
        if (AllServers.hasOwnProperty(key)) size++;
    }
    return size;
}

//Add a server onto the map of all servers in the game
function AddToAllServers(server) {
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

//Returns server object with corresponding hostname
//    Relatively slow, would rather not use this a lot
function GetServerByHostname(hostname) {
    for (var ip in AllServers) {
        if (AllServers.hasOwnProperty(ip)) {
            if (AllServers[ip].hostname == hostname) {
                return AllServers[ip];
            }
        }
    }
    return null;
}

//Get server by IP or hostname. Returns null if invalid
function getServer(s) {
    if (!isValidIPAddress(s)) {
        return GetServerByHostname(s);
    }
    if(AllServers[s] !== undefined) {
        return AllServers[s];
    }
    return null;
}

//Debugging tool
function PrintAllServers() {
    for (var ip in AllServers) {
        if (AllServers.hasOwnProperty(ip)) {
            console.log("Ip: " + ip + ", hostname: " + AllServers[ip].hostname);
        }
    }
}

// Directory object (folders)
function Directory(server, parent, name) {
    this.s = server; //Ref to server
    this.p = parent; //Ref to parent directory
    this.c = [];     //Subdirs
    this.n = name;
    this.d = parent.d + 1; //We'll only have a maximum depth of 3 or something
    this.scrs   = []; //Holds references to the scripts in server.scripts
    this.pgms   = [];
    this.msgs   = [];
}

Directory.prototype.createSubdir = function(name) {
    var subdir = new Directory(this.s, this, name);

}

Directory.prototype.getPath = function(name) {
    var res = [];
    var i = this;
    while (i !== null) {
        res.unshift(i.n, "/");
        i = i.parent;
    }
    res.unshift("/");
    return res.join("");
}

export {Server, AllServers, getServer, GetServerByHostname, loadAllServers,
        AddToAllServers, processSingleServerGrowth, initForeignServers,
        prestigeAllServers, prestigeHomeComputer};
