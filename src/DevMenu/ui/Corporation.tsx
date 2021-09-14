import React from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Button from "@material-ui/core/Button";
import { Adjuster } from "./Adjuster";
import { IPlayer } from "../../PersonObjects/IPlayer";

const bigNumber = 1e27;

interface IProps {
  player: IPlayer;
}

export function Corporation(props: IProps): React.ReactElement {
  function addTonsCorporationFunds(): void {
    if (props.player.corporation) {
      props.player.corporation.funds = props.player.corporation.funds.plus(1e99);
    }
  }

  function resetCorporationFunds(): void {
    if (props.player.corporation) {
      props.player.corporation.funds = props.player.corporation.funds.minus(props.player.corporation.funds);
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
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Corporation</h2>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Button onClick={addTonsCorporationFunds}>Tons of funds</Button>
                <Button onClick={resetCorporationFunds}>Reset funds</Button>
              </td>
            </tr>
            <tr>
              <td>
                <span className="text">Cycles:</span>
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
