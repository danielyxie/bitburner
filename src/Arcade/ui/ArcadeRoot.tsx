import React, { useState } from "react";
import { BBCabinetRoot } from "./BBCabinet";

import Button from "@mui/material/Button";
import { Player } from "../../Player";
import { AlertEvents } from "../../ui/React/AlertManager";

enum Page {
  None,
  Megabyteburner2000,
}

export function ArcadeRoot(): React.ReactElement {
  const [page, setPage] = useState(Page.None);

  function mbBurner2000(): void {
    if (Player.sourceFileLvl(1) === 0) {
      AlertEvents.emit("This machine is broken.");
    } else {
      setPage(Page.Megabyteburner2000);
    }
  }

  if (page === Page.None) {
    return (
      <>
        <Button onClick={mbBurner2000}>Megabyte burner 2000</Button>
      </>
    );
  }
  let currentGame = <></>;
  switch (page) {
    case Page.Megabyteburner2000:
      currentGame = <BBCabinetRoot />;
  }
  return (
    <>
      <Button onClick={() => setPage(Page.None)}>Back</Button>
      {currentGame}
    </>
  );
}
