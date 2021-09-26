import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";

export function repFromDonation(amt: number, player: IPlayer): number {
  return (amt / CONSTANTS.DonateMoneyToRepDivisor) * player.faction_rep_mult;
}

export function costFromRep(amt: number, player: IPlayer): number {
  return (amt * CONSTANTS.DonateMoneyToRepDivisor) / player.faction_rep_mult;
}