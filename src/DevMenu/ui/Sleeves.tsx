import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { IPlayer } from "../../PersonObjects/IPlayer";

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
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Sleeves</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Typography>Shock:</Typography>
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
                <Typography>Sync:</Typography>
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
