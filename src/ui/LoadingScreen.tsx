import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { Terminal } from "../Terminal";
import { Engine } from "../engine";
import { Player } from "../Player";
import { GameRoot } from "./GameRoot";

import { CONSTANTS } from "../Constants";

function load(cb: () => void): void {
  if (!window.indexedDB) {
    return Engine.load(""); // Will try to load from localstorage
  }

  /**
   * DB is called bitburnerSave
   * Object store is called savestring
   * key for the Object store is called save
   */
  // Version 1 is important
  const indexedDbRequest: IDBOpenDBRequest = window.indexedDB.open("bitburnerSave", 1);

  indexedDbRequest.onerror = function (this: IDBRequest<IDBDatabase>, ev: Event) {
    console.error("Error opening indexedDB: ");
    console.error(ev);
    Engine.load(""); // Try to load from localstorage
    cb();
  };

  indexedDbRequest.onsuccess = function (this: IDBRequest<IDBDatabase>) {
    Engine.indexedDb = this.result;
    const transaction = Engine.indexedDb.transaction(["savestring"]);
    const objectStore = transaction.objectStore("savestring");
    const request: IDBRequest<string> = objectStore.get("save");
    request.onerror = function (this: IDBRequest<string>, ev: Event) {
      console.error("Error in Database request to get savestring: " + ev);
      Engine.load(""); // Try to load from localstorage
      cb();
    };

    request.onsuccess = function (this: IDBRequest<string>) {
      Engine.load(this.result);
      cb();
    };
  };

  // This is called when there's no db to begin with. It's important.
  indexedDbRequest.onupgradeneeded = function (this: IDBRequest<IDBDatabase>) {
    const db = this.result;
    db.createObjectStore("savestring");
  };
}

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
