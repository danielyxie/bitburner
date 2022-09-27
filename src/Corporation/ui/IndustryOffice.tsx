// React Component for displaying an Industry's OfficeSpace information
// (bottom-left panel in the Industry UI)
import React, { useState } from "react";

import { OfficeSpace } from "../OfficeSpace";
import { Employee } from "../Employee";
import { EmployeePositions } from "../EmployeePositions";
import { BuyCoffee } from "../Actions";

import { MoneyCost } from "./MoneyCost";
import { numeralWrapper } from "../../ui/numeralFormat";

import { UpgradeOfficeSizeModal } from "./modals/UpgradeOfficeSizeModal";
import { ThrowPartyModal } from "./modals/ThrowPartyModal";
import { Money } from "../../ui/React/Money";
import { useCorporation, useDivision } from "./Context";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import { TableCell } from "../../ui/React/Table";
import { Box } from "@mui/material";

interface IProps {
  office: OfficeSpace;
  rerender: () => void;
}

interface ISwitchProps {
  manualMode: boolean;
  switchMode: (f: (b: boolean) => boolean) => void;
}

function SwitchButton(props: ISwitchProps): React.ReactElement {
  if (props.manualMode) {
    return (
      <Tooltip
        title={
          <Typography>
            Switch to Automatic Assignment Mode, which will automatically assign employees to your selected jobs. You
            simply have to select the number of assignments for each job
          </Typography>
        }
      >
        <Button onClick={() => props.switchMode((old) => !old)}>Switch to Auto Mode</Button>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip
        title={
          <Typography>
            Switch to Manual Assignment Mode, which allows you to specify which employees should get which jobs
          </Typography>
        }
      >
        <Button onClick={() => props.switchMode((old) => !old)}>Switch to Manual Mode</Button>
      </Tooltip>
    );
  }
}

function ManualManagement(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const [employee, setEmployee] = useState<Employee | null>(
    props.office.employees.length > 0 ? props.office.employees[0] : null,
  );

  // Employee Selector
  const employees = [];
  for (let i = 0; i < props.office.employees.length; ++i) {
    employees.push(
      <MenuItem key={props.office.employees[i].name} value={props.office.employees[i].name}>
        {props.office.employees[i].name}
      </MenuItem>,
    );
  }

  function employeeSelectorOnChange(e: SelectChangeEvent<string>): void {
    const name = e.target.value;
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
      <MenuItem key={positionNames[i]} value={positionNames[i]}>
        {positionNames[i]}
      </MenuItem>,
    );
    if (emp != null && emp.nextPos === positionNames[i]) {
      employeePositionSelectorInitialValue = emp.nextPos;
    }
  }

  function employeePositionSelectorOnChange(e: SelectChangeEvent<string>): void {
    if (employee === null) return;
    props.office.assignSingleJob(employee, e.target.value);
    props.rerender();
  }

  // Numeral.js formatter
  const nf = "0.000";

  // Employee stats (after applying multipliers)
  const effCre = emp ? emp.cre * corp.getEmployeeCreMultiplier() * division.getEmployeeCreMultiplier() : 0;
  const effCha = emp ? emp.cha * corp.getEmployeeChaMultiplier() * division.getEmployeeChaMultiplier() : 0;
  const effInt = emp ? emp.int * corp.getEmployeeIntMultiplier() * division.getEmployeeIntMultiplier() : 0;
  const effEff = emp ? emp.eff * corp.getEmployeeEffMultiplier() * division.getEmployeeEffMultiplier() : 0;

  return (
    <>
      <br />
      <Select value={employee !== null ? employee.name : ""} onChange={employeeSelectorOnChange}>
        {employees}
      </Select>
      {employee != null && (
        <Typography>
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
        </Typography>
      )}
      {employee != null && (
        <Select onChange={employeePositionSelectorOnChange} value={employeePositionSelectorInitialValue}>
          {employeePositions}
        </Select>
      )}
    </>
  );
}

interface IAutoAssignProps {
  office: OfficeSpace;
  job: string;
  desc: string;
  rerender: () => void;
}

function EmployeeCount(props: { num: number; next: number }): React.ReactElement {
  return (
    <Typography display="flex" alignItems="center" justifyContent="flex-end">
      {props.num === props.next ? null : props.num}
      {props.num === props.next ? null : <ArrowForwardIcon fontSize="inherit" />}
      {props.next}
    </Typography>
  );
}

