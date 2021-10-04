import React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Reputation } from "../../ui/React/Reputation";

export function ReputationRate({ reputation }: { reputation: number }): React.ReactElement {
  return <Reputation reputation={`${numeralWrapper.formatReputation(reputation)} / sec`} />;
}
