import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";

export function repFromDonation(amt: number, player: IPlayer): number {
  return (amt / CONSTANTS.DonateMoneyToRepDivisor) * player.mults.faction_rep;
}
