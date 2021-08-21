/**
 * Implements the purchasing of extra Duplicate Sleeves from The Covenant,
 * as well as the purchasing of upgrades (memory)
 */
import { IPlayer } from "../IPlayer";

import { CovenantPurchasesRoot } from "./ui/CovenantPurchasesRoot";
import { createPopup,
         removePopup } from "../../ui/React/createPopup";

export const MaxSleevesFromCovenant = 5;
export const BaseCostPerSleeve = 10e12;
export const PopupId = "covenant-sleeve-purchases-popup";

export function createSleevePurchasesFromCovenantPopup(p: IPlayer): void {
    createPopup(PopupId, CovenantPurchasesRoot, { p: p, closeFn: () => removePopup(PopupId) });
}
