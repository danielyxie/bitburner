import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import { EventLogObject as EventLog, getDummyData } from "../../EventLog/EventLog";

export function EventLogDev(): React.ReactElement {
  function wipeLogs(): void {
    EventLog.clear();
  }

  function addDummy(): void {
    EventLog.setEntries(getDummyData());
  }

  function addSpam(): void {
    let n = 1;
    setInterval(() => {
      EventLog.addItem(`Entry #${n}`);
      n++;
    }, 2000);
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Event Log</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td></td>
              <td>
                <Typography>Achievements:</Typography>
              </td>
              <td>
                <ButtonGroup>
                  <Button onClick={wipeLogs}>Wipe All</Button>
                  <Button onClick={addDummy}>Set Dummy</Button>
                  <Button onClick={addSpam}>Spam Events</Button>
                </ButtonGroup>
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