function AutoAssignJob(props: IAutoAssignProps): React.ReactElement {
  const currJob = props.office.employeeJobs[props.job];
  const nextJob = props.office.employeeNextJobs[props.job];
  const nextUna = props.office.employeeNextJobs[EmployeePositions.Unassigned];

  function assignEmployee(): void {
    if (nextUna <= 0) {
      console.warn("Cannot assign employee. No unassigned employees available");
      return;
    }

    props.office.autoAssignJob(props.job, nextJob + 1);
    props.rerender();
  }

  function unassignEmployee(): void {
    props.office.autoAssignJob(props.job, nextJob - 1);
    props.rerender();
  }

  return (
    <TableRow>
      <TableCell>
        <Tooltip title={props.desc}>
          <Typography>{props.job}</Typography>
        </Tooltip>
      </TableCell>
      <TableCell>
        <EmployeeCount num={currJob} next={nextJob} />
      </TableCell>
      <TableCell width="1px">
        <IconButton disabled={nextUna === 0} onClick={assignEmployee}>
          <ArrowDropUpIcon />
        </IconButton>
      </TableCell>
      <TableCell width="1px">
        <IconButton disabled={nextJob === 0} onClick={unassignEmployee}>
          <ArrowDropDownIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

function AutoManagement(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const vechain = corp.unlockUpgrades[4] === 1; // Has Vechain upgrade

  // Calculate average morale, happiness,  energy, and salary.
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

  const currUna = props.office.employeeJobs[EmployeePositions.Unassigned];
  const nextUna = props.office.employeeNextJobs[EmployeePositions.Unassigned];

  return (
    <Table padding="none">
      <TableBody>
        <TableRow>
          <TableCell>
            <Typography>Unassigned Employees:</Typography>
          </TableCell>
          <TableCell>
            <EmployeeCount num={currUna} next={nextUna} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography>Avg Employee Morale:</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography>{numeralWrapper.format(avgMorale, "0.000")}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography>Avg Employee Happiness:</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography>{numeralWrapper.format(avgHappiness, "0.000")}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography>Avg Employee Energy:</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography>{numeralWrapper.format(avgEnergy, "0.000")}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography>Total Employee Salary:</Typography>
          </TableCell>
          <TableCell>
            <Typography align="right">
              <Money money={totalSalary} />
            </Typography>
          </TableCell>
        </TableRow>
        {vechain && (
          <>
            <TableRow>
              <TableCell>
                <Tooltip
                  title={
                    <Typography>
                      The base amount of material this office can produce. Does not include production multipliers from
                      upgrades and materials. This value is based off the productivity of your Operations, Engineering,
                      and Management employees
                    </Typography>
                  }
                >
                  <Typography>Material Production:</Typography>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Typography align="right">
                  {numeralWrapper.format(division.getOfficeProductivity(props.office), "0.000")}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Tooltip
                  title={
                    <Typography>
                      The base amount of any given Product this office can produce. Does not include production
                      multipliers from upgrades and materials. This value is based off the productivity of your
                      Operations, Engineering, and Management employees
                    </Typography>
                  }
                >
                  <Typography>Product Production:</Typography>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Typography align="right">
                  {numeralWrapper.format(
                    division.getOfficeProductivity(props.office, {
                      forProduct: true,
                    }),
                    "0.000",
                  )}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Tooltip
                  title={<Typography>The effect this office's 'Business' employees has on boosting sales</Typography>}
                >
                  <Typography> Business Multiplier:</Typography>
                </Tooltip>
              </TableCell>
              <TableCell align="right">
                <Typography>x{numeralWrapper.format(division.getBusinessFactor(props.office), "0.000")}</Typography>
              </TableCell>
            </TableRow>
          </>
        )}
        <AutoAssignJob
          rerender={props.rerender}
          office={props.office}
          job={EmployeePositions.Operations}
          desc={"Manages supply chain operations. Improves the amount of Materials and Products you produce."}
        />

        <AutoAssignJob
          rerender={props.rerender}
          office={props.office}
          job={EmployeePositions.Engineer}
          desc={
            "Develops and maintains products and production systems. Increases the quality of everything you produce. Also increases the amount you produce (not as much as Operations, however)"
          }
        />

        <AutoAssignJob
          rerender={props.rerender}
          office={props.office}
          job={EmployeePositions.Business}
          desc={"Handles sales and finances. Improves the amount of Materials and Products you can sell."}
        />

        <AutoAssignJob
          rerender={props.rerender}
          office={props.office}
          job={EmployeePositions.Management}
          desc={
            "Leads and oversees employees and office operations. Improves the effectiveness of Engineer and Operations employees."
          }
        />

        <AutoAssignJob
          rerender={props.rerender}
          office={props.office}
          job={EmployeePositions.RandD}
          desc={"Research new innovative ways to improve the company. Generates Scientific Research."}
        />

        <AutoAssignJob
          rerender={props.rerender}
          office={props.office}
          job={EmployeePositions.Training}
          desc={
            "Set employee to training, which will increase some of their stats. Employees in training do not affect any company operations."
          }
        />
      </TableBody>
    </Table>
  );
}

export function IndustryOffice(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const [upgradeOfficeSizeOpen, setUpgradeOfficeSizeOpen] = useState(false);
  const [throwPartyOpen, setThrowPartyOpen] = useState(false);
  const [employeeManualAssignMode, setEmployeeManualAssignMode] = useState(false);

  function autohireEmployeeButtonOnClick(): void {
    if (props.office.atCapacity()) return;
    props.office.hireRandomEmployee();
    props.rerender();
  }

  return (
    <Paper>
      <Typography>Office Space</Typography>
      <Typography>
        Size: {props.office.employees.length} / {props.office.size} employees
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr", width: "fit-content" }}>
        <Box sx={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <Tooltip title={<Typography>Automatically hires an employee and gives him/her a random name</Typography>}>
            <span>
              <Button disabled={props.office.atCapacity()} onClick={autohireEmployeeButtonOnClick}>
                Hire Employee
              </Button>
            </span>
          </Tooltip>
          <Tooltip title={<Typography>Upgrade the office's size so that it can hold more employees!</Typography>}>
            <span>
              <Button disabled={corp.funds < 0} onClick={() => setUpgradeOfficeSizeOpen(true)}>
                Upgrade size
              </Button>
            </span>
          </Tooltip>
          <UpgradeOfficeSizeModal
            rerender={props.rerender}
            office={props.office}
            open={upgradeOfficeSizeOpen}
            onClose={() => setUpgradeOfficeSizeOpen(false)}
          />

          {!division.hasResearch("AutoBrew") && (
            <>
              <Tooltip
                title={<Typography>Provide your employees with coffee, increasing their energy by 5%</Typography>}
              >
                <span>
                  <Button
                    disabled={corp.funds < props.office.getCoffeeCost() || props.office.coffeeMult > 0}
                    onClick={() => BuyCoffee(corp, props.office)}
                  >
                    {props.office.coffeeMult > 0 ? (
                      "Buying coffee..."
                    ) : (
                      <span>
                        Buy Coffee - <MoneyCost money={props.office.getCoffeeCost()} corp={corp} />
                      </span>
                    )}
                  </Button>
                </span>
              </Tooltip>
            </>
          )}

          {!division.hasResearch("AutoPartyManager") && (
            <>
              <Tooltip
                title={<Typography>Throw an office party to increase your employee's morale and happiness</Typography>}
              >
                <span>
                  <Button
                    disabled={corp.funds < 0 || props.office.partyMult > 0}
                    onClick={() => setThrowPartyOpen(true)}
                  >
                    {props.office.partyMult > 0 ? "Throwing Party..." : "Throw Party"}
                  </Button>
                </span>
              </Tooltip>
              <ThrowPartyModal
                rerender={props.rerender}
                office={props.office}
                open={throwPartyOpen}
                onClose={() => setThrowPartyOpen(false)}
              />
            </>
          )}
        </Box>
        <SwitchButton manualMode={employeeManualAssignMode} switchMode={setEmployeeManualAssignMode} />
      </Box>
      {employeeManualAssignMode ? (
        <ManualManagement rerender={props.rerender} office={props.office} />
      ) : (
        <AutoManagement rerender={props.rerender} office={props.office} />
      )}
    </Paper>
  );
}
