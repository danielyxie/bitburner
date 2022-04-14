import React from "react";

import { numeralWrapper } from "../numeralFormat";

import { Hashes } from "./Hashes";

export function HashRate({ hashes }: { hashes: number }): React.ReactElement {
  return <Hashes hashes={`${numeralWrapper.formatHashes(hashes)} h / s`} />;
}
