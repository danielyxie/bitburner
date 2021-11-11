import { AlertEvents } from "./AlertManager";

import React from "react";

export function dialogBoxCreate(txt: string | JSX.Element): void {
  if (typeof txt !== "string") {
    AlertEvents.emit(txt);
  } else {
    AlertEvents.emit(<span dangerouslySetInnerHTML={{ __html: txt }} />);
  }
}
