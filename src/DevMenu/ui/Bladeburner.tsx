import React from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Adjuster } from "./Adjuster";
import { IPlayer } from "../../PersonObjects/IPlayer";

const bigNumber = 1e27;

interface IProps {
  player: IPlayer;
}

export function Bladeburner(props: IProps): React.ReactElement {
  function modifyBladeburnerRank(modify: number): (x: number) => void {
    return function (rank: number): void {
      if (props.player.bladeburner) {
        props.player.bladeburner.changeRank(props.player, rank * modify);
      }
    };
  }

  function resetBladeburnerRank(): void {
    props.player.bladeburner.rank = 0;
    props.player.bladeburner.maxRank = 0;
  }

  function addTonsBladeburnerRank(): void {
    if (props.player.bladeburner) {
      props.player.bladeburner.changeRank(props.player, bigNumber);
    }
  }

  function modifyBladeburnerCycles(modify: number): (x: number) => void {
    return function (cycles: number): void {
      if (props.player.bladeburner) {
        props.player.bladeburner.storedCycles += cycles * modify;
      }
    };
  }

  function resetBladeburnerCycles(): void {
    if (props.player.bladeburner) {
      props.player.bladeburner.storedCycles = 0;
    }
  }

  function addTonsBladeburnerCycles(): void {
    if (props.player.bladeburner) {
      props.player.bladeburner.storedCycles += bigNumber;
    }
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Bladeburner</h2>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <span className="text">Rank:</span>
              </td>
              <td>
                <Adjuster
                  label="rank"
                  placeholder="amt"
                  tons={addTonsBladeburnerRank}
                  add={modifyBladeburnerRank(1)}
                  subtract={modifyBladeburnerRank(-1)}
                  reset={resetBladeburnerRank}
                />
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
                  tons={addTonsBladeburnerCycles}
                  add={modifyBladeburnerCycles(1)}
                  subtract={modifyBladeburnerCycles(-1)}
                  reset={resetBladeburnerCycles}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
