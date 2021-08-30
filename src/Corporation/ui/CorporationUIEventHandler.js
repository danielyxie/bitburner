// Creates a class for handling UI events, such as clicks and keyboard events
import { CorporationRouting } from "./Routing";
import { Corporation,
         Industry,
         Warehouse,
         DividendMaxPercentage,
         IssueNewSharesCooldown } from "../Corporation";
import { OfficeSpace } from "../OfficeSpace";

import { Industries,
         IndustryStartingCosts,
         IndustryDescriptions,
} from "../IndustryData";

import { MaterialSizes } from "../MaterialSizes";

import { Product } from "../Product";

import { Cities } from "../../Locations/Cities";

import { numeralWrapper } from "../../ui/numeralFormat";

import { dialogBoxCreate } from "../../../utils/DialogBox";

import { getRandomInt } from "../../../utils/helpers/getRandomInt";
import { KEY } from "../../../utils/helpers/keyCodes";

import { clearSelector } from "../../../utils/uiHelpers/clearSelector";
import { createElement } from "../../../utils/uiHelpers/createElement";
import { createOptionElement } from "../../../utils/uiHelpers/createOptionElement";
import { createPopup } from "../../../utils/uiHelpers/createPopup";
import { createPopupCloseButton } from "../../../utils/uiHelpers/createPopupCloseButton";
import { getSelectText,
         getSelectValue } from "../../../utils/uiHelpers/getSelectData";
import { removeElementById } from "../../../utils/uiHelpers/removeElementById";

export class CorporationEventHandler {
    constructor(corp, routing) {
        if (!(corp instanceof Corporation)) {
            throw new Error(`CorporationEventHandler constructed without proper Corporation instance`);
        }
        if (!(routing instanceof CorporationRouting)) {
            throw new Error(`CorporationEventHandler constructed without proper CorporationRouting instance`);
        }

        this.corp = corp;
        this.routing = routing;
    }

    // Create a popup that lets the player use the Market TA research for Products
    createProductMarketTaPopup(product, industry) {
        const popupId = "cmpy-mgmt-marketta-popup";
        const markupLimit = product.rat / product.mku;
        const ta1 = createElement("p", {
            innerHTML: "<u><strong>Market-TA.I</strong></u><br>" +
                       "The maximum sale price you can mark this up to is "  +
                       numeralWrapper.formatMoney(product.pCost + markupLimit) +
                       ". This means that if you set the sale price higher than this, " +
                       "you will begin to experience a loss in number of sales",
        });

        // Enable using Market-TA1 for automatically setting sale price
        const useTa1AutoSaleId = "cmpy-mgmt-marketa1-checkbox";
        const useTa1AutoSaleDiv = createElement("div", { display: "block" });
        const useTa1AutoSaleLabel = createElement("label", {
            color: "white",
            for: useTa1AutoSaleId,
            innerText: "Use Market-TA.I for Auto-Sale Price",
            tooltip: "If this is enabled, then this Product will automatically " +
                     "be sold at the price identified by Market-TA.I (i.e. the price shown above)",
        })
        const useTa1AutoSaleCheckbox = createElement("input", {
            checked: product.marketTa1,
            id: useTa1AutoSaleId,
            margin: "3px",
            type: "checkbox",
            changeListener: (e) => {
                product.marketTa1 = e.target.checked;
            },
        });
        useTa1AutoSaleDiv.appendChild(useTa1AutoSaleLabel);
        useTa1AutoSaleDiv.appendChild(useTa1AutoSaleCheckbox);

        const closeBtn = createPopupCloseButton(popupId, {
            class: "std-button",
            display: "block",
            innerText: "Close",
        });

        if (industry.hasResearch("Market-TA.II")) {
            let updateTa2Text;
            const ta2Text = createElement("p");
            const ta2Input = createElement("input", {
                marginTop: "4px",
                onkeyup: (e) => {
                    e.preventDefault();
                    updateTa2Text();
                },
                type: "number",
                value: product.pCost,
            });

            // Function that updates the text in ta2Text element
            updateTa2Text = function() {
                const sCost = parseFloat(ta2Input.value);
                let markup = 1;
                if (sCost > product.pCost) {
                    if ((sCost - product.pCost) > markupLimit) {
                        markup = markupLimit / (sCost - product.pCost);
                    }
                }
                ta2Text.innerHTML = `<br><u><strong>Market-TA.II</strong></u><br>` +
                                    `If you sell at ${numeralWrapper.formatMoney(sCost)}, ` +
                                    `then you will sell ${numeralWrapper.format(markup, "0.00000")}x as much compared ` +
                                    `to if you sold at market price.`;
            }
            updateTa2Text();

            // Enable using Market-TA2 for automatically setting sale price
            const useTa2AutoSaleId = "cmpy-mgmt-marketa2-checkbox";
            const useTa2AutoSaleDiv = createElement("div", { display: "block" });
            const useTa2AutoSaleLabel = createElement("label", {
                color: "white",
                for: useTa2AutoSaleId,
                innerText: "Use Market-TA.II for Auto-Sale Price",
                tooltip: "If this is enabled, then this Product will automatically " +
                         "be sold at the optimal price such that the amount sold matches the " +
                         "amount produced. (i.e. the highest possible price, while still ensuring " +
                         " that all produced materials will be sold)",
            })
            const useTa2AutoSaleCheckbox = createElement("input", {
                checked: product.marketTa2,
                id: useTa2AutoSaleId,
                margin: "3px",
                type: "checkbox",
                changeListener: (e) => {
                    product.marketTa2 = e.target.checked;
                },
            });
            useTa2AutoSaleDiv.appendChild(useTa2AutoSaleLabel);
            useTa2AutoSaleDiv.appendChild(useTa2AutoSaleCheckbox);

            const ta2OverridesTa1 = createElement("p", {
                innerText: "Note that Market-TA.II overrides Market-TA.I. This means that if " +
                           "both are enabled, then Market-TA.II will take effect, not Market-TA.I",
            });

            createPopup(popupId, [ta1, useTa1AutoSaleDiv, ta2Text, ta2Input, useTa2AutoSaleDiv, ta2OverridesTa1, closeBtn]);
        } else {
            // Market-TA.I only
            createPopup(popupId, [ta1, useTa1AutoSaleDiv, closeBtn]);
        }
    }

