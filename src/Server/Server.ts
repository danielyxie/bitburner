// Class representing a single generic Server
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { CodingContract } from "../CodingContracts";
import { Message } from "../Message/Message";
import { RunningScript } from "../Script/RunningScript";
import { Script } from "../Script/Script";
import { TextFile } from "../TextFile";

import { createRandomIp } from "../../utils/IPAddress";
import { Generic_fromJSON,
         Generic_toJSON,
         Reviver } from "../../utils/JSONReviver";

interface IConstructorParams {
    adminRights?: boolean;
    hackDifficulty?: number;
    hostname: string;
    ip?: string;
    isConnectedTo?: boolean;
    maxRam?: number;
    moneyAvailable?: number;
    numOpenPortsRequired?: number;
    organizationName?: string;
    purchasedByPlayer?: boolean;
    requiredHackingSkill?: number;
    serverGrowth?: number;
}

export class Server {
    // Initial server security level
    // (i.e. security level when the server was created)
    baseDifficulty: number = 1;

    // Coding Contract files on this server
    contracts: CodingContract[] = [];

    // How many CPU cores this server has. Maximum of 8.
    // Currently, this only affects hacking missions
    cpuCores: number = 1;

    // Flag indicating whether the FTP port is open
    ftpPortOpen: boolean = false;

    // Server Security Level
    hackDifficulty: number = 1;

    // Flag indicating whether player has admin/root access to this server
    hasAdminRights: boolean = false;

    // Hostname. Must be unique
    hostname: string = "";

    // Flag indicating whether HTTP Port is open
    httpPortOpen: boolean = false;

    // IP Address. Must be unique
    ip: string = "";

    // Flag indicating whether player is curently connected to this server
    isConnectedTo: boolean = false;

    // Flag indicating whether this server has been manually hacked (ie.
    // hacked through Terminal) by the player
    manuallyHacked: boolean = false;

    // RAM (GB) available on this server
    maxRam: number = 0;

    // Message files AND Literature files on this Server
    // For Literature files, this array contains only the filename (string)
    // For Messages, it contains the actual Message object
    // TODO Separate literature files into its own property
    messages: (Message | string)[] = [];

    // Minimum server security level that this server can be weakened to
    minDifficulty: number = 1;

    // How much money currently resides on the server and can be hacked
    moneyAvailable: number = 0;

    // Maximum amount of money that this server can hold
    moneyMax: number = 0;

    // Number of open ports required in order to gain admin/root access
    numOpenPortsRequired: number = 5;

    // How many ports are currently opened on the server
    openPortCount: number = 0;

    // Name of company/faction/etc. that this server belongs to.
    // Optional, not applicable to all Servers
    organizationName: string = "";

    // Programs on this servers. Contains only the names of the programs
    programs: string[] = [];

    // Flag indicating wehther this is a purchased server
    purchasedByPlayer: boolean = false;

    // RAM (GB) used. i.e. unavailable RAM
    ramUsed: number = 0;

    // Hacking level required to hack this server
    requiredHackingSkill: number = 1;

    // RunningScript files on this server
    runningScripts: RunningScript[] = [];

    // Script files on this Server
    scripts: Script[] = [];

    // Parameter that affects how effectively this server's money can
    // be increased using the grow() Netscript function
    serverGrowth: number = 1;

    // Contains the IP Addresses of all servers that are immediately
    // reachable from this one
    serversOnNetwork: string[] = [];

    // Flag indicating whether SMTP Port is open
    smtpPortOpen: boolean = false;

    // Flag indicating whether SQL Port is open
    sqlPortOpen: boolean = false;

    // Flag indicating whether the SSH Port is open
    sshPortOpen: boolean = false;

    // Text files on this server
    textFiles: TextFile[] = [];

    constructor(params: IConstructorParams={hostname: "", ip: createRandomIp() }) {
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

        //RAM, CPU speed and Scripts
        this.maxRam     = params.maxRam != null ? params.maxRam : 0;  //GB

        /* Hacking information (only valid for "foreign" aka non-purchased servers) */
        this.requiredHackingSkill   = params.requiredHackingSkill != null ? params.requiredHackingSkill : 1;
        this.moneyAvailable         = params.moneyAvailable != null       ? params.moneyAvailable * BitNodeMultipliers.ServerStartingMoney : 0;
        this.moneyMax               = 25 * this.moneyAvailable * BitNodeMultipliers.ServerMaxMoney;

        //Hack Difficulty is synonymous with server security. Base Difficulty = Starting difficulty
        this.hackDifficulty         = params.hackDifficulty != null ? params.hackDifficulty * BitNodeMultipliers.ServerStartingSecurity : 1;
        this.baseDifficulty         = this.hackDifficulty;
        this.minDifficulty          = Math.max(1, Math.round(this.hackDifficulty / 3));
        this.serverGrowth           = params.serverGrowth != null   ? params.serverGrowth : 1; //Integer from 0 to 100. Affects money increase from grow()

        //Port information, required for porthacking servers to get admin rights
        this.numOpenPortsRequired = params.numOpenPortsRequired != null ? params.numOpenPortsRequired : 5;
    };

    setMaxRam(ram: number): void {
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
}

//Functions for loading and saving a Server
Server.prototype.toJSON = function() {
    return Generic_toJSON("Server", this);
}

Server.fromJSON = function(value) {
    return Generic_fromJSON(Server, value.data);
}

Reviver.constructors.Server = Server;
