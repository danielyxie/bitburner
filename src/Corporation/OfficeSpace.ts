import { EmployeePositions } from "./EmployeePositions";
import { CorporationConstants } from "./data/Constants";
import { getRandomInt } from "../../utils/helpers/getRandomInt";
import { generateRandomString } from "../../utils/StringHelperFunctions";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";
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
  maxEne = 100;
  minHap = 0;
  maxHap = 100;
  maxMor = 100;
  employees: Employee[] = [];
  employeeProd: { [key: string]: number } = {
    [EmployeePositions.Operations]: 0,
    [EmployeePositions.Engineer]: 0,
    [EmployeePositions.Business]: 0,
    [EmployeePositions.Management]: 0,
    [EmployeePositions.RandD]: 0,
    total: 0,
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

    // Calculate changes in Morale/Happiness/Energy for Employees
    let perfMult = 1; //Multiplier for employee morale/happiness/energy based on company performance
    if (corporation.funds < 0 && industry.lastCycleRevenue < 0) {
      perfMult = Math.pow(0.99, marketCycles);
    } else if (corporation.funds > 0 && industry.lastCycleRevenue > 0) {
      perfMult = Math.pow(1.01, marketCycles);
    }

    const hasAutobrew = industry.hasResearch("AutoBrew");
    const hasAutoparty = industry.hasResearch("AutoPartyManager");

    let salaryPaid = 0;
    for (let i = 0; i < this.employees.length; ++i) {
      const emp = this.employees[i];
      if (hasAutoparty) {
        emp.mor = this.maxMor;
        emp.hap = this.maxHap;
      } else {
        emp.mor *= perfMult;
        emp.hap *= perfMult;
        emp.mor = Math.min(emp.mor, this.maxMor);
        emp.hap = Math.min(emp.hap, this.maxHap);
      }

      if (hasAutobrew) {
        emp.ene = this.maxEne;
      } else {
        emp.ene *= perfMult;
        emp.ene = Math.min(emp.ene, this.maxEne);
      }

      const salary = emp.process(marketCycles, this);
      salaryPaid += salary;
    }

    this.calculateEmployeeProductivity(corporation, industry);
    return salaryPaid;
  }

  calculateEmployeeProductivity(corporation: ICorporation, industry: IIndustry): void {
    //Reset
    for (const name in this.employeeProd) {
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
    const mult = getRandomInt(76, 100) / 100;
    const int = getRandomInt(50, 100),
      cha = getRandomInt(50, 100),
      exp = getRandomInt(50, 100),
      cre = getRandomInt(50, 100),
      eff = getRandomInt(50, 100),
      sal = CorporationConstants.EmployeeSalaryMultiplier * (int + cha + exp + cre + eff);

    const emp = new Employee({
      intelligence: int * mult,
      charisma: cha * mult,
      experience: exp * mult,
      creativity: cre * mult,
      efficiency: eff * mult,
      salary: sal * mult,
    });

    const name = generateRandomString(7);

    for (let i = 0; i < this.employees.length; ++i) {
      if (this.employees[i].name === name) {
        return this.hireRandomEmployee();
      }
    }
    emp.name = name;
    this.employees.push(emp);

    return emp;
  }

  //Finds the first unassigned employee and assigns its to the specified job
  assignEmployeeToJob(job: string): boolean {
    for (let i = 0; i < this.employees.length; ++i) {
      if (this.employees[i].pos === EmployeePositions.Unassigned) {
        this.employees[i].pos = job;
        return true;
      }
    }
    return false;
  }

  //Finds the first employee with the given job and unassigns it
  unassignEmployeeFromJob(job: string): boolean {
    for (let i = 0; i < this.employees.length; ++i) {
      if (this.employees[i].pos === job) {
        this.employees[i].pos = EmployeePositions.Unassigned;
        return true;
      }
    }
    return false;
  }

  copy(): OfficeSpace {
    const office = new OfficeSpace();
    office.loc = this.loc;
    office.size = this.size;
    office.minEne = this.minEne;
    office.maxEne = this.maxEne;
    office.minHap = this.minHap;
    office.maxHap = this.maxHap;
    office.maxMor = this.maxMor;
    office.employeeProd = {
      [EmployeePositions.Operations]: this.employeeProd[EmployeePositions.Operations],
      [EmployeePositions.Engineer]: this.employeeProd[EmployeePositions.Engineer],
      [EmployeePositions.Business]: this.employeeProd[EmployeePositions.Business],
      [EmployeePositions.Management]: this.employeeProd[EmployeePositions.Management],
      [EmployeePositions.RandD]: this.employeeProd[EmployeePositions.RandD],
      total: this.employeeProd["total"],
    };
    office.employees = [];
    for (const employee of this.employees) {
      office.employees.push(employee.copy());
    }
    return office;
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
