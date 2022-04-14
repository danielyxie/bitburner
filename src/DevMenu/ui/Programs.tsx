import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

import type { IPlayer } from "../../PersonObjects/IPlayer";
import { Programs as AllPrograms } from "../../Programs/Programs";

interface IProps {
  player: IPlayer;
}

export function Programs(props: IProps): React.ReactElement {
  const [program, setProgram] = useState("NUKE.exe");
  function setProgramDropdown(event: SelectChangeEvent<string>): void {
    setProgram(event.target.value as string);
  }
  function addProgram(): void {
    if (!props.player.hasProgram(program)) {
      props.player.getHomeComputer().programs.push(program);
    }
  }

  function addAllPrograms(): void {
    for (const i of Object.keys(AllPrograms)) {
      if (!props.player.hasProgram(AllPrograms[i].name)) {
        props.player.getHomeComputer().programs.push(AllPrograms[i].name);
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
