// React Component for displaying an Industry's OfficeSpace information
// (bottom-left panel in the Industry UI)
import React, { useState } from "react";

import { OfficeSpace } from "../OfficeSpace";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import { TableCell } from "../../ui/React/Table";
import { Box } from "@mui/material";

interface IProps {
  office: OfficeSpace;
  rerender: () => void;
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
            <Typography>{numeralWrapper.format(props.office.avgMor, "0.000")}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography>Avg Employee Happiness:</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography>{numeralWrapper.format(props.office.avgHap, "0.000")}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography>Avg Employee Energy:</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography>{numeralWrapper.format(props.office.avgEne, "0.000")}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography>Avg Employee Experience:</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography>
              {numeralWrapper.format(props.office.totalExp / props.office.totalEmployees || 0, "0.000")}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Typography>Total Employee Salary:</Typography>
          </TableCell>
          <TableCell>
            <Typography align="right">
              <Money money={props.office.totalSalary} />
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

  function autohireEmployeeButtonOnClick(): void {
    if (props.office.atCapacity()) return;
    props.office.hireRandomEmployee(EmployeePositions.Unassigned);
    props.rerender();
  }

  return (
    <Paper>
      <Typography>Office Space</Typography>
      <Typography>
        Size: {props.office.totalEmployees} / {props.office.size} employees
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr", width: "fit-content" }}>
        <Box sx={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <Tooltip title={<Typography>Hires an employee</Typography>}>
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
      </Box>
      <AutoManagement rerender={props.rerender} office={props.office} />
    </Paper>
  );
}
