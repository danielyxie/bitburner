/**
 * React Component for all the gang stuff.
 */
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useEffect, useState } from "react";

import { use } from "../../ui/Context";

import { Context } from "./Context";
import { EquipmentsSubpage } from "./EquipmentsSubpage";
import { ManagementSubpage } from "./ManagementSubpage";
import { TerritorySubpage } from "./TerritorySubpage";

export function GangRoot(): React.ReactElement {
  const player = use.Player();
  const gang = (function () {
    if (player.gang === null) throw new Error("Gang should not be null");
    return player.gang;
  })();
  const [value, setValue] = React.useState(0);

  function handleChange(event: React.SyntheticEvent, tab: number): void {
    setValue(tab);
  }

  const setRerender = useState(false)[1];

  useEffect(() => {
    const id = setInterval(() => setRerender((old) => !old), 200);
    return () => clearInterval(id);
  }, []);

  return (
    <Context.Gang.Provider value={gang}>
      <Tabs variant="fullWidth" value={value} onChange={handleChange} sx={{ minWidth: "fit-content", maxWidth: "45%" }}>
        <Tab label="Management" />
        <Tab label="Equipment" />
        <Tab label="Territory" />
      </Tabs>
      {value === 0 && <ManagementSubpage />}
      {value === 1 && <EquipmentsSubpage />}
      {value === 2 && <TerritorySubpage />}
    </Context.Gang.Provider>
  );
}
