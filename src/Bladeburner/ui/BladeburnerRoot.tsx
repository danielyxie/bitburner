import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";

import { use } from "../../ui/Context";

import { AllPages } from "./AllPages";
import { Console } from "./Console";
import { Stats } from "./Stats";

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
