// React Component for displaying an Industry's OfficeSpace information
// (bottom-left panel in the Industry UI)
import React, { useState } from "react";

import { OfficeSpace }              from "../OfficeSpace";
import { Employee }                 from "../Employee";
import { EmployeePositions }        from "../EmployeePositions";

import { numeralWrapper }           from "../../ui/numeralFormat";

import { getSelectText }            from "../../../utils/uiHelpers/getSelectData";
import { createPopup }              from "../../ui/React/createPopup";
import { UpgradeOfficeSizePopup }   from "./UpgradeOfficeSizePopup";
import { ThrowPartyPopup }          from "./ThrowPartyPopup";
import { ICorporation }             from "../ICorporation";
import { IPlayer }                  from "../../PersonObjects/IPlayer";
import { CorporationRouting }       from "./Routing";

interface IProps {
    routing: CorporationRouting;
    corp: ICorporation;
    currentCity: string;
    player: IPlayer;
}

export function IndustryOffice(props: IProps): React.ReactElement {
    const [employeeManualAssignMode, setEmployeeManualAssignMode] = useState(false);
    const [city, setCity] = useState("");
    const [divisionName, setDivisionName] = useState("");
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [numEmployees, setNumEmployees] = useState(0);
    const [numOperations, setNumOperations] = useState(0);
    const [numEngineers, setNumEngineers] = useState(0);
    const [numBusiness, setNumBusiness] = useState(0);
    const [numManagement, setNumManagement] = useState(0);
    const [numResearch, setNumResearch] = useState(0);
    const [numUnassigned, setNumUnassigned] = useState(0);
    const [numTraining, setNumTraining] = useState(0);

    function resetEmployeeCount(): void {
        setNumEmployees(0);
        setNumOperations(0);
        setNumEngineers(0);
        setNumBusiness(0);
        setNumManagement(0);
        setNumResearch(0);
        setNumUnassigned(0);
        setNumTraining(0);
    }

    function updateEmployeeCount(): void {
        const division = props.routing.currentDivision;
        if (division == null) {
            throw new Error(`Routing does not hold reference to the current Industry`);
        }
        const office = division.offices[props.currentCity];
        if (!(office instanceof OfficeSpace)) {
            throw new Error(`Current City (${props.currentCity}) for UI does not have an OfficeSpace object`);
        }

        // If we're in a new city, we have to reset the state
        if (division.name !== divisionName || props.currentCity !== city) {
            resetEmployeeCount();
            setDivisionName(division.name);
            setCity(props.currentCity);
        }

        // Calculate how many NEW employees we need to account for
        const currentNumEmployees = office.employees.length;

        let newOperations = numOperations;
        let newEngineers = numEngineers;
        let newBusiness = numBusiness;
        let newManagement = numManagement;
        let newResearch = numResearch;
        let newUnassigned = numUnassigned;
        let newTraining = numTraining;

        // Record the number of employees in each position, for NEW employees only
        for (let i = numEmployees; i < office.employees.length; ++i) {
            switch (office.employees[i].pos) {
                case EmployeePositions.Operations:
                    newOperations++;
                    break;
                case EmployeePositions.Engineer:
                    newEngineers++;
                    break;
                case EmployeePositions.Business:
                    newBusiness++;
                    break;
                case EmployeePositions.Management:
                    newManagement++;
                    break;
                case EmployeePositions.RandD:
                    newResearch++;
                    break;
                case EmployeePositions.Unassigned:
                    newUnassigned++;
                    break;
                case EmployeePositions.Training:
                    newTraining++;
                    break;
                default:
                    console.error("Unrecognized employee position: " + office.employees[i].pos);
                    break;
            }
        }
        if(newOperations !== numOperations) setNumOperations(newOperations);
        if(newEngineers !== numEngineers) setNumEngineers(newEngineers);
        if(newBusiness !== numBusiness) setNumBusiness(newBusiness);
        if(newManagement !== numManagement) setNumManagement(newManagement);
        if(newResearch !== numResearch) setNumResearch(newResearch);
        if(newUnassigned !== numUnassigned) setNumUnassigned(newUnassigned);
        if(newTraining !== numTraining) setNumTraining(newTraining);

        if(currentNumEmployees !== numEmployees) setNumEmployees(currentNumEmployees);
    }

    updateEmployeeCount();

    // Renders the "Employee Management" section of the Office UI
    function renderEmployeeManagement(): React.ReactElement {
        updateEmployeeCount();

        if (employeeManualAssignMode) {
            return renderManualEmployeeManagement();
        } else {
            return renderAutomaticEmployeeManagement();
        }
    }

    function renderAutomaticEmployeeManagement(): React.ReactElement {
        const division = props.routing.currentDivision; // Validated in constructor
        if(division === null) return(<></>);
        const office = division.offices[props.currentCity]; // Validated in constructor
        const vechain = (props.corp.unlockUpgrades[4] === 1); // Has Vechain upgrade

        function switchModeOnClick(): void {
            setEmployeeManualAssignMode(true);
            props.corp.rerender(props.player);
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
        function assignEmployee(to: string): void {
            if (numUnassigned <= 0) {
                console.warn("Cannot assign employee. No unassigned employees available");
                return;
            }

            switch (to) {
                case EmployeePositions.Operations:
                    setNumOperations(n => n+1);
                    break;
                case EmployeePositions.Engineer:
                    setNumEngineers(n => n+1);
                    break;
                case EmployeePositions.Business:
                    setNumBusiness(n => n+1);
                    break;
                case EmployeePositions.Management:
                    setNumManagement(n => n+1);
                    break;
                case EmployeePositions.RandD:
                    setNumResearch(n => n+1);
                    break;
                case EmployeePositions.Unassigned:
                    setNumUnassigned(n => n+1);
                    break;
                case EmployeePositions.Training:
                    setNumTraining(n => n+1);
                    break;
                default:
                    console.error("Unrecognized employee position: " + to);
                    break;
            }
            setNumUnassigned(n => n-1);

            office.assignEmployeeToJob(to);
            office.calculateEmployeeProductivity({ corporation: props.corp, industry:division });
            props.corp.rerender(props.player);
        }

        function unassignEmployee(from: string): void {
            function logWarning(pos: string): void {
                console.warn(`Cannot unassign from ${pos} because there is nobody assigned to that position`);
            }

            switch (from) {
                case EmployeePositions.Operations:
                    if (numOperations <= 0) { return logWarning(EmployeePositions.Operations); }
                    setNumOperations(n => n-1);
                    break;
                case EmployeePositions.Engineer:
                    if (numEngineers <= 0) { return logWarning(EmployeePositions.Operations); }
                    setNumEngineers(n => n-1);
                    break;
                case EmployeePositions.Business:
                    if (numBusiness <= 0) { return logWarning(EmployeePositions.Operations); }
                    setNumBusiness(n => n-1);
                    break;
                case EmployeePositions.Management:
                    if (numManagement <= 0) { return logWarning(EmployeePositions.Operations); }
                    setNumManagement(n => n-1);
                    break;
                case EmployeePositions.RandD:
                    if (numResearch <= 0) { return logWarning(EmployeePositions.Operations); }
                    setNumResearch(n => n-1);
                    break;
                case EmployeePositions.Unassigned:
                    console.warn(`Tried to unassign from the Unassigned position`);
                    break;
                case EmployeePositions.Training:
                    if (numTraining <= 0) { return logWarning(EmployeePositions.Operations); }
                    setNumTraining(n => n-1);
                    break;
                default:
                    console.error("Unrecognized employee position: " + from);
                    break;
            }
            setNumUnassigned(n => n+1);

            office.unassignEmployeeFromJob(from);
            office.calculateEmployeeProductivity({ corporation: props.corp, industry:division });
            props.corp.rerender(props.player);
        }

        const positionHeaderStyle = {
            fontSize: "15px",
            margin: "5px 0px 5px 0px",
            width: "50%",
        }
        const assignButtonClass = numUnassigned > 0 ? "std-button" : "a-link-button-inactive";

        function operationAssignButtonOnClick(): void {
            assignEmployee(EmployeePositions.Operations);
            props.corp.rerender(props.player);
        }
        function operationUnassignButtonOnClick(): void {
            unassignEmployee(EmployeePositions.Operations);
            props.corp.rerender(props.player);
        }
        const operationUnassignButtonClass = numOperations > 0 ? "std-button" : "a-link-button-inactive";

        function engineerAssignButtonOnClick(): void {
            assignEmployee(EmployeePositions.Engineer);
            props.corp.rerender(props.player);
        }
        function engineerUnassignButtonOnClick(): void {
            unassignEmployee(EmployeePositions.Engineer);
            props.corp.rerender(props.player);
        }
        const engineerUnassignButtonClass = numEngineers > 0 ? "std-button" : "a-link-button-inactive";

        function businessAssignButtonOnClick(): void {
            assignEmployee(EmployeePositions.Business);
            props.corp.rerender(props.player);
        }
        function businessUnassignButtonOnClick(): void {
            unassignEmployee(EmployeePositions.Business);
            props.corp.rerender(props.player);
        }
        const businessUnassignButtonClass = numBusiness > 0 ? "std-button" : "a-link-button-inactive";

        function managementAssignButtonOnClick(): void {
            assignEmployee(EmployeePositions.Management);
            props.corp.rerender(props.player);
        }
        function managementUnassignButtonOnClick(): void {
            unassignEmployee(EmployeePositions.Management);
            props.corp.rerender(props.player);
        }
        const managementUnassignButtonClass = numManagement > 0 ? "std-button" : "a-link-button-inactive";

        function rndAssignButtonOnClick(): void {
            assignEmployee(EmployeePositions.RandD);
            props.corp.rerender(props.player);
        }
        function rndUnassignButtonOnClick(): void {
            unassignEmployee(EmployeePositions.RandD);
            props.corp.rerender(props.player);
        }
        const rndUnassignButtonClass = numResearch > 0 ? "std-button" : "a-link-button-inactive";

        function trainingAssignButtonOnClick(): void {
            assignEmployee(EmployeePositions.Training);
            props.corp.rerender(props.player);
        }
        function trainingUnassignButtonOnClick(): void {
            unassignEmployee(EmployeePositions.Training);
            props.corp.rerender(props.player);
        }
        const trainingUnassignButtonClass = numTraining > 0 ? "std-button" : "a-link-button-inactive";

        return (
            <div>
                <button className={"std-button tooltip"} onClick={switchModeOnClick}>
                    Switch to Manual Mode
                    <span className={"tooltiptext"}>
                        Switch to Manual Assignment Mode, which allows you to
                        specify which employees should get which jobs
                    </span>
                </button>

                <p><strong>Unassigned Employees: {numUnassigned}</strong></p>
                <br />

                <p>Avg Employee Morale: {numeralWrapper.format(avgMorale, "0.000")}</p>
                <p>Avg Employee Happiness: {numeralWrapper.format(avgHappiness, "0.000")}</p>
                <p>Avg Employee Energy: {numeralWrapper.format(avgEnergy, "0.000")}</p>
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
                    {EmployeePositions.Operations} ({numOperations})
                    <span className={"tooltiptext"}>
                        Manages supply chain operations. Improves the amount of Materials and Products you produce.
                    </span>
                </h2>
                <button className={assignButtonClass} onClick={operationAssignButtonOnClick}>+</button>
                <button className={operationUnassignButtonClass} onClick={operationUnassignButtonOnClick}>-</button>
                <br />

                <h2 className={"tooltip"} style={positionHeaderStyle}>
                    {EmployeePositions.Engineer} ({numEngineers})
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
                    {EmployeePositions.Business} ({numBusiness})
                    <span className={"tooltiptext"}>
                        Handles sales and finances. Improves the amount of Materials and Products you can sell.
                    </span>
                </h2>
                <button className={assignButtonClass} onClick={businessAssignButtonOnClick}>+</button>
                <button className={businessUnassignButtonClass} onClick={businessUnassignButtonOnClick}>-</button>
                <br />

                <h2 className={"tooltip"} style={positionHeaderStyle}>
                    {EmployeePositions.Management} ({numManagement})
                    <span className={"tooltiptext"}>
                        Leads and oversees employees and office operations. Improves the effectiveness of
                        Engineer and Operations employees
                    </span>
                </h2>
                <button className={assignButtonClass} onClick={managementAssignButtonOnClick}>+</button>
                <button className={managementUnassignButtonClass} onClick={managementUnassignButtonOnClick}>-</button>
                <br />

                <h2 className={"tooltip"} style={positionHeaderStyle}>
                    {EmployeePositions.RandD} ({numResearch})
                    <span className={"tooltiptext"}>
                        Research new innovative ways to improve the company. Generates Scientific Research
                    </span>
                </h2>
                <button className={assignButtonClass} onClick={rndAssignButtonOnClick}>+</button>
                <button className={rndUnassignButtonClass} onClick={rndUnassignButtonOnClick}>-</button>
                <br />

                <h2 className={"tooltip"} style={positionHeaderStyle}>
                    {EmployeePositions.Training} ({numTraining})
                    <span className={"tooltiptext"}>
                        Set employee to training, which will increase some of their stats. Employees in training do not affect any company operations.
                    </span>
                </h2>
                <button className={assignButtonClass} onClick={trainingAssignButtonOnClick}>+</button>
                <button className={trainingUnassignButtonClass} onClick={trainingUnassignButtonOnClick}>-</button>
            </div>
        )
    }

    function renderManualEmployeeManagement(): React.ReactElement {
        const corp = props.corp;
        const division = props.routing.currentDivision; // Validated in constructor
        if(division === null) return (<></>);
        const office = division.offices[props.currentCity]; // Validated in constructor

        function switchModeOnClick(): void {
            setEmployeeManualAssignMode(false);
            props.corp.rerender(props.player);
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

        function employeeSelectorOnChange(e: React.ChangeEvent<HTMLSelectElement>): void {
            const name = getSelectText(e.target);
            for (let i = 0; i < office.employees.length; ++i) {
                if (name === office.employees[i].name) {
                    setEmployee(office.employees[i]);
                    break;
                }
            }

            corp.rerender(props.player);
        }

        // Employee Positions Selector
        const emp = employee;
        let employeePositionSelectorInitialValue = "";
        const employeePositions = [];
        const positionNames = Object.values(EmployeePositions);
        for (let i = 0; i < positionNames.length; ++i) {
            employeePositions.push(<option key={positionNames[i]} value={positionNames[i]}>{positionNames[i]}</option>);
            if (emp != null && emp.pos === positionNames[i]) {
                employeePositionSelectorInitialValue = positionNames[i];
            }
        }

        function employeePositionSelectorOnChange(e: React.ChangeEvent<HTMLSelectElement>): void {
            if(employee === null) return;
            const pos = getSelectText(e.target);
            employee.pos = pos;
            resetEmployeeCount();
            corp.rerender(props.player);
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
                        employee != null &&
                        <p>
                            Morale: {numeralWrapper.format(employee.mor, nf)}
                            <br />
                            Happiness: {numeralWrapper.format(employee.hap, nf)}
                            <br />
                            Energy: {numeralWrapper.format(employee.ene, nf)}
                            <br />
                            Intelligence: {numeralWrapper.format(effInt, nf)}
                            <br />
                            Charisma: {numeralWrapper.format(effCha, nf)}
                            <br />
                            Experience: {numeralWrapper.format(employee.exp, nf)}
                            <br />
                            Creativity: {numeralWrapper.format(effCre, nf)}
                            <br />
                            Efficiency: {numeralWrapper.format(effEff, nf)}
                            <br />
                            Salary: {numeralWrapper.formatMoney(employee.sal)}
                        </p>
                    }
                    {
                        employee != null &&
                        <select onChange={employeePositionSelectorOnChange} value={employeePositionSelectorInitialValue}>
                            {employeePositions}
                        </select>
                    }
                </div>
            </div>
        )
    }

    const corp = props.corp;
    const division = props.routing.currentDivision; // Validated in constructor
    if(division === null) return (<></>);
    const office = division.offices[props.currentCity]; // Validated in constructor

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

    function hireEmployeeButtonOnClick(): void {
        office.findEmployees(props.player, { corporation: corp, industry: division });
    }

    // Autohire employee button
    let autohireEmployeeButtonClass = "tooltip";
    if (office.atCapacity()) {
        autohireEmployeeButtonClass += " a-link-button-inactive";
    } else {
        autohireEmployeeButtonClass += " std-button";
    }
    function autohireEmployeeButtonOnClick(): void {
        if (office.atCapacity()) return;
        office.hireRandomEmployee();
        props.corp.rerender(props.player);
    }

    function openUpgradeOfficeSizePopup(): void {
        const popupId = "cmpy-mgmt-upgrade-office-size-popup";
        createPopup(popupId, UpgradeOfficeSizePopup, {
            office: office,
            corp: props.corp,
            popupId: popupId,
            player: props.player,
        });
    }

    function openThrowPartyPopup(): void {
        const popupId = "cmpy-mgmt-throw-office-party-popup";
        createPopup(popupId, ThrowPartyPopup, {
            office: office,
            corp: props.corp,
            popupId: popupId,
        });
    }

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
            <button className={"std-button tooltip"} onClick={openUpgradeOfficeSizePopup} style={buttonStyle}>
                Upgrade size
                <span className={"tooltiptext"}>
                    Upgrade the office's size so that it can hold more employees!
                </span>
            </button>
            {
                !division.hasResearch("AutoPartyManager") &&
                <button className={"std-button tooltip"} onClick={openThrowPartyPopup} style={buttonStyle}>
                    Throw Party
                    <span className={"tooltiptext"}>
                        "Throw an office party to increase your employee's morale and happiness"
                    </span>
                </button>
            }
            <br />

            {renderEmployeeManagement()}
        </div>
    )
}
