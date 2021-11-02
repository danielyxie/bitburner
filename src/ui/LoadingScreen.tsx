import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";

import { Terminal } from "../Terminal";
import { load } from "../db";
import { Player } from "../Player";
import { Engine } from "../engine";
import { GameRoot } from "./GameRoot";

import { CONSTANTS } from "../Constants";
import { ActivateRecoveryMode } from "./React/RecoveryRoot";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.colors.backgroundprimary,
    },
  }),
);

export function LoadingScreen(): React.ReactElement {
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!loaded) setShow(true);
    }, 2000);
    return () => clearTimeout(id);
  });

  useEffect(() => {
    async function doLoad(): Promise<void> {
      await load()
        .then((saveString) => {
          try {
            Engine.load(saveString);
          } catch (err: any) {
            ActivateRecoveryMode();
            setLoaded(true);
            throw err;
          }

          setLoaded(true);
        })
        .catch((reason) => {
          console.error(reason);
          Engine.load("");
          setLoaded(true);
        });
    }
    doLoad();
  }, []);

  return (
    <Box className={classes.root}>
      {loaded ? (
        <GameRoot terminal={Terminal} engine={Engine} player={Player} />
      ) : (
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
      )}
    </Box>
  );
}
