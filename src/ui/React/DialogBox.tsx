import { AlertEvents } from "./AlertManager";

import React from "react";
import { Typography } from "@mui/material";
import { ScriptDeath } from "../../Netscript/ScriptDeath";

export function dialogBoxCreate(txt: string | JSX.Element): void {
  AlertEvents.emit(typeof txt === "string" ? <Typography component="span">{txt}</Typography> : txt);
}

export function errorDialog(e: unknown, initialText = "") {
  let errorText = "";
  if (typeof e === "string") errorText = e;
  else if (e instanceof ScriptDeath) {
    if (!e.errorMessage) return; //No need for a dialog for an empty ScriptDeath
    errorText = e.errorMessage;
    if (!e.errorMessage.includes(`${e.name}@${e.hostname}`)) {
      initialText += `${e.name}@${e.hostname} (PID - ${e.pid})\n\n`;
    }
  } else if (e instanceof Error) errorText = "Original error message:\n" + e.message;
  else {
    errorText = "An unknown error was thrown, see console.";
    console.error(e);
  }

  if (!initialText && e instanceof ScriptDeath) {
    const basicHeader = `ERROR\n${e.name}@${e.hostname} (PID - ${e.pid})\n\n`;
    if (e.errorMessage.includes(basicHeader)) initialText = basicHeader;
  }
  dialogBoxCreate(initialText + errorText);
}
