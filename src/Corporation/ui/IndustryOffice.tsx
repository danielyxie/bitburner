// React Component for displaying an Industry's OfficeSpace information
// (bottom-left panel in the Industry UI)
import React, { useState } from "react";

import { OfficeSpace } from "../OfficeSpace";
import { IIndustry } from "../IIndustry";
import { Employee } from "../Employee";
import { EmployeePositions } from "../EmployeePositions";

import { numeralWrapper } from "../../ui/numeralFormat";

import { getSelectText } from "../../ui/uiHelpers/getSelectData";
import { createPopup } from "../../ui/React/createPopup";
import { UpgradeOfficeSizePopup } from "./UpgradeOfficeSizePopup";
import { HireEmployeePopup } from "./HireEmployeePopup";
import { ThrowPartyPopup } from "./ThrowPartyPopup";
import { ICorporation } from "../ICorporation";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Money } from "../../ui/React/Money";

interface IProps {
  corp: ICorporation;
  division: IIndustry;
  office: OfficeSpace;
  player: IPlayer;
  rerender: () => void;
}

function countEmployee(employees: Employee[], job: string): number {
  let n = 0;
  for (let i = 0; i < employees.length; ++i) {
    if (employees[i].pos === job) n++;
  }
  return n;
}

interface ISwitchProps {
  manualMode: boolean;
  switchMode: (f: (b: boolean) => boolean) => void;
}

function SwitchButton(props: ISwitchProps): React.ReactElement {
  if (props.manualMode) {
    return (
      <button className={"std-button tooltip"} onClick={() => props.switchMode((old) => !old)}>
        Switch to Auto Mode
        <span className={"tooltiptext"}>
          Switch to Automatic Assignment Mode, which will automatically assign employees to your selected jobs. You
          simply have to select the number of assignments for each job
        </span>
      </button>
    );
  } else {
    return (
      <button className={"std-button tooltip"} onClick={() => props.switchMode((old) => !old)}>
        Switch to Manual Mode
        <span className={"tooltiptext"}>
          Switch to Manual Assignment Mode, which allows you to specify which employees should get which jobs
        </span>
      </button>
    );
  }
}

function ManualManagement(props: IProps): React.ReactElement {
  const [employee, setEmployee] = useState<Employee | null>(
    props.office.employees.length > 0 ? props.office.employees[0] : null,
  );

  const employeeInfoDivStyle = {
    color: "white",
    margin: "4px",
    padding: "4px",
  };

  // Employee Selector
  const employees = [];
  for (let i = 0; i < props.office.employees.length; ++i) {
    employees.push(<option key={props.office.employees[i].name}>{props.office.employees[i].name}</option>);
  }

  function employeeSelectorOnChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    const name = getSelectText(e.target);
    for (let i = 0; i < props.office.employees.length; ++i) {
      if (name === props.office.employees[i].name) {
        setEmployee(props.office.employees[i]);
        break;
      }
    }

    props.rerender();
  }

  // Employee Positions Selector
  const emp = employee;
  let employeePositionSelectorInitialValue = "";
  const employeePositions = [];
  const positionNames = Object.values(EmployeePositions);
  for (let i = 0; i < positionNames.length; ++i) {
    employeePositions.push(
      <option key={positionNames[i]} value={positionNames[i]}>
        {positionNames[i]}
      </option>,
    );
    if (emp != null && emp.pos === positionNames[i]) {
      employeePositionSelectorInitialValue = positionNames[i];
    }
  }

  function employeePositionSelectorOnChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    if (employee === null) return;
    const pos = getSelectText(e.target);
    employee.pos = pos;
    props.rerender();
  }

  // Numeraljs formatter
  const nf = "0.000";

  // Employee stats (after applying multipliers)
  const effCre = emp ? emp.cre * props.corp.getEmployeeCreMultiplier() * props.division.getEmployeeCreMultiplier() : 0;
  const effCha = emp ? emp.cha * props.corp.getEmployeeChaMultiplier() * props.division.getEmployeeChaMultiplier() : 0;
  const effInt = emp ? emp.int * props.corp.getEmployeeIntMultiplier() * props.division.getEmployeeIntMultiplier() : 0;
  const effEff = emp ? emp.eff * props.corp.getEmployeeEffMultiplier() * props.division.getEmployeeEffMultiplier() : 0;

  return (
    <div style={employeeInfoDivStyle}>
      <select className="dropdown" onChange={employeeSelectorOnChange}>
        {employees}
      </select>
      {employee != null && (
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
          Salary: <Money money={employee.sal} />
        </p>
      )}
      {employee != null && (
        <select
          className="dropdown"
          onChange={employeePositionSelectorOnChange}
          value={employeePositionSelectorInitialValue}
        >
          {employeePositions}
        </select>
      )}
    </div>
  );
}

interface IAutoAssignProps {
  office: OfficeSpace;
  corp: ICorporation;
  division: IIndustry;
  player: IPlayer;
  job: string;
  desc: string;
  rerender: () => void;
}

