import { EmployeePositions } from "./EmployeePositions";
import { CorporationConstants } from "./data/Constants";
import { getRandomInt } from "../utils/helpers/getRandomInt";
import { generateRandomString } from "../utils/StringHelperFunctions";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../utils/JSONReviver";
import { IIndustry } from "./IIndustry";
import { ICorporation } from "./ICorporation";

interface IParams {
  loc?: string;
  size?: number;
}

export class OfficeSpace {
  loc: string;
  size: number;

  minEne = 0;
  minHap = 0;
  minMor = 0;

  maxEne = 100;
  maxHap = 100;
  maxMor = 100;

  avgEne = 75;
  avgHap = 75;
  avgMor = 75;

  avgInt = 75;
  avgCha = 75;
  totalExp = 0;
  avgCre = 75;
  avgEff = 75;

  totalEmployees = 0;
  totalSalary = 0;

  autoCoffee = false;
  autoParty = false;
  coffeeMult = 0;
  partyMult = 0;
  coffeeEmployees = 0;
  partyEmployees = 0;

  employeeProd: { [key: string]: number } = {
    [EmployeePositions.Operations]: 0,
    [EmployeePositions.Engineer]: 0,
    [EmployeePositions.Business]: 0,
    [EmployeePositions.Management]: 0,
    [EmployeePositions.RandD]: 0,
    total: 0,
  };
  employeeJobs: { [key: string]: number } = {
    [EmployeePositions.Operations]: 0,
    [EmployeePositions.Engineer]: 0,
    [EmployeePositions.Business]: 0,
    [EmployeePositions.Management]: 0,
    [EmployeePositions.RandD]: 0,
    [EmployeePositions.Training]: 0,
    [EmployeePositions.Unassigned]: 0,
  };
  employeeNextJobs: { [key: string]: number } = {
    [EmployeePositions.Operations]: 0,
    [EmployeePositions.Engineer]: 0,
    [EmployeePositions.Business]: 0,
    [EmployeePositions.Management]: 0,
    [EmployeePositions.RandD]: 0,
    [EmployeePositions.Training]: 0,
    [EmployeePositions.Unassigned]: 0,
  };

  constructor(params: IParams = {}) {
    this.loc = params.loc ? params.loc : "";
    this.size = params.size ? params.size : 1;
  }

  atCapacity(): boolean {
    return this.totalEmployees >= this.size;
  }

  process(marketCycles = 1, corporation: ICorporation, industry: IIndustry): number {
    // HRBuddy AutoRecruitment and training
    if (industry.hasResearch("HRBuddy-Recruitment") && !this.atCapacity()) {
      this.hireRandomEmployee(industry.hasResearch("HRBuddy-Training"));
    }

    // Update employee jobs and job counts
    for (const name of Object.keys(this.employeeNextJobs)) {
      this.employeeJobs[name] = this.employeeNextJobs[name];
    }

    // Process Office properties
    this.maxEne = 100;
    this.maxHap = 100;
    this.maxMor = 100;

    if (industry.hasResearch("Go-Juice")) {
      this.maxEne += 10;
    }
    if (industry.hasResearch("JoyWire")) {
      this.maxHap += 10;
    }
    if (industry.hasResearch("Sti.mu")) {
      this.maxMor += 10;
    }
    if (industry.hasResearch("AutoBrew")) {
      this.autoCoffee = true;
    }
    if (industry.hasResearch("AutoPartyManager")) {
      this.autoParty = true;
    }

    if (this.totalEmployees > 0) {
      // Calculate changes in Morale/Happiness/Energy for Employees
      let perfMult = 1; //Multiplier for employee morale/happiness/energy based on company performance
      let reduction = 0.0015 * marketCycles; // Passive reduction every cycle
      if (corporation.funds < 0 && industry.lastCycleRevenue < 0) {
        perfMult = Math.pow(0.99, marketCycles);
      } else if (corporation.funds > 0 && industry.lastCycleRevenue > 0) {
        perfMult = Math.pow(1.01, marketCycles);
      }

      if (this.autoCoffee) {
        this.avgEne = this.maxEne;
      } else if (this.coffeeMult > 1) {
        this.avgEne -= reduction;
        this.avgEne *= this.coffeeMult * this.coffeeEmployees / this.totalEmployees;
      } else {
        this.avgEne -= reduction;
        this.avgEne *= perfMult;
      }

      if (this.autoParty) {
        this.avgMor = this.maxMor;
        this.avgHap = this.maxHap;
      } else if (this.partyMult > 1) {
        this.avgHap -= reduction;
        this.avgMor *= this.partyMult * this.partyEmployees / this.totalEmployees;
        this.avgHap *= this.partyMult * this.partyEmployees / this.totalEmployees;
      } else {
        this.avgHap -= reduction;
        this.avgMor *= perfMult;
        this.avgHap *= perfMult;
      }
      
      this.avgEne = Math.max(Math.min(this.avgEne, this.maxEne), this.minEne);
      this.avgMor = Math.max(Math.min(this.avgMor, this.maxMor), this.minMor);
      this.avgHap = Math.max(Math.min(this.avgHap, this.maxHap), this.minHap);

      this.coffeeMult = 0;
      this.partyMult = 0;
      this.coffeeEmployees = 0;
      this.partyEmployees = 0;
    }

    // Get experience increase; unassigned employees do not contribute, employees in training contribute 5x
    this.totalExp += 0.0015 * marketCycles * (this.totalEmployees - this.employeeJobs[EmployeePositions.Unassigned] + this.employeeJobs[EmployeePositions.Training] * 4);

    this.calculateEmployeeProductivity(corporation, industry);
    if (this.totalEmployees === 0) {
      this.totalSalary = 0;
    }
    else {
      this.totalSalary = CorporationConstants.EmployeeSalaryMultiplier * marketCycles * this.totalEmployees * (this.avgInt + this.avgCha + this.totalExp / this.totalEmployees + this.avgCre + this.avgEff)
    }
    return this.totalSalary;
  }

