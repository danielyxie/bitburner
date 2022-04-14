import { dialogBoxCreate } from "../ui/React/DialogBox";

import { Literatures } from "./Literatures";

export function showLiterature(fn: string): void {
  const litObj = Literatures[fn];
  if (litObj == null) {
    return;
  }
  const txt = `<i>${litObj.title}</i><br><br>${litObj.txt}`;
  dialogBoxCreate(txt);
}
