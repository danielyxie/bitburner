import { CONSTANTS } from "../../Constants";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { Person as IPerson } from "../../ScriptEditor/NetscriptDefinitions";

export function repFromDonation(amt: number, person: IPerson): number {
  return (amt / CONSTANTS.DonateMoneyToRepDivisor) * person.mults.faction_rep * BitNodeMultipliers.FactionWorkRepGain;
}
