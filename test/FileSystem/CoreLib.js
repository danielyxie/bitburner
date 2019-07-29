var chai = require("chai");
var expect = chai.expect
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

import {BaseServer} from "../../src/Server/BaseServer";
import {Server} from "../../src/Server/Server";
import {HacknetServer} from "../../src/Hacknet/HacknetServer";
//////////////////////////////////////////////////////////////////////////////
// Here we import every existing function to let them initialize themselves //
//////////////////////////////////////////////////////////////////////////////
import { mkdir } from "../../src/Server/lib/mkdir";
import { rm } from "../../src/Server/lib/rm";
import { mv } from "../../src/Server/lib/mv";
import { ls } from "../../src/Server/lib/ls";
import { nano } from "../../src/Server/lib/nano";
import { tree } from "../../src/Server/lib/tree";
import { top } from "../../src/Server/lib/top";
import { scan } from "../../src/Server/lib/scan";
import { mem } from "../../src/Server/lib/mem";
import { cd } from "../../src/Server/lib/cd";
import { cls } from "../../src/Server/lib/cls";
import { sudov } from "../../src/Server/lib/sudov";
import { clear } from "../../src/Server/lib/clear";
import { nuke } from "../../src/Server/lib/nuke";
import { analyze } from "../../src/Server/lib/analyze";
import { run } from "../../src/Server/lib/run";
import { FTPCrack } from "../../src/Server/lib/FTPCrack";
import { bruteSSH } from "../../src/Server/lib/bruteSSH";
import { HTTPWorm } from "../../src/Server/lib/HTTPWorm";
import { lscpu } from "../../src/Server/lib/lscpu";
import { hostname } from "../../src/Server/lib/hostname";
import { home } from "../../src/Server/lib/home";
import { connect } from "../../src/Server/lib/connect";
import { ifconfig } from "../../src/Server/lib/ifconfig";
import { scan_analyze } from "../../src/Server/lib/scan_analyze";
import { relaySMTP } from "../../src/Server/lib/relaySMTP";
import { help } from "../../src/Server/lib/help";
import { download } from "../../src/Server/lib/download";
import { cp } from "../../src/Server/lib/cp";
import { scp } from "../../src/Server/lib/scp";
import { expr } from "../../src/Server/lib/expr";
import { check } from "../../src/Server/lib/check";
import { SQLInject } from "../../src/Server/lib/SQLInject";
import { kill } from "../../src/Server/lib/kill";
import { killall } from "../../src/Server/lib/killall";
import { wget } from "../../src/Server/lib/wget";
import { hack } from "../../src/Server/lib/hack";
import { alias } from "../../src/Server/lib/alias";
import { cat } from "../../src/Server/lib/cat";
import { unalias } from "../../src/Server/lib/unalias";
import { theme } from "../../src/Server/lib/theme";
import { ps } from "../../src/Server/lib/ps";
import { buy } from "../../src/Server/lib/buy";
import { tail } from "../../src/Server/lib/tail";
import { ServerProfiler } from "../../src/Server/lib/ServerProfiler";
import { AutoLink } from "../../src/Server/lib/AutoLink";
import { DeepscanV2 } from "../../src/Server/lib/DeepscanV2";
import { DeepscanV1 } from "../../src/Server/lib/DeepscanV1";
import { fl1ght } from "../../src/Server/lib/fl1ght";
import { b1t_flum3 } from "../../src/Server/lib/b1t_flum3";
import { free } from "../../src/Server/lib/free";


import * as sys from "../../src/Server/lib/sys";

import {Terminal} from "../../src/Terminal";
import {OverwriteStrategy} from "../../src/Server/lib/OverwriteStrategy";
import {VersioningStrategy} from "../../src/Server/lib/VersioningStrategy";

import Player from "../../src/Player";

import { PlayerObject } from "../../src/PersonObjects/Player/PlayerObject";

import { SpecialServerIps, SpecialServerIpsMap } from "../../src/Server/SpecialServerIps";
import * as AllServers from "../../src/Server/AllServers";
import {resetAllAliases} from "../../src/Alias";
import {Script} from "../../src/Script/Script";
import {RunningScript} from "../../src/Script/RunningScript";

