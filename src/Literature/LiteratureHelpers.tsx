import React from "react";
import { Literatures } from "./Literatures";
import { dialogBoxCreate } from "../ui/React/DialogBox";

export function showLiterature(fn: string): void {
  const litObj = Literatures[fn];
  if (litObj == null) {
    return;
  }
  const txt = `<i>${litObj.title}</i><br><br>${litObj.txt}`;
  dialogBoxCreate(txt, true);
}
