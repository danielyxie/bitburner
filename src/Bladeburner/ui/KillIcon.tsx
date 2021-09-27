import React from "react";
import { killIcon } from "../data/Icons";

import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

export function KillIcon(): React.ReactElement {
  return (
    <Tooltip disableInteractive title={<Typography>This action involves retirement</Typography>}>
      {killIcon}
    </Tooltip>
  );
}
