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
  } else if (e instanceof SyntaxError) errorText = e.message + " (sorry we can't be more helpful)";
  else if (e instanceof Error) errorText = e.message + (e.stack ? `\nstack:\n${e.stack.toString()}` : "");
  else {
    errorText = "An unknown error was thrown, see console.";
    console.error(e);
  }

  if (!initialText) {
    if (e instanceof ScriptDeath) initialText = `${e.name}@${e.hostname} (PID - ${e.pid})\n\n`;
  }

  dialogBoxCreate(initialText + errorText);
}
