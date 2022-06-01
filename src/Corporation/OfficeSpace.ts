import { EmployeePositions } from "./EmployeePositions";
import { CorporationConstants } from "./data/Constants";
import { getRandomInt } from "../utils/helpers/getRandomInt";
import { generateRandomString } from "../utils/StringHelperFunctions";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../utils/JSONReviver";
import { Employee } from "./Employee";
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

  autoCoffee = false;
  autoParty  = false;
  coffeeMult = 0;
  partyMult  = 0;

  employees: Employee[] = [];
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
    return this.employees.length >= this.size;
  }

  process(marketCycles = 1, corporation: ICorporation, industry: IIndustry): number {
    // HRBuddy AutoRecruitment and training
    if (industry.hasResearch("HRBuddy-Recruitment") && !this.atCapacity()) {
      const emp = this.hireRandomEmployee();
      if (industry.hasResearch("HRBuddy-Training") && emp !== undefined) {
        emp.pos = EmployeePositions.Training;
      }
    }

    // Update employee jobs and job counts
    for (const employee of this.employees) { employee.pos = employee.nextPos; }
    this.calculateTotalEmployees();
    this.calculateNextEmployees();

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

    // Calculate changes in Morale/Happiness/Energy for Employees
    let perfMult = 1; //Multiplier for employee morale/happiness/energy based on company performance
    if (corporation.funds < 0 && industry.lastCycleRevenue < 0) {
      perfMult = Math.pow(0.99, marketCycles);
    } else if (corporation.funds > 0 && industry.lastCycleRevenue > 0) {
      perfMult = Math.pow(1.01, marketCycles);
    }

    let totalSalary = 0;
    for (const employee of this.employees) {
      const salary = employee.process(marketCycles, this);
      totalSalary += salary;

      if (this.autoCoffee) {
        employee.ene = this.maxEne;
      } else if (this.coffeeMult > 1) {
        employee.ene *= this.coffeeMult;
      } else {
        employee.ene *= perfMult;
      }

      if (this.autoParty) {
        employee.mor = this.maxMor;
        employee.hap = this.maxHap;
      } else if (this.partyMult > 1) {
        employee.mor *= this.partyMult;
        employee.hap *= this.partyMult;
      } else {
        employee.mor *= perfMult;
        employee.hap *= perfMult;
      }

      employee.ene = Math.max(Math.min(employee.ene, this.maxEne), this.minEne);
      employee.mor = Math.max(Math.min(employee.mor, this.maxMor), this.minMor);
      employee.hap = Math.max(Math.min(employee.hap, this.maxHap), this.minHap);
    }

    this.coffeeMult = 0;
    this.partyMult  = 0;

    this.calculateEmployeeProductivity(corporation, industry);
    return totalSalary;
  }

  calculateNextEmployees(): void {
    //Reset
    for (const name of Object.keys(this.employeeNextJobs)) {
      this.employeeNextJobs[name] = 0;
    }

    for (let i = 0; i < this.employees.length; ++i) {
      const employee = this.employees[i];
      this.employeeNextJobs[employee.nextPos]++;
    }
  }

  calculateTotalEmployees(): void {
    //Reset
    for (const name of Object.keys(this.employeeJobs)) {
      this.employeeJobs[name] = 0;
    }

    for (let i = 0; i < this.employees.length; ++i) {
      const employee = this.employees[i];
      this.employeeJobs[employee.pos]++;
    }
  }

  calculateEmployeeProductivity(corporation: ICorporation, industry: IIndustry): void {
    //Reset
    for (const name of Object.keys(this.employeeProd)) {
      this.employeeProd[name] = 0;
    }

    let total = 0;
    for (let i = 0; i < this.employees.length; ++i) {
      const employee = this.employees[i];
      const prod = employee.calculateProductivity(corporation, industry);
      this.employeeProd[employee.pos] += prod;
      total += prod;
    }
    this.employeeProd.total = total;
  }

  hireRandomEmployee(): Employee | undefined {
    if (this.atCapacity()) return;
    if (document.getElementById("cmpy-mgmt-hire-employee-popup") != null) return;

    //Generate three random employees (meh, decent, amazing)
    const int = getRandomInt(50, 100),
      cha = getRandomInt(50, 100),
      exp = getRandomInt(50, 100),
      cre = getRandomInt(50, 100),
      eff = getRandomInt(50, 100),
      sal = CorporationConstants.EmployeeSalaryMultiplier * (int + cha + exp + cre + eff);

    const emp = new Employee({
      intelligence: int,
      charisma: cha,
      experience: exp,
      creativity: cre,
      efficiency: eff,
      salary: sal,
    });

    const name = generateRandomString(7);

    for (let i = 0; i < this.employees.length; ++i) {
      if (this.employees[i].name === name) {
        return this.hireRandomEmployee();
      }
    }
    emp.name = name;
    this.employees.push(emp);

    this.calculateTotalEmployees();
    this.calculateNextEmployees();
    return emp;
  }

  assignSingleJob(employee: Employee, job: string): void {
    employee.nextPos = job;
    this.calculateNextEmployees();
  }

  autoAssignJob(job: string, target: number): boolean {
    let count = this.employeeNextJobs[job];

    for (const employee of this.employees) {
      if (count === target) {
        break;
      } else if (employee.nextPos === EmployeePositions.Unassigned && count <= target) {
        employee.nextPos = job;
        count++;
      } else if (employee.nextPos === job && count >= target) {
        employee.nextPos = EmployeePositions.Unassigned;
        count--;
      }
    }

    this.calculateNextEmployees();
    return count === target;
  }

  setCoffee(mult = 1.05): boolean {
    if (mult > 1 && this.coffeeMult === 0 && !this.autoCoffee) {
      this.coffeeMult = mult;
      return true;
    }

    return false;
  }

  setParty(mult: number): boolean {
    if (mult > 1 && this.partyMult === 0 && !this.autoParty) {
      this.partyMult = mult;
      return true;
    }

    return false;
  }

  toJSON(): any {
    return Generic_toJSON("OfficeSpace", this);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): OfficeSpace {
    return Generic_fromJSON(OfficeSpace, value.data);
  }
}

Reviver.constructors.OfficeSpace = OfficeSpace;
