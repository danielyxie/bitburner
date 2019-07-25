/**
 * Abstract Base Class for any Server object
 */
import { CodingContract } from "../CodingContracts";
import { Message } from "../Message/Message";
import { RunningScript } from "../Script/RunningScript";
import { Script } from "../Script/Script";
import { TextFile } from "../TextFile";
import { IReturnStatus } from "../types";

import { isScriptFilename } from "../Script/ScriptHelpersTS";

import { compareArrays } from "../../utils/helpers/compareArrays";
import { createRandomIp } from "../../utils/IPAddress";

import { createFsFromVolume, Volume } from "memfs";
import { Literatures } from "../Literature";


import * as path from "path";

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
    messages: Array<Message | string> = [];

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

    // Filesystem of this server
    vol: any;
    fs: any;

    // JSON save state of the server Volume, used as a serializable data format for its file system.
    volJSON: Record<string, string | null> = {};

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

    constructor(params: IConstructorParams = { hostname: "", ip: createRandomIp() }) {

        this.ip = params.ip ? params.ip : createRandomIp();

        this.hostname = params.hostname;
        this.organizationName = params.organizationName != null ? params.organizationName : "";
        this.isConnectedTo = params.isConnectedTo != null ? params.isConnectedTo : false;

        // Access information
        this.hasAdminRights = params.adminRights != null ? params.adminRights : false;
        // file system, contains the server local files
        this.restoreFileSystem(this.volJSON);

    }

    restoreFileSystem(volJSON = {}) {
        for (const file in volJSON) { console.log(`-${file}`); }
        this.vol = Volume.fromJSON(volJSON);
        this.fs = createFsFromVolume(this.vol);

        // console.log(`Migrating old file system to the new file system...`)
        // MIGRATION FROM THE OLD PROPERTY SEPARATED SYSTEM.
        for (let i = 0; i < this.scripts.length; i++) { // migrating scripts.
            const script = this.scripts[i];
            const filename = script.filename;
            if (this.fs.existsSync(filename)) { continue; }
            const data = script.code;
            this.writeFile(filename, data);
        }
        for (let i = 0; i < this.textFiles.length; i++) { // migrating text files
            const textFile = this.textFiles[i];
            const filename = textFile.fn;
            if (this.fs.existsSync(filename)) { continue; }
            const data = textFile.text;
            this.writeFile(filename, data);
        }

        for (let i = 0; i < this.messages.length; i++) { // migrating litterature/message files
            const msg = this.messages[i];
            let filename = "";
            let data = "";
            if (typeof msg === "string") { // then the message is a file name only. litterature files. we fetch their content.
                filename = msg;
                data = `Obj: ${Literatures[msg].title}\n\n${Literatures[msg].txt}`;
            } else { // the message is a Message.
                filename = msg.filename;
                data = msg.msg;
            }
            if (this.fs.existsSync(filename)) { continue; }
            this.writeFile(filename, data);
        }
        for (let i = 0; i < this.programs.length; i++) { // migrating program files
            const filename = this.programs[i];
            if (this.fs.existsSync(filename)) { continue; }
            const data = ""; // TODO find a content to add to those programs source code.
            this.writeFile(filename, data);
        }
        this.volJSON = this.vol.toJSON();
    }

    resolvePath( filepath:string, cwd:string){
        //TODO using another arguments like a kind of $PATH, and using ...PATH in the path.resolve could allow using a global import environment
        // this could allow moving system executables in a sys folder and importing the system functions as dependencies directly.
        // Also, adding the server object to any running script environment could  allow direct file system manipulation instead of the ns.func one.
        // RAM calculations could still be possible with this system, only using fs.func instead of ns.func for the detection.
        let resolvedPath = path.resolve(path.dirname(cwd), filepath );
        console.log(`resolving path from file ${cwd} (${path.dirname(cwd)}) to file ${filepath} => ${resolvedPath}`)
        return resolvedPath;
    }

    isDir(path: string) {
        try {
            if (this.exists(path)) { this.fs.readdirSync(path); }
        } catch (e) {
            console.log(`not a directory: "${path}"; error code ${e.code}`);
            if (e.code == "ENOTDIR") { return false; } else { throw e; }
        }
        return true;
    }


    readdir(dirpath: string, withFileTypes = false) {
        return this.fs.readdirSync(dirpath, { withFileTypes });
    }

    mkdir(dirpath: string, recursive = false) {
        this.fs.mkdirSync(dirpath, { recursive });
    }

    writeFile(filename: string, data: string, recursive = false): void {
        console.log(`Writing to file ${filename}`);
        if (recursive) { this.fs.mkdirSync(path.dirname(filename), { recursive: true }); }
        this.fs.writeFileSync(filename, data);
        this.volJSON = this.vol.toJSON();
    }

    readFile(filename: string): string {
        console.log(`${this.hostname} : reading file ${filename}`);
        return this.fs.readFileSync(filename, "utf8");
    }

    copyFile(src: string, target: string, recursive = false) {
        this.writeFile(target, this.readFile(src), recursive);
    }

    /**
     * Returns if a file exists at the specified path.
     */
    exists(filename: string): boolean {
        return this.fs.existsSync(filename);
    }

    /**
     * Creates an empty file if none exists.
     */
    touch(filename: string) {
        if (!this.exists(filename)) { this.writeFile(filename, ""); }
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

    /**
     * Find an actively running script on this server
     * @param scriptName - Filename of script to search for
     * @param scriptArgs - Arguments that script is being run with
     * @returns RunningScript for the specified active script
     *          Returns null if no such script can be found
     */
    getRunningScript(scriptName: string, scriptArgs: any[]): RunningScript | null {
        for (const rs of this.runningScripts) {
            if (rs.filename === scriptName && compareArrays(rs.args, scriptArgs)) {
                return rs;
            }
        }

        return null;
    }

    /**
     * Given the name of the script, returns the corresponding
     * Script object on the server (if it exists)
     */
    getScript(scriptName: string): Script | null {
        for (let i = 0; i < this.scripts.length; i++) {
            if (this.scripts[i].filename === scriptName) {
                return this.scripts[i];
            }
        }

        return null;
    }

    /**
     * Returns boolean indicating whether the given script is running on this server
     */
    isRunning(fn: string): boolean {
        for (const runningScriptObj of this.runningScripts) {
            if (runningScriptObj.filename === fn) {
                return true;
            }
        }

        return false;
    }

    removeContract(contract: CodingContract) {
        if (contract instanceof CodingContract) {
            this.contracts = this.contracts.filter((c) =>
                c.fn !== contract.fn);
        } else {
            this.contracts = this.contracts.filter((c) =>
                c.fn !== contract);
        }
    }

    /**
     * Remove a file from the server
     * @param fn {string} Name of file to be deleted
     * @returns {IReturnStatus} Return status object indicating whether or not file was deleted
     */
    removeFile(fn: string): IReturnStatus {
        console.log(`Does the file exists on the server? ${this.fs.existsSync(fn)}`);
        this.fs.unlinkSync(fn);
        console.log(`Does the file still exists on the server? ${this.fs.existsSync(fn)}`);

        if (fn.endsWith(".exe") || fn.match(/^.+\.exe-\d+(?:\.\d*)?%-INC$/) != null) {
            for (let i = 0; i < this.programs.length; ++i) {
                if (this.programs[i] === fn) {
                    this.programs.splice(i, 1);
                    return { res: true };
                }
            }
        } else if (isScriptFilename(fn)) {
            for (let i = 0; i < this.scripts.length; ++i) {
                if (this.scripts[i].filename === fn) {
                    if (this.isRunning(fn)) {
                        return {
                            res: false,
                            msg: "Cannot delete a script that is currently running!",
                        };
                    }

                    this.scripts.splice(i, 1);
                    return { res: true };
                }
            }
        } else if (fn.endsWith(".lit")) {
            for (let i = 0; i < this.messages.length; ++i) {
                const f = this.messages[i];
                if (typeof f === "string" && f === fn) {
                    this.messages.splice(i, 1);
                    return { res: true };
                }
            }
        } else if (fn.endsWith(".txt")) {
            for (let i = 0; i < this.textFiles.length; ++i) {
                if (this.textFiles[i].fn === fn) {
                    this.textFiles.splice(i, 1);
                    return { res: true };
                }
            }
        } else if (fn.endsWith(".cct")) {
            for (let i = 0; i < this.contracts.length; ++i) {
                if (this.contracts[i].fn === fn) {
                    this.contracts.splice(i, 1);
                    return { res: true };
                }
            }
        }

        return { res: false, msg: "No such file exists" };
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

}