function AutoAssignJob(props: IAutoAssignProps): React.ReactElement {
  const numJob = countEmployee(props.office.employees, props.job);
  const numUnassigned = countEmployee(props.office.employees, EmployeePositions.Unassigned);
  function assignEmployee(): void {
    if (numUnassigned <= 0) {
      console.warn("Cannot assign employee. No unassigned employees available");
      return;
    }

    props.office.assignEmployeeToJob(props.job);
    props.office.calculateEmployeeProductivity(props.corp, props.division);
    props.rerender();
  }

  function unassignEmployee(): void {
    props.office.unassignEmployeeFromJob(props.job);
    props.office.calculateEmployeeProductivity(props.corp, props.division);
    props.rerender();
  }
  const positionHeaderStyle = {
    fontSize: "15px",
    margin: "5px 0px 5px 0px",
    width: "50%",
  };
  return (
    <>
      <h2 className={"tooltip"} style={positionHeaderStyle}>
        {props.job} ({numJob})<span className={"tooltiptext"}>{props.desc}</span>
      </h2>
      <button className={numUnassigned > 0 ? "std-button" : "a-link-button-inactive"} onClick={assignEmployee}>
        +
      </button>
      <button className={numJob > 0 ? "std-button" : "a-link-button-inactive"} onClick={unassignEmployee}>
        -
      </button>
      <br />
    </>
  );
}

