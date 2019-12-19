var chai = require("chai");
var expect = chai.expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

//////////////////////////////////////////////////////////////////////////////
// Here we import every existing function to let them initialize themselves //
//////////////////////////////////////////////////////////////////////////////
import {hasGang} from "../../src/Gangs/lib/hasGang";
import {createGang} from "../../src/Gangs/lib/createGang";
import {getBonusTime} from "../../src/Gangs/lib/getBonusTime";
import {setTerritoryWarfare} from "../../src/Gangs/lib/setTerritoryWarfare";
import {getChanceToWinClash} from "../../src/Gangs/lib/getChanceToWinClash";
import {ascendMember} from "../../src/Gangs/lib/ascendMember";
import {purchaseEquipment} from "../../src/Gangs/lib/purchaseEquipment";
import {getEquipmentCost} from "../../src/Gangs/lib/getEquipmentCost";
import {getEquipmentNames} from "../../src/Gangs/lib/getEquipmentNames";
import {setMemberTask} from "../../src/Gangs/lib/setMemberTask";
import {getTaskNames} from "../../src/Gangs/lib/getTaskNames";
import {recruitMember} from "../../src/Gangs/lib/recruitMember";
import {canRecruitMember} from "../../src/Gangs/lib/canRecruitMember";
import {getMemberInformation} from "../../src/Gangs/lib/getMemberInformation";
import {getOtherGangInformation} from "../../src/Gangs/lib/getOtherGangInformation";
import {getGangInformation} from "../../src/Gangs/lib/getGangInformation";
import {getMemberNames} from "../../src/Gangs/lib/getMemberNames";
import {getEquipmentType} from "../../src/Gangs/lib/getEquipmentType";

import * as sys from "../../src/Server/lib/sys";

import {Terminal} from "../../src/Terminal";

import {PlayerObject} from "../../src/PersonObjects/Player/PlayerObject";

import {AllGangs, Gang, GANGTYPE} from "../../src/Gang";

