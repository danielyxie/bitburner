import * as React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";

export function Hashes(hashes: number | string): JSX.Element {
  return (
    <span className={"money-gold samefont"}>
      {typeof hashes === "number"
        ? numeralWrapper.formatHashes(hashes)
        : hashes}
    </span>
  );
}
