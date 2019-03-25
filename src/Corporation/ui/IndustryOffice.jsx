// React Component for displaying an Industry's OfficeSpace information
// (bottom-left panel in the Industry UI)
import React from "react";
import { BaseReactComponent }       from "./BaseReactComponent";

import { OfficeSpace }              from "../Corporation";
import { EmployeePositions }        from "../EmployeePositions";

import { numeralWrapper }           from "../../ui/numeralFormat";

import { getSelectText }            from "../../../utils/uiHelpers/getSelectData";

export class IndustryOffice extends BaseReactComponent {
    constructor(props) {
        super(props);

        this.state = {
            city: "",
            division: "",
            employeeManualAssignMode: false,
            employee: null, // Reference to employee being referenced if in Manual Mode
            numEmployees: 0,
            numOperations: 0,
            numEngineers: 0,
            numBusiness: 0,
            numManagement: 0,
            numResearch: 0,
            numUnassigned: 0,
            numTraining: 0,
        }

        this.updateEmployeeCount(); // This function validates division and office refs
    }

    resetEmployeeCount() {
        this.state.numEmployees = 0;
        this.state.numOperations = 0;
        this.state.numEngineers = 0;
        this.state.numBusiness = 0;
        this.state.numManagement = 0;
        this.state.numResearch = 0;
        this.state.numUnassigned = 0;
        this.state.numTraining = 0;
    }

    updateEmployeeCount() {
        const division = this.routing().currentDivision;
        if (division == null) {
            throw new Error(`Routing does not hold reference to the current Industry`);
        }
        const office = division.offices[this.props.currentCity];
        if (!(office instanceof OfficeSpace)) {
            throw new Error(`Current City (${this.props.currentCity}) for UI does not have an OfficeSpace object`);
        }

        // If we're in a new city, we have to reset the state
        if (division.name !== this.state.division || this.props.currentCity !== this.state.city) {
            this.resetEmployeeCount();
            this.state.division = division.name;
            this.state.city = this.props.currentCity;
        }

        // Calculate how many NEW emplyoees we need to account for
        const currentNumEmployees = office.employees.length;
        const newEmployees = currentNumEmployees - this.state.numEmployees;

        // Record the number of employees in each position, for NEW employees only
        for (let i = this.state.numEmployees; i < office.employees.length; ++i) {
            switch (office.employees[i].pos) {
                case EmployeePositions.Operations:
                    ++this.state.numOperations;
                    break;
                case EmployeePositions.Engineer:
                    ++this.state.numEngineers;
                    break;
                case EmployeePositions.Business:
                    ++this.state.numBusiness;
                    break;
                case EmployeePositions.Management:
                    ++this.state.numManagement;
                    break;
                case EmployeePositions.RandD:
                    ++this.state.numResearch;
                    break;
                case EmployeePositions.Unassigned:
                    ++this.state.numUnassigned;
                    break;
                case EmployeePositions.Training:
                    ++this.state.numTraining;
                    break;
                default:
                    console.error("Unrecognized employee position: " + office.employees[i].pos);
                    break;
            }
        }

        this.state.numEmployees = currentNumEmployees;
    }

    // Renders the "Employee Management" section of the Office UI
    renderEmployeeManagement() {
        this.updateEmployeeCount();

        if (this.state.employeeManualAssignMode) {
            return this.renderManualEmployeeManagement();
        } else {
            return this.renderAutomaticEmployeeManagement();
        }
    }

