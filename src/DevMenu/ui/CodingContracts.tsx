import React, { useState } from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Button } from "../../ui/React/Button";
import { Select } from "../../ui/React/Select";
import { PlayerOwnedSourceFile } from "../../SourceFile/PlayerOwnedSourceFile";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { generateContract, generateRandomContract, generateRandomContractOnHome } from "../../CodingContractGenerator";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import MenuItem from "@material-ui/core/MenuItem";
import { CodingContractTypes } from "../../CodingContracts";

// Update as additional BitNodes get implemented
const validSFN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const bigNumber = 1e27;

interface IProps {
  player: IPlayer;
}

export function CodingContracts(props: IProps): React.ReactElement {
  const [codingcontract, setCodingcontract] = useState("Find Largest Prime Factor");
  function setCodingcontractDropdown(event: React.ChangeEvent<{ value: unknown }>): void {
    setCodingcontract(event.target.value as string);
  }

  function specificContract(): void {
    generateContract({
      problemType: codingcontract,
      server: "home",
    });
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Coding Contracts</h2>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Button onClick={generateRandomContract}>Generate Random Contract</Button>
                <Button onClick={generateRandomContractOnHome}>Generate Random Contract on Home Comp</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Select
                  id="contract-types-dropdown"
                  className="dropdown"
                  onChange={setCodingcontractDropdown}
                  value={codingcontract}
                >
                  {Object.values(CodingContractTypes).map((cc) => (
                    <MenuItem key={cc.name} value={cc.name}>
                      {cc.name}
                    </MenuItem>
                  ))}
                </Select>
                <Button onClick={specificContract}>Generate Specified Contract Type on Home Comp</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
