/**
 * Implements the purchasing of extra Duplicate Sleeves from The Covenant,
 * as well as the purchasing of upgrades (memory)
 */
import { IPlayer } from "../IPlayer";

import { CovenantPurchasesRoot } from "./ui/CovenantPurchasesRoot";
import { createPopup,
         removePopup } from "../../ui/React/createPopup";

export const MaxSleevesFromCovenant: number = 5;
export const BaseCostPerSleeve: number = 10e12;
export const PopupId: string = "covenant-sleeve-purchases-popup";

export function createSleevePurchasesFromCovenantPopup(p: IPlayer) {
    const removePopupFn = removePopup.bind(null, PopupId);
    createPopup(PopupId, CovenantPurchasesRoot, { p: p, closeFn: removePopupFn });
}
