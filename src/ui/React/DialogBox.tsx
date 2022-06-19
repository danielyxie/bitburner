import { AlertEvents } from "./AlertManager";

import React from "react";
import { SxProps } from "@mui/system";
import { Typography } from "@mui/material";

export function dialogBoxCreate(txt: string | JSX.Element, styles?: SxProps): void {
  if (typeof txt !== "string") {
    AlertEvents.emit(txt);
  } else {
    AlertEvents.emit(<Typography component="span" sx={styles} dangerouslySetInnerHTML={{ __html: txt }} />);
  }
}

export function dialogBoxCreateEscape(txt: string, escape: string, styles?: SxProps): void {
  AlertEvents.emit(
    <>
      <Typography component="span" sx={styles} dangerouslySetInnerHTML={{ __html: txt }} />
      <Typography component="span" sx={styles}>
        {escape}
      </Typography>
    </>,
  );
}
