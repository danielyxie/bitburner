import { EmployeePositions } from "./EmployeePositions";
import { CorporationConstants } from "./data/Constants";
import { getRandomInt } from "../../utils/helpers/getRandomInt";
import { formatNumber, generateRandomString } from "../../utils/StringHelperFunctions";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";
import { yesNoBoxCreate,
         yesNoTxtInpBoxCreate,
         yesNoBoxGetYesButton,
         yesNoBoxGetNoButton,
         yesNoTxtInpBoxGetYesButton,
         yesNoTxtInpBoxGetNoButton,
         yesNoTxtInpBoxGetInput,
         yesNoBoxClose,
         yesNoTxtInpBoxClose } from "../../utils/YesNoBox";
import { dialogBoxCreate } from "../../utils/DialogBox";
import { createPopup } from "../../utils/uiHelpers/createPopup";
import { removeElementById } from "../../utils/uiHelpers/removeElementById";
import { createElement } from "../../utils/uiHelpers/createElement";
import { numeralWrapper } from "../ui/numeralFormat";
import { Employee } from "./Employee";

interface IParams {
    loc?: string;
    cost?: number;
    size?: number;
    comfort?: number;
    beauty?: number;
}

export class OfficeSpace {
    loc: string;
    cost: number;
    size: number;
    comf: number;
    beau: number;
    tier = "Basic";
    minEne = 0;
    maxEne = 100;
    minHap = 0;
    maxHap = 100;
    maxMor = 100;
    employees: any[] = [];
    employeeProd: {[key: string]: number} = {
        [EmployeePositions.Operations]:   0,
        [EmployeePositions.Engineer]:     0,
        [EmployeePositions.Business]:     0,
        [EmployeePositions.Management]:   0,
        [EmployeePositions.RandD]:        0,
        total:                            0,
    };

    constructor(params: IParams = {}) {
        this.loc    = params.loc        ? params.loc        : "";
        this.cost   = params.cost       ? params.cost       : 1;
        this.size   = params.size       ? params.size       : 1;
        this.comf   = params.comfort    ? params.comfort    : 1;
        this.beau   = params.beauty      ? params.beauty     : 1;
    }


    atCapacity(): boolean {
        return (this.employees.length) >= this.size;
    }

