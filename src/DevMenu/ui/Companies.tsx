import React, { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Companies as AllCompanies } from "../../Company/Companies";
import MenuItem from "@mui/material/MenuItem";
import { Adjuster } from "./Adjuster";
import { FactionNames } from "../../Faction/data/FactionNames";

const bigNumber = 1e12;

export function Companies(): React.ReactElement {
  const [company, setCompany] = useState(FactionNames.ECorp as string);
  function setCompanyDropdown(event: SelectChangeEvent<string>): void {
    setCompany(event.target.value as string);
  }
  function resetCompanyRep(): void {
    AllCompanies[company].playerReputation = 0;
  }

  function modifyCompanyRep(modifier: number): (x: number) => void {
    return function (reputation: number): void {
      const c = AllCompanies[company];
      if (c != null && !isNaN(reputation)) {
        c.playerReputation += reputation * modifier;
      }
    };
  }

  function modifyCompanyFavor(modifier: number): (x: number) => void {
    return function (favor: number): void {
      const c = AllCompanies[company];
      if (c != null && !isNaN(favor)) {
        c.favor += favor * modifier;
      }
    };
  }

  function resetCompanyFavor(): void {
    AllCompanies[company].favor = 0;
  }

  function tonsOfRepCompanies(): void {
    for (const c of Object.keys(AllCompanies)) {
      AllCompanies[c].playerReputation = bigNumber;
    }
  }

  function resetAllRepCompanies(): void {
    for (const c of Object.keys(AllCompanies)) {
      AllCompanies[c].playerReputation = 0;
    }
  }

  function tonsOfFavorCompanies(): void {
    for (const c of Object.keys(AllCompanies)) {
      AllCompanies[c].favor = bigNumber;
    }
  }

  function resetAllFavorCompanies(): void {
    for (const c of Object.keys(AllCompanies)) {
      AllCompanies[c].favor = 0;
    }
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Companies</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Typography>Company:</Typography>
              </td>
              <td colSpan={3}>
                <Select id="dev-companies-dropdown" onChange={setCompanyDropdown} value={company}>
                  {Object.values(AllCompanies).map((company) => (
                    <MenuItem key={company.name} value={company.name}>
                      {company.name}
                    </MenuItem>
                  ))}
                </Select>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Reputation:</Typography>
              </td>
              <td>
                <Adjuster
                  label="reputation"
                  placeholder="amt"
                  tons={() => modifyCompanyRep(1)(bigNumber)}
                  add={modifyCompanyRep(1)}
                  subtract={modifyCompanyRep(-1)}
                  reset={resetCompanyRep}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Favor:</Typography>
              </td>
              <td>
                <Adjuster
                  label="favor"
                  placeholder="amt"
                  tons={() => modifyCompanyFavor(1)(2000)}
                  add={modifyCompanyFavor(1)}
                  subtract={modifyCompanyFavor(-1)}
                  reset={resetCompanyFavor}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Typography>All Reputation:</Typography>
              </td>
              <td>
                <Button onClick={tonsOfRepCompanies}>Tons</Button>
                <Button onClick={resetAllRepCompanies}>Reset</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>All Favor:</Typography>
              </td>
              <td>
                <Button onClick={tonsOfFavorCompanies}>Tons</Button>
                <Button onClick={resetAllFavorCompanies}>Reset</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
