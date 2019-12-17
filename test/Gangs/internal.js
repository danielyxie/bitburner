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


import * as sys from "../../src/Server/lib/sys";

import {Terminal} from "../../src/Terminal";

import {Player} from "../../src/Player";

import { PlayerObject } from "../../src/PersonObjects/Player/PlayerObject";

import { Gang } from "../../src/Gang";

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
                Player.gang = new Gang("Slum Snakes");
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
    });
})

