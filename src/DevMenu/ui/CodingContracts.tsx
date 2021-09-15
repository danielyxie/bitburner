import React, { useState } from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { generateContract, generateRandomContract, generateRandomContractOnHome } from "../../CodingContractGenerator";
import { CodingContractTypes } from "../../CodingContracts";

export function CodingContracts(): React.ReactElement {
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
                <Select onChange={setCodingcontractDropdown} value={codingcontract}>
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
