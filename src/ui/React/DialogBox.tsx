import { AlertEvents } from "./AlertManager";

import React from "react";
import { Typography } from "@mui/material";

export function dialogBoxCreate(txt: string | JSX.Element): void {
  AlertEvents.emit(typeof txt === "string" ? <Typography component="span">{txt}</Typography> : txt);
}