  calculateEmployeeProductivity(corporation: ICorporation, industry: IIndustry): void {
    const effCre = this.avgCre * corporation.getEmployeeCreMultiplier() * industry.getEmployeeCreMultiplier(),
      effCha = this.avgCha * corporation.getEmployeeChaMultiplier() * industry.getEmployeeChaMultiplier(),
      effInt = this.avgInt * corporation.getEmployeeIntMultiplier() * industry.getEmployeeIntMultiplier(),
      effEff = this.avgEff * corporation.getEmployeeEffMultiplier() * industry.getEmployeeEffMultiplier();
    const prodBase = this.avgMor * this.avgHap * this.avgEne * 1e-6;

    let total = 0;
    let exp = this.totalExp / this.totalEmployees || 0;
    for (const name of Object.keys(this.employeeProd)) {
      let prodMult = 0;
      switch(name) {
        case EmployeePositions.Operations:
          prodMult = 0.6 * effInt + 0.1 * effCha + exp + 0.5 * effCre + effEff;
          break;
        case EmployeePositions.Engineer:
          prodMult = effInt + 0.1 * effCha + 1.5 * exp + effEff;
          break;
        case EmployeePositions.Business:
          prodMult = 0.4 * effInt + effCha + 0.5 * exp;
          break;
        case EmployeePositions.Management:
          prodMult = 2 * effCha + exp + 0.2 * effCre + 0.7 * effEff;
          break;
        case EmployeePositions.RandD:
          prodMult = 1.5 * effInt + 0.8 * exp + effCre + 0.5 * effEff;
          break;
        case EmployeePositions.Unassigned:
        case EmployeePositions.Training:
        case "total":
          continue;
        default:
          console.error(`Invalid employee position: ${name}`);
          break;
      }
      this.employeeProd[name] = this.employeeJobs[name] * prodMult;
      total += this.employeeProd[name];
    }

    this.employeeProd.total = total;
  }

  hireRandomEmployee(setToTraining = false): boolean {
    if (this.atCapacity()) return false;
    if (document.getElementById("cmpy-mgmt-hire-employee-popup") != null) return false;

    ++this.totalEmployees;
    if (setToTraining) {
      ++this.employeeJobs[EmployeePositions.Training];
      ++this.employeeNextJobs[EmployeePositions.Training];
    }
    else {
      ++this.employeeJobs[EmployeePositions.Unassigned];
      ++this.employeeNextJobs[EmployeePositions.Unassigned];
    }
    this.totalExp += 75;
    this.avgMor = (this.avgMor * this.totalEmployees + 75) / (this.totalEmployees + 1);
    this.avgHap = (this.avgHap * this.totalEmployees + 75) / (this.totalEmployees + 1);
    this.avgEne = (this.avgEne * this.totalEmployees + 75) / (this.totalEmployees + 1);
    return true;
  }

  autoAssignJob(job: string, target: number): boolean {
    let diff = target - this.employeeNextJobs[job];

    if (diff === 0) {
      return true;
    }
    else if (diff <= this.employeeNextJobs[EmployeePositions.Unassigned]) {
      // This covers both a negative diff (reducing the amount of employees in position) and a positive (increasing and using up unassigned employees)
      this.employeeNextJobs[EmployeePositions.Unassigned] -= diff;
      this.employeeNextJobs[job] = target;
      return true;
    }
    return false;
  }

  getCoffeeCost(): number {
    return 500e3 * this.totalEmployees;
  }

  setCoffee(mult = 1.05): boolean {
    if (mult > 1 && this.coffeeMult === 0 && !this.autoCoffee && this.totalEmployees > 0) {
      this.coffeeMult = mult;
      this.coffeeEmployees = this.totalEmployees;
      return true;
    }

    return false;
  }

  setParty(mult: number): boolean {
    if (mult > 1 && this.partyMult === 0 && !this.autoParty && this.totalEmployees > 0) {
      this.partyMult = mult;
      this.partyEmployees = this.totalEmployees;
      return true;
    }

    return false;
  }

  toJSON(): IReviverValue {
    return Generic_toJSON("OfficeSpace", this);
  }

  static fromJSON(value: IReviverValue): OfficeSpace {
    // Convert employees from the old version
    if (value.data.hasOwnProperty("employees")) {
      let ret = Generic_fromJSON(OfficeSpace, value.data);
      ret.totalEmployees = value.data.employees.length;
      ret.avgHap = value.data.employees.reduce((a: number, b: { data: { hap: number; }; }) => a + b.data.hap, 0) / ret.totalEmployees || 75;
      ret.avgMor = value.data.employees.reduce((a: number, b: { data: { mor: number; }; }) => a + b.data.mor, 0) / ret.totalEmployees || 75;
      ret.avgEne = value.data.employees.reduce((a: number, b: { data: { ene: number; }; }) => a + b.data.ene, 0) / ret.totalEmployees || 75;
      ret.totalExp = value.data.employees.reduce((a: number, b: { data: { exp: number; }; }) => a + b.data.exp, 0);
      return ret;
    }
    return Generic_fromJSON(OfficeSpace, value.data);
  }
}

Reviver.constructors.OfficeSpace = OfficeSpace;
