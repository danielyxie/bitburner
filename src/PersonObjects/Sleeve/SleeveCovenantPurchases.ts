/**
 * Implements the purchasing of extra Duplicate Sleeves from The Covenant
 */
import { Sleeve } from "./Sleeve";
import { IPlayer } from "../IPlayer";

import { numeralWrapper } from "../../ui/numeralFormat";

import { dialogBoxCreate } from "../../../utils/DialogBox";
import { yesNoBoxCreate,
         yesNoBoxClose,
         yesNoBoxGetYesButton,
         yesNoBoxGetNoButton } from "../../../utils/YesNoBox";

export const MaxSleevesFromCovenant: number = 5;

export function createPurchaseSleevesFromCovenantPopup(p: IPlayer) {
    if (p.sleevesFromCovenant >= MaxSleevesFromCovenant) { return; }

    // First sleeve purchased costs the base amount. Then, the price of
    // each successive one increases by the same amount
    const baseCostPerExtraSleeve: number = 10e12;
    const cost: number = (p.sleevesFromCovenant + 1) * baseCostPerExtraSleeve;

    const yesBtn = yesNoBoxGetYesButton();
    const noBtn = yesNoBoxGetNoButton();

    yesBtn!.addEventListener("click", () => {
        if (p.canAfford(cost)) {
            p.loseMoney(cost);
            p.sleevesFromCovenant += 1;
            p.sleeves.push(new Sleeve());
            yesNoBoxClose();
        } else {
            dialogBoxCreate("You cannot afford to purchase a Duplicate Sleeve", false);
        }
    });

    noBtn!.addEventListener("click", () => {
        yesNoBoxClose();
    });

    const txt = `Would you like to purchase an additional Duplicate Sleeve from The Covenant for ` +
                `${numeralWrapper.formatMoney(cost)}?<br><br>` +
                `These Duplicate Sleeves are permanent. You can purchase a total of 5 Duplicate ` +
                `Sleeves from The Covenant`;
    yesNoBoxCreate(txt);
}
