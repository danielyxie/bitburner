import React, { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Tooltip } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import { IPlayer } from "../../PersonObjects/IPlayer";
import { achievements } from "../../Achievements/Achievements";
import { IEngine } from "../../IEngine";

interface IProps {
  player: IPlayer;
  engine: IEngine;
}

export function Achievements(props: IProps): React.ReactElement {
  const [playerAchievement, setPlayerAchievements] = useState(props.player.achievements.map(m => m.ID));

  function grantAchievement(id: string): void {
    props.player.giveAchievement(id);
    setPlayerAchievements(props.player.achievements.map(m => m.ID));
  }

  function grantAllAchievements(): void {
    Object.values(achievements).forEach(a => props.player.giveAchievement(a.ID));
    setPlayerAchievements(props.player.achievements.map(m => m.ID));
  }

  function removeAchievement(id: string): void {
    props.player.achievements = props.player.achievements.filter(a => a.ID !== id);
    setPlayerAchievements(props.player.achievements.map(m => m.ID));
  }

  function clearAchievements(): void {
    props.player.achievements = [];
    setPlayerAchievements(props.player.achievements.map(m => m.ID));
  }

  function disableEngine(): void {
    props.engine.Counters.achievementsCounter = Number.MAX_VALUE;
  }

  function enableEngine(): void {
    props.engine.Counters.achievementsCounter = 0
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Achievements</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
              </td>
              <td>
                <Typography>Achievements:</Typography>
              </td>
              <td>
                <ButtonGroup>
                  <Button onClick={grantAllAchievements}>Grant All</Button>
                  <Button onClick={clearAchievements}>Clear</Button>
                  <Button onClick={disableEngine}>Disable Engine</Button>
                  <Button onClick={enableEngine}>Enable Engine</Button>
                </ButtonGroup>
              </td>
            </tr>
            {Object.values(achievements).map((i) => {
              const achieved = playerAchievement.includes(i.ID);
              return <tr key={"ach-" + i.ID}>
                <td>
                  {achieved ? (
                    <Tooltip title="Achieved">
                      <LockOpenIcon color="primary" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Locked">
                      <LockIcon color="secondary" />
                    </Tooltip>
                  )}
                </td>
                <td>
                  <Tooltip title={<>{i.ID}<br />{i.Description}</>}>
                    <Typography color={achieved ? 'primary': 'secondary'}>{i.Name}:</Typography>
                  </Tooltip>
                </td>
                <td>
                  <ButtonGroup>
                    <Button onClick={() => grantAchievement(i.ID)}>Grant</Button>
                    <Button onClick={() => removeAchievement(i.ID)}>Clear</Button>
                  </ButtonGroup>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
