import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Theme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";

import { Terminal } from "../Terminal";
import { Engine } from "../engine";
import { Player } from "../Player";
import { GameRoot } from "./GameRoot";

import { CONSTANTS } from "../Constants";

import { load } from "../engine";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    center: {
      position: "fixed",
      top: "50%",
      left: "50%",
    },
  }),
);

export function LoadingScreen(): React.ReactElement {
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);

  console.log("renredering");
  useEffect(() => {
    const id = setTimeout(() => {
      if (!loaded) setShow(true);
    }, 2000);
    return () => clearTimeout(id);
  });

  useEffect(() => {
    load(() => {
      setLoaded(true);
    });
  }, []);

  if (loaded) {
    return <GameRoot terminal={Terminal} engine={Engine} player={Player} />;
  }

  return (
    <Grid container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
      <Grid item>
        <CircularProgress size={150} color="primary" />
      </Grid>
      <Grid item>
        <Typography variant="h3">Loading Bitburner v{CONSTANTS.Version}</Typography>
      </Grid>
      {show && (
        <Grid item>
          <Typography>
            If the game fails to load, consider <a href="?noScripts">killing all scripts</a>
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
