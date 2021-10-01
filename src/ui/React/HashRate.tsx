import React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Hashes } from "../../ui/React/Hashes";

export function HashRate({ hashes }: { hashes: number }): React.ReactElement {
  return <Hashes hashes={`${numeralWrapper.formatHashes(hashes)} / sec`} />;
}
