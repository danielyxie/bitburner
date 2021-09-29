import { CorporationConstants } from "./data/Constants";
import { getRandomInt } from "../utils/helpers/getRandomInt";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../utils/JSONReviver";
import { createElement } from "../ui/uiHelpers/createElement";
import { EmployeePositions } from "./EmployeePositions";
import { ICorporation } from "./ICorporation";
import { numeralWrapper } from "../ui/numeralFormat";
import { formatNumber } from "../utils/StringHelperFunctions";
import { OfficeSpace } from "./OfficeSpace";
import { IIndustry } from "./IIndustry";

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
  pro = 0;
  cyclesUntilRaise = CorporationConstants.CyclesPerEmployeeRaise;
  loc: string;
  pos: string;

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
  }

  //Returns the amount the employee needs to be paid
  process(marketCycles = 1, office: OfficeSpace): number {
    const gain = 0.003 * marketCycles,
      det = gain * Math.random();
    this.exp += gain;

    // Employee salaries slowly go up over time
    this.cyclesUntilRaise -= marketCycles;
    if (this.cyclesUntilRaise <= 0) {
      this.sal += CorporationConstants.EmployeeRaiseAmount;
      this.cyclesUntilRaise += CorporationConstants.CyclesPerEmployeeRaise;
    }

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

    if (this.ene < office.minEne) {
      this.ene = office.minEne;
    }
    if (this.hap < office.minHap) {
      this.hap = office.minHap;
    }
    const salary = this.sal * marketCycles * CorporationConstants.SecsPerMarketCycle;
    return salary;
  }

  calculateProductivity(corporation: ICorporation, industry: IIndustry): number {
    const effCre = this.cre * corporation.getEmployeeCreMultiplier() * industry.getEmployeeCreMultiplier(),
      effCha = this.cha * corporation.getEmployeeChaMultiplier() * industry.getEmployeeChaMultiplier(),
      effInt = this.int * corporation.getEmployeeIntMultiplier() * industry.getEmployeeIntMultiplier(),
      effEff = this.eff * corporation.getEmployeeEffMultiplier() * industry.getEmployeeEffMultiplier();
    const prodBase = this.mor * this.hap * this.ene * 1e-6;
    let prodMult = 0;
    switch (this.pos) {
      //Calculate productivity based on position. This is multipled by prodBase
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

  //Process benefits from having an office party thrown
  throwParty(money: number): number {
    const mult = 1 + money / 10e6;
    this.mor *= mult;
    this.mor = Math.min(100, this.mor);
    this.hap *= mult;
    this.hap = Math.min(100, this.hap);
    return mult;
  }

  copy(): Employee {
    const employee = new Employee();
    employee.name = this.name;
    employee.mor = this.mor;
    employee.hap = this.hap;
    employee.ene = this.ene;
    employee.int = this.int;
    employee.cha = this.cha;
    employee.exp = this.exp;
    employee.cre = this.cre;
    employee.eff = this.eff;
    employee.sal = this.sal;
    employee.pro = this.pro;
    employee.cyclesUntilRaise = this.cyclesUntilRaise;
    employee.loc = this.loc;
    employee.pos = this.pos;
    return employee;
  }

  toJSON(): any {
    return Generic_toJSON("Employee", this);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): Employee {
    return Generic_fromJSON(Employee, value.data);
  }
}

Reviver.constructors.Employee = Employee;
