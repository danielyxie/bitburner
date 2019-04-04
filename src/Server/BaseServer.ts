/**
 * Abstract Base Class for any Server object
 */
import { CodingContract } from "../CodingContracts";
import { Message } from "../Message/Message";
import { RunningScript } from "../Script/RunningScript";
import { Script } from "../Script/Script";
import { TextFile } from "../TextFile";

import { isScriptFilename } from "../Script/ScriptHelpersTS";

import { createRandomIp } from "../../utils/IPAddress";

interface IConstructorParams {
    adminRights?: boolean;
    hostname: string;
    ip?: string;
    isConnectedTo?: boolean;
    maxRam?: number;
    organizationName?: string;
}

export class BaseServer {
    // Coding Contract files on this server
    contracts: CodingContract[] = [];

    // How many CPU cores this server has. Maximum of 8.
    // Currently, this only affects hacking missions
    cpuCores: number = 1;

    // Flag indicating whether the FTP port is open
    ftpPortOpen: boolean = false;

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

    // RAM (GB) available on this server
    maxRam: number = 0;

    // Message files AND Literature files on this Server
    // For Literature files, this array contains only the filename (string)
    // For Messages, it contains the actual Message object
    // TODO Separate literature files into its own property
    messages: (Message | string)[] = [];

    // Name of company/faction/etc. that this server belongs to.
    // Optional, not applicable to all Servers
    organizationName: string = "";

    // Programs on this servers. Contains only the names of the programs
    programs: string[] = [];

    // RAM (GB) used. i.e. unavailable RAM
    ramUsed: number = 0;

    // RunningScript files on this server
    runningScripts: RunningScript[] = [];

    // Script files on this Server
    scripts: Script[] = [];

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

    constructor(params: IConstructorParams={ hostname: "", ip: createRandomIp() }) {
        this.ip = params.ip ? params.ip : createRandomIp();

        this.hostname           =     params.hostname;
        this.organizationName   =     params.organizationName != null ? params.organizationName   : "";
        this.isConnectedTo      =     params.isConnectedTo  != null   ? params.isConnectedTo      : false;

        //Access information
        this.hasAdminRights     =    params.adminRights != null       ? params.adminRights        : false;
    }

    addContract(contract: CodingContract) {
        this.contracts.push(contract);
    }

    getContract(contractName: string): CodingContract | null {
        for (const contract of this.contracts) {
            if (contract.fn === contractName) {
                return contract;
            }
        }
        return null;
    }

    // Given the name of the script, returns the corresponding
    // script object on the server (if it exists)
    getScript(scriptName: string): Script | null {
        for (let i = 0; i < this.scripts.length; i++) {
            if (this.scripts[i].filename === scriptName) {
                return this.scripts[i];
            }
        }

        return null;
    }

    removeContract(contract: CodingContract) {
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

    /**
     * Called when a script is run on this server.
     * All this function does is add a RunningScript object to the
     * `runningScripts` array. It does NOT check whether the script actually can
     * be run.
     */
    runScript(script: RunningScript): void {
        this.runningScripts.push(script);
    }

    setMaxRam(ram: number): void {
        this.maxRam = ram;
    }

    /**
     * Write to a script file
     * Overwrites existing files. Creates new files if the script does not eixst
     */
    writeToScriptFile(fn: string, code: string) {
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
        const newScript = new Script();
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
    writeToTextFile(fn: string, txt: string) {
        var ret = { success: false, overwritten: false };
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
}