function AutoManagement(props: IProps): React.ReactElement {
  const numUnassigned = countEmployee(props.office.employees, EmployeePositions.Unassigned);
  const vechain = props.corp.unlockUpgrades[4] === 1; // Has Vechain upgrade

  // Calculate average morale, happiness, and energy. Also salary
  // TODO is this efficient?
  let totalMorale = 0,
    totalHappiness = 0,
    totalEnergy = 0,
    totalSalary = 0;
  for (let i = 0; i < props.office.employees.length; ++i) {
    totalMorale += props.office.employees[i].mor;
    totalHappiness += props.office.employees[i].hap;
    totalEnergy += props.office.employees[i].ene;
    totalSalary += props.office.employees[i].sal;
  }

  let avgMorale = 0,
    avgHappiness = 0,
    avgEnergy = 0;
  if (props.office.employees.length > 0) {
    avgMorale = totalMorale / props.office.employees.length;
    avgHappiness = totalHappiness / props.office.employees.length;
    avgEnergy = totalEnergy / props.office.employees.length;
  }

  return (
    <>
      <p>
        <strong>Unassigned Employees: {numUnassigned}</strong>
      </p>
      <br />
      <table>
        <tbody>
          <tr>
            <td>
              <p>Avg Employee Morale:</p>
            </td>
            <td>
              <p>{numeralWrapper.format(avgMorale, "0.000")}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Avg Employee Happiness:</p>
            </td>
            <td>
              <p>{numeralWrapper.format(avgHappiness, "0.000")}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Avg Employee Energy:</p>
            </td>
            <td>
              <p>{numeralWrapper.format(avgEnergy, "0.000")}</p>
            </td>
          </tr>
          <tr>
            <td>
              <p>Total Employee Salary:</p>
            </td>
            <td>
              <p>
                <Money money={totalSalary} />
              </p>
            </td>
          </tr>
          {vechain && (
            <>
              <tr>
                <td>
                  <p className={"tooltip"} style={{ display: "inline-block" }}>
                    Material Production:
                    <span className={"tooltiptext"}>
                      The base amount of material this office can produce. Does not include production multipliers from
                      upgrades and materials. This value is based off the productivity of your Operations, Engineering,
                      and Management employees
                    </span>
                  </p>
                </td>
                <td>
                  <p>{numeralWrapper.format(props.division.getOfficeProductivity(props.office), "0.000")}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={"tooltip"} style={{ display: "inline-block" }}>
                    Product Production:
                    <span className={"tooltiptext"}>
                      The base amount of any given Product this office can produce. Does not include production
                      multipliers from upgrades and materials. This value is based off the productivity of your
                      Operations, Engineering, and Management employees
                    </span>
                  </p>
                </td>
                <td>
                  <p>
                    {numeralWrapper.format(
                      props.division.getOfficeProductivity(props.office, {
                        forProduct: true,
                      }),
                      "0.000",
                    )}
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className={"tooltip"} style={{ display: "inline-block" }}>
                    Business Multiplier:
                    <span className={"tooltiptext"}>
                      The effect this office's 'Business' employees has on boosting sales
                    </span>
                  </p>
                </td>
                <td>
                  <p>x{numeralWrapper.format(props.division.getBusinessFactor(props.office), "0.000")}</p>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      <AutoAssignJob
        rerender={props.rerender}
        office={props.office}
        corp={props.corp}
        division={props.division}
        player={props.player}
        job={EmployeePositions.Operations}
        desc={"Manages supply chain operations. Improves the amount of Materials and Products you produce."}
      />

      <AutoAssignJob
        rerender={props.rerender}
        office={props.office}
        corp={props.corp}
        division={props.division}
        player={props.player}
        job={EmployeePositions.Engineer}
        desc={
          "Develops and maintains products and production systems. Increases the quality of everything you produce. Also increases the amount you produce (not as much as Operations, however)"
        }
      />

      <AutoAssignJob
        rerender={props.rerender}
        office={props.office}
        corp={props.corp}
        division={props.division}
        player={props.player}
        job={EmployeePositions.Business}
        desc={"Handles sales and finances. Improves the amount of Materials and Products you can sell."}
      />

      <AutoAssignJob
        rerender={props.rerender}
        office={props.office}
        corp={props.corp}
        division={props.division}
        player={props.player}
        job={EmployeePositions.Management}
        desc={
          "Leads and oversees employees and office operations. Improves the effectiveness of Engineer and Operations employees."
        }
      />

      <AutoAssignJob
        rerender={props.rerender}
        office={props.office}
        corp={props.corp}
        division={props.division}
        player={props.player}
        job={EmployeePositions.RandD}
        desc={"Research new innovative ways to improve the company. Generates Scientific Research."}
      />

      <AutoAssignJob
        rerender={props.rerender}
        office={props.office}
        corp={props.corp}
        division={props.division}
        player={props.player}
        job={EmployeePositions.Training}
        desc={
          "Set employee to training, which will increase some of their stats. Employees in training do not affect any company operations."
        }
      />
    </>
  );
}

export function IndustryOffice(props: IProps): React.ReactElement {
  const [employeeManualAssignMode, setEmployeeManualAssignMode] = useState(false);

  const buttonStyle = {
    fontSize: "13px",
  };

  // Hire Employee button
  let hireEmployeeButtonClass = "tooltip";
  if (props.office.atCapacity()) {
    hireEmployeeButtonClass += " a-link-button-inactive";
  } else {
    hireEmployeeButtonClass += " std-button";
    if (props.office.employees.length === 0) {
      hireEmployeeButtonClass += " flashing-button";
    }
  }

  function openHireEmployeePopup(): void {
    const popupId = "cmpy-mgmt-hire-employee-popup";
    createPopup(popupId, HireEmployeePopup, {
      rerender: props.rerender,
      office: props.office,
      corp: props.corp,
      popupId: popupId,
      player: props.player,
    });
  }

  // Autohire employee button
  let autohireEmployeeButtonClass = "tooltip";
  if (props.office.atCapacity()) {
    autohireEmployeeButtonClass += " a-link-button-inactive";
  } else {
    autohireEmployeeButtonClass += " std-button";
  }
  function autohireEmployeeButtonOnClick(): void {
    if (props.office.atCapacity()) return;
    props.office.hireRandomEmployee();
    props.rerender();
  }

  function openUpgradeOfficeSizePopup(): void {
    const popupId = "cmpy-mgmt-upgrade-office-size-popup";
    createPopup(popupId, UpgradeOfficeSizePopup, {
      rerender: props.rerender,
      office: props.office,
      corp: props.corp,
      popupId: popupId,
      player: props.player,
    });
  }

  function openThrowPartyPopup(): void {
    const popupId = "cmpy-mgmt-throw-office-party-popup";
    createPopup(popupId, ThrowPartyPopup, {
      office: props.office,
      corp: props.corp,
      popupId: popupId,
    });
  }

  return (
    <div className={"cmpy-mgmt-employee-panel"}>
      <h1 style={{ margin: "4px 0px 5px 0px" }}>Office Space</h1>
      <p>
        Size: {props.office.employees.length} / {props.office.size} employees
      </p>
      <button className={hireEmployeeButtonClass} onClick={openHireEmployeePopup} style={buttonStyle}>
        Hire Employee
        {props.office.employees.length === 0 && (
          <span className={"tooltiptext"}>
            You'll need to hire some employees to get your operations started! It's recommended to have at least one
            employee in every position
          </span>
        )}
      </button>
      <button className={autohireEmployeeButtonClass} onClick={autohireEmployeeButtonOnClick} style={buttonStyle}>
        Autohire Employee
        <span className={"tooltiptext"}>Automatically hires an employee and gives him/her a random name</span>
      </button>
      <br />
      <button
        className={"std-button tooltip"}
        onClick={openUpgradeOfficeSizePopup}
        style={buttonStyle}
        disabled={props.corp.funds.lt(0)}
      >
        Upgrade size
        <span className={"tooltiptext"}>Upgrade the office's size so that it can hold more employees!</span>
      </button>
      {!props.division.hasResearch("AutoPartyManager") && (
        <button
          className={"std-button tooltip"}
          onClick={openThrowPartyPopup}
          style={buttonStyle}
          disabled={props.corp.funds.lt(0)}
        >
          Throw Party
          <span className={"tooltiptext"}>
            "Throw an office party to increase your employee's morale and happiness"
          </span>
        </button>
      )}
      <br />

      <div>
        <SwitchButton manualMode={employeeManualAssignMode} switchMode={setEmployeeManualAssignMode} />
      </div>
      {employeeManualAssignMode ? (
        <ManualManagement
          rerender={props.rerender}
          corp={props.corp}
          division={props.division}
          office={props.office}
          player={props.player}
        />
      ) : (
        <AutoManagement
          rerender={props.rerender}
          corp={props.corp}
          division={props.division}
          office={props.office}
          player={props.player}
        />
      )}
    </div>
  );
}
