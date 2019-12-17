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
        EXIST: 3
    }
    var Player = new PlayerObject();

    function resetEnv(options={gangInitType:gangInitType.POSSIBLE}){
        Player = new PlayerObject();
        Player.bitNodeN = 2;
        Player.sourceFiles=[{n:2,lvl:1}];
        fakeTerm.getPlayer=()=>Player;

        switch (options.gangInitType) {
            case gangInitType.EXIST:
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


    describe("Gang executable access", function (){
        describe("HasGangAPI function is ", function(){
            it("Available in Bitnode 2" ,function(){
                resetEnv();
                Player.sourceFiles=[];
                let isHidden = false;
                out = (msg)=> isHidden = msg;
                expect(()=>isHidden = sys.isExecutableHidden("hasGangAPI")).to.not.throw();
                expect(isHidden).to.equal(false);
            });
            it("Available with SourceFile 2" ,function(){
                resetEnv();
                Player.bitNodeN = 1;
                let isHidden = false;
                expect(()=>isHidden = sys.isExecutableHidden("hasGangAPI")).to.not.throw();
                expect(isHidden).to.equal(false);
            });
            it("Available without SourceFile 2 nor Bitnode 2" ,function(){
                resetEnv();
                Player.bitNodeN = 1;
                Player.sourceFiles=[];
                let isHidden = false;
                expect(()=>isHidden = sys.isExecutableHidden("hasGangAPI")).to.not.throw();
                expect(isHidden).to.equal(false);
            });
        });
    });
})

