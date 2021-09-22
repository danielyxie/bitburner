import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { Terminal } from "../Terminal";
import { load } from "../db";
import { Player } from "../Player";
import { Engine } from "../engine";
import { GameRoot } from "./GameRoot";

import { CONSTANTS } from "../Constants";

export function LoadingScreen(): React.ReactElement {
  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!loaded) setShow(true);
    }, 2000);
    return () => clearTimeout(id);
  });

  useEffect(() => {
    async function doLoad() {
      await load()
        .then((saveString) => {
          Engine.load(saveString);
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