    renderAutomaticEmployeeManagement() {
        const division = this.routing().currentDivision; // Validated in constructor
        const office = division.offices[this.props.currentCity]; // Validated in constructor
        const vechain = (this.corp().unlockUpgrades[4] === 1); // Has Vechain upgrade

        const switchModeOnClick = () => {
            this.state.employeeManualAssignMode = true;
            this.corp().rerender();
        }

        // Calculate average morale, happiness, and energy. Also salary
        // TODO is this efficient?
        let totalMorale = 0, totalHappiness = 0, totalEnergy = 0, totalSalary = 0;
        for (let i = 0; i < office.employees.length; ++i) {
            totalMorale += office.employees[i].mor;
            totalHappiness += office.employees[i].hap;
            totalEnergy += office.employees[i].ene;
            totalSalary += office.employees[i].sal;
        }

        let avgMorale = 0, avgHappiness = 0, avgEnergy = 0;
        if (office.employees.length > 0) {
            avgMorale = totalMorale / office.employees.length;
            avgHappiness = totalHappiness / office.employees.length;
            avgEnergy = totalEnergy / office.employees.length;
        }

        // Helper functions for (re-)assigning employees to different positions
        const assignEmployee = (to) => {
            if (this.state.numUnassigned <= 0) {
                console.warn("Cannot assign employee. No unassigned employees available");
                return;
            }

            switch (to) {
                case EmployeePositions.Operations:
                    ++this.state.numOperations;
                    break;
                case EmployeePositions.Engineer:
                    ++this.state.numEngineers;
                    break;
                case EmployeePositions.Business:
                    ++this.state.numBusiness;
                    break;
                case EmployeePositions.Management:
                    ++this.state.numManagement;
                    break;
                case EmployeePositions.RandD:
                    ++this.state.numResearch;
                    break;
                case EmployeePositions.Unassigned:
                    ++this.state.numUnassigned;
                    break;
                case EmployeePositions.Training:
                    ++this.state.numTraining;
                    break;
                default:
                    console.error("Unrecognized employee position: " + to);
                    break;
            }
            --this.state.numUnassigned;

            office.assignEmployeeToJob(to);
            office.calculateEmployeeProductivity({ corporation: this.corp(), industry:division });
            this.corp().rerender();
        }

        const unassignEmployee = (from) => {
            function logWarning(pos) {
                console.warn(`Cannot unassign from ${pos} because there is nobody assigned to that position`);
            }

            switch (from) {
                case EmployeePositions.Operations:
                    if (this.state.numOperations <= 0) { return logWarning(EmployeePositions.Operations); }
                    --this.state.numOperations;
                    break;
                case EmployeePositions.Engineer:
                    if (this.state.numEngineers <= 0) { return logWarning(EmployeePositions.Operations); }
                    --this.state.numEngineers;
                    break;
                case EmployeePositions.Business:
                    if (this.state.numBusiness <= 0) { return logWarning(EmployeePositions.Operations); }
                    --this.state.numBusiness;
                    break;
                case EmployeePositions.Management:
                    if (this.state.numManagement <= 0) { return logWarning(EmployeePositions.Operations); }
                    --this.state.numManagement;
                    break;
                case EmployeePositions.RandD:
                    if (this.state.numResearch <= 0) { return logWarning(EmployeePositions.Operations); }
                    --this.state.numResearch;
                    break;
                case EmployeePositions.Unassigned:
                    console.warn(`Tried to unassign from the Unassigned position`);
                    break;
                case EmployeePositions.Training:
                    if (this.state.numTraining <= 0) { return logWarning(EmployeePositions.Operations); }
                    --this.state.numTraining;
                    break;
                default:
                    console.error("Unrecognized employee position: " + from);
                    break;
            }
            ++this.state.numUnassigned;

            office.unassignEmployeeFromJob(from);
            office.calculateEmployeeProductivity({ corporation: this.corp(), industry:division });
            this.corp().rerender();
        }

        const positionHeaderStyle = {
            fontSize: "15px",
            margin: "5px 0px 5px 0px",
            width: "50%",
        }
        const assignButtonClass = this.state.numUnassigned > 0 ? "std-button" : "a-link-button-inactive";

        const operationAssignButtonOnClick = () => {
            assignEmployee(EmployeePositions.Operations);
            this.corp().rerender();
        }
        const operationUnassignButtonOnClick = () => {
            unassignEmployee(EmployeePositions.Operations);
            this.corp().rerender();
        }
        const operationUnassignButtonClass = this.state.numOperations > 0 ? "std-button" : "a-link-button-inactive";

        const engineerAssignButtonOnClick = () => {
            assignEmployee(EmployeePositions.Engineer);
            this.corp().rerender();
        }
        const engineerUnassignButtonOnClick = () => {
            unassignEmployee(EmployeePositions.Engineer);
            this.corp().rerender();
        }
        const engineerUnassignButtonClass = this.state.numEngineers > 0 ? "std-button" : "a-link-button-inactive";

        const businessAssignButtonOnClick = () => {
            assignEmployee(EmployeePositions.Business);
            this.corp().rerender();
        }
        const businessUnassignButtonOnClick = () => {
            unassignEmployee(EmployeePositions.Business);
            this.corp().rerender();
        }
        const businessUnassignButtonClass = this.state.numBusiness > 0 ? "std-button" : "a-link-button-inactive";

        const managementAssignButtonOnClick = () => {
            assignEmployee(EmployeePositions.Management);
            this.corp().rerender();
        }
        const managementUnassignButtonOnClick = () => {
            unassignEmployee(EmployeePositions.Management);
            this.corp().rerender();
        }
        const managementUnassignButtonClass = this.state.numManagement > 0 ? "std-button" : "a-link-button-inactive";

        const rndAssignButtonOnClick = () => {
            assignEmployee(EmployeePositions.RandD);
            this.corp().rerender();
        }
        const rndUnassignButtonOnClick = () => {
            unassignEmployee(EmployeePositions.RandD);
            this.corp().rerender();
        }
        const rndUnassignButtonClass = this.state.numResearch > 0 ? "std-button" : "a-link-button-inactive";

        const trainingAssignButtonOnClick = () => {
            assignEmployee(EmployeePositions.Training);
            this.corp().rerender();
        }
        const trainingUnassignButtonOnClick = () => {
            unassignEmployee(EmployeePositions.Training);
            this.corp().rerender();
        }
        const trainingUnassignButtonClass = this.state.numTraining > 0 ? "std-button" : "a-link-button-inactive";

        return (
            <div>
                <button className={"std-button tooltip"} onClick={switchModeOnClick}>
                    Switch to Manual Mode
                    <span className={"tooltiptext"}>
                        Switch to Manual Assignment Mode, which allows you to
                        specify which employees should get which jobs
                    </span>
                </button>

                <p><strong>Unassigned Employees: {this.state.numUnassigned}</strong></p>
                <br />

                <p>Avg Employee Morale: {numeralWrapper.format(avgMorale, "0.000")}</p>
                <p>Avg Employee Happiness: {numeralWrapper.format(avgHappiness, "0.000")}</p>
                <p>Avg Energy Morale: {numeralWrapper.format(avgEnergy, "0.000")}</p>
                <p>Total Employee Salary: {numeralWrapper.formatMoney(totalSalary)}</p>
                {
                    vechain &&
                    <p className={"tooltip"} style={{display: "inline-block"}}>
                        Material Production: {numeralWrapper.format(division.getOfficeProductivity(office), "0.000")}
                        <span className={"tooltiptext"}>
                            The base amount of material this office can produce. Does not include
                            production multipliers from upgrades and materials. This value is based off
                            the productivity of your Operations, Engineering, and Management employees
                        </span>
                    </p>
                }
                {
                    vechain && <br />
                }
                {
                    vechain &&
                    <p className={"tooltip"} style={{display: "inline-block"}}>
                        Product Production: {numeralWrapper.format(division.getOfficeProductivity(office, {forProduct:true}), "0.000")}
                        <span className={"tooltiptext"}>
                            The base amount of any given Product this office can produce. Does not include
                            production multipliers from upgrades and materials. This value is based off
                            the productivity of your Operations, Engineering, and Management employees
                        </span>
                    </p>
                }
                {
                    vechain && <br />
                }
                {
                    vechain &&
                    <p className={"tooltip"} style={{display: "inline-block"}}>
                        Business Multiplier: x{numeralWrapper.format(division.getBusinessFactor(office), "0.000")}
                        <span className={"tooltiptext"}>
                            The effect this office's 'Business' employees has on boosting sales
                        </span>
                    </p>
                }
                {
                    vechain && <br />
                }

                <h2 className={"tooltip"} style={positionHeaderStyle}>
                    {EmployeePositions.Operations} ({this.state.numOperations})
                    <span className={"tooltiptext"}>
                        Manages supply chain operations. Improves the amount of Materials and Products you produce.
                    </span>
                </h2>
                <button className={assignButtonClass} onClick={operationAssignButtonOnClick}>+</button>
                <button className={operationUnassignButtonClass} onClick={operationUnassignButtonOnClick}>-</button>
                <br />

                <h2 className={"tooltip"} style={positionHeaderStyle}>
                    {EmployeePositions.Engineer} ({this.state.numEngineers})
                    <span className={"tooltiptext"}>
                        Develops and maintains products and production systems. Increases the quality of
                        everything you produce. Also increases the amount you produce (not as much
                        as Operations, however)
                    </span>
                </h2>
                <button className={assignButtonClass} onClick={engineerAssignButtonOnClick}>+</button>
                <button className={engineerUnassignButtonClass} onClick={engineerUnassignButtonOnClick}>-</button>
                <br />

                <h2 className={"tooltip"} style={positionHeaderStyle}>
                    {EmployeePositions.Business} ({this.state.numBusiness})
                    <span className={"tooltiptext"}>
                        Handles sales and finances. Improves the amount of Materials and Products you can sell.
                    </span>
                </h2>
                <button className={assignButtonClass} onClick={businessAssignButtonOnClick}>+</button>
                <button className={businessUnassignButtonClass} onClick={businessUnassignButtonOnClick}>-</button>
                <br />

                <h2 className={"tooltip"} style={positionHeaderStyle}>
                    {EmployeePositions.Management} ({this.state.numManagement})
                    <span className={"tooltiptext"}>
                        Leads and oversees employees and office operations. Improves the effectiveness of
                        Engineer and Operations employees
                    </span>
                </h2>
                <button className={assignButtonClass} onClick={managementAssignButtonOnClick}>+</button>
                <button className={managementUnassignButtonClass} onClick={managementUnassignButtonOnClick}>-</button>
                <br />

                <h2 className={"tooltip"} style={positionHeaderStyle}>
                    {EmployeePositions.RandD} ({this.state.numResearch})
                    <span className={"tooltiptext"}>
                        Research new innovative ways to improve the company. Generates Scientific Research
                    </span>
                </h2>
                <button className={assignButtonClass} onClick={rndAssignButtonOnClick}>+</button>
                <button className={rndUnassignButtonClass} onClick={rndUnassignButtonOnClick}>-</button>
                <br />

                <h2 className={"tooltip"} style={positionHeaderStyle}>
                    {EmployeePositions.Training} ({this.state.numTraining})
                    <span className={"tooltiptext"}>
                        Set employee to training, which will increase some of their stats. Employees in training do not affect any company operations.
                    </span>
                </h2>
                <button className={assignButtonClass} onClick={trainingAssignButtonOnClick}>+</button>
                <button className={trainingUnassignButtonClass} onClick={trainingUnassignButtonOnClick}>-</button>
            </div>
        )
    }

