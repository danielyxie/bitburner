import React, { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Player } from "@player";
import { Programs as AllPrograms } from "../../Programs/Programs";
import MenuItem from "@mui/material/MenuItem";

export function Programs(): React.ReactElement {
  const [program, setProgram] = useState("NUKE.exe");
  function setProgramDropdown(event: SelectChangeEvent<string>): void {
    setProgram(event.target.value);
  }
  function addProgram(): void {
    if (!Player.hasProgram(program)) {
      Player.getHomeComputer().programs.push(program);
    }
  }

  function addAllPrograms(): void {
    for (const i of Object.keys(AllPrograms)) {
      if (!Player.hasProgram(AllPrograms[i].name)) {
        Player.getHomeComputer().programs.push(AllPrograms[i].name);
      }
    }
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Programs</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Typography>Program:</Typography>
              </td>
              <td>
                <Select onChange={setProgramDropdown} value={program}>
                  {Object.values(AllPrograms).map((program) => (
                    <MenuItem key={program.name} value={program.name}>
                      {program.name}
                    </MenuItem>
                  ))}
                </Select>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Add:</Typography>
              </td>
              <td>
                <Button onClick={addProgram}>One</Button>
                <Button onClick={addAllPrograms}>All</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
