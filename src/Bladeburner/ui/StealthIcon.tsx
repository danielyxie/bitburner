import React from "react";
import { stealthIcon } from "../data/Icons";

import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

export function StealthIcon(): React.ReactElement {
  return <Tooltip title={<Typography>This action involves stealth</Typography>}>{stealthIcon}</Tooltip>;
}