    // Create a popup that lets the player purchase a Material
    createPurchaseMaterialPopup(mat, industry, warehouse) {
        const corp = this.corp;

        const purchasePopupId = "cmpy-mgmt-material-purchase-popup";
        const txt = createElement("p", {
            innerHTML: "Enter the amount of " + mat.name + " you would like " +
                       "to purchase per second. This material's cost changes constantly",
        });
        let confirmBtn;
        let input = createElement("input", {
            margin: "5px",
            placeholder: "Purchase amount",
            type: "number",
            value: mat.buy ? mat.buy : null,
            onkeyup: (e) => {
                e.preventDefault();
                if (e.keyCode === KEY.ENTER) {confirmBtn.click();}
            },
        });
        confirmBtn = createElement("button", {
            innerText: "Confirm", class: "std-button",
            clickListener: () => {
                if (isNaN(input.value)) {
                    dialogBoxCreate("Invalid amount");
                } else {
                    mat.buy = parseFloat(input.value);
                    if (isNaN(mat.buy)) {mat.buy = 0;}
                    removeElementById(purchasePopupId);
                    this.rerender();
                    return false;
                }
            },
        });
        const clearButton = createElement("button", {
            innerText: "Clear Purchase", class: "std-button",
            clickListener: () => {
                mat.buy = 0;
                removeElementById(purchasePopupId);
                this.rerender();
                return false;
            },
        });
        const cancelBtn = createPopupCloseButton(purchasePopupId, {
            class: "std-button",
            innerText: "Cancel",
        });

        const elems = [txt, input, confirmBtn, clearButton, cancelBtn];

        if (industry.hasResearch("Bulk Purchasing")) {
            const bulkPurchaseInfo = createElement("p", {
                innerText: "Enter the amount of " + mat.name + " you would like " +
                           "to bulk purchase. This purchases the specified amount instantly " +
                           "(all at once).",
            });

            let bulkPurchaseCostTxt = createElement("p");
            function updateBulkPurchaseText(amount) {
                const parsedAmt = parseFloat(amount);
                const cost = parsedAmt * mat.bCost;

                const matSize = MaterialSizes[mat.name];
                const maxAmount = ((warehouse.size - warehouse.sizeUsed) / matSize);

                if (parsedAmt * matSize > maxAmount) {
                    bulkPurchaseCostTxt.innerText = "Not enough warehouse space to purchase this amount";
                } else if (isNaN(cost)) {
                    bulkPurchaseCostTxt.innerText = "Invalid put for Bulk Purchase amount";
                } else {
                    bulkPurchaseCostTxt.innerText = `Purchasing ${numeralWrapper.format(parsedAmt, "0,0.00")} of ` +
                                                    `${mat.name} will cost ${numeralWrapper.formatMoney(cost)}`;
                }
            }

            let bulkPurchaseConfirmBtn;
            const bulkPurchaseInput = createElement("input", {
                margin: "5px",
                placeholder: "Bulk Purchase amount",
                type: "number",
                onkeyup: (e) => {
                    e.preventDefault();
                    updateBulkPurchaseText(e.target.value);
                    if (e.keyCode === KEY.ENTER) {bulkPurchaseConfirmBtn.click();}
                },
            });

            bulkPurchaseConfirmBtn = createElement("button", {
                class: "std-button",
                innerText: "Confirm Bulk Purchase",
                clickListener: () => {
                    const amount = parseFloat(bulkPurchaseInput.value);

                    const matSize = MaterialSizes[mat.name];
                    const maxAmount = ((warehouse.size - warehouse.sizeUsed) / matSize);
                    if (amount * matSize > maxAmount) {
                        dialogBoxCreate(`You do not have enough warehouse size to fit this purchase`);
                        return false;
                    }

                    if (isNaN(amount)) {
                        dialogBoxCreate("Invalid input amount");
                    } else {
                        const cost = amount * mat.bCost;
                        if (corp.funds.gt(cost)) {
                            corp.funds = corp.funds.minus(cost);
                            mat.qty += amount;
                        } else {
                            dialogBoxCreate(`You cannot afford this purchase.`);
                            return false;
                        }

                        removeElementById(purchasePopupId);
                        return false;
                    }
                },
            })

            elems.push(bulkPurchaseInfo);
            elems.push(bulkPurchaseCostTxt);
            elems.push(bulkPurchaseInput);
            elems.push(bulkPurchaseConfirmBtn);
        }

        createPopup(purchasePopupId, elems);
        input.focus();
    }

