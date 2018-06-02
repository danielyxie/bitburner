import {Player} from "./Player.js";
import {Reviver, Generic_toJSON,
        Generic_fromJSON}                           from "../utils/JSONReviver.js";

function ContractType(name, generate, validquestion, solver, reward) {
	this.name = name;
	this.generate = generate;
	this.solver = solver;
	this.validquestion = validquestion;
	this.reward = reward;
}

function rewardMoney(money) {
	return function(){Player.gainMoney(money)};
}

const ContractTypes = {
	PlusOne: new ContractType("PlusOne", function(){return 1},
		function(data){return data === 1},
		function(input, answer){return 2},
		rewardMoney(1000000000000)),
};


function CodingContract(name, type, puzzle=undefined) {
	if(ContractTypes[type] === undefined) {
		throw new Error("Error: invalid contract type: "+type+" please contact developper");
	}
	this.fn = name+'.cct';
	this.type = type;
	this.data = puzzle === undefined ? ContractTypes[type].generate() : puzzle;
}

CodingContract.prototype.isSolution = function(solution) {
	return ContractTypes[this.type].solver(this.data, solution);
};

CodingContract.prototype.giveReward = function() {
	ContractTypes[this.type].reward();
}

CodingContract.prototype.toJSON = function() {
    return Generic_toJSON("CodingContract", this);
}

CodingContract.fromJSON = function(value) {
    return Generic_fromJSON(CodingContract, value.data);
}

Reviver.constructors.CodingContract = CodingContract;

export {CodingContract, ContractTypes};