describe("BaseServer file system core library tests", function() {
    /**
     * In the following tests, every directory will be prefixed by a 'd', and every file by a 'f'.
     * existing files and directories will be suffixed with a number (f1,f2...) and a letter (dA, dB,...) respectively.
     * non existent ones will see this suffix inverted, files will be suffixed with letters (fX, fZ...) and directories with numbers (d0, d1, d2...);
     */



    const testingVolJSON = {
        "/f1":"/f1",
        "/dA/f2":"/dA/f2",
        "/dA/f3":"/dA/f3",
        "/dA/dB/f4":"/dA/dB/f4",
    };
    const WRITTEN_CONTENT = "written content";
    const server = new Server({hostname:"home", ip:"127.0.0.1"});
    server.hasAdminRights=true;
    server.purchasedByThePlayer=true;
    server.hostname = "home";
    server.restoreFileSystem(testingVolJSON);
    server.serversOnNetwork.push()
    let out = (msg) => {}; // null stream
    let err = (msg) => {throw msg}; // exception callback
    let fakeTerm = Terminal;
    fakeTerm.output = [];
    fakeTerm.clearOutput = ()=>{fakeTerm.output=[];};
    fakeTerm.resetTerminalInput = ()=>{};
    fakeTerm.currDir = "/";
    const ServerInitType = {
        NORMAL: 1,
        EMPTY : 2,
        DIRECTORIES_ONLY : 3
    }
    var Player = new PlayerObject();
    var SpecialServerIps = new SpecialServerIpsMap();

    const destServer = new Server({hostname:"???", ip:"666.666.666.669"});
    const invisibleServer = new Server({hostname:"Drax the destructor", ip:"xxx.xxx.xxx.xxx"})
    server.serversOnNetwork.push(destServer.ip)
    server.serversOnNetwork.push(server.ip)

    destServer.restoreFileSystem(testingVolJSON);
    AllServers.AddToAllServers(server);
    AllServers.AddToAllServers(invisibleServer);
    AllServers.AddToAllServers(destServer);
    AllServers.SERVERS_INITIALIZED = true;

    function resetEnv(options={servInitType:ServerInitType.NORMAL}){

        server.hasAdminRights = true;
        server.purchasedByPlayer = true;
        server.maxRam = 64;
        server.requiredHackingSkill = 100;
        server.cpuCores = 1;
        server.programs = [];
        server.runningScripts = [];
        Player.hacking_skill = 1;
        Player.setMoney(0);

        switch(options.servInitType){
            case ServerInitType.NORMAL:
                server.restoreFileSystem({
                    "/f1":"/f1",
                    "/dA/f2":"/dA/f2",
                    "/dA/f3":"/dA/f3",
                    "/dA/dB/f4":"/dA/dB/f4",
                });
                destServer.restoreFileSystem({
                    "/f1":"/f1",
                    "/dA/f2":"/dA/f2",
                    "/dA/f3":"/dA/f3",
                    "/dA/dB/f4":"/dA/dB/f4",
                });
                break;
            case ServerInitType.DIRECTORIES_ONLY:
                server.restoreFileSystem({
                    "/dA/f2":"/dA/f2",
                    "/dA/f3":"/dA/f3",
                    "/dA/dB/f4":"/dA/dB/f4",
                });
                destServer.restoreFileSystem({
                    "/f1":"/f1",
                    "/dA/f2":"/dA/f2",
                    "/dA/f3":"/dA/f3",
                    "/dA/dB/f4":"/dA/dB/f4",
                });
                server.removeFile("/dA/f2", {force:true});
                server.removeFile("/dA/f3",{force:true});
                server.removeFile("/dA/dB/f4",{force:true});
                server.removeFile("/dev/null",{force:true});
                destServer.removeFile("/dA/f2", {force:true});
                destServer.removeFile("/dA/f3",{force:true});
                destServer.removeFile("/dA/dB/f4",{force:true});
                destServer.removeFile("/dev/null",{force:true});
                break;
            case ServerInitType.EMPTY:
                server.restoreFileSystem({ });
                destServer.restoreFileSystem({ });
                break;
        };
        destServer.restoreFileSystem({
            "/f1":"/f1",
            "/dA/f2":"/dA/f2",
            "/dA/f3":"/dA/f3",
            "/dA/dB/f4":"/dA/dB/f4",
        });

        resetAllAliases();
        fakeTerm.currDir = "/";
        out = (msg) => {};
        err = (msg) => {throw msg};

        Player = new PlayerObject();
        Player.getHomeComputer = ()=>{return server};
        SpecialServerIps = new SpecialServerIpsMap()
    };


    function addScriptsToServer(scripts){
        for(let script of scripts){
            server.scriptsMap[script.path] = new Script(script.path, script.ip);
            server.scriptsMap[script.path].getServer = ()=>{return server};
            expect(()=>server.writeFile(script.path, script.content)).to.not.throw();
            expect(()=>server.readFile(script.path)).to.not.throw();
            server.scriptsMap[script.path].ramUsage = script.ramUsage;
        }
    }

    function addRunningScriptsToServer(scriptsTemplates){
        let pid = 0;
        for(let script of scriptsTemplates){
            pid++;
            expect(()=>server.writeFile(script.filename, "data", {recursive:true})).to.not.throw();
            expect(()=>server.readFile(script.filename)).to.not.throw();

            let runningScript = new RunningScript(script, script.args);
            runningScript.pid = pid;
            runningScript.logs = script.logs;
            server.runScript(runningScript);
        }

    }

    function expectResultFromExpr(expression, expected){
        let result;
        let out = (msg) => {result = msg.toString();};
        expect(()=>expr(server, fakeTerm, out, err, [expression])).not.to.throw();
        expect(result).to.equal(expected);
    };

    describe("File operations", function (){
        describe("cp", function(){

            it("Can copy an existing file in an existing directory if a filename is specified" ,function(){
                resetEnv();
                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/dA/f1", "-T"])).to.not.throw();
                expect(server.readFile("/dA/f1")).to.equal("/f1");
            });
            it("Can copy an existing file in an existing directory if a directory is specified" ,function(){
                resetEnv();

                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/dA"])).to.not.throw();
                expect(server.readFile("/dA/f1")).to.equal("/f1");
            });
            it("Cannot copy an existing file as itself" ,function(){
                resetEnv();

                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/f1"])).to.throw();
            });
            it("Can copy an existing file into an NON existing directory if asked to create them on the fly AND we specify to treat the target as a directory" ,function(){
                resetEnv();

                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/d0", "-r"])).to.not.throw();
                expect(server.readFile("/d0/f1")).to.equal("/f1");
            });
            it("Can copy an existing file into an NON existing directory if asked to create them on the fly AND we specify a directory separator at the end of the target" ,function(){
                resetEnv();

                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/d0/","-r"])).to.not.throw();
                expect(server.readFile("/d0/f1")).to.equal("/f1");
            });
            it("Can NOT copy multiple files into a single existing file" ,function(){
                resetEnv();

                expect(()=>cp(server, fakeTerm, out, err, [ "/d0/", "/f1", "-r"])).to.throw();
            });//TODO versioning tests
        });
        describe("mv", function(){
            it("Can move an existing file in an existing directory if a filename is specified" ,function(){
                resetEnv();

                expect(()=>mv(server, fakeTerm, out, err, ["/f1", "/dA/f1", "-T"])).to.not.throw();
                expect(server.readFile("/dA/f1")).to.equal("/f1");
            });
            it("Can move an existing file in an existing directory if a directory is specified" ,function(){
                resetEnv();

                expect(()=>mv(server, fakeTerm, out, err, ["/f1", "/dA"])).to.not.throw();
                expect(server.readFile("/dA/f1")).to.equal("/f1");
            });
            it("Cannot move an existing file as itself" ,function(){
                resetEnv();

                expect(()=>mv(server, fakeTerm, out, err, ["/f1", "/f1", "-T"])).to.throw();
            });
            it("Can move an existing file into an NON existing directory if asked to create them on the fly AND we specify to treat the target as a directory" ,function(){
                resetEnv();

                expect(()=>mv(server, fakeTerm, out, err, ["/f1", "/d0", "-r"])).to.not.throw();
                expect(server.readFile("/d0/f1")).to.equal("/f1");
            });
            it("Can move an existing file into an NON existing directory if asked to create them on the fly AND we specify a directory separator at the end of the target" ,function(){
                resetEnv();

                expect(()=>mv(server, fakeTerm, out, err, ["/f1", "/d0/","-r"])).to.not.throw();
                expect(server.readFile("/d0/f1")).to.equal("/f1");
            });
            it("Can NOT move multiple files into a single existing file" ,function(){
                resetEnv();

                expect(()=>mv(server, fakeTerm, out, err, [ "/dA/", "/f1", "-r", "-T"])).to.throw();
            });//TODO versioning tests
        });
        describe("ls", function(){
            it("Can list the cwd files and subdirectories with a depth of 0" ,function(){
                resetEnv();

                let expected = ["/dA/","/dA/dB/", "/dA/f2","/dA/f3"];
                let result = [];
                out = (msg) => {result.push(msg)};
                fakeTerm.currDir = "/dA";
                expect(()=>ls(server, fakeTerm, out, err, ["-d", "0"])).to.not.throw();
                expected.sort()
                result.sort()
                expect(result.join("\n")).to.equal(expected.join("\n"))
            });
            it("Can list the cwd files and subdirectories with a depth of n" ,function(){
                resetEnv();

                let expected = ["/dA/","/dA/dB/","/dA/dB/f4", "/dA/f2","/dA/f3" ]
                let result = [];
                out = (msg) => {result.push(msg)};
                fakeTerm.currDir = "/dA";
                expect(()=>ls(server, fakeTerm, out, err,["-d", "5"])).to.not.throw();
                expected.sort()
                result.sort()
                expect(result.join("\n")).to.equal(expected.join("\n"))
            });
            it("Can list a specified directory with a depth of n" ,function(){
                resetEnv();

                let expected = ["/dA/","/dA/dB/","/dA/dB/f4" , "/dA/f2","/dA/f3"]
                let result = [];
                out = (msg) => {result.push(msg)};
                fakeTerm.currDir = "/";
                expect(()=>ls(server, fakeTerm, out, err, ["/dA", "-d", "5"])).to.not.throw();
                expected.sort()
                result.sort()
                expect(result.join("\n")).to.equal(expected.join("\n"))
            });
            it("Can list files using bash patterns with a depth of n" ,function(){
                resetEnv();

                let expected = ["/dA/dB/f4" , "/dA/f2","/dA/f3"]
                let result = [];
                out = (msg) => {result.push(msg)};
                fakeTerm.currDir = "/";
                expect(()=>ls(server, fakeTerm, out, err, ["/**/f*", "-d", "5"])).to.not.throw();
                expected.sort()
                result.sort()
                expect(result.join("\n")).to.equal(expected.join("\n"))

                expected = ["/f1","/dA/dB/f4" , "/dA/f2","/dA/f3"]
                result = [];
                fakeTerm.currDir = "/";
                expect(()=>ls(server, fakeTerm, out, err, ["**/f*", "-d", "5"])).to.not.throw();
                expected.sort()
                result.sort()
                expect(result.join("\n")).to.equal(expected.join("\n"))
            });
            it("Can list multiple distant specified directory with a depth of n" ,function(){
                resetEnv();

                let expected = ["/","/dA/", "/dev/","/f1", "/dA/dB/","/dA/dB/f4"]
                let result = [];
                out = (msg) => {result.push(msg)};
                fakeTerm.currDir = "/";
                expect(()=>ls(server, fakeTerm, out, err, ["/","/dA/dB/", "-d", "0"])).to.not.throw();
                expected.sort()
                result.sort()
                expect(result.join("\n")).to.equal(expected.join("\n"))
            });
            it("Can list multiple combined specified directory with a depth of n" ,function(){
                resetEnv();

                let expected = ["/","/dA/", "/dev/","/f1", "/dA/","/dA/dB/","/dA/f2", "/dA/f3", ]
                let result = [];
                out = (msg) => {result.push(msg)};
                fakeTerm.currDir = "/";
                expect(()=>ls(server, fakeTerm, out, err, ["/","/dA/", "-d", "0"])).to.not.throw();
                expected.sort()
                result.sort()
                expect(result.join("\n")).to.equal(expected.join("\n"))
            });
        });

        describe("tree", function(){
            it("Can list the cwd files and subdirectories with a depth of 0" ,function(){
                resetEnv();

                let expected = [
                    "/dA/",
                    "├──dB/",
                    "├──f2",
                    "└──f3"
                    ].join("\n");
                let result = [];
                out = (msg) => {result.push(msg)};
                fakeTerm.currDir = "/dA";
                expect(()=>tree(server, fakeTerm, out, err, ["-d", "0"])).to.not.throw();
                expect(result.join("\n")).to.equal(expected)
            });
            it("Can list the cwd files and subdirectories with a depth of n" ,function(){
                resetEnv();

                let expected = [
                    "/dA/",
                    "├──dB/",
                    "│  └──f4",
                    "├──f2",
                    "└──f3"
                    ].join("\n")
                fakeTerm.currDir = "/dA";
                let result = [];
                out = (msg) => {result.push(msg)};
                expect(()=>tree(server, fakeTerm, out, err,["-d", "5"])).to.not.throw();
                expect(result.join("\n")).to.equal(expected)
            });
            it("Can list a specified directory with a depth of n" ,function(){
                resetEnv();

                let expected = [
                    "/dA/",
                    "├──dB/",
                    "│  └──f4" ,
                    "├──f2",
                    "└──f3"
                    ].join("\n")
                fakeTerm.currDir = "/";
                let result = [];
                out = (msg) => {result.push(msg)};
                expect(()=>tree(server, fakeTerm, out, err, ["/dA", "-d", "5"])).to.not.throw();
                expect(result.join("\n")).to.equal(expected)
            });
            it("Can list multiple distant specified directory with a depth of n" ,function(){
                resetEnv();

                let expected = [
                    "/",
                    "├──dA/",
                    "├──dev/",
                    "└──f1",
                    "/dA/dB/",
                    "└──f4"
                    ].join("\n")
                fakeTerm.currDir = "/";
                let result = [];
                out = (msg) => {result.push(msg)};
                expect(()=>tree(server, fakeTerm, out, err, ["/","/dA/dB/", "-d", "0"])).to.not.throw();
                expect(result.join("\n")).to.equal(expected)
            });
            it("Can list multiple combined specified directory with a depth of n" ,function(){
                resetEnv();

                let expected = [
                    "/",
                    "├──dA/",
                    "├──dev/",
                    "└──f1",
                    "/dA/",
                    "├──dB/",
                    "├──f2",
                    "└──f3",
                    ].join("\n")
                fakeTerm.currDir = "/";
                let result = [];
                out = (msg) => {result.push(msg)};
                expect(()=>tree(server, fakeTerm,out, err, ["/","/dA/", "-d", "0"])).to.not.throw();
                expect(result.join("\n")).to.equal(expected)
            });
        });

        describe("mkdir", function(){
            it("Can create a new directory if none exists at the specified name" ,function(){
                resetEnv();

                expect(()=>mkdir(server, fakeTerm, out, err,["/d0"])).to.not.throw();
            });
            it("Cannot create a new directory if one already exists at the specified name" ,function(){
                resetEnv();

                expect(()=>mkdir(server, fakeTerm, out, err,["/dA"])).to.throw();
            });
            it("Can create a chain of subdirectories if asked to create them recursively" ,function(){
                resetEnv();

                expect(()=>mkdir(server, fakeTerm, out, err,["/d0/d0/d0/", "-r"])).to.not.throw();
            });
            it("Can NOT  create a chain of subdirectories if NOT asked to create them recursively" ,function(){
                resetEnv();

                expect(()=>mkdir(server, fakeTerm, out, err, ["/d0/d0/d0/"])).to.throw();
            });
        });
        describe("rm", function(){
            it("Can remove an existing file" ,function(){
                resetEnv();

                expect(server.exists("/f1")).to.equal(true);
                expect(()=>rm(server, fakeTerm, out, err, ["/f1"])).to.not.throw();
                expect(server.exists("/f1")).to.equal(false);
            });
            it("Can remove an empty directory" ,function(){
                resetEnv();

                expect(()=>mkdir(server, fakeTerm, out, err, ["/d0"])).to.not.throw();
                expect(()=>rm(server, fakeTerm, out, err, ["/d0"])).to.not.throw();
                expect(server.exists("/d0")).to.equal(false);
            });
            it("Can NOT remove an unexisting directory" ,function(){
                resetEnv();

                expect(()=>rm(server, fakeTerm, out, err, ["/d0"])).to.throw();
            });
            it("Can remove a directory having files only with the recursive flag" ,function(){
                resetEnv();

                expect(()=>cp(server, fakeTerm, out, err, ["/f1", "/d0/f1", "-T", "-r"])).to.not.throw();
                expect(()=>rm(server, fakeTerm, out, err, ["/d0"])).to.throw();
                expect(server.exists("/d0")).to.equal(true);
                expect(()=>rm(server, fakeTerm, (msg)=>{console.log(msg)}, err, ["/d0", "-r"])).to.not.throw();
                expect(server.exists("/d0")).to.equal(false);
            });
        });
        describe("cat", function(){
            it("Can print an existing file" ,function(){
                resetEnv();
                let result = "";

                expect(()=>cat(server, fakeTerm, (msg)=>{result+=msg;}, err, ["/f1"])).to.not.throw();
                expect(result).to.equal(server.readFile("/f1"))
            });
            it("Can print multiple files of a single directory excluding its subdirectories" ,function(){
                resetEnv();
                let result = "";

                expect(()=>cat(server, fakeTerm, (msg)=>{result+=msg;}, err, ["/dA"])).to.not.throw();
                expect(result).to.equal(server.readFile("/dA/f3")+server.readFile("/dA/f2"));
            });
            it("Can print multiple files of a single directory including its subdirectories if using the recursive flag" ,function(){
                resetEnv();
                let result = "";

                expect(()=>cat(server, fakeTerm, (msg)=>{result+=msg;}, err, ["/dA", "-r"])).to.not.throw();
                expect(result).to.equal([server.readFile("/dA/f3"),server.readFile("/dA/f2"),server.readFile("/dA/dB/f4")].join(""));
            });
        });
        describe("alias", function(){
            it("Can register a new alias and print it" ,function(){
                resetEnv();

                let result = "";
                expect(()=>alias(server, fakeTerm, (msg)=>{result+=msg;}, err, ["a=\"val1d aliascommand; another_ammaam!#$%^&*()_+{}[]\"", "-p"])).to.not.throw();
                expect(result).to.equal("alias a=\"val1d aliascommand; another_ammaam!#$%^&*()_+{}[]\"");
            });
            it("Can register a new global alias and print it" ,function(){
                resetEnv();

                let result = "";
                expect(()=>alias(server, fakeTerm, (msg)=>{result+=msg;}, err, ["-g", "a=\"val1d aliascommand; another_ammaam!#$%^&*()_+{}[]\"", "-p"])).to.not.throw();
                expect(result).to.equal("global alias a=\"val1d aliascommand; another_ammaam!#$%^&*()_+{}[]\"");
            });
            it("Can register multiple new aliases" ,function(){
                resetEnv();

                let result = "";
                expect(()=>alias(server, fakeTerm, (msg)=>{result+=msg;}, err, ["wat=\"wowie\"", "a=\"val1d aliascommand; another_ammaam!#$%^&*()_+{}[]\"", "-p"])).to.not.throw();
                expect(result).to.equal([
                    "alias wat=\"wowie\"",
                    "alias a=\"val1d aliascommand; another_ammaam!#$%^&*()_+{}[]\""].join('\n'));
            });
            it("Can replace an older alias" ,function(){
                resetEnv();

                let result = "";
                expect(()=>alias(server, fakeTerm, (msg)=>{result+=msg;}, err, ["a=\"val1d aliascommand; another_ammaam!#$%^&*()_+{}[]\"", "-p"])).to.not.throw();
                expect(()=>alias(server, fakeTerm, (msg)=>{result+=msg;}, err, ["a=\"wowie\"", "-p"])).to.not.throw();
                expect(result).to.equal([
                    "alias a=\"val1d aliascommand; another_ammaam!#$%^&*()_+{}[]\"",
                    "alias a=\"wowie\""].join(""));
            });
            it("Can NOT register invalid aliases" ,function(){
                resetEnv();

                expect(()=>alias(server, fakeTerm, out, err, ["_a.=\"invalidalias\""])).to.throw();
                expect(()=>alias(server, fakeTerm, out, err, ["_a.=\"invalidalias"])).to.throw();
            });
        });

        const minimalScript = `
        export function main(ns){
            return;
        }
        `;

        const littleScript = `
            export async function main(ns){
                return await ns.hack();
            }
            `;
        const heavyScript = `
            export async function main(ns){
                window;
                return;
            }
            `;

        const memScripts = [
            {
                path:"/minimalScript",
                ramUsage:1.6,
                content:minimalScript,
                ip: server.ip
            },
            {
                path:"/dA/littleScript",
                ramUsage:1.7,
                content:littleScript,
                ip: server.ip
            },
            {
                path:"/dA/dB/heavyScript",
                ramUsage:26.6,
                content:heavyScript,
                ip: server.ip
            },
        ]
        describe("mem", function(){
            it("Can detect an existing script.", function(){
                resetEnv({servInitType:ServerInitType.DIRECTORIES_ONLY})
                addScriptsToServer(memScripts)

                expect(()=>mem(server, fakeTerm, out, err, ["/minimalScript"])).to.not.throw();
                expect(()=>mem(server, fakeTerm, out, err, ["/dA/littleScript"])).to.not.throw();
                expect(()=>mem(server, fakeTerm, out, err, ["/dA/dB/heavyScript"])).to.not.throw();
            });

            it("Can read the actual ram usage of an existing script.", function(){
                resetEnv({servInitType:ServerInitType.DIRECTORIES_ONLY})
                addScriptsToServer(memScripts)

                let result = "";
                out = (msg)=>{result = msg};

                expect(()=>mem(server, fakeTerm, out, err, ["/minimalScript"])).to.not.throw();
                expect(result).to.equal("/minimalScript requires 1.60 GB of RAM to run for 1 thread(s)");
                result = "";
                expect(()=>mem(server, fakeTerm, out, err, ["/dA/littleScript"])).to.not.throw();
                expect(result).to.equal("/dA/littleScript requires 1.70 GB of RAM to run for 1 thread(s)");
                result = "";
                expect(()=>mem(server, fakeTerm, out, err, ["/dA/dB/heavyScript"])).to.not.throw();
                expect(result).to.equal("/dA/dB/heavyScript requires 26.60 GB of RAM to run for 1 thread(s)");
                result = "";
            });

            it("Can read the ram usage of multiple specified scripts from a directory excluding its subdirectories.", function(){
                resetEnv({servInitType:ServerInitType.DIRECTORIES_ONLY})
                addScriptsToServer(memScripts)

                let result = [];
                out = (msg)=>{result.push(msg)};

                expect(()=>mem(server, fakeTerm, out, err, ["/"])).to.not.throw();
                expect(result.join("\n")).to.equal(
                    "/minimalScript requires 1.60 GB of RAM to run for 1 thread(s)");
                });

            it("Can read the ram usage of multiple specified scripts from a directory and its subdirectories if the recursive flag is used.", function(){
                resetEnv({servInitType:ServerInitType.DIRECTORIES_ONLY})
                addScriptsToServer(memScripts)

                let result = [];
                out = (msg)=>{result.push(msg)};
                expect(()=>mem(server, fakeTerm, out, err, ["/", "-r"])).to.not.throw();
                expect(result.join("\n")).to.equal(
                    ["/minimalScript requires 1.60 GB of RAM to run for 1 thread(s)",
                    "/dA/littleScript requires 1.70 GB of RAM to run for 1 thread(s)" ,
                    "/dA/dB/heavyScript requires 26.60 GB of RAM to run for 1 thread(s)"].join("\n"));
                });
        });

        describe("tail", function(){
            it("Can detect a running script by name and arguments", function (){
                resetEnv();
                addRunningScriptsToServer([
                    {
                        filename:"/boup",
                        args:["test"],
                        server:server.ip,
                        ramUsage:1,
                        logs:["testboup"]
                    }]);

                let result = [];
                out = (msg)=>{result=msg};

                expect(()=>tail(server, fakeTerm, out, err, ["/boup", "test"])).to.not.throw();
                expect(result.join("\n")).to.equal(["testboup"].join("\n"));
            });
            it("Can detect a running script by PID", function (){
                resetEnv();
                addRunningScriptsToServer([
                    {
                        filename:"/boup",
                        args:["test"],
                        server:server.ip,
                        ramUsage:1,
                        logs:["testboup"]
                    }]);

                let result = [];
                out = (msg)=>{result=msg};
                expect(()=>tail(server, fakeTerm, out, err, ["-p","1"])).to.not.throw();
                expect(result.join("\n")).to.equal(["testboup"].join("\n"));
            });
        });

        describe("check", function(){
            it("Can detect a running script by name and arguments", function (){
                resetEnv();
                addRunningScriptsToServer([
                    {
                        filename:"/boup",
                        args:["test"],
                        server:server.ip,
                        ramUsage:1,
                        logs:["testboup"]
                    }]);

                let result = [];
                out = (msg)=>{result=msg};

                expect(()=>check(server, fakeTerm, out, err, ["/boup", "test"])).to.not.throw();
                expect(result.join("\n")).to.equal(["testboup"].join("\n"));
            });
            it("Can detect a running script by PID", function (){
                resetEnv();
                addRunningScriptsToServer([
                    {
                        filename:"/boup",
                        args:["test"],
                        server:server.ip,
                        ramUsage:1,
                        logs:["testboup"]
                    }]);

                let result = [];
                out = (msg)=>{result=msg};
                expect(()=>check(server, fakeTerm, out, err, ["-p","1"])).to.not.throw();
                expect(result.join("\n")).to.equal(["testboup"].join("\n"));
            });
        });

        describe("scp", function(){

            it("Can copy an existing file in an existing directory if a filename is specified" ,function(){
                resetEnv();


                expect(()=>scp(server, fakeTerm, out, err, ["/f1", "/dA/f1", "-T", "--to", "destServer"], {recursive:false, verbose:false, targetAsDirectory:true, targetDir:undefined, backup:VersioningStrategy.EXISTING, overwriteStrategy:OverwriteStrategy.NO_CLOBBER, suffix:"~", to:undefined, destServer:destServer})).to.not.throw();
                expect(destServer.readFile("/dA/f1")).to.equal("/f1");
            });
            it("Can copy an existing file in an existing directory if a directory is specified" ,function(){
                resetEnv();

                expect(()=>scp(server, fakeTerm, out, err, ["/f1", "/dA", "--to", "destServer"], {recursive:false, verbose:false, targetAsDirectory:true, targetDir:undefined, backup:VersioningStrategy.EXISTING, overwriteStrategy:OverwriteStrategy.NO_CLOBBER, suffix:"~", to:undefined, destServer:destServer})).to.not.throw();
                expect(destServer.readFile("/dA/f1")).to.equal("/f1");
            });
            it("Cannot copy an existing file as itself" ,function(){
                resetEnv();

                expect(()=>scp(server, fakeTerm, out, err, ["/f1", "/f1", "--to", "destServer"], {recursive:false, verbose:false, targetAsDirectory:true, targetDir:undefined, backup:VersioningStrategy.EXISTING, overwriteStrategy:OverwriteStrategy.NO_CLOBBER, suffix:"~", to:undefined, destServer:destServer})).to.throw();
            });
            it("Can copy an existing file into an NON existing directory if asked to create them on the fly AND we specify to treat the target as a directory" ,function(){
                resetEnv();

                expect(()=>scp(server, fakeTerm, out, err, ["/f1", "/d0", "-r", "--to", "destServer"], {recursive:false, verbose:false, targetAsDirectory:true, targetDir:undefined, backup:VersioningStrategy.EXISTING, overwriteStrategy:OverwriteStrategy.NO_CLOBBER, suffix:"~", to:undefined, destServer:destServer})).to.not.throw();
                expect(destServer.readFile("/d0/f1")).to.equal("/f1");
            });
            it("Can copy an existing file into an NON existing directory if asked to create them on the fly AND we specify a directory separator at the end of the target" ,function(){
                resetEnv();

                expect(()=>scp(server, fakeTerm, out, err, ["/f1", "/d0/","-r", "--to", "destServer"], {recursive:false, verbose:false, targetAsDirectory:true, targetDir:undefined, backup:VersioningStrategy.EXISTING, overwriteStrategy:OverwriteStrategy.NO_CLOBBER, suffix:"~", to:undefined, destServer:destServer})).to.not.throw();
                expect(destServer.readFile("/d0/f1")).to.equal("/f1");
            });
            it("Can NOT copy multiple files into a single existing file" ,function(){
                resetEnv();

                expect(()=>scp(server, fakeTerm, out, err, [ "/d0/", "/f1", "-r", "--to", "destServer"], {recursive:false, verbose:false, targetAsDirectory:true, targetDir:undefined, backup:VersioningStrategy.EXISTING, overwriteStrategy:OverwriteStrategy.NO_CLOBBER, suffix:"~", to:undefined, destServer:destServer})).to.throw();
            });//TODO versioning tests
        });
        let URL = "https://support.oneskyapp.com/hc/en-us/article_attachments/202761627/example_1.json";
        let content = {
            "fruit": "Apple",
            "size": "Large",
            "color": "Red"
        }
//        describe("wget", function(){ // TODO, the function works correctly, I just cant get fetch to work during tests.

//            it("can retrieve files from an URL into a file", async function(){
//               resetEnv();
//                let promise = wget(server, fakeTerm, out, err, [ "--from", URL, "--to", "/fX"])
//                expect(async ()=>{await promise}).to.not.throw();
//                expect(JSON.parse(server.readFile("/fX"))).equals(content);
//            })

//        })
        describe("buy", function(){
            it("Can buy programs from the dark web if connected to it and enough money", function(){
                resetEnv();
                Player.gainMoney(10000000);
                SpecialServerIps["Darkweb Server"] = true;
                expect(()=>buy(server, fakeTerm, out, err, ["AutoLink.exe"], {Player:Player, SpecialServerIps:SpecialServerIps})).to.not.throw();
                expect(Player.hasProgram("AutoLink.exe")).to.equal(true);
            });
            it("Can NOT buy programs from the dark web if NOT connected to it", function(){
                resetEnv();
                expect(()=>buy(server, fakeTerm, out, err, ["AutoLink.exe"], {Player:Player, SpecialServerIps:SpecialServerIps})).to.throw();
            });
            it("Can NOT buy programs from the dark web if NOT enough money", function(){
                resetEnv();
                SpecialServerIps["Darkweb Server"] = true;
                expect(()=>buy(server, fakeTerm, out, err, ["AutoLink.exe"], {Player:Player, SpecialServerIps:SpecialServerIps})).to.throw();
            });
            it("Can NOT buy programs from the dark web if the name doesnt exist", function(){
                resetEnv();
                Player.gainMoney(10000000);
                SpecialServerIps["Darkweb Server"] = true;
                expect(()=>buy(server, fakeTerm, out, err, ["Aut@Link.exe"], {Player:Player, SpecialServerIps:SpecialServerIps})).to.throw();
            });
        });

        describe("download", function(){
            it("Can download programs at the root", function(){
                resetEnv();
                let expected = ["Zipping up /f1.."];
                let results = [];

                out = (msg)=>{results.push(msg)};

                expect(()=>download(server, fakeTerm, out, err, ["/f*"], {testing:true})).to.not.throw();
                expected.sort();
                results.sort();
                expect(results.join("\n")).to.equal(expected.join("\n"));
            });
            it("Can download any matching programs", function(){
                resetEnv();
                let expected =     [
                    "Zipping up /dA/dB/f4..",
                    "Zipping up /dA/f2..",
                    "Zipping up /dA/f3..",
                    "Zipping up /f1.."
                ];
                let results = [];

                out = (msg)=>{results.push(msg)};

                expect(()=>download(server, fakeTerm, out, err, ["**/f*"],{testing:true})).to.not.throw();
                expected.sort();
                results.sort();
                expect(results.join("\n")).to.equal(expected.join("\n"));
            });

        });



        describe("expr", function(){
            it("can process simple calculus", function(){
                expectResultFromExpr('12 / (2.3 + 0.7)', "4"); // calculus
                expectResultFromExpr(`((18 * 2)-(2/(4+8-4)))^2`, "1278.0625"); //calculus

                expectResultFromExpr('9 / 3 + 2i', "3 + 2i");//imaginary numbers

                expectResultFromExpr(`simplify("2x + x")`, "3 * x");//algebra, equation simplification
                expectResultFromExpr(`derivative("2x^2 + 3x + 4", "x")`, "4 * x + 3"); // equation derivation
            });
            it("can process matrix calculus", function(){

                expectResultFromExpr('det([-1, 2; 3, 1])', "-7"); // matrix calculus

                expectResultFromExpr('9 / 3 + 2i', "3 + 2i");//imaginary numbers

                expectResultFromExpr(`simplify("2x + x")`, "3 * x");//algebra, equation simplification
                expectResultFromExpr(`derivative("2x^2 + 3x + 4", "x")`, "4 * x + 3"); // equation derivation
            });
            it("can process imaginary numbers", function(){

                expectResultFromExpr('9 / 3 + 2i', "3 + 2i");//imaginary numbers

            });
            it("can process linear algebra", function(){
                expectResultFromExpr(`simplify("2x + x")`, "3 * x");//algebra, equation simplification
                expectResultFromExpr(`derivative("2x^2 + 3x + 4", "x")`, "4 * x + 3"); // equation derivation
            });
        });
        describe("free", function(){
            it("Can display the current server RAM info", function(){
                resetEnv();
                server.maxRam = 0;

                let expected = ["Available: 0.00 GB", "Total:     0.00 GB", "Used:      0.00 GB (0.00%)"];
                let results = [];

                out = (msg)=>{results.push(msg); };
                expect(()=>free(server, fakeTerm, out, err, [])).to.not.throw();
                expected.sort();
                results.sort();
                expect(results.join("\n")).to.equal(expected.join("\n"));

                server.maxRam = 32;
                expected = ["Available: 32.00 GB", "Total:     32.00 GB", "Used:       0.00 GB (0.00%)"];
                results = [];

                out = (msg)=>{results.push(msg); };
                expect(()=>free(server, fakeTerm, out, err, [])).to.not.throw();
                expected.sort();
                results.sort();
                expect(results.join("\n")).to.equal(expected.join("\n"));

            })

        });
        describe("hack", function(){
            it("Can NOT hack a BaseServer purchased by the player", function(){
                resetEnv();
                server.purchasedByPlayer = true;
                let result = false;
                fakeTerm.startHack = ()=>{result = true};
                expect(()=>hack(server, fakeTerm, out, err, [], {Player:Player})).to.throw();
                expect(result).to.equal(false);
            });
            it("Can NOT hack a BaseServer if the player doesn't have root access", function(){
                resetEnv();
                server.hasAdminRights = false;
                let result = false;
                fakeTerm.startHack = ()=>{result = true};
                expect(()=>hack(server, fakeTerm, out, err, [], {Player:Player})).to.throw();
                expect(result).to.equal(false);
            });
            it("Can NOT hack a BaseServer if the player doesn't have the server required hacking level", function(){
                resetEnv();
                server.requiredHackingSkill = 100;
                Player.hacking_skill = 0;
                let result = false;
                fakeTerm.startHack = ()=>{result = true};
                expect(()=>hack(server, fakeTerm, out, err, [], {Player:Player})).to.throw();
                expect(result).to.equal(false);
            });
            it("Can NOT hack a HacknetServer", function(){
                resetEnv();
                let hacknetServer = new HacknetServer();
                let result = false;
                fakeTerm.startHack = ()=>{result = true};
                expect(()=>hack(hacknetServer, fakeTerm, out, err, [], {Player:Player})).to.throw();
                expect(result).to.equal(false);
            });
            it("Can hack any BaseServer where the player is not the owner but have both root access and the required hack level", function(){
                resetEnv();
                server.purchasedByPlayer = false;
                server.requiredHackingSkill = 0;
                Player.hacking_skill = 1;
                server.hasAdminRights = true;
                let result = false;
                fakeTerm.startHack = ()=>{result = true};
                expect(()=>hack(server, fakeTerm, out, err, [], {Player:Player})).not.to.throw();
                expect(result).to.equal(true);
            });
        });

        const notWorkingScript = `export function main(ns){ return await ns.sleep(1); }`;
        const workingScript = "import {r2d} from './dir2/script2'; export function main(ns){ return r2d(2); }";
        const workingSubscript = "export function r2d(x){return x;}";

        const run_scripts = [
            {
                path:"/dir1/script1",
                ramUsage: NaN,
                content: workingScript,
                ip: server.ip
            },
            {
                path:"/dir1/dir2/script2",
                ramUsage: 1.6,
                content: workingSubscript,
                ip: server.ip
            },
            {
                path:"/dir1/script3",
                ramUsage: NaN,
                content: notWorkingScript,
                ip: server.ip
            }
        ]

        describe("run", function(){
            it("Can run a valid script using absolute pathing", async function(){
                resetEnv();
                addScriptsToServer(run_scripts);
                //absolute pathing
                await expect(run(server, fakeTerm, out, err, ["/dir1/script1"], {Player:Player})).to.eventually.be.fulfilled;
                expect(()=>killall(server, fakeTerm, out, err, [])).not.to.throw();

            });
            it("Can run a valid script using relative pathing", async function(){
                resetEnv();
                addScriptsToServer(run_scripts);
                //relative pathing
                fakeTerm.currDir = "/dir1/";
                await expect(run(server, fakeTerm, out, err, ["script1"], {Player:Player})).to.eventually.be.fulfilled;
                expect(()=>killall(server, fakeTerm, out, err, [])).not.to.throw();

            });
            it("Can NOT run an invalid script using absolute pathing", async function(){
                resetEnv();
                addScriptsToServer(run_scripts);

                await expect(run(server, fakeTerm, out, err, ["/dir1/script3"], {Player:Player})).to.eventually.be.rejected;

            });
            it("Can NOT run an invalid script using relative pathing", async function(){
                resetEnv();
                addScriptsToServer(run_scripts);

                fakeTerm.currDir = "/dir1/";
                await expect(run(server, fakeTerm, out, err, ["script3"], {Player:Player})).to.eventually.be.rejected;

            });
            //it("TODO Can run an existing coding contract", function(){
            //    resetEnv();
            //    expect(false).to.equal(true);
                //server.addContract() //TODO
                //expect(()=>run(server, fakeTerm, out, err, ["/dir1/script1"], {Player:Player})).to.throw();
                //fakeTerm.currDir = "/dir1/";
                //expect(()=>run(server, fakeTerm, out, err, ["script1"], {Player:Player})).to.throw();

            //});
            //it("TODO Can NOT run an inexisting coding contract", function(){
            //    resetEnv();
            //    expect(false).to.equal(true);


            //});
            it("Can run an owned executable", async function(){
                resetEnv();

                sys.revealExecutable("AutoLink.exe");
                expect(sys.fetchExecutable("AutoLink.exe")).to.not.equal(undefined);
                await expect(run(server, fakeTerm, out, err, ["AutoLink.exe"], {Player:Player})).to.eventually.be.fulfilled;
                sys.hideExecutable("AutoLink.exe");
            });

            it("Can NOT run an unowned executable", async function(){
                resetEnv();

                out = (msg)=>{console.log(msg)};
                await expect(run(server, fakeTerm, out, err, ["AutoLink.exe"], {Player:Player})).to.eventually.be.rejected;

            });
            it("Can NOT run an inexisting file, executable or coding contract", async function(){
                resetEnv();
                await expect(run(server, fakeTerm, out, err, ["wow it didnt work!"], {Player:Player})).to.eventually.be.rejected;

            });
        });

        describe("sudov", function(){
            it("Can detect admin rights", function(){
                resetEnv();
                server.hasAdminRights = true;
                let result = "";
                out = (msg) => {result = msg};
                let expected = "You have root access to this machine.";
                expect(()=>sudov(server, fakeTerm, out, err, [])).not.to.throw();
                expect(result).to.equal(expected)
            });
            it("Can detect NO admin rights", function(){
                resetEnv();
                server.hasAdminRights = false;
                let result = "";
                out = (msg) => {result = msg};
                let expected = "You DO NOT have root access to this machine.";
                expect(()=>sudov(server, fakeTerm, out, err, [])).not.to.throw();
                expect(result).to.equal(expected)
            });
        });

        describe("cd", function(){
            it("Can change cwd to an existing absolute path", function(){
                resetEnv();
                let expected = "/dA/dB";
                expect(()=>cd(server, fakeTerm, out, err, ["/dA/dB"])).not.to.throw();
                expect(fakeTerm.currDir).to.equal(expected)
            });
            it("Can change cwd to an existing relative path", function(){
                resetEnv();
                fakeTerm.currDir = "/dA/dB";
                let expected = "/dA";
                expect(()=>cd(server, fakeTerm, out, err, [".."])).not.to.throw();
                expect(fakeTerm.currDir).to.equal(expected)
            });
            it("Can NOT change cwd to an inexisting absolute path", function(){
                resetEnv();
                let expected = "/";
                expect(()=>cd(server, fakeTerm, out, err, ["/dZ"])).to.throw();
                expect(fakeTerm.currDir).to.equal(expected)
            });
            it("Can NOT change cwd to an inexisting relative path", function(){
                resetEnv();
                fakeTerm.currDir = "/dA/dB";
                let expected = "/dA/dB";
                expect(()=>cd(server, fakeTerm, out, err, ["../dC"])).to.throw();
                expect(fakeTerm.currDir).to.equal(expected)
            });
        });

        describe("scan", function(){
            it("Can scan neighbouring servers", function(){
                resetEnv();
                let result = [];
                let expected = [
                    "Hostname             IP                   Root Access",
                    "???                  666.666.666.669      N",
                    "home                 127.0.0.1            Y"
                    ];
                out = (msg) => { result.push(msg);}

                expect(()=>scan(server, fakeTerm, out, err, [])).not.to.throw();
                result.sort();
                expected.sort();
                expect(result.join("\n")).to.equal(expected.join("\n"));
            });
        });

        describe("hostname", function(){
            it("Can display the hostname of the current server", function(){
                resetEnv();
                let result = "";
                let expected = "home";
                out = (msg) => { result += msg;}

                expect(()=>hostname(server, fakeTerm, out, err, [])).not.to.throw();
                expect(result).to.equal(expected);
            });
        });

        describe("ifconfig", function(){
            it("Can display the ip of the current server", function(){
                resetEnv();
                let result = "";
                let expected = server.ip;
                out = (msg) => { result += msg;}

                expect(()=>ifconfig(server, fakeTerm, out, err, [])).not.to.throw();
                expect(result).to.equal(expected);
            });
        });

        describe("lscpu", function(){
            it("Can display the amount of cores of the current server", function(){
                resetEnv();
                let result = "";
                server.cpuCores = 1;
                let expected = "1 Core(s)";
                out = (msg) => { result += msg;}

                expect(()=>lscpu(server, fakeTerm, out, err, [])).not.to.throw();
                expect(result).to.equal(expected);
            });
        });

        describe("connect", function(){
            it("Can connect to a neighbouring server", function(){
                resetEnv();
                let result = "";
                let expected = "Connected to ???";
                out = (msg) => { result += msg;}

                expect(()=>connect(server, fakeTerm, out, err, ["???"])).not.to.throw();
                expect(result).to.equal(expected);
                expect(()=>connect(server, fakeTerm, out, err, ["home"])).not.to.throw();

            });
            it("Can NOT connect to a NON neighbouring server", function(){
                resetEnv();
                let result = "";
                let expected = "xxx.xxx.xxx.xxx out of reach";
                err = (msg) => { result += msg; throw msg};

                expect(()=>connect(server, fakeTerm, out, err, ["xxx.xxx.xxx.xxx"])).to.throw();
                expect(result).to.equal(expected);
            });
            it("Can connect to a NON neighbouring server using AutoLink", function(){
                resetEnv();
                let result = "";
                let expected = "Connected to xxx.xxx.xxx.xxx";
                out = (msg) => { result += msg;};

                expect(()=>connect(server, fakeTerm, out, err, ["xxx.xxx.xxx.xxx"], {autolink:true})).to.not.throw();
                expect(result).to.equal(expected);
                expect(()=>connect(server, fakeTerm, out, err, ["home"], {autolink:true})).not.to.throw();
            });
        });
        describe("home", function(){
            it("Can go home from a neighbouring server", function(){
                resetEnv();
                let result = "";
                let expected = "Connected to home";

                expect(()=>connect(server, fakeTerm, out, err, ["???"])).not.to.throw();
                out = (msg) => { result += msg;}
                expect(()=>home(server, fakeTerm, out, err, [])).not.to.throw();
                expect(result).to.equal(expected);

            });
            it("Can go home from a NON neighbouring server", function(){
                resetEnv();
                let result = "";
                let expected = "Connected to home";

                expect(()=>connect(server, fakeTerm, out, err, ["xxx.xxx.xxx.xxx"], {autolink:true})).to.not.throw();
                out = (msg) => { result += msg;}
                expect(()=>home(server, fakeTerm, out, err, [])).not.to.throw();
                expect(result).to.equal(expected);
            });
        });

        describe("top", function(){
            it("Can display the list of running script, their ram usage and amount of threads", function (){
                resetEnv();
                addRunningScriptsToServer([
                    {
                        filename:"/f1",
                        args:["test"],
                        server:server.ip,
                        ramUsage:1,
                        logs:["testboup"]
                    },
                    {
                        filename:"/f1",
                        args:["david"],
                        server:server.ip,
                        ramUsage:3,
                        logs:["wowie"]
                    },]);

                let result = [];
                out = (msg)=>{result.push(msg)};
                let expected = [
                    "Script                                  PID       Threads         RAM Usage",
                    "/f1                                     2         1               3.00 GB",
                    "/f1                                     1         1               1.00 GB"];

                expect(()=>top(server, fakeTerm, out, err, [])).to.not.throw();
                expected.sort();
                result.sort()
                expect(result.join("\n")).to.equal(expected.join("\n"));
            });
        });

        describe("kill", function(){
            it("Can kill a running script by arguments or PID", function (){
                resetEnv();
                addRunningScriptsToServer([
                    {
                        filename:"/f1",
                        args:["test"],
                        server:server.ip,
                        ramUsage:1,
                        logs:["testboup"]
                    },
                    {
                        filename:"/f1",
                        args:["david"],
                        server:server.ip,
                        ramUsage:3,
                        logs:["wowie"]
                    },]);

                let result = [];
                out = (msg)=>{result.push(msg);};
                let expected = [
                    "Script                                  PID       Threads         RAM Usage",
                    "/f1                                     2         1               3.00 GB",
                    "/f1                                     1         1               1.00 GB"];

                expect(()=>top(server, fakeTerm, out, err, [])).to.not.throw();
                expected.sort();
                result.sort()
                expect(result.join("\n")).to.equal(expected.join("\n"));
                // both scripts are now running.
                // test 1: killing by arguments
                expect(()=>kill(server, fakeTerm, out, err, ["/f1", "test"], {testing:true})).to.not.throw();

                result = [];
                expected = [
                    "Script                                  PID       Threads         RAM Usage",
                    "/f1                                     2         1               3.00 GB"];

                expect(()=>top(server, fakeTerm, out, err, [])).to.not.throw();
                expected.sort();
                result.sort()
                expect(result.join("\n")).to.equal(expected.join("\n"));
                //test 2: killing by PID
                expect(()=>kill(server, fakeTerm, out, err, ["-p","2"],{testing:true})).to.not.throw();

                result = [];
                expected = [ "Script                                  PID       Threads         RAM Usage"];

                expect(()=>top(server, fakeTerm, out, err, [])).to.not.throw();
                expected.sort();
                result.sort()
                expect(result.join("\n")).to.equal(expected.join("\n"));
            });
        });

        describe("killall", function(){
            it("Can kill every running scripts", function (){
                resetEnv();
                addRunningScriptsToServer([
                    {
                        filename:"/f1",
                        args:["test"],
                        server:server.ip,
                        ramUsage:1,
                        logs:["testboup"]
                    },
                    {
                        filename:"/f1",
                        args:["david"],
                        server:server.ip,
                        ramUsage:3,
                        logs:["wowie"]
                    },]);

                let result = [];
                out = (msg)=>{result.push(msg);};
                let expected = [
                    "Script                                  PID       Threads         RAM Usage",
                    "/f1                                     2         1               3.00 GB",
                    "/f1                                     1         1               1.00 GB"];

                expect(()=>top(server, fakeTerm, out, err, [])).to.not.throw();
                expected.sort();
                result.sort()
                expect(result.join("\n")).to.equal(expected.join("\n"));
                // both scripts are now running.
                expect(()=>killall(server, fakeTerm, out, err, [], {testing:true})).to.not.throw();

                result = [];
                expected = [ "Script                                  PID       Threads         RAM Usage"];

                expect(()=>top(server, fakeTerm, out, err, [])).to.not.throw();
                expected.sort();
                result.sort()
                expect(result.join("\n")).to.equal(expected.join("\n"));
            });
        });
    });
})