    // Create a popup that let the player manage sales of a material
    createSellMaterialPopup(mat) {
        const sellPopupId = "cmpy-mgmt-material-sell-popup";
        const txt = createElement("p", {
            innerHTML: "Enter the maximum amount of " + mat.name + " you would like " +
                       "to sell per second, as well as the price at which you would " +
                       "like to sell at.<br><br>" +
                       "If the sell amount is set to 0, then the material will not be sold. If the sell price " +
                       "if set to 0, then the material will be discarded<br><br>" +
                       "Setting the sell amount to 'MAX' will result in you always selling the " +
                       "maximum possible amount of the material.<br><br>" +
                       "When setting the sell amount, you can use the 'PROD' variable to designate a dynamically " +
                       "changing amount that depends on your production. For example, if you set the sell amount " +
                       "to 'PROD-5' then you will always sell 5 less of the material than you produce.<br><br>" +
                       "When setting the sell price, you can use the 'MP' variable to designate a dynamically " +
                       "changing price that depends on the market price. For example, if you set the sell price " +
                       "to 'MP+10' then it will always be sold at $10 above the market price.",
        });
        const br = createElement("br");
        let confirmBtn;
        const inputQty = createElement("input", {
            type: "text", marginTop: "4px",
            value: mat.sllman[1] ? mat.sllman[1] : null,
            placeholder: "Sell amount",
            onkeyup: (e) => {
                e.preventDefault();
                if (e.keyCode === KEY.ENTER) {confirmBtn.click();}
            },
        });

        let inputButtonInitValue = mat.sCost ? mat.sCost : null;
        if (mat.marketTa2) {
            inputButtonInitValue += " (Market-TA.II)";
        } else if (mat.marketTa1) {
            inputButtonInitValue += " (Market-TA.I)";
        }

        const inputPx = createElement("input", {
            type: "text", marginTop: "4px",
            value: inputButtonInitValue,
            placeholder: "Sell price",
            onkeyup: (e) => {
                e.preventDefault();
                if (e.keyCode === KEY.ENTER) {confirmBtn.click();}
            },
        });
        confirmBtn = createElement("button", {
            class: "std-button",
            innerText: "Confirm",
            clickListener: () => {
                //Parse price
                let cost = inputPx.value.replace(/\s+/g, '');
                cost = cost.replace(/[^-()\d/*+.MP]/g, ''); //Sanitize cost
                let temp = cost.replace(/MP/g, mat.bCost);
                try {
                    temp = eval(temp);
                } catch(e) {
                    dialogBoxCreate("Invalid value or expression for sell price field: " + e);
                    return false;
                }

                if (temp == null || isNaN(temp)) {
                    dialogBoxCreate("Invalid value or expression for sell price field");
                    return false;
                }

                if (cost.includes("MP")) {
                    mat.sCost = cost; //Dynamically evaluated
                } else {
                    mat.sCost = temp;
                }

                //Parse quantity
                if (inputQty.value.includes("MAX") || inputQty.value.includes("PROD")) {
                    let qty = inputQty.value.replace(/\s+/g, '');
                    qty = qty.replace(/[^-()\d/*+.MAXPROD]/g, '');
                    let tempQty = qty.replace(/MAX/g, 1);
                    tempQty = tempQty.replace(/PROD/g, 1);
                    try {
                        tempQty = eval(tempQty);
                    } catch(e) {
                        dialogBoxCreate("Invalid value or expression for sell price field: " + e);
                        return false;
                    }

                    if (tempQty == null || isNaN(tempQty)) {
                        dialogBoxCreate("Invalid value or expression for sell price field");
                        return false;
                    }

                    mat.sllman[0] = true;
                    mat.sllman[1] = qty; //Use sanitized input
                } else if (isNaN(inputQty.value)) {
                    dialogBoxCreate("Invalid value for sell quantity field! Must be numeric or 'MAX'");
                    return false;
                } else {
                    var qty = parseFloat(inputQty.value);
                    if (isNaN(qty)) {qty = 0;}
                    if (qty === 0) {
                        mat.sllman[0] = false;
                        mat.sllman[1] = 0;
                    } else {
                        mat.sllman[0] = true;
                        mat.sllman[1] = qty;
                    }
                }

                removeElementById(sellPopupId);
                this.rerender();
                return false;
            },
        });
        const cancelBtn = createPopupCloseButton(sellPopupId, {
            class: "std-button",
            innerText: "Cancel",
        });

        createPopup(sellPopupId, [txt, br, inputQty, inputPx, confirmBtn, cancelBtn]);
        inputQty.focus();
    }

    // Create a popup that lets the player manage sales of the product
    createSellProductPopup(product, city) {
        const popupId = "cmpy-mgmt-sell-product-popup";
        const txt = createElement("p", {
            innerHTML:"Enter the maximum amount of " + product.name + " you would like " +
                      "to sell per second, as well as the price at which you would like to " +
                      "sell it at.<br><br>" +
                      "If the sell amount is set to 0, then the product will not be sold. If the " +
                      "sell price is set to 0, then the product will be discarded.<br><br>" +
                      "Setting the sell amount to 'MAX' will result in you always selling the " +
                      "maximum possible amount of the material.<br><br>" +
                      "When setting the sell amount, you can use the 'PROD' variable to designate a " +
                      "dynamically changing amount that depends on your production. For example, " +
                      "if you set the sell amount to 'PROD-1' then you will always sell 1 less of  " +
                      "the material than you produce.<br><br>" +
                      "When setting the sell price, you can use the 'MP' variable to set a " +
                      "dynamically changing price that depends on the Product's estimated " +
                      "market price. For example, if you set it to 'MP*5' then it " +
                      "will always be sold at five times the estimated market price.",
        });
        let confirmBtn;
        const inputQty = createElement("input", {
            margin: "5px 0px 5px 0px",
            placeholder: "Sell amount",
            type: "text",
            value: product.sllman[city][1] ? product.sllman[city][1] : null,
            onkeyup: (e) => {
                e.preventDefault();
                if (e.keyCode === KEY.ENTER) {confirmBtn.click();}
            },
        });

        let inputButtonInitValue = product.sCost ? product.sCost : null;
        if (product.marketTa2) {
            inputButtonInitValue += " (Market-TA.II)";
        } else if (product.marketTa1) {
            inputButtonInitValue += " (Market-TA.I)";
        }

        const inputPx = createElement("input", {
            margin: "5px 0px 5px 0px",
            placeholder: "Sell price",
            type: "text",
            value: inputButtonInitValue,
            onkeyup: (e) => {
                e.preventDefault();
                if (e.keyCode === KEY.ENTER) {confirmBtn.click();}
            },
        });
        const checkboxDiv = createElement("div", {
            border: "1px solid white",
            display: "inline-block",
        })
        const checkboxLabel = createElement("label", {
            for: popupId + "-checkbox",
            innerText: "Use same 'Sell Amount' for all cities",
        });
        const checkbox = createElement("input", {
            checked: true,
            id: popupId + "-checkbox",
            margin: "2px",
            type: "checkbox",
        });
        checkboxDiv.appendChild(checkboxLabel);
        checkboxDiv.appendChild(checkbox);

        confirmBtn = createElement("button", {
            class: "std-button",
            innerText: "Confirm",
            clickListener: () => {
                //Parse price
                if (inputPx.value.includes("MP")) {
                    //Dynamically evaluated quantity. First test to make sure its valid
                    //Sanitize input, then replace dynamic variables with arbitrary numbers
                    var price = inputPx.value.replace(/\s+/g, '');
                    price = price.replace(/[^-()\d/*+.MP]/g, '');
                    var temp = price.replace(/MP/g, 1);
                    try {
                        temp = eval(temp);
                    } catch(e) {
                        dialogBoxCreate("Invalid value or expression for sell quantity field: " + e);
                        return false;
                    }
                    if (temp == null || isNaN(temp)) {
                        dialogBoxCreate("Invalid value or expression for sell quantity field.");
                        return false;
                    }
                    product.sCost = price; //Use sanitized price
                } else {
                    var cost = parseFloat(inputPx.value);
                    if (isNaN(cost)) {
                        dialogBoxCreate("Invalid value for sell price field");
                        return false;
                    }
                    product.sCost = cost;
                }

                // Array of all cities. Used later
                const cities = Object.keys(Cities);

                // Parse quantity
                if (inputQty.value.includes("MAX") || inputQty.value.includes("PROD")) {
                    //Dynamically evaluated quantity. First test to make sure its valid
                    var qty = inputQty.value.replace(/\s+/g, '');
                    qty = qty.replace(/[^-()\d/*+.MAXPROD]/g, '');
                    var temp = qty.replace(/MAX/g, 1);
                    temp = temp.replace(/PROD/g, 1);
                    try {
                        temp = eval(temp);
                    } catch(e) {
                        dialogBoxCreate("Invalid value or expression for sell price field: " + e);
                        return false;
                    }

                    if (temp == null || isNaN(temp)) {
                        dialogBoxCreate("Invalid value or expression for sell price field");
                        return false;
                    }
                    if (checkbox.checked) {
                        for (let i = 0; i < cities.length; ++i) {
                            const tempCity = cities[i];
                            product.sllman[tempCity][0] = true;
                            product.sllman[tempCity][1] = qty; //Use sanitized input
                        }
                    } else {
                        product.sllman[city][0] = true;
                        product.sllman[city][1] = qty; //Use sanitized input
                    }
                } else if (isNaN(inputQty.value)) {
                    dialogBoxCreate("Invalid value for sell quantity field! Must be numeric");
                    return false;
                } else {
                    var qty = parseFloat(inputQty.value);
                    if (isNaN(qty)) {qty = 0;}
                    if (qty === 0) {
                        if (checkbox.checked) {
                            for (let i = 0; i < cities.length; ++i) {
                                const tempCity = cities[i];
                                product.sllman[tempCity][0] = false;
                            }
                        } else {
                            product.sllman[city][0] = false;
                        }
                    } else {
                        if (checkbox.checked) {
                            for (let i = 0; i < cities.length; ++i) {
                                const tempCity = cities[i];
                                product.sllman[tempCity][0] = true;
                                product.sllman[tempCity][1] = qty;
                            }
                        } else {
                            product.sllman[city][0] = true;
                            product.sllman[city][1] = qty;
                        }
                    }
                }

                removeElementById(popupId);
                this.rerender();
                return false;
            },
        });
        const cancelBtn = createPopupCloseButton(popupId, { class: "std-button" });

        const linebreak1 = createElement("br");

        createPopup(popupId, [txt, inputQty, inputPx, confirmBtn, cancelBtn, linebreak1,
                              checkboxDiv]);
        inputQty.focus();
    }

    rerender() {
        this.corp.rerender();
    }
}
