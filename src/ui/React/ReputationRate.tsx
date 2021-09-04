import { numeralWrapper } from "../../ui/numeralFormat";
import { Reputation } from "../../ui/React/Reputation";

export function ReputationRate(reputation: number): JSX.Element {
  return Reputation(`${numeralWrapper.formatReputation(reputation)} / sec`);
}
