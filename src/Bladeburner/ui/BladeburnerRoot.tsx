import React, { useState, useEffect } from "react";
import { Stats } from "./Stats";
import { Console } from "./Console";
import { AllPages } from "./AllPages";

import { use } from "../../ui/Context";
import Box from "@mui/material/Box";

export function BladeburnerRoot(): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);

  const bladeburner = player.bladeburner;
  if (bladeburner === null) return <></>;
  return (
    <Box display="flex" flexDirection="column">
      <Box sx={{ display: "grid", gridTemplateColumns: "4fr 8fr", p: 1 }}>
        <Stats bladeburner={bladeburner} player={player} router={router} />
        <Console bladeburner={bladeburner} player={player} />
      </Box>

      <AllPages bladeburner={bladeburner} player={player} />
    </Box>
  );
}
