import { CONSTANTS } from "../../Constants";
import { Person } from "../../PersonObjects/Person";

export function repFromDonation(amt: number, person: Person): number {
  return (amt / CONSTANTS.DonateMoneyToRepDivisor) * person.mults.faction_rep;
}
