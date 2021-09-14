import React from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Button } from "../../ui/React/Button";
import { Adjuster } from "./Adjuster";
import { IPlayer } from "../../PersonObjects/IPlayer";

const bigNumber = 1e27;

interface IProps {
  player: IPlayer;
}

export function Gang(props: IProps): React.ReactElement {
  function addTonsGangCycles(): void {
    if (props.player.gang) {
      props.player.gang.storedCycles = bigNumber;
    }
  }

  function modifyGangCycles(modify: number): (x: number) => void {
    return function (cycles: number): void {
      if (props.player.gang) {
        props.player.gang.storedCycles += cycles * modify;
      }
    };
  }

  function resetGangCycles(): void {
    if (props.player.gang) {
      props.player.gang.storedCycles = 0;
    }
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Gang</h2>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <span className="text">Cycles:</span>
              </td>
              <td>
                <Adjuster
                  label="cycles"
                  placeholder="amt"
                  tons={addTonsGangCycles}
                  add={modifyGangCycles(1)}
                  subtract={modifyGangCycles(-1)}
                  reset={resetGangCycles}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
