import { CONSTANTS } from "../../Constants";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { Person } from "../../PersonObjects/Person";

export function repFromDonation(amt: number, person: Person): number {
  return (amt / CONSTANTS.DonateMoneyToRepDivisor) * person.mults.faction_rep * BitNodeMultipliers.FactionWorkRepGain;
}