    process(marketCycles = 1, parentRefs: any): number {
        const industry = parentRefs.industry;

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
        let perfMult=1; //Multiplier for employee morale/happiness/energy based on company performance
        if (industry.funds < 0 && industry.lastCycleRevenue < 0) {
            perfMult = Math.pow(0.99, marketCycles);
        } else if (industry.funds > 0 && industry.lastCycleRevenue > 0) {
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

        this.calculateEmployeeProductivity(parentRefs);
        return salaryPaid;
    }

    calculateEmployeeProductivity(parentRefs: any) {
        const company = parentRefs.corporation, industry = parentRefs.industry;

        //Reset
        for (const name in this.employeeProd) {
            this.employeeProd[name] = 0;
        }

        let total = 0;
        for (let i = 0; i < this.employees.length; ++i) {
            const employee = this.employees[i];
            const prod = employee.calculateProductivity(company, industry);
            this.employeeProd[employee.pos] += prod;
            total += prod;
        }
        this.employeeProd.total = total;
    }

    //Takes care of UI as well
    findEmployees(parentRefs: any) {
        if (this.atCapacity()) { return; }
        if (document.getElementById("cmpy-mgmt-hire-employee-popup") != null) {return;}

        //Generate three random employees (meh, decent, amazing)
        const mult1 = getRandomInt(25, 50)/100,
            mult2 = getRandomInt(51, 75)/100,
            mult3 = getRandomInt(76, 100)/100;
        const int = getRandomInt(50, 100),
            cha = getRandomInt(50, 100),
            exp = getRandomInt(50, 100),
            cre = getRandomInt(50, 100),
            eff = getRandomInt(50, 100),
            sal = CorporationConstants.EmployeeSalaryMultiplier * (int + cha + exp + cre + eff);

        const emp1 = new Employee({
            intelligence: int * mult1,
            charisma: cha * mult1,
            experience: exp * mult1,
            creativity: cre * mult1,
            efficiency: eff * mult1,
            salary: sal * mult1,
        });

        const emp2 = new Employee({
            intelligence: int * mult2,
            charisma: cha * mult2,
            experience: exp * mult2,
            creativity: cre * mult2,
            efficiency: eff * mult2,
            salary: sal * mult2,
        });

        const emp3 = new Employee({
            intelligence: int * mult3,
            charisma: cha * mult3,
            experience: exp * mult3,
            creativity: cre * mult3,
            efficiency: eff * mult3,
            salary: sal * mult3,
        });

        const text = createElement("h1", {
            innerHTML: "Select one of the following candidates for hire:",
        });

        const createEmpDiv = function(employee: any, office: any) {
            const div = createElement("div", {
                class:"cmpy-mgmt-find-employee-option",
                innerHTML:  "Intelligence: " + formatNumber(employee.int, 1) + "<br>" +
                            "Charisma: " + formatNumber(employee.cha, 1) + "<br>" +
                            "Experience: " + formatNumber(employee.exp, 1) + "<br>" +
                            "Creativity: " + formatNumber(employee.cre, 1) + "<br>" +
                            "Efficiency: " + formatNumber(employee.eff, 1) + "<br>" +
                            "Salary: " + numeralWrapper.format(employee.sal, '$0.000a') + " \ s<br>",
                clickListener: () => {
                    office.hireEmployee(employee, parentRefs);
                    removeElementById("cmpy-mgmt-hire-employee-popup");
                    return false;
                },
            });
            return div;
        };

        const cancelBtn = createElement("a", {
            class:"a-link-button",
            innerText:"Cancel",
            float:"right",
            clickListener:() => {
                removeElementById("cmpy-mgmt-hire-employee-popup");
                return false;
            },
        });

        const elems = [text,
                     createEmpDiv(emp1, this),
                     createEmpDiv(emp2, this),
                     createEmpDiv(emp3, this),
                     cancelBtn];

        createPopup("cmpy-mgmt-hire-employee-popup", elems);
    }

    hireEmployee(employee: Employee, parentRefs: any) {
        const company = parentRefs.corporation;
        const yesBtn = yesNoTxtInpBoxGetYesButton(),
            noBtn = yesNoTxtInpBoxGetNoButton();
        yesBtn.innerHTML = "Hire";
        noBtn.innerHTML = "Cancel";
        yesBtn.addEventListener("click", () => {
            const name = yesNoTxtInpBoxGetInput();
            for (let i = 0; i < this.employees.length; ++i) {
                if (this.employees[i].name === name) {
                    dialogBoxCreate("You already have an employee with this nickname! Please give every employee a unique nickname.");
                    return false;
                }
            }
            employee.name = name;
            this.employees.push(employee);
            company.rerender();
            return yesNoTxtInpBoxClose();
        });
        noBtn.addEventListener("click", () => {
            return yesNoTxtInpBoxClose();
        });
        yesNoTxtInpBoxCreate("Give your employee a nickname!");
    }

    hireRandomEmployee(): Employee | undefined {
        if (this.atCapacity()) return;
        if (document.getElementById("cmpy-mgmt-hire-employee-popup") != null) return;

        //Generate three random employees (meh, decent, amazing)
        const mult = getRandomInt(76, 100)/100;
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
    assignEmployeeToJob(job: any): boolean {
        for (let i = 0; i < this.employees.length; ++i) {
            if (this.employees[i].pos === EmployeePositions.Unassigned) {
                this.employees[i].pos = job;
                return true;
            }
        }
        return false;
    }

    //Finds the first employee with the given job and unassigns it
    unassignEmployeeFromJob(job: any): boolean {
        for (let i = 0; i < this.employees.length; ++i) {
            if (this.employees[i].pos === job) {
                this.employees[i].pos = EmployeePositions.Unassigned;
                return true;
            }
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