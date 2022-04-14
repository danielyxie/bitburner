import React from "react";

import { numeralWrapper } from "../numeralFormat";

import { Reputation } from "./Reputation";

export function ReputationRate({ reputation }: { reputation: number }): React.ReactElement {
  return <Reputation reputation={`${numeralWrapper.formatReputation(reputation)} / sec`} />;
}
