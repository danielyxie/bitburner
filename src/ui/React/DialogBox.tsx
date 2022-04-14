import { Typography } from "@mui/material";
import type { SxProps } from "@mui/system";
import React from "react";

import { AlertEvents } from "./AlertManager";

export function dialogBoxCreate(txt: string | JSX.Element, styles?: SxProps): void {
  if (typeof txt !== "string") {
    AlertEvents.emit(txt);
  } else {
    AlertEvents.emit(<Typography component="span" sx={styles} dangerouslySetInnerHTML={{ __html: txt }} />);
  }
}
