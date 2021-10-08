import React from "react";

import { staneksGift } from "../../CotMG/Helper";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import { Adjuster } from "./Adjuster";

export function Stanek(): React.ReactElement {
  function addCycles(): void {
    staneksGift.storedCycles = 1e6;
  }

  function modCycles(modify: number): (x: number) => void {
    return function (cycles: number): void {
      staneksGift.storedCycles += cycles * modify;
    };
  }

  function resetCycles(): void {
    staneksGift.storedCycles = 0;
  }

  function addCharge(): void {
    staneksGift.fragments.forEach((f) => (f.charge = 1e21));
  }

  function modCharge(modify: number): (x: number) => void {
    return function (cycles: number): void {
      staneksGift.fragments.forEach((f) => (f.charge += cycles * modify));
    };
  }

  function resetCharge(): void {
    staneksGift.fragments.forEach((f) => (f.charge = 0));
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Stanek's Gift</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Adjuster
                  label="cycles"
                  placeholder="amt"
                  tons={addCycles}
                  add={modCycles(1)}
                  subtract={modCycles(-1)}
                  reset={resetCycles}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Adjuster
                  label="all charge"
                  placeholder="amt"
                  tons={addCharge}
                  add={modCharge(1)}
                  subtract={modCharge(-1)}
                  reset={resetCharge}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
