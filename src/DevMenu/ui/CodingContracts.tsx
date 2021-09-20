import React, { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { generateContract, generateRandomContract, generateRandomContractOnHome } from "../../CodingContractGenerator";
import { CodingContractTypes } from "../../CodingContracts";

export function CodingContracts(): React.ReactElement {
  const [codingcontract, setCodingcontract] = useState("Find Largest Prime Factor");
  function setCodingcontractDropdown(event: SelectChangeEvent<string>): void {
    setCodingcontract(event.target.value as string);
  }

  function specificContract(): void {
    generateContract({
      problemType: codingcontract,
      server: "home",
    });
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
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
