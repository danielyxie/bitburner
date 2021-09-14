import React from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Button } from "../../ui/React/Button";
import { PlayerOwnedSourceFile } from "../../SourceFile/PlayerOwnedSourceFile";
import { IPlayer } from "../../PersonObjects/IPlayer";
import ButtonGroup from "@material-ui/core/ButtonGroup";

// Update as additional BitNodes get implemented
const validSFN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const bigNumber = 1e27;

interface IProps {
  player: IPlayer;
}

export function Sleeves(props: IProps): React.ReactElement {
  function sleeveMaxAllShock(): void {
    for (let i = 0; i < props.player.sleeves.length; ++i) {
      props.player.sleeves[i].shock = 0;
    }
  }

  function sleeveClearAllShock(): void {
    for (let i = 0; i < props.player.sleeves.length; ++i) {
      props.player.sleeves[i].shock = 100;
    }
  }

  function sleeveSyncMaxAll(): void {
    for (let i = 0; i < props.player.sleeves.length; ++i) {
      props.player.sleeves[i].sync = 100;
    }
  }

  function sleeveSyncClearAll(): void {
    for (let i = 0; i < props.player.sleeves.length; ++i) {
      props.player.sleeves[i].sync = 0;
    }
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Sleeves</h2>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <span className="text">Shock:</span>
              </td>
              <td>
                <Button onClick={sleeveMaxAllShock}>Max all</Button>
              </td>
              <td>
                <Button onClick={sleeveClearAllShock}>Clear all</Button>
              </td>
            </tr>
            <tr>
              <td>
                <span className="text">Sync:</span>
              </td>
              <td>
                <Button onClick={sleeveSyncMaxAll}>Max all</Button>
              </td>
              <td>
                <Button onClick={sleeveSyncClearAll}>Clear all</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
