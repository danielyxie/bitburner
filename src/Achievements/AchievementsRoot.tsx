import React from "react";

import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import { Theme } from "@mui/material/styles";

import { AchievementList } from "./AchievementList";
import { achievements } from "./Achievements";
import { Typography } from "@mui/material";
import { Player } from "@player";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 50,
      padding: theme.spacing(2),
      userSelect: "none",
    },
  }),
);

export function AchievementsRoot(): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.root} style={{ width: "90%" }}>
      <Typography variant="h4">Achievements</Typography>
      <AchievementList achievements={Object.values(achievements)} playerAchievements={Player.achievements} />
    </div>
  );
}
