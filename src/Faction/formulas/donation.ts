import { CONSTANTS } from "../../Constants";
import { IPerson } from "../../PersonObjects/IPerson";

export function repFromDonation(amt: number, person: IPerson): number {
  return (amt / CONSTANTS.DonateMoneyToRepDivisor) * person.mults.faction_rep;
}
