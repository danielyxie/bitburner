import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Adjuster } from "./Adjuster";
import { Player } from "@player";

const bigNumber = 1e27;

export function Corporation(): React.ReactElement {
  function addTonsCorporationFunds(): void {
    if (Player.corporation) {
      Player.corporation.funds = Player.corporation.funds + bigNumber;
    }
  }

  function modifyCorporationFunds(modify: number): (x: number) => void {
    return function (funds: number): void {
      if (Player.corporation) {
        Player.corporation.funds += funds * modify;
      }
    };
  }

  function resetCorporationFunds(): void {
    if (Player.corporation) {
      Player.corporation.funds = Player.corporation.funds - Player.corporation.funds;
    }
  }

  function addTonsCorporationCycles(): void {
    if (Player.corporation) {
      Player.corporation.storedCycles = bigNumber;
    }
  }

  function modifyCorporationCycles(modify: number): (x: number) => void {
    return function (cycles: number): void {
      if (Player.corporation) {
        Player.corporation.storedCycles += cycles * modify;
      }
    };
  }

  function resetCorporationCycles(): void {
    if (Player.corporation) {
      Player.corporation.storedCycles = 0;
    }
  }

  function finishCorporationProducts(): void {
    if (!Player.corporation) return;
    Player.corporation.divisions.forEach((div) => {
      Object.keys(div.products).forEach((prod) => {
        const product = div.products[prod];
        if (product === undefined) throw new Error("Impossible product undefined");
        product.prog = 99.9;
      });
    });
  }

  function addCorporationResearch(): void {
    if (!Player.corporation) return;
    Player.corporation.divisions.forEach((div) => {
      div.sciResearch += 1e10;
    });
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Corporation</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Typography>Funds:</Typography>
              </td>
              <td>
                <Adjuster
                  label="set funds"
                  placeholder="amt"
                  tons={addTonsCorporationFunds}
                  add={modifyCorporationFunds(1)}
                  subtract={modifyCorporationFunds(-1)}
                  reset={resetCorporationFunds}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Cycles:</Typography>
              </td>
              <td>
                <Adjuster
                  label="cycles"
                  placeholder="amt"
                  tons={addTonsCorporationCycles}
                  add={modifyCorporationCycles(1)}
                  subtract={modifyCorporationCycles(-1)}
                  reset={resetCorporationCycles}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Button onClick={finishCorporationProducts}>Finish products</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Button onClick={addCorporationResearch}>Tons of research</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
