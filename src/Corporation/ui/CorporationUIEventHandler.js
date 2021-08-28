// Creates a class for handling UI events, such as clicks and keyboard events
import { CorporationRouting } from "./Routing";
import { Corporation,
         Industry,
         Warehouse,
         DividendMaxPercentage,
         IssueNewSharesCooldown,
         OfficeInitialCost,
         OfficeInitialSize,
         SellSharesCooldown,
         WarehouseInitialCost,
         WarehouseInitialSize,
         BribeToRepRatio } from "../Corporation";
import { OfficeSpace } from "../OfficeSpace";

import { Industries,
         IndustryStartingCosts,
         IndustryDescriptions,
} from "../IndustryData";

import { MaterialSizes } from "../MaterialSizes";

import { Product } from "../Product";

import { Player } from "../../Player";

import { Factions } from "../../Faction/Factions";
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

    // Create a popup that lets the player buyback shares
    // This is created when the player clicks the "Buyback Shares" button in the overview panel
    createBuybackSharesPopup() {
        const popupId = "cmpy-mgmt-buyback-shares-popup";
        const currentStockPrice = this.corp.sharePrice;
        const buybackPrice = currentStockPrice * 1.1;
        const txt = createElement("p", {
            innerHTML: "Enter the number of outstanding shares you would like to buy back. " +
                       "These shares must be bought at a 10% premium. However, " +
                       "repurchasing shares from the market tends to lead to an increase in stock price.<br><bR>" +
                       "To purchase these shares, you must use your own money (NOT your Corporation's funds).<br><br>" +
                       "The current buyback price of your company's stock is " +
                       numeralWrapper.format(buybackPrice, "$0.000a") +
                       ". Your company currently has " + numeralWrapper.formatBigNumber(this.corp.issuedShares) + " outstanding stock shares",
        });
        var costIndicator = createElement("p", {});
        var input = createElement("input", {
            type:"number", placeholder:"Shares to buyback", margin:"5px",
            inputListener: ()=> {
                var numShares = Math.round(input.value);
                if (isNaN(numShares) || numShares <= 0) {
                    costIndicator.innerText = "ERROR: Invalid value entered for number of shares to buyback"
                } else if (numShares > this.corp.issuedShares) {
                    costIndicator.innerText = "There are not this many shares available to buy back. " +
                                              "There are only " + numeralWrapper.formatBigNumber(this.corp.issuedShares) +
                                              " outstanding shares.";
                } else {
                    costIndicator.innerText = "Purchase " + numShares + " shares for a total of " +
                                              numeralWrapper.format(numShares * buybackPrice, '$0.000a');
                }
            },
        });
        var confirmBtn = createElement("button", {
            class:"a-link-button", innerText:"Buy shares", display:"inline-block",
            clickListener: () => {
                var shares = Math.round(input.value);
                const tempStockPrice = this.corp.sharePrice;
                const buybackPrice = tempStockPrice * 1.1;
                if (isNaN(shares) || shares <= 0) {
                    dialogBoxCreate("ERROR: Invalid value for number of shares");
                } else if (shares > this.corp.issuedShares) {
                    dialogBoxCreate("ERROR: There are not this many oustanding shares to buy back");
                } else if (shares * buybackPrice > Player.money) {
                    dialogBoxCreate("ERROR: You do not have enough money to purchase this many shares (you need " +
                                    numeralWrapper.format(shares * buybackPrice, "$0.000a") + ")");
                } else {
                    this.corp.numShares += shares;
                    if (isNaN(this.corp.issuedShares)) {
                        console.warn("Corporation issuedShares is NaN: " + this.corp.issuedShares);
                        console.warn("Converting to number now");
                        const res = parseInt(this.corp.issuedShares);
                        if (isNaN(res)) {
                            this.corp.issuedShares = 0;
                        } else {
                            this.corp.issuedShares = res;
                        }
                    }
                    this.corp.issuedShares -= shares;
                    Player.loseMoney(shares * buybackPrice);
                    removeElementById(popupId);
                    this.rerender();
                }
                return false;

            },
        });
        var cancelBtn = createPopupCloseButton(popupId, {
            class: "std-button",
            display: "inline-block",
            innerText: "Cancel",
        });

        createPopup(popupId, [txt, costIndicator, input, confirmBtn, cancelBtn]);
        input.focus();
    }

    // Create a popup that lets the player discontinue a product
    createDiscontinueProductPopup(product, industry) {
        const popupId = "cmpy-mgmt-discontinue-product-popup";
        const txt = createElement("p", {
            innerText:"Are you sure you want to do this? Discontinuing a product " +
                      "removes it completely and permanently. You will no longer " +
                      "produce this product and all of its existing stock will be " +
                      "removed and left unsold",
        });
        const confirmBtn = createElement("button", {
            class:"popup-box-button",innerText:"Discontinue",
            clickListener: () => {
                industry.discontinueProduct(product);
                removeElementById(popupId);
                this.rerender();
                return false;
            },
        });
        const cancelBtn = createPopupCloseButton(popupId, { innerText: "Cancel" });

        createPopup(popupId, [txt, cancelBtn, confirmBtn]);
    }

    // Create a popup that lets the player manage exports
    createExportMaterialPopup(mat) {
        const corp = this.corp;

        const popupId = "cmpy-mgmt-export-popup";
        const exportTxt = createElement("p", {
            innerText:"Select the industry and city to export this material to, as well as " +
                      "how much of this material to export per second. You can set the export " +
                      "amount to 'MAX' to export all of the materials in this warehouse.",
        });

        //Select industry and city to export to
        const citySelector = createElement("select", {class: "dropdown"});
        const industrySelector = createElement("select", {
            class: "dropdown",
            changeListener: () => {
                const industryName = getSelectValue(industrySelector);
                for (let i = 0; i < corp.divisions.length; ++i) {
                    if (corp.divisions[i].name == industryName) {
                        clearSelector(citySelector);
                        for (const cityName in corp.divisions[i].warehouses) {
                            if (corp.divisions[i].warehouses[cityName] instanceof Warehouse) {
                                citySelector.add(createElement("option", {
                                    value:cityName, text:cityName,
                                }));
                            }
                        }
                        return;
                    }
                }
            },
        });

        for (let i = 0; i < corp.divisions.length; ++i) {
            industrySelector.add(createOptionElement(corp.divisions[i].name));
        }

        // Force change listener to initialize citySelector
        industrySelector.dispatchEvent(new Event("change"));

        //Select amount to export
        const exportAmount = createElement("input", {
            class: "text-input",
            placeholder:"Export amount / s",
        });

        const exportBtn  = createElement("button", {
            class: "std-button", display:"inline-block", innerText:"Export",
            clickListener: () => {
                const industryName = getSelectText(industrySelector);
                const cityName = citySelector.options[citySelector.selectedIndex].text;
                const amt = exportAmount.value;

                // Sanitize amt
                let sanitizedAmt = amt.replace(/\s+/g, '');
                sanitizedAmt = sanitizedAmt.replace(/[^-()\d/*+.MAX]/g, '');
                let temp = sanitizedAmt.replace(/MAX/g, 1);
                try {
                    temp = eval(temp);
                } catch(e) {
                    dialogBoxCreate("Invalid expression entered for export amount: " + e);
                    return false;
                }

                if (temp == null || isNaN(temp) || temp < 0) {
                    dialogBoxCreate("Invalid amount entered for export");
                    return;
                }
                var exportObj = {ind:industryName, city:cityName, amt:sanitizedAmt};
                mat.exp.push(exportObj);
                removeElementById(popupId);
                return false;
            },
        });

        const cancelBtn = createPopupCloseButton(popupId, { innerText: "Cancel" });

        const currExportsText = createElement("p", {
            innerText:"Below is a list of all current exports of this material from this warehouse. " +
                      "Clicking on one of the exports below will REMOVE that export.",
        });
        const currExports = [];
        for (var i = 0; i < mat.exp.length; ++i) {
            (function(i, mat, currExports){
            currExports.push(createElement("div", {
                class:"cmpy-mgmt-existing-export",
                innerHTML: "Industry: " + mat.exp[i].ind + "<br>" +
                           "City: " + mat.exp[i].city + "<br>" +
                           "Amount/s: " + mat.exp[i].amt,
                clickListener:()=>{
                    mat.exp.splice(i, 1); //Remove export object
                    removeElementById(popupId);
                    createExportMaterialPopup(mat);
                },
            }));
            })(i, mat, currExports);
        }
        createPopup(popupId, [exportTxt, industrySelector, citySelector, exportAmount,
                              exportBtn, cancelBtn, currExportsText].concat(currExports));
    }

    // Create a popup that lets the player issue & manage dividends
    // This is created when the player clicks the "Issue Dividends" button in the overview panel
    createIssueDividendsPopup() {
        const popupId = "cmpy-mgmt-issue-dividends-popup";
        const descText = "Dividends are a distribution of a portion of the corporation's " +
                         "profits to the shareholders. This includes yourself, as well.<br><br>" +
                         "In order to issue dividends, simply allocate some percentage " +
                         "of your corporation's profits to dividends. This percentage must be an " +
                         `integer between 0 and ${DividendMaxPercentage}. (A percentage of 0 means no dividends will be ` +
                         "issued<br><br>" +
                         "Two important things to note:<br>" +
                         " * Issuing dividends will negatively affect your corporation's stock price<br>" +
                         " * Dividends are taxed. Taxes start at 50%, but can be decreased<br><br>" +
                         "Example: Assume your corporation makes $100m / sec in profit and you allocate " +
                         "40% of that towards dividends. That means your corporation will gain $60m / sec " +
                         "in funds and the remaining $40m / sec will be paid as dividends. Since your " +
                         "corporation starts with 1 billion shares, every shareholder will be paid $0.04 per share " +
                         "per second before taxes.";
        const txt = createElement("p", { innerHTML: descText });

        let allocateBtn;
        const dividendPercentInput = createElement("input", {
            margin: "5px",
            placeholder: "Dividend %",
            type: "number",
            onkeyup: (e) => {
                e.preventDefault();
                if (e.keyCode === KEY.ENTER) {allocateBtn.click();}
            },
        });

        allocateBtn = createElement("button", {
            class: "std-button",
            display: "inline-block",
            innerText: "Allocate Dividend Percentage",
            clickListener: () => {
                const percentage = Math.round(parseInt(dividendPercentInput.value));
                if (isNaN(percentage) || percentage < 0 || percentage > DividendMaxPercentage) {
                    return dialogBoxCreate(`Invalid value. Must be an integer between 0 and ${DividendMaxPercentage}`);
                }

                this.corp.dividendPercentage = percentage;

                removeElementById(popupId);

                this.rerender();
                return false;
            },
        });

        const cancelBtn = createPopupCloseButton(popupId, {
            class: "std-button",
            display: "inline-block",
            innerText: "Cancel",
        });

        createPopup(popupId, [txt, dividendPercentInput, allocateBtn, cancelBtn]);
        dividendPercentInput.focus();
    }

    // Create a popup that lets the player issue new shares
    // This is created when the player clicks the "Issue New Shares" buttons in the overview panel
    createIssueNewSharesPopup() {
        const popupId = "cmpy-mgmt-issue-new-shares-popup";
        const maxNewSharesUnrounded = Math.round(this.corp.totalShares * 0.2);
        const maxNewShares = maxNewSharesUnrounded - (maxNewSharesUnrounded % 1e6);

        const descText = createElement("p", {
            innerHTML:  "You can issue new equity shares (i.e. stocks) in order to raise " +
                        "capital for your corporation.<br><br>" +
                        `&nbsp;* You can issue at most ${numeralWrapper.format(maxNewShares, "0.000a")} new shares<br>` +
                        `&nbsp;* New shares are sold at a 10% discount<br>` +
                        `&nbsp;* You can only issue new shares once every 12 hours<br>` +
                        `&nbsp;* Issuing new shares causes dilution, resulting in a decrease in stock price and lower dividends per share<br>` +
                        `&nbsp;* Number of new shares issued must be a multiple of 10 million<br><br>` +
                        `When you choose to issue new equity, private shareholders have first priority for up to 50% of the new shares. ` +
                        `If they choose to exercise this option, these newly issued shares become private, restricted shares, which means ` +
                        `you cannot buy them back.`,
        });

        let issueBtn, newSharesInput;
        const dynamicText = createElement("p", {
            display: "block",
        });

        function updateDynamicText(corp) {
            const newSharePrice = Math.round(corp.sharePrice * 0.9);
            let newShares = parseInt(newSharesInput.value);
            if (isNaN(newShares)) {
                dynamicText.innerText = "Invalid input";
                return;
            }

            // Round to nearest ten-millionth
            newShares /= 10e6;
            newShares = Math.round(newShares) * 10e6;

            if (newShares < 10e6) {
                dynamicText.innerText = "Must issue at least 10 million new shares";
                return;
            }

            if (newShares > maxNewShares) {
                dynamicText.innerText = "You cannot issue that many shares";
                return;
            }

            dynamicText.innerText = `Issue ${numeralWrapper.format(newShares, "0.000a")} new shares ` +
                                    `for ${numeralWrapper.formatMoney(newShares * newSharePrice)}?`
        }
        newSharesInput = createElement("input", {
            margin: "5px",
            placeholder: "# New Shares",
            type: "number",
            onkeyup: (e) => {
                e.preventDefault();
                if (e.keyCode === KEY.ENTER) {
                    issueBtn.click();
                } else {
                    updateDynamicText(this.corp);
                }
            },
        });

        issueBtn = createElement("button", {
            class: "std-button",
            display: "inline-block",
            innerText: "Issue New Shares",
            clickListener: () => {
                const newSharePrice = Math.round(this.corp.sharePrice * 0.9);
                let newShares = parseInt(newSharesInput.value);
                if (isNaN(newShares)) {
                    dialogBoxCreate("Invalid input for number of new shares");
                    return;
                }

                // Round to nearest ten-millionth
                newShares = Math.round(newShares / 10e6) * 10e6;

                if (newShares < 10e6 || newShares > maxNewShares) {
                    dialogBoxCreate("Invalid input for number of new shares");
                    return;
                }

                const profit = newShares * newSharePrice;
                this.corp.issueNewSharesCooldown = IssueNewSharesCooldown;
                this.corp.totalShares += newShares;

                // Determine how many are bought by private investors
                // Private investors get up to 50% at most
                // Round # of private shares to the nearest millionth
                let privateShares = getRandomInt(0, Math.round(newShares / 2));
                privateShares = Math.round(privateShares / 1e6) * 1e6;

                this.corp.issuedShares += (newShares - privateShares);
                this.corp.funds = this.corp.funds.plus(profit);
                this.corp.immediatelyUpdateSharePrice();

                removeElementById(popupId);
                dialogBoxCreate(`Issued ${numeralWrapper.format(newShares, "0.000a")} and raised ` +
                                `${numeralWrapper.formatMoney(profit)}. ${numeralWrapper.format(privateShares, "0.000a")} ` +
                                `of these shares were bought by private investors.<br><br>` +
                                `Stock price decreased to ${numeralWrapper.formatMoney(this.corp.sharePrice)}`);

                this.rerender();
                return false;
            },
        });

        const cancelBtn = createPopupCloseButton(popupId, {
            class: "std-button",
            display: "inline-block",
            innerText: "Cancel",
        });

        createPopup(popupId, [descText, dynamicText, newSharesInput, issueBtn, cancelBtn]);
        newSharesInput.focus();
    }

    // Create a popup that lets the player limit the production of a product
    createLimitProductProdutionPopup(product, city) {
        const popupId = "cmpy-mgmt-limit-product-production-popup";
        const txt = createElement("p", {
            innerText:"Enter a limit to the amount of this product you would " +
                      "like to product per second. Leave the box empty to set no limit.",
        });
        let confirmBtn;
        const input = createElement("input", {
            margin: "5px",
            placeholder:"Limit",
            type:"number",
            onkeyup: (e) => {
                e.preventDefault();
                if (e.keyCode === KEY.ENTER) { confirmBtn.click(); }
            },
        });
        confirmBtn = createElement("button", {
            class: "std-button",
            display: "inline-block",
            innerText: "Limit production",
            margin: "5px",
            clickListener: () => {
                if (input.value === "") {
                    product.prdman[city][0] = false;
                    removeElementById(popupId);
                    return false;
                }
                var qty = parseFloat(input.value);
                if (isNaN(qty)) {
                    dialogBoxCreate("Invalid value entered");
                    return false;
                }
                if (qty < 0) {
                    product.prdman[city][0] = false;
                } else {
                    product.prdman[city][0] = true;
                    product.prdman[city][1] = qty;
                }
                removeElementById(popupId);
                this.rerender();
                return false;
            },
        });
        const cancelBtn = createPopupCloseButton(popupId, { innerText: "Cancel" });
        cancelBtn.style.margin = "6px";

        createPopup(popupId, [txt, input, confirmBtn, cancelBtn]);
        input.focus();
    }

    // Create a popup that lets the player create a product for their current industry
    createMakeProductPopup(popupText, division) {
        if (division.hasMaximumNumberProducts()) { return; }

        const popupId = "cmpy-mgmt-create-product-popup";
        const txt = createElement("p", {
            innerHTML: popupText,
        });
        const designCity = createElement("select", {
            class: "dropdown",
            margin: "5px",
        });
        for (const cityName in division.offices) {
            if (division.offices[cityName] instanceof OfficeSpace) {
                designCity.add(createElement("option", {
                    value: cityName,
                    text: cityName,
                }));
            }
        }
        let productNamePlaceholder = "Product Name";
        if (division.type === Industries.Food) {
            productNamePlaceholder = "Restaurant Name";
        } else if (division.type === Industries.Healthcare) {
            productNamePlaceholder = "Hospital Name";
        } else if (division.type === Industries.RealEstate) {
            productNamePlaceholder = "Property Name";
        }
        var productNameInput = createElement("input", {
            class: "text-input",
            margin: "5px",
            placeholder: productNamePlaceholder,
        });
        var lineBreak1 = createElement("br");
        var designInvestInput = createElement("input", {
            class: "text-input",
            margin: "5px",
            placeholder: "Design investment",
            type: "number",
        });
        let confirmBtn;
        var marketingInvestInput = createElement("input", {
            class: "text-input",
            margin: "5px",
            placeholder: "Marketing investment",
            type: "number",
            onkeyup: (e) => {
                e.preventDefault();
                if (e.keyCode === KEY.ENTER) { confirmBtn.click(); }
            },
        });
        confirmBtn = createElement("button", {
            class: "std-button",
            innerText: "Develop Product",
            clickListener: () => {
                if (designInvestInput.value == null || designInvestInput.value < 0) { designInvestInput.value = 0; }
                if (marketingInvestInput.value == null || marketingInvestInput.value < 0) { marketingInvestInput.value = 0; }
                var designInvest = parseFloat(designInvestInput.value),
                    marketingInvest = parseFloat(marketingInvestInput.value);
                if (productNameInput.value == null || productNameInput.value === "") {
                    dialogBoxCreate("You must specify a name for your product!");
                } else if (isNaN(designInvest)) {
                    dialogBoxCreate("Invalid value for design investment");
                } else if (isNaN(marketingInvest))  {
                    dialogBoxCreate("Invalid value for marketing investment");
                } else if (this.corp.funds.lt(designInvest + marketingInvest)) {
                    dialogBoxCreate("You don't have enough company funds to make this large of an investment");
                } else {
                    const product = new Product({
                        name:productNameInput.value.replace(/[<>]/g, ''), //Sanitize for HTMl elements
                        createCity:designCity.options[designCity.selectedIndex].value,
                        designCost: designInvest,
                        advCost: marketingInvest,
                    });
                    if (division.products[product.name] instanceof Product) {
                        dialogBoxCreate(`You already have a product with this name!`);
                        return;
                    }
                    this.corp.funds = this.corp.funds.minus(designInvest + marketingInvest);
                    division.products[product.name] = product;
                    removeElementById(popupId);
                }
                this.rerender();
                return false;
            },
        })
        const cancelBtn = createPopupCloseButton(popupId, {
            class: "std-button",
            innerText: "Cancel",
        });

        createPopup(popupId, [txt, designCity, productNameInput, lineBreak1,
                              designInvestInput, marketingInvestInput, confirmBtn, cancelBtn]);
        productNameInput.focus();
    }

    // Create a popup that lets the player use the Market TA research for Materials
    createMaterialMarketTaPopup(mat, industry) {
        const popupId = "cmpy-mgmt-marketta-popup";
        const markupLimit = mat.getMarkupLimit();
        const ta1 = createElement("p", {
            innerHTML: "<u><strong>Market-TA.I</strong></u><br>" +
                       "The maximum sale price you can mark this up to is "  +
                       numeralWrapper.formatMoney(mat.bCost + markupLimit) +
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
            tooltip: "If this is enabled, then this Material will automatically " +
                     "be sold at the price identified by Market-TA.I (i.e. the price shown above)",
        })
        const useTa1AutoSaleCheckbox = createElement("input", {
            checked: mat.marketTa1,
            id: useTa1AutoSaleId,
            margin: "3px",
            type: "checkbox",
            changeListener: (e) => {
                mat.marketTa1 = e.target.checked;
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
                value: mat.bCost,
            });

            // Function that updates the text in ta2Text element
            updateTa2Text = function() {
                const sCost = parseFloat(ta2Input.value);
                let markup = 1;
                if (sCost > mat.bCost) {
                    //Penalty if difference between sCost and bCost is greater than markup limit
                    if ((sCost - mat.bCost) > markupLimit) {
                        markup = Math.pow(markupLimit / (sCost - mat.bCost), 2);
                    }
                } else if (sCost < mat.bCost) {
                    if (sCost <= 0) {
                        markup = 1e12; //Sell everything, essentially discard
                    } else {
                        //Lower prices than market increases sales
                        markup = mat.bCost / sCost;
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
                tooltip: "If this is enabled, then this Material will automatically " +
                         "be sold at the optimal price such that the amount sold matches the " +
                         "amount produced. (i.e. the highest possible price, while still ensuring " +
                         " that all produced materials will be sold)",
            })
            const useTa2AutoSaleCheckbox = createElement("input", {
                checked: mat.marketTa2,
                id: useTa2AutoSaleId,
                margin: "3px",
                type: "checkbox",
                changeListener: (e) => {
                    mat.marketTa2 = e.target.checked;
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

    // Create a popup that lets the player expand into a new city (for the current industry)
    // The 'cityStateSetter' arg is a function that sets the UI's 'city' state property
    createNewCityPopup(division, cityStateSetter) {
        const popupId = "cmpy-mgmt-expand-city-popup";
        const text = createElement("p", {
            innerText: "Would you like to expand into a new city by opening an office? " +
                       "This would cost " + numeralWrapper.format(OfficeInitialCost, '$0.000a'),
        });
        const citySelector = createElement("select", { class: "dropdown", margin:"5px" });
        for (const cityName in division.offices) {
            if (!(division.offices[cityName] instanceof OfficeSpace)) {
                citySelector.add(createElement("option", {
                    text: cityName,
                    value: cityName,
                }));
            }
        }

        const confirmBtn = createElement("button", {
            class:"std-button",
            display:"inline-block",
            innerText: "Confirm",
            clickListener: () => {
                if (citySelector.length <= 0) { return false; }
                let city = citySelector.options[citySelector.selectedIndex].value;
                if (this.corp.funds.lt(OfficeInitialCost)) {
                    dialogBoxCreate("You don't have enough company funds to open a new office!");
                } else {
                    this.corp.funds = this.corp.funds.minus(OfficeInitialCost);
                    dialogBoxCreate("Opened a new office in " + city + "!");
                    division.offices[city] = new OfficeSpace({
                        loc: city,
                        size: OfficeInitialSize,
                    });
                }

                cityStateSetter(city);
                removeElementById(popupId);
                this.rerender();
                return false;
            },
        });
        const cancelBtn = createPopupCloseButton(popupId, {
            class: "std-button",
            innerText: "Cancel",
        });

        createPopup(popupId, [text, citySelector, confirmBtn, cancelBtn]);
    }

    // Create a popup that lets the player create a new industry.
    // This is created when the player clicks the "Expand into new Industry" header tab
    createNewIndustryPopup() {
        const popupId = "cmpy-mgmt-expand-industry-popup";
        if (document.getElementById(popupId) != null) { return; }

        var txt = createElement("p", {
            innerHTML: "Create a new division to expand into a new industry:",
        });
        var selector = createElement("select", {
            class:"dropdown",
        });
        var industryDescription = createElement("p", {});
        var yesBtn;
        var nameInput = createElement("input", {
            type:"text",
            id:"cmpy-mgmt-expand-industry-name-input",
            class: "text-input",
            display:"block",
            maxLength: 30,
            pattern:"[a-zA-Z0-9-_]",
            onkeyup:(e)=>{
                e.preventDefault();
                if (e.keyCode === KEY.ENTER) {yesBtn.click();}
            },
        });
        var nameLabel = createElement("label", {
            for:"cmpy-mgmt-expand-industry-name-input",
            innerText:"Division name: ",
        });
        yesBtn = createElement("span", {
            class:"popup-box-button",
            innerText:"Create Division",
            clickListener: ()=>{
                const ind = selector.options[selector.selectedIndex].value;
                const newDivisionName = nameInput.value;

                for (let i = 0; i < this.corp.divisions.length; ++i) {
                    if (this.corp.divisions[i].name === newDivisionName) {
                        dialogBoxCreate("This name is already in use!");
                        return false;
                    }
                }
                if (this.corp.funds.lt(IndustryStartingCosts[ind])) {
                    dialogBoxCreate("Not enough money to create a new division in this industry");
                } else if (newDivisionName === "") {
                    dialogBoxCreate("New division must have a name!");
                } else {
                    this.corp.funds = this.corp.funds.minus(IndustryStartingCosts[ind]);
                    var newInd = new Industry({
                        corp: this.corp,
                        name: newDivisionName,
                        type: ind,
                    });
                    this.corp.divisions.push(newInd);

                    // Set routing to the new division so that the UI automatically switches to it
                    this.routing.routeTo(newDivisionName);

                    removeElementById("cmpy-mgmt-expand-industry-popup");
                    this.rerender();
                }
                return false;
            },
        });

        const noBtn = createPopupCloseButton(popupId, {
            display: "inline-block",
            innerText: "Cancel",
        });

        // Make an object to keep track of what industries you're already in
        const ownedIndustries = {};
        for (let i = 0; i < this.corp.divisions.length; ++i) {
            ownedIndustries[this.corp.divisions[i].type] = true;
        }

        // Add industry types to selector
        // Have Agriculture be first as recommended option
        if (!ownedIndustries["Agriculture"]) {
            selector.add(createElement("option", {
                text:Industries["Agriculture"], value:"Agriculture",
            }));
        }

        for (var key in Industries) {
            if (key !== "Agriculture" && Industries.hasOwnProperty(key) && !ownedIndustries[key]) {
                var ind = Industries[key];
                selector.add(createElement("option", {
                    text: ind,value:key,
                }));
            }
        }

        //Initial Industry Description
        var ind = selector.options[selector.selectedIndex].value;
        industryDescription.innerHTML = (IndustryDescriptions[ind] + "<br><br>");

        //Change the industry description text based on selected option
        selector.addEventListener("change", function() {
            var ind = selector.options[selector.selectedIndex].value;
            industryDescription.innerHTML = IndustryDescriptions[ind] + "<br><br>";
        });

        //Add to DOM
        const elems = [];
        elems.push(txt);
        elems.push(selector);
        elems.push(industryDescription);
        elems.push(nameLabel);
        elems.push(nameInput);
        elems.push(noBtn);
        elems.push(yesBtn);

        createPopup(popupId, elems);
        nameInput.focus();

        return false;
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

    // Create a popup that lets the player sell Corporation shares
    // This is created when the player clicks the "Sell Shares" button in the overview panel
    createSellSharesPopup() {
        const popupId = "cmpy-mgmt-sell-shares-popup";
        const currentStockPrice = this.corp.sharePrice;
        const txt = createElement("p", {
            innerHTML: "Enter the number of shares you would like to sell. The money from " +
                       "selling your shares will go directly to you (NOT your Corporation).<br><br>" +
                       "Selling your shares will cause your corporation's stock price to fall due to " +
                       "dilution. Furthermore, selling a large number of shares all at once will have an immediate effect " +
                       "in reducing your stock price.<br><br>" +
                       "The current price of your " +
                       "company's stock is " + numeralWrapper.format(currentStockPrice, "$0.000a"),
        });
        const profitIndicator = createElement("p");
        const input = createElement("input", {
            class: "text-input",
            type:"number", placeholder:"Shares to sell", margin:"5px",
            inputListener: ()=> {
                var numShares = Math.round(input.value);
                if (isNaN(numShares) || numShares <= 0) {
                    profitIndicator.innerText = "ERROR: Invalid value entered for number of shares to sell"
                } else if (numShares > this.corp.numShares) {
                    profitIndicator.innerText = "You don't have this many shares to sell!";
                } else {
                    const stockSaleResults = this.corp.calculateShareSale(numShares);
                    const profit = stockSaleResults[0];
                    profitIndicator.innerText = "Sell " + numShares + " shares for a total of " +
                                                numeralWrapper.format(profit, '$0.000a');
                }
            },
        });
        const confirmBtn = createElement("button", {
            class:"a-link-button", innerText:"Sell shares", display:"inline-block",
            clickListener:()=>{
                var shares = Math.round(input.value);
                if (isNaN(shares) || shares <= 0) {
                    dialogBoxCreate("ERROR: Invalid value for number of shares");
                } else if (shares > this.corp.numShares) {
                    dialogBoxCreate("ERROR: You don't have this many shares to sell");
                } else {
                    const stockSaleResults = this.corp.calculateShareSale(shares);
                    const profit = stockSaleResults[0];
                    const newSharePrice = stockSaleResults[1];
                    const newSharesUntilUpdate = stockSaleResults[2];

                    this.corp.numShares -= shares;
                    if (isNaN(this.corp.issuedShares)) {
                        console.error(`Corporation issuedShares is NaN: ${this.corp.issuedShares}`);
                        var res = parseInt(this.corp.issuedShares);
                        if (isNaN(res)) {
                            this.corp.issuedShares = 0;
                        } else {
                            this.corp.issuedShares = res;
                        }
                    }
                    this.corp.issuedShares += shares;
                    this.corp.sharePrice = newSharePrice;
                    this.corp.shareSalesUntilPriceUpdate = newSharesUntilUpdate;
                    this.corp.shareSaleCooldown = SellSharesCooldown;
                    Player.gainMoney(profit);
                    Player.recordMoneySource(profit, "corporation");
                    removeElementById(popupId);
                    dialogBoxCreate(`Sold ${numeralWrapper.formatMoney(shares, "0.000a")} shares for ` +
                                    `${numeralWrapper.formatMoney(profit, "$0.000a")}. ` +
                                    `The corporation's stock price fell to ${numeralWrapper.formatMoney(this.corp.sharePrice)} ` +
                                    `as a result of dilution.`);

                    this.rerender();
                    return false;
                }

            },
        });
        const cancelBtn = createPopupCloseButton(popupId, {
            class: "std-button",
            display: "inline-block",
            innerText: "Cancel",
        });

        createPopup(popupId, [txt, profitIndicator, input, confirmBtn, cancelBtn]);
        input.focus();
    }

    rerender() {
        this.corp.rerender();
    }
}