describe("Gang system core library tests", function () {

    let out = (msg) => {
    }; // null stream
    let err = (msg) => {
        throw msg
    }; // exception callback
    let fakeTerm = Terminal;
    fakeTerm.output = [];
    fakeTerm.clearOutput = () => {
        fakeTerm.output = [];
    };
    fakeTerm.resetTerminalInput = () => {
    };
    fakeTerm.currDir = "/";
    const gangInitType = {
        CANNOT: 1,
        POSSIBLE: 2,
        EXISTS: 3
    };
    var Player = new PlayerObject();

    function resetEnv(options = {gangInitType: gangInitType.EXISTS}) {
        Player = new PlayerObject();
        Player.bitNodeN = 2;
        Player.sourceFiles = [{n: 2, lvl: 1}];
        Player.gang = undefined;

        switch (options.gangInitType) {
            case gangInitType.EXISTS:
                Player.factions.push("Slum Snakes");
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.bitNodeN = 2;
                Player.sourceFiles = [{n: 2, lvl: 1}];
                break;
            case gangInitType.POSSIBLE:
                Player.factions.push("Slum Snakes");
                Player.bitNodeN = 2;
                Player.sourceFiles = [{n: 2, lvl: 1}];
                break;
            default:
                Player.bitNodeN = 1;
                Player.sourceFiles = [];
                break;
        }
        fakeTerm.getPlayer = () => {
            return Player
        };
        out = (msg) => {
        };
        err = (msg) => {
            throw msg
        };
        sys.revealNamespace("gang");

    }


    describe("Gang executables", function () {
        describe("HasGang says gang", function () {
            it("Exists if it does", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                let exists = false;
                out = (msg) => exists = msg;
                expect(() => hasGang(null, fakeTerm, out, err, [])).to.not.throw();
                expect(exists).to.equal(true);
            });
            it("Do not exists if it doesn't", function () {
                resetEnv(gangInitType.CANNOT);
                let exists = false;
                out = (msg) => exists = msg;
                expect(() => hasGang(null, fakeTerm, out, err, [])).to.not.throw();
                expect(exists).to.equal(false);
            });
        });
        describe("createGang", function () {
            it("lists all current factions you can currently create gangs with", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.factions = ["NiteSec", "Slum Snakes"];
                let expected = ["NiteSec\thacking", "Slum Snakes\tcombat"];
                let result = [];
                out = (msg) => result.push(msg);
                expect(() => createGang(null, fakeTerm, out, err, ["-l"])).to.not.throw();
                result.sort();
                expected.sort();
                expect(result.join("\n")).to.equal(expected.join("\n"));
            });
            it("lists the type of gang factions you are currently member with can create", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.factions = ["NiteSec", "Slum Snakes", "Sector 12"];
                let expected = ["NiteSec\thacking", "Slum Snakes\tcombat", "Sector 12 does not deal with gangs"];
                let result = [];
                out = (msg) => result.push(msg);
                expect(() => createGang(null, fakeTerm, out, err, ["-t", "NiteSec", "Slum Snakes", "Sector 12"])).to.not.throw();
                result.sort();
                expected.sort();
                expect(result.join("\n")).to.equal(expected.join("\n"));
            });
            it("does NOT lists the type of gang factions you are NOT currently member with can create", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.factions = [];
                let result = [];
                out = (msg) => result.push(msg);
                expect(() => createGang(null, fakeTerm, out, err, ["-t", "NiteSec"])).to.throw();
                expect(result.join("\n")).to.equal([].join("\n"));
            });
            it("creates a gang with a faction you are a member of which can create gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.factions = ["Slum Snakes"];
                let expected = ["Gang with Slum Snakes successfully created!"];
                let result = [];
                out = (msg) => result.push(msg);
                expect(() => createGang(null, fakeTerm, out, err, ["Slum Snakes"])).to.not.throw();
                expect(result.join("\n")).to.equal(expected.join("\n"));
                expect(Player.gang).to.be.instanceof(Gang);
            });
            it("does NOT creates a gang with a faction you are NOT a member of", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.factions = [];
                let result = [];
                out = (msg) => result.push(msg);
                expect(() => createGang(null, fakeTerm, out, err, ["Slum Snakes"])).to.throw();
                expect(result.join("\n")).to.equal([].join("\n"));
                expect(Player.gang).not.to.be.instanceof(Gang);
            });
            it("does NOT creates a gang with a faction you are a member of but CANNOT manage gangs", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.factions = ["Sector 12"];
                let result = [];
                out = (msg) => result.push(msg);
                expect(() => createGang(null, fakeTerm, out, err, ["Sector 12"])).to.throw();
                expect(result.join("\n")).to.equal([].join("\n"));
                expect(Player.gang).not.to.be.instanceof(Gang);
            });
            it("does NOT creates a gang when you ALREADY have a gang", function () {
                resetEnv(gangInitType.EXISTS);
                Player.factions = ["Slum Snakes", "NiteSec"];
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                let result = [];
                let out = (msg) => {
                    result.push(msg)
                };
                let err = (msg) => {
                    throw msg
                };
                expect(() => createGang(null, fakeTerm, out, err, ["NiteSec"])).to.throw();
                expect(result.join("\n")).to.equal([].join("\n"));
            });
        });
        describe("getBonusTime", function () {
            it("outputs the bonus time available to your gang", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                let value;
                out = (msg) => {
                    value = msg
                };
                expect(() => getBonusTime(null, fakeTerm, out, err, [])).to.not.throw();
                expect(value).not.to.equal(undefined);
            });
            it("does NOT outputs any bonus time if you have NO gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                let value;
                out = (msg) => {
                    value = msg
                };
                expect(() => getBonusTime(null, fakeTerm, out, err, [])).to.throw();
                expect(value).to.equal(undefined);
            });
        });
        describe("setTerritoryWarfare", function () {
            it("Sets the Territory Warfare of your gang to the right mode", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.territoryWarfareEngaged = false;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => setTerritoryWarfare(null, fakeTerm, out, err, ["true"])).to.not.throw();
                expect(Player.gang.territoryWarfareEngaged).to.equal(true);
                expect(() => setTerritoryWarfare(null, fakeTerm, out, err, ["false"])).to.not.throw();
                expect(Player.gang.territoryWarfareEngaged).to.equal(false);
                expect(() => setTerritoryWarfare(null, fakeTerm, out, err, [true])).to.not.throw();
                expect(Player.gang.territoryWarfareEngaged).to.equal(true);
                expect(() => setTerritoryWarfare(null, fakeTerm, out, err, [false])).to.not.throw();
                expect(Player.gang.territoryWarfareEngaged).to.equal(false);
            });
            it("THROW an error if you have NO gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => setTerritoryWarfare(null, fakeTerm, out, err, [])).to.throw();
            });
        });
        describe("getChanceToWinClash", function () {
            it("Gets the chances to win clash between your gang and another", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getChanceToWinClash(null, fakeTerm, out, err, ["NiteSec", "The Black Hand"])).to.not.throw();
            });
            it("Gets the chances to win clash between your gang and every other gang with list argument", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                let result = [];
                out = (msg) => {
                    result.push(msg)
                };
                expect(() => getChanceToWinClash(null, fakeTerm, out, err, ["-l"])).to.not.throw();
                expect(result.length).to.equal(Object.keys(AllGangs).length - 1);
            });
            it("THROW an error if you have NO gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getChanceToWinClash(null, fakeTerm, out, err, ["NiteSec"])).to.throw();
            });
            it("THROW an error if you don't provide arguments", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getChanceToWinClash(null, fakeTerm, out, err, [])).to.throw();
            });
            it("THROW an error if you provide your own gang alone", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getChanceToWinClash(null, fakeTerm, out, err, [Player.gang.facName])).to.throw();
            });
            it("does NOT throw an error if you provide your own gang among others", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getChanceToWinClash(null, fakeTerm, out, err, [Player.gang.facName, Player.gang.facName])).to.not.throw();
            });
        });
        describe("ascendMember", function () {
            it("ascend a valid gang member", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => ascendMember(null, fakeTerm, out, err, ["test1"])).to.not.throw();
            });
            it("does NOT ascend an INVALID gang member", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => ascendMember(null, fakeTerm, out, err, ["test1"])).to.throw();
            });
            it("THROW an error if you have NO gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => ascendMember(null, fakeTerm, out, err, ["NiteSec"])).to.throw();
            });
            it("THROW an error if you don't provide arguments", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => ascendMember(null, fakeTerm, out, err, [])).to.throw();
            });
        });
        describe("purchaseEquipment", function () {
            it("purchase a valid Equipment for a valid gang member", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                Player.gainMoney(1000000000);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => purchaseEquipment(null, fakeTerm, out, err, ["-e", "Baseball Bat", "-m", "test1"])).to.not.throw();
            });
            it("does NOT purchase a valid Equipment for an INVALID gang member", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                Player.gainMoney(1000000000);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => purchaseEquipment(null, fakeTerm, out, err, ["-e", "Baseball Bat", "-m", "test2"])).to.throw();
            });
            it("does NOT purchase an INVALID Equipment for an valid gang member", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                Player.gainMoney(1000000000);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => purchaseEquipment(null, fakeTerm, out, err, ["-e", "Baseball tab", "-m", "test1"])).to.throw();
            });
            it("THROW an error if you don't provide enough arguments", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                Player.gainMoney(1000000000);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => purchaseEquipment(null, fakeTerm, out, err, [])).to.throw();
            });
            it("THROW an error if you provide too much arguments", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                Player.gainMoney(1000000000);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => purchaseEquipment(null, fakeTerm, out, err, ["a", "b", "c"])).to.throw();
            });
            it("THROW an error if you dont have a gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => purchaseEquipment(null, fakeTerm, out, err, ["a", "b"])).to.throw();
            });
        });

        describe("getEquipmentCost", function () {
            it("outputs the cost of an existing equipment", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getEquipmentCost(null, fakeTerm, out, err, ["Baseball Bat"])).to.not.throw();
            });
            it("outputs the cost of multiple existing equipments", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                let result = [];
                out = (msg) => {
                    result.push(msg)
                };
                expect(() => getEquipmentCost(null, fakeTerm, out, err, ["Baseball Bat", "Baseball Bat"])).to.not.throw();
                expect(result.length).to.equal(2);
            });
            it("THROW an error if you have NO gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getEquipmentCost(null, fakeTerm, out, err, [])).to.throw();
            });
            it("THROW an error if you don't provide arguments", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getEquipmentCost(null, fakeTerm, out, err, [])).to.throw();
            });
        });
        describe("getEquipmentCost", function () {
            it("outputs the cost of an existing equipment", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getEquipmentType(null, fakeTerm, out, err, ["Baseball Bat"])).to.not.throw();
            });
            it("outputs the cost of multiple existing equipments", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                let result = [];
                out = (msg) => {
                    result.push(msg)
                };
                expect(() => getEquipmentType(null, fakeTerm, out, err, ["Baseball Bat", "Baseball Bat"])).to.not.throw();
                expect(result.length).to.equal(2);
            });
            it("THROW an error if you have NO gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getEquipmentType(null, fakeTerm, out, err, [])).to.throw();
            });
            it("THROW an error if you don't provide arguments", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getEquipmentType(null, fakeTerm, out, err, [])).to.throw();
            });
        });
        describe("getMemberInformation", function () {
            it("outputs the information of an existing gang member", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getMemberInformation(null, fakeTerm, out, err, ["test1"])).to.not.throw();
            });
            it("THROW an error if you have NO gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getMemberInformation(null, fakeTerm, out, err, [])).to.throw();
            });
            it("THROW an error if you don't provide arguments", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getMemberInformation(null, fakeTerm, out, err, [])).to.throw();
            });
            it("THROW an error if the member does not exists", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getMemberInformation(null, fakeTerm, out, err, ["test1"])).to.throw();
            });
        });
        describe("getMemberNames", function () {
            it("outputs the names of your gang members", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                fakeTerm.getPlayer = () => {
                    return Player
                };
                let value = "";
                out = (msg) => {
                    value = msg
                };
                expect(() => getMemberNames(null, fakeTerm, out, err, [])).to.not.throw();
                expect(value).to.equal("test1");
            });
            it("THROW an error if you have NO gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getMemberNames(null, fakeTerm, out, err, [])).to.throw();
            });
        });
        describe("getGangInformation", function () {
            it("outputs information about your gang", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                fakeTerm.getPlayer = () => {
                    return Player
                };
                let value;
                out = (msg) => {
                    value = msg
                };
                expect(() => getGangInformation(null, fakeTerm, out, err, [])).to.not.throw();
                expect(value).not.to.equal(undefined);
            });
            it("THROW an error if you have NO gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getGangInformation(null, fakeTerm, out, err, [])).to.throw();
            });
        });
        describe("canRecruitMember", function () {
            it("outputs whether you can recruit or not", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                fakeTerm.getPlayer = () => {
                    return Player
                };
                let value;
                out = (msg) => {
                    value = msg
                };
                expect(() => canRecruitMember(null, fakeTerm, out, err, [])).to.not.throw();
                expect(value).not.to.equal(undefined);
            });
            it("THROW an error if you have NO gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => canRecruitMember(null, fakeTerm, out, err, [])).to.throw();
            });
        });
        describe("getEquipmentNames", function () {
            it("outputs the names of available equipments", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                fakeTerm.getPlayer = () => {
                    return Player
                };
                let value;
                out = (msg) => {
                    value = msg
                };
                expect(() => getEquipmentNames(null, fakeTerm, out, err, [])).to.not.throw();
                expect(value).not.to.equal(undefined);
            });
            it("THROW an error if you have NO gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getEquipmentNames(null, fakeTerm, out, err, [])).to.throw();
            });
        });
        describe("getTaskNames", function () {
            it("outputs the names of available tasks", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                fakeTerm.getPlayer = () => {
                    return Player
                };
                let value;
                out = (msg) => {
                    value = msg;
                };
                expect(() => getTaskNames(null, fakeTerm, out, err, [])).to.not.throw();
                expect(value).not.to.equal(undefined);
            });
            it("THROW an error if you have NO gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getTaskNames(null, fakeTerm, out, err, [])).to.throw();
            });
        });
        describe("getOtherGangInformation", function () {
            it("outputs other gangs information", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                fakeTerm.getPlayer = () => {
                    return Player
                };
                let value;
                out = (msg) => {
                    value = msg
                };
                expect(() => getOtherGangInformation(null, fakeTerm, out, err, [])).to.not.throw();
                expect(value).not.to.equal(undefined);
            });
            it("THROW an error if you have NO gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => getOtherGangInformation(null, fakeTerm, out, err, [])).to.throw();
            });
        });
        describe("recruitMember", function () {
            it("recruits a valid member name", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                let value;
                out = (msg) => {
                    value = msg
                };
                expect(() => recruitMember(null, fakeTerm, out, err, ["test1"])).to.not.throw();
                expect(value).not.to.equal(undefined);
            });
            it("THROW an error if you have NO gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => recruitMember(null, fakeTerm, out, err, [])).to.throw();
            });
            it("THROW an error if you provide an INVALID member name", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => recruitMember(null, fakeTerm, out, err, [""])).to.throw();
            });
        });
        describe("setMemberTask", function () {
            it("sets a valid member to a valid task", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                fakeTerm.getPlayer = () => {
                    return Player
                };
                let value;
                out = (msg) => {
                    value = msg
                };
                let taskName = "";
                let taskOut = (msg) => taskName = msg;
                getTaskNames(null, fakeTerm, taskOut, err, []);

                expect(() => setMemberTask(null, fakeTerm, out, err, ["-m", "test1", "-t", taskName])).to.not.throw();
                expect(value).not.to.equal(undefined);
            });
            it("THROW an error if you have NO gang", function () {
                resetEnv(gangInitType.POSSIBLE);
                Player.gang = undefined;
                fakeTerm.getPlayer = () => {
                    return Player
                };
                expect(() => setMemberTask(null, fakeTerm, out, err, [])).to.throw();
            });
            it("THROW an error if you provide an INVALID member", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                fakeTerm.getPlayer = () => {
                    return Player
                };
                let taskName = "";
                let taskOut = (msg) => taskName = msg;
                getTaskNames(null, fakeTerm, taskOut, err, []);
                expect(() => setMemberTask(null, fakeTerm, out, err, ["-m", "test2", "-t", taskName])).to.throw();
            });
            it("THROW an error if you provide an INVALID task", function () {
                resetEnv(gangInitType.EXISTS);
                Player.gang = new Gang("Slum Snakes", GANGTYPE.COMBAT);
                Player.gang.recruitMember("test1");
                fakeTerm.getPlayer = () => {
                    return Player
                };
                let taskName = "";
                let taskOut = (msg) => taskName = msg;
                getTaskNames(null, fakeTerm, taskOut, err, []);
                expect(() => setMemberTask(null, fakeTerm, out, err, ["-m", "test1", "-t", "theSpanishInquisition"])).to.throw();
            });
        });
    });
});
