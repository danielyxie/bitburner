import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import type { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import React, { useEffect, useState } from "react";

import { CONSTANTS } from "../Constants";
import { load } from "../db";
import { pushGameReady } from "../Electron";
import { Engine } from "../engine";
import { hash } from "../hash/hash";
import { Player } from "../Player";
import { Terminal } from "../Terminal";

import { GameRoot } from "./GameRoot";
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

  const version = `v${CONSTANTS.VersionString} (${hash()})`;
  if (process.env.NODE_ENV === "development") {
    document.title = `[dev] Bitburner ${version}`;
  } else {
    document.title = `Bitburner ${version}`;
  }

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

          pushGameReady();
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
            <Typography variant="h3">Loading Bitburner {version}</Typography>
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
