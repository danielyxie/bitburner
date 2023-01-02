import { IPlayer } from "../../PersonObjects/IPlayer";
import { Milestones } from "../Milestones";
import { Milestone } from "../Milestone";
import * as React from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface IProps {
  player: IPlayer;
}

function highestMilestone(p: IPlayer, milestones: Milestone[]): number {
  let n = -1;
  for (let i = 0; i < milestones.length; i++) {
    if (milestones[i].fulfilled(p)) n = i;
  }

  return n;
}

export function MilestonesRoot(props: IProps): JSX.Element {
  const n = highestMilestone(props.player, Milestones);
  const milestones = Milestones.map((milestone: Milestone, i: number) => {
    if (i <= n + 1) {
      return (
        <Typography key={i}>
          [{milestone.fulfilled(props.player) ? "x" : " "}] {milestone.title}
        </Typography>
      );
    }
  });
  return (
    <>
      <Typography variant="h4">Milestones</Typography>
      <Box mx={2}>
        <Typography>
          Milestones don't reward you for completing them. They are here to guide you if you're lost. They will reset
          when you install Augmentations.
        </Typography>
        <br />

        <Typography>Completing fl1ght.exe</Typography>
        {milestones}
      </Box>
    </>
  );
}
