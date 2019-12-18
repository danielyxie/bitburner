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
import { getBonusTime } from "../../src/Gangs/lib/getBonusTime";
import { setTerritoryWarfare } from "../../src/Gangs/lib/setTerritoryWarfare";
import { getChanceToWinClash } from "../../src/Gangs/lib/getChanceToWinClash";
import {ascendMember} from "../../src/Gangs/lib/ascendMember";
import {purchaseEquipment} from "../../src/Gangs/lib/purchaseEquipment";
import {getEquipmentCost} from "./Gangs/lib/getEquipmentCost";
import {getEquipmentNames} from "./Gangs/lib/getEquipmentNames";
import {setMemberTask} from "./Gangs/lib/setMemberTask";
import {getTaskNames} from "./Gangs/lib/getTaskNames";
//import {recruitMember} from "./Gangs/lib/recruitMember";
//import {canRecruitMember} from "./Gangs/lib/canRecruitMember";
//import {getMemberInformation} from "./Gangs/lib/getMemberInformation";
//import {getOtherGangInformation} from "./Gangs/lib/getOtherGangInformation";
//import {getGangInformation} from "./Gangs/lib/getGangInformation";
//import {getMemberNames} from "./Gangs/lib/getMemberNames";
import {getEquipmentType} from "./Gangs/lib/getEquipmentType";

import * as sys from "../../src/Server/lib/sys";

import {Terminal} from "../../src/Terminal";

import {Player} from "../../src/Player";

import { PlayerObject } from "../../src/PersonObjects/Player/PlayerObject";

