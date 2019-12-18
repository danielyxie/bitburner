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
import { hasGangAPI } from "../../src/Gangs/lib/hasGangAPI";
import { hasGang } from "../../src/Gangs/lib/hasGang";
import { createGang } from "../../src/Gangs/lib/createGang";


import * as sys from "../../src/Server/lib/sys";

import {Terminal} from "../../src/Terminal";

import {Player} from "../../src/Player";

import { PlayerObject } from "../../src/PersonObjects/Player/PlayerObject";

import { Gang, GANGTYPE } from "../../src/Gang";

describe("Gang system core library tests", function() {

    let out = (msg) => {}; // null stream
    let err = (msg) => {throw msg}; // exception callback
    let fakeTerm = Terminal;
    fakeTerm.output = [];
    fakeTerm.clearOutput = ()=>{fakeTerm.output=[];};
    fakeTerm.resetTerminalInput = ()=>{};
    fakeTerm.currDir = "/";
    const gangInitType = {
        CANNOT: 1,
        POSSIBLE: 2,
        EXISTS: 3
    }
    var Player = new PlayerObject();

    function resetEnv(options={gangInitType:gangInitType.POSSIBLE}){
        Player = new PlayerObject();
        Player.bitNodeN = 2;
        Player.sourceFiles=[{n:2,lvl:1}];
        fakeTerm.getPlayer=()=>Player;

        switch (options.gangInitType) {
            case gangInitType.EXISTS:
                Player.factions.push("Slum Snakes");
                Player.gang = new Gang("Slum Snakes", GANGTYPE.combat);
                break;
            case gangInitType.POSSIBLE:
                Player.factions.push("Slum Snakes");
                break;
            default:
                break;
        }
        out = (msg) => {};
        err = (msg) => {throw msg};

    };


    describe("Gang executables", function (){
        describe("HasGangAPI says gang function are ", function(){
            it("Available in Bitnode 2" ,function(){
                resetEnv();
                Player.sourceFiles=[];
                let hasAccess = false;
                out = (msg)=> hasAccess = msg;
                expect(()=>hasGangAPI(null, fakeTerm, out, err, [])).to.not.throw();
                expect(hasAccess).to.equal(true);
            });
            it("Available with SourceFile 2" ,function(){
                resetEnv();
                Player.bitNodeN = 1;
                let hasAccess = false;
                out = (msg)=> hasAccess = msg;
                expect(()=>hasGangAPI(null, fakeTerm, out, err, [])).to.not.throw();
                expect(hasAccess).to.equal(true);
            });
            it("Unavailable without SourceFile 2 nor Bitnode 2" ,function(){
                resetEnv();
                Player.bitNodeN = 1;
                Player.sourceFiles=[];
                let hasAccess = false;
                out = (msg)=> hasAccess = msg;
                expect(()=>hasGangAPI(null, fakeTerm, out, err, [])).to.not.throw();
                expect(hasAccess).to.equal(false);
            });
        });
        describe("HasGang says gang", function(){
            it("Exists if it does" ,function(){
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = ()=>Player;
                let exists = false;
                out = (msg)=> exists = msg;
                expect(()=>hasGang(null, fakeTerm, out, err, [])).to.not.throw();
                expect(exists).to.equal(true);
            });
            it("Do not exists if it doesn't" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                let exists = false;
                out = (msg)=> exists = msg;
                expect(()=>hasGang(null, fakeTerm, out, err, [])).to.not.throw();
                expect(exists).to.equal(false);
            });
        });
        describe("createGang", function(){
            it("lists all current factions you can currently create gangs with" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.factions=["NiteSec", "Slum Snakes"];
                fakeTerm.getPlayer = ()=>Player;
                let expected = ["NiteSec\thacking", "Slum Snakes\tcombat"];
                let result = [];
                out = (msg)=> result.push(msg);
                expect(()=>createGang(null, fakeTerm, out, err, ["-l"])).to.not.throw();
                result.sort();
                expected.sort();
                expect(result.join("\n")).to.equal(expected.join("\n"));
            });
            it("lists the type of gang factions you are currently member with can create" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.factions=["NiteSec", "Slum Snakes", "Sector 12"];
                fakeTerm.getPlayer = ()=>Player;
                let expected = ["NiteSec\thacking", "Slum Snakes\tcombat", "Sector 12 does not deal with gangs"];
                let result = [];
                out = (msg)=> result.push(msg);
                expect(()=>createGang(null, fakeTerm, out, err, ["-t", "NiteSec", "Slum Snakes", "Sector 12"])).to.not.throw();
                result.sort();
                expected.sort();
                expect(result.join("\n")).to.equal(expected.join("\n"));
            });
            it("does NOT lists the type of gang factions you are NOT currently member with can create" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.factions=[];
                fakeTerm.getPlayer = ()=>Player;
                let result = [];
                out = (msg)=> result.push(msg);
                expect(()=>createGang(null, fakeTerm, out, err, ["-t", "NiteSec"])).to.throw();
                expect(result.join("\n")).to.equal([].join("\n"));
            });
            it("creates a gang with a faction you are a member of which can create gang" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.factions=["Slum Snakes"];
                fakeTerm.getPlayer = ()=>Player;
                let expected = ["Gang with Slum Snakes successfully created!"];
                let result = [];
                out = (msg)=> result.push(msg);
                expect(()=>createGang(null, fakeTerm, out, err, ["Slum Snakes"])).to.not.throw();
                expect(result.join("\n")).to.equal(expected.join("\n"));
                expect(Player.gang).to.be.instanceof(Gang);
            });
            it("does NOT creates a gang with a faction you are NOT a member of" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.factions=[];
                fakeTerm.getPlayer = ()=>Player;
                let expected = [];
                let result = [];
                out = (msg)=> result.push(msg);
                expect(()=>createGang(null, fakeTerm, out, err, ["Slum Snakes"])).to.throw();
                expect(result.join("\n")).to.equal(expected.join("\n"));
                expect(Player.gang).not.to.be.instanceof(Gang);
            });
            it("does NOT creates a gang with a faction you are a member of but CANNOT manage gangs" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.factions=["Sector 12"];
                fakeTerm.getPlayer = ()=>Player;
                let expected = [];
                let result = [];
                out = (msg)=> result.push(msg);
                expect(()=>createGang(null, fakeTerm, out, err, ["Sector 12"])).to.throw();
                expect(result.join("\n")).to.equal(expected.join("\n"));
                expect(Player.gang).not.to.be.instanceof(Gang);
            });
            it("does NOT creates a gang when you ALREADY have a gang" ,function(){
                resetEnv(gangInitType.EXISTS);
                Player.factions=["Slum Snakes", "NiteSec"];
                Player.gang=new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = ()=>Player;
                let expected = [];
                let result = [];
                let out = (msg)=> {result.push(msg)};
                let err=(msg)=>{throw msg};
                expect(()=>createGang(null, fakeTerm, out, err, ["NiteSec"])).to.throw();
                expect(result.join("\n")).to.equal(expected.join("\n"));
            });
        });
    });
})

