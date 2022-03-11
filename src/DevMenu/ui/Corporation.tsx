import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Adjuster } from "./Adjuster";
import { IPlayer } from "../../PersonObjects/IPlayer";

const bigNumber = 1e27;

interface IProps {
  player: IPlayer;
}

export function Corporation(props: IProps): React.ReactElement {
  function addTonsCorporationFunds(): void {
    if (props.player.corporation) {
      props.player.corporation.funds = props.player.corporation.funds + bigNumber;
    }
  }

  function modifyCorporationFunds(modify: number): (x: number) => void {
    return function (funds: number): void {
      if (props.player.corporation) {
        props.player.corporation.funds += funds * modify;
      }
    };
  }

  function resetCorporationFunds(): void {
    if (props.player.corporation) {
      props.player.corporation.funds = props.player.corporation.funds - props.player.corporation.funds;
    }
  }

  function addTonsCorporationCycles(): void {
    if (props.player.corporation) {
      props.player.corporation.storedCycles = bigNumber;
    }
  }

  function modifyCorporationCycles(modify: number): (x: number) => void {
    return function (cycles: number): void {
      if (props.player.corporation) {
        props.player.corporation.storedCycles += cycles * modify;
      }
    };
  }

  function resetCorporationCycles(): void {
    if (props.player.corporation) {
      props.player.corporation.storedCycles = 0;
    }
  }

  function finishCorporationProducts(): void {
    if (!props.player.corporation) return;
    props.player.corporation.divisions.forEach((div) => {
      Object.keys(div.products).forEach((prod) => {
        const product = div.products[prod];
        if (product === undefined) throw new Error("Impossible product undefined");
        product.prog = 99.9;
      });
    });
  }

  function addCorporationResearch(): void {
    if (!props.player.corporation) return;
    props.player.corporation.divisions.forEach((div) => {
      div.sciResearch.qty += 1e10;
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