import { Gang, GANGTYPE, AllGangs } from "../../src/Gang";

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

    function resetEnv(options={gangInitType:gangInitType.EXISTS}){
        Player = new PlayerObject();
        Player.bitNodeN = 2;
        Player.sourceFiles=[{n:2,lvl:1}];
        Player.gang = undefined;

        switch (options.gangInitType) {
            case gangInitType.EXISTS:
                Player.factions.push("Slum Snakes");
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.bitNodeN = 2;
                Player.sourceFiles=[{n:2,lvl:1}];
                break;
            case gangInitType.POSSIBLE:
                Player.factions.push("Slum Snakes");
                Player.bitNodeN = 2;
                Player.sourceFiles=[{n:2,lvl:1}];
                break;
            default:
                Player.bitNodeN = 1;
                Player.sourceFiles=[];
                break;
        }
        fakeTerm.getPlayer=()=>{return Player};
        out = (msg) => {};
        err = (msg) => {throw msg};
        sys.revealNamespace("gang");

    };


    describe("Gang executables", function (){
        describe("HasGangAPI says gang function are ", function(){
            it("Available in Bitnode 2" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.bitNodeN = 2;
                Player.sourceFiles = [{n:2, lvl:1}];
                let hasAccess = false;
                out = (msg)=> hasAccess = msg;
                expect(()=>hasGangAPI(null, fakeTerm, out, err, [])).to.not.throw();
                expect(hasAccess).to.equal(true);
            });
            it("Available with SourceFile 2" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.bitNodeN = 1;
                Player.sourceFiles = [{n:2, lvl:1}];
                let hasAccess = false;
                out = (msg)=> hasAccess = msg;
                expect(()=>hasGangAPI(null, fakeTerm, out, err, [])).to.not.throw();
                expect(hasAccess).to.equal(true);
            });
            it("Unavailable without SourceFile 2 nor Bitnode 2" ,function(){
                resetEnv(gangInitType.CANNOT);
                Player.bitNodeN = 1;
                Player.sourceFiles = [];
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
                let exists = false;
                out = (msg)=> exists = msg;
                expect(()=>hasGang(null, fakeTerm, out, err, [])).to.not.throw();
                expect(exists).to.equal(true);
            });
            it("Do not exists if it doesn't" ,function(){
                resetEnv(gangInitType.CANNOT);
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
                let result = [];
                out = (msg)=> result.push(msg);
                expect(()=>createGang(null, fakeTerm, out, err, ["-t", "NiteSec"])).to.throw();
                expect(result.join("\n")).to.equal([].join("\n"));
            });
            it("creates a gang with a faction you are a member of which can create gang" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.factions=["Slum Snakes"];
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
                let expected = [];
                let result = [];
                let out = (msg)=> {result.push(msg)};
                let err=(msg)=>{throw msg};
                expect(()=>createGang(null, fakeTerm, out, err, ["NiteSec"])).to.throw();
                expect(result.join("\n")).to.equal(expected.join("\n"));
            });
        });
        describe("getBonusTime", function(){
            it("outputs the bonus time available to your gang" ,function(){
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer=()=>{return Player};
                let value;
                out = (msg)=> {value = msg};
                expect(()=>getBonusTime(null, fakeTerm, out, err, [])).to.not.throw();
                expect(value).not.to.equal(undefined);
            });
            it("does NOT outputs any bonus time if you have NO gang" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer=()=>{return Player};
                let value;
                out = (msg)=> {value = msg};
                expect(()=>getBonusTime(null, fakeTerm, out, err, [])).to.throw();
                expect(value).to.equal(undefined);
            });
        });
        describe("setTerritoryWarfare", function(){
            it("Sets the Territory Warfare of your gang to the right mode" ,function(){
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.territoryWarfareEngaged = false;
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>setTerritoryWarfare(null, fakeTerm, out, err, ["true"])).to.not.throw();
                expect(Player.gang.territoryWarfareEngaged).to.equal(true);
                expect(()=>setTerritoryWarfare(null, fakeTerm, out, err, ["false"])).to.not.throw();
                expect(Player.gang.territoryWarfareEngaged).to.equal(false);
                expect(()=>setTerritoryWarfare(null, fakeTerm, out, err, [true])).to.not.throw();
                expect(Player.gang.territoryWarfareEngaged).to.equal(true);
                expect(()=>setTerritoryWarfare(null, fakeTerm, out, err, [false])).to.not.throw();
                expect(Player.gang.territoryWarfareEngaged).to.equal(false);
            });
            it("THROW an error if you have NO gang" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>setTerritoryWarfare(null, fakeTerm, out, err, [])).to.throw();
            });
        });
        describe("getChanceToWinClash", function(){
            it("Gets the chances to win clash between your gang and another" ,function(){
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>getChanceToWinClash(null, fakeTerm, out, err, ["NiteSec", "The Black Hand"])).to.not.throw();
            });
            it("Gets the chances to win clash between your gang and every other gang with list argument" ,function(){
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer=()=>{return Player};
                let result = [];
                out = (msg)=>{result.push(msg)}
                expect(()=>getChanceToWinClash(null, fakeTerm, out, err, ["-l"])).to.not.throw();
                expect(result.length).to.equal(Object.keys(AllGangs).length-1);
            });
            it("THROW an error if you have NO gang" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>getChanceToWinClash(null, fakeTerm, out, err, ["NiteSec"])).to.throw();
            });
            it("THROW an error if you don't provide arguments" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>getChanceToWinClash(null, fakeTerm, out, err, [])).to.throw();
            });
            it("THROW an error if you provide your own gang alone" ,function(){
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>getChanceToWinClash(null, fakeTerm, out, err, [Player.gang.facName])).to.throw();
            });
            it("does NOT throw an error if you provide your own gang among others" ,function(){
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>getChanceToWinClash(null, fakeTerm, out, err, [Player.gang.facName, Player.gang.facName])).to.not.throw();
            });
        });
        describe("ascendMember", function(){
            it("ascend a valid gang member" ,function(){
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>ascendMember(null, fakeTerm, out, err, ["test1"])).to.not.throw();
            });
            it("does NOT ascend an INVALID gang member" ,function(){
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>ascendMember(null, fakeTerm, out, err, ["test1"])).to.throw();
            });
            it("THROW an error if you have NO gang" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>ascendMember(null, fakeTerm, out, err, ["NiteSec"])).to.throw();
            });
            it("THROW an error if you don't provide arguments" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>ascendMember(null, fakeTerm, out, err, [])).to.throw();
            });
        });
        describe("purchaseEquipment", function(){
            it("purchase a valid Equipment for a valid gang member" ,function(){
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                Player.gainMoney(1000000000);
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>purchaseEquipment(null, fakeTerm, out, err, ["-e","Baseball Bat","-m", "test1"])).to.not.throw();
            });
            it("does NOT purchase a valid Equipment for an INVALID gang member" ,function(){
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                Player.gainMoney(1000000000);
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>purchaseEquipment(null, fakeTerm, out, err, ["-e","Baseball Bat","-m", "test2"])).to.throw();
            });
            it("does NOT purchase an INVALID Equipment for an valid gang member" ,function(){
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                Player.gainMoney(1000000000);
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>purchaseEquipment(null, fakeTerm, out, err, ["-e","Baseball tab","-m", "test1"])).to.throw();
            });
            it("THROW an error if you don't provide enough arguments" ,function(){
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                Player.gainMoney(1000000000);
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>purchaseEquipment(null, fakeTerm, out, err, [])).to.throw();
            });
            it("THROW an error if you provide too much arguments" ,function(){
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                Player.gainMoney(1000000000);
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>purchaseEquipment(null, fakeTerm, out, err, ["a", "b", "c"])).to.throw();
            });
            it("THROW an error if you dont have a gang" ,function(){
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer=()=>{return Player};
                expect(()=>purchaseEquipment(null, fakeTerm, out, err, ["a", "b"])).to.throw();
            });
        });
    });
})

