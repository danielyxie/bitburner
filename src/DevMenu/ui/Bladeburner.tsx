import React from "react";

import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Adjuster } from "./Adjuster";
import { IPlayer } from "../../PersonObjects/IPlayer";

const bigNumber = 1e27;

interface IProps {
  player: IPlayer;
}

export function Bladeburner(props: IProps): React.ReactElement {
  const bladeburner = props.player.bladeburner;
  if (bladeburner === null) return <></>;
  function modifyBladeburnerRank(modify: number): (x: number) => void {
    return function (rank: number): void {
      if (!bladeburner) return;
      bladeburner.changeRank(props.player, rank * modify);
    };
  }

  function resetBladeburnerRank(): void {
    if (!bladeburner) return;
    bladeburner.rank = 0;
    bladeburner.maxRank = 0;
  }

  function addTonsBladeburnerRank(): void {
    if (!bladeburner) return;

    bladeburner.changeRank(props.player, bigNumber);
  }

  function modifyBladeburnerCycles(modify: number): (x: number) => void {
    return function (cycles: number): void {
      if (!bladeburner) return;
      bladeburner.storedCycles += cycles * modify;
    };
  }

  function resetBladeburnerCycles(): void {
    if (!bladeburner) return;
    bladeburner.storedCycles = 0;
  }

  function addTonsBladeburnerCycles(): void {
    if (!bladeburner) return;
    bladeburner.storedCycles += bigNumber;
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Bladeburner</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Typography>Rank:</Typography>
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
                <Typography>Cycles:</Typography>
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