    renderManualEmployeeManagement() {
        const corp = this.corp();
        const division = this.routing().currentDivision; // Validated in constructor
        const office = division.offices[this.props.currentCity]; // Validated in constructor

        const switchModeOnClick = () => {
            this.state.employeeManualAssignMode = false;
            this.corp().rerender();
        }

        const employeeInfoDivStyle = {
            color: "white",
            margin: "4px",
            padding: "4px",
        }

        // Employee Selector
        const employees = [];
        for (let i = 0; i < office.employees.length; ++i) {
            employees.push(<option key={office.employees[i].name}>{office.employees[i].name}</option>)
        }

        const employeeSelectorOnChange = (e) => {
            const name = getSelectText(e.target);
            for (let i = 0; i < office.employees.length; ++i) {
                if (name === office.employees[i].name) {
                    this.state.employee = office.employees[i];
                    break;
                }
            }

            corp.rerender();
        }

        // Employee Positions Selector
        const emp = this.state.employee;
        let employeePositionSelectorInitialValue = null;
        const employeePositions = [];
        const positionNames = Object.values(EmployeePositions);
        for (let i = 0; i < positionNames.length; ++i) {
            employeePositions.push(<option key={positionNames[i]} value={positionNames[i]}>{positionNames[i]}</option>);
            if (emp != null && emp.pos === positionNames[i]) {
                employeePositionSelectorInitialValue = positionNames[i];
            }
        }

        const employeePositionSelectorOnChange = (e) => {
            const pos = getSelectText(e.target);
            this.state.employee.pos = pos;
            this.resetEmployeeCount();
            corp.rerender();
        }

        // Numeraljs formatter
        const nf = "0.000";

        // Employee stats (after applying multipliers)
        const effCre = emp ? emp.cre * corp.getEmployeeCreMultiplier() * division.getEmployeeCreMultiplier() : 0;
        const effCha = emp ? emp.cha * corp.getEmployeeChaMultiplier() * division.getEmployeeChaMultiplier() : 0;
        const effInt = emp ? emp.int * corp.getEmployeeIntMultiplier() * division.getEmployeeIntMultiplier() : 0;
        const effEff = emp ? emp.eff * corp.getEmployeeEffMultiplier() * division.getEmployeeEffMultiplier() : 0;

        return (
            <div>
                <button className={"std-button tooltip"} onClick={switchModeOnClick}>
                    Switch to Auto Mode
                    <span className={"tooltiptext"}>
                        Switch to Automatic Assignment Mode, which will automatically
                        assign employees to your selected jobs. You simply have to select
                        the number of assignments for each job
                    </span>
                </button>

                <div style={employeeInfoDivStyle}>
                    <select onChange={employeeSelectorOnChange}>
                        {employees}
                    </select>
                    {
                        this.state.employee != null &&
                        <p>
                            Morale: {numeralWrapper.format(this.state.employee.mor, nf)}
                            <br />
                            Happiness: {numeralWrapper.format(this.state.employee.hap, nf)}
                            <br />
                            Energy: {numeralWrapper.format(this.state.employee.ene, nf)}
                            <br />
                            Age: {numeralWrapper.format(this.state.employee.age, nf)}
                            <br />
                            Intelligence: {numeralWrapper.format(effInt, nf)}
                            <br />
                            Charisma: {numeralWrapper.format(effCha, nf)}
                            <br />
                            Experience: {numeralWrapper.format(this.state.employee.exp, nf)}
                            <br />
                            Creativity: {numeralWrapper.format(effCre, nf)}
                            <br />
                            Efficiency: {numeralWrapper.format(effEff, nf)}
                            <br />
                            Salary: {numeralWrapper.formatMoney(this.state.employee.sal)}
                        </p>
                    }
                    {
                        this.state.employee != null &&
                        <select onChange={employeePositionSelectorOnChange} value={employeePositionSelectorInitialValue}>
                            {employeePositions}
                        </select>
                    }
                </div>
            </div>
        )
    }

