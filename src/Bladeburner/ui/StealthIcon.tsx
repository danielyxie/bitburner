import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React from "react";

import { stealthIcon } from "../data/Icons";

export function StealthIcon(): React.ReactElement {
  return <Tooltip title={<Typography>This action involves stealth</Typography>}>{stealthIcon}</Tooltip>;
}
