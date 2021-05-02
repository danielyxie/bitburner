import { numeralWrapper } from "../../ui/numeralFormat";
import { Hashes } from "../../ui/React/Hashes";

export function HashRate(hashes: number): JSX.Element {
	return Hashes(`${numeralWrapper.formatHashes(hashes)} / sec`);
}