    render() {
        const corp = this.corp();
        const division = this.routing().currentDivision; // Validated in constructor
        const office = division.offices[this.props.currentCity]; // Validated in constructor

        const buttonStyle = {
            fontSize: "13px",
        }

        // Hire Employee button
        let hireEmployeeButtonClass = "tooltip";
        if (office.atCapacity()) {
            hireEmployeeButtonClass += " a-link-button-inactive";
        } else {
            hireEmployeeButtonClass += " std-button";
            if (office.employees.length === 0) {
                hireEmployeeButtonClass += " flashing-button";
            }
        }

        const hireEmployeeButtonOnClick = () => {
            office.findEmployees({ corporation: corp, industry: division });
        }

        // Autohire employee button
        let autohireEmployeeButtonClass = "tooltip";
        if (office.atCapacity()) {
            autohireEmployeeButtonClass += " a-link-button-inactive";
        } else {
            autohireEmployeeButtonClass += " std-button";
        }
        const autohireEmployeeButtonOnClick = () => {
            if (office.atCapacity()) { return; }
            office.hireRandomEmployee();
            this.corp().rerender();
        }

        // Upgrade Office Size Button
        const upgradeOfficeSizeOnClick = this.eventHandler().createUpgradeOfficeSizePopup.bind(this.eventHandler(), office);

        // Throw Office Party
        const throwOfficePartyOnClick = this.eventHandler().createThrowOfficePartyPopup.bind(this.eventHandler(), office);

        return (
            <div className={"cmpy-mgmt-employee-panel"}>
                <h1 style={{ margin: "4px 0px 5px 0px" }}>Office Space</h1>
                <p>Size: {office.employees.length} / {office.size} employees</p>
                <button className={hireEmployeeButtonClass} onClick={hireEmployeeButtonOnClick} style={buttonStyle}>
                    Hire Employee
                    {
                        office.employees.length === 0 &&
                        <span className={"tooltiptext"}>
                            You'll need to hire some employees to get your operations started!
                            It's recommended to have at least one employee in every position
                        </span>
                    }
                </button>
                <button className={autohireEmployeeButtonClass} onClick={autohireEmployeeButtonOnClick} style={buttonStyle}>
                    Autohire Employee
                    <span className={"tooltiptext"}>
                        Automatically hires an employee and gives him/her a random name
                    </span>
                </button>
                <br />
                <button className={"std-button tooltip"} onClick={upgradeOfficeSizeOnClick} style={buttonStyle}>
                    Upgrade size
                    <span className={"tooltiptext"}>
                        Upgrade the office's size so that it can hold more employees!
                    </span>
                </button>
                {
                    !division.hasResearch("AutoPartyManager") &&
                    <button className={"std-button tooltip"} onClick={throwOfficePartyOnClick} style={buttonStyle}>
                        Throw Party
                        <span className={"tooltiptext"}>
                            "Throw an office party to increase your employee's morale and happiness"
                        </span>
                    </button>
                }
                <br />

                {this.renderEmployeeManagement()}
            </div>
        )
    }
}
