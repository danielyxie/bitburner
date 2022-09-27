import { CorporationConstants } from "./data/Constants";
import { getRandomInt } from "../utils/helpers/getRandomInt";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../utils/JSONReviver";
import { EmployeePositions } from "./EmployeePositions";
import { Corporation } from "./Corporation";
import { Industry } from "./Industry";

interface IParams {
  name?: string;
  morale?: number;
  happiness?: number;
  energy?: number;
  intelligence?: number;
  charisma?: number;
  experience?: number;
  creativity?: number;
  efficiency?: number;
  salary?: number;
  loc?: string;
}

export class Employee {
  name: string;
  mor: number;
  hap: number;
  ene: number;
  int: number;
  cha: number;
  exp: number;
  cre: number;
  eff: number;
  sal: number;
  cyclesUntilRaise = CorporationConstants.CyclesPerEmployeeRaise;
  loc: string;
  pos: string;
  nextPos: string;

  constructor(params: IParams = {}) {
    this.name = params.name ? params.name : "Bobby";

    //Morale, happiness, and energy are 0-100
    this.mor = params.morale ? params.morale : getRandomInt(50, 100);
    this.hap = params.happiness ? params.happiness : getRandomInt(50, 100);
    this.ene = params.energy ? params.energy : getRandomInt(50, 100);

    this.int = params.intelligence ? params.intelligence : getRandomInt(10, 50);
    this.cha = params.charisma ? params.charisma : getRandomInt(10, 50);
    this.exp = params.experience ? params.experience : getRandomInt(10, 50);
    this.cre = params.creativity ? params.creativity : getRandomInt(10, 50);
    this.eff = params.efficiency ? params.efficiency : getRandomInt(10, 50);
    this.sal = params.salary ? params.salary : getRandomInt(0.1, 5);

    this.loc = params.loc ? params.loc : "";
    this.pos = EmployeePositions.Unassigned;
    this.nextPos = this.pos;
  }

  //Returns the amount the employee needs to be paid
  process(marketCycles = 1): number {
    const gain = 0.003 * marketCycles;
    const det = gain * Math.random();
    this.exp += gain;

    //Training
    const trainingEff = gain * Math.random();
    if (this.pos === EmployeePositions.Training) {
      //To increase creativity and intelligence special upgrades are needed
      this.cha += trainingEff;
      this.exp += trainingEff;
      this.eff += trainingEff;
    }

    this.ene -= det;
    this.hap -= det;

    const salary = this.sal * marketCycles * CorporationConstants.SecsPerMarketCycle;
    return salary;
  }

  calculateProductivity(corporation: Corporation, industry: Industry): number {
    const effCre = this.cre * corporation.getEmployeeCreMultiplier() * industry.getEmployeeCreMultiplier(),
      effCha = this.cha * corporation.getEmployeeChaMultiplier() * industry.getEmployeeChaMultiplier(),
      effInt = this.int * corporation.getEmployeeIntMultiplier() * industry.getEmployeeIntMultiplier(),
      effEff = this.eff * corporation.getEmployeeEffMultiplier() * industry.getEmployeeEffMultiplier();
    const prodBase = this.mor * this.hap * this.ene * 1e-6;
    let prodMult = 0;
    switch (this.pos) {
      //Calculate productivity based on position. This is multiplied by prodBase
      //to get final value
      case EmployeePositions.Operations:
        prodMult = 0.6 * effInt + 0.1 * effCha + this.exp + 0.5 * effCre + effEff;
        break;
      case EmployeePositions.Engineer:
        prodMult = effInt + 0.1 * effCha + 1.5 * this.exp + effEff;
        break;
      case EmployeePositions.Business:
        prodMult = 0.4 * effInt + effCha + 0.5 * this.exp;
        break;
      case EmployeePositions.Management:
        prodMult = 2 * effCha + this.exp + 0.2 * effCre + 0.7 * effEff;
        break;
      case EmployeePositions.RandD:
        prodMult = 1.5 * effInt + 0.8 * this.exp + effCre + 0.5 * effEff;
        break;
      case EmployeePositions.Unassigned:
      case EmployeePositions.Training:
        prodMult = 0;
        break;
      default:
        console.error(`Invalid employee position: ${this.pos}`);
        break;
    }
    return prodBase * prodMult;
  }

  toJSON(): IReviverValue {
    return Generic_toJSON("Employee", this);
  }

  static fromJSON(value: IReviverValue): Employee {
    return Generic_fromJSON(Employee, value.data);
  }
}

Reviver.constructors.Employee = Employee;
