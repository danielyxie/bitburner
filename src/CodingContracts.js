import {Player} from "./Player.js";

function ContractType(generate, validquestion, solver, reward) {
	this.generate = generate;
	this.solver = solver;
	this.validquestion = validquestion;
	this.reward = reward;
}

function rewardMoney(money) {
	return function(){Player.gainMoney(money)};
}

const ContractTypes = {
	PlusOneChallenge: ContractType(
		generate=function(){return 1},
		validquestion=function(data){return data === 1},
		solver=function(input, answer){return 2},
		reward=rewardMoney(1000)),
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

export {CodingContract, ContractTypes};