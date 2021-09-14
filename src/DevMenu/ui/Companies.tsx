import React, { useState } from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Button } from "../../ui/React/Button";
import { Select } from "../../ui/React/Select";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Companies as AllCompanies } from "../../Company/Companies";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ReplyAllIcon from "@material-ui/icons/ReplyAll";
import ReplyIcon from "@material-ui/icons/Reply";
import InputLabel from "@material-ui/core/InputLabel";
import { Adjuster } from "./Adjuster";

const bigNumber = 1e12;

interface IProps {
  player: IPlayer;
}

export function Companies(props: IProps): React.ReactElement {
  const [company, setCompany] = useState("ECorp");
  function setCompanyDropdown(event: React.ChangeEvent<{ value: unknown }>): void {
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
    for (const c in AllCompanies) {
      AllCompanies[c].playerReputation = bigNumber;
    }
  }

  function resetAllRepCompanies(): void {
    for (const c in AllCompanies) {
      AllCompanies[c].playerReputation = 0;
    }
  }

  function tonsOfFavorCompanies(): void {
    for (const c in AllCompanies) {
      AllCompanies[c].favor = bigNumber;
    }
  }

  function resetAllFavorCompanies(): void {
    for (const c in AllCompanies) {
      AllCompanies[c].favor = 0;
    }
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Companies</h2>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <span className="text">Company:</span>
              </td>
              <td colSpan={3}>
                <Select id="dev-companies-dropdown" className="dropdown" onChange={setCompanyDropdown} value={company}>
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
                <span className="text">Reputation:</span>
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
                <span className="text">Favor:</span>
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
                <span className="text">All Reputation:</span>
              </td>
              <td>
                <Button onClick={tonsOfRepCompanies}>Tons</Button>
                <Button onClick={resetAllRepCompanies}>Reset</Button>
              </td>
            </tr>
            <tr>
              <td>
                <span className="text">All Favor:</span>
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
