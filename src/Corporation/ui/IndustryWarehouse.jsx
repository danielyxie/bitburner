// React Component for displaying an Industry's warehouse information
// (right-side panel in the Industry UI)
import React from "react";
import { BaseReactComponent }           from "./BaseReactComponent";

import { OfficeSpace,
         WarehouseInitialCost,
         WarehouseUpgradeBaseCost,
         ProductProductionCostRatio }   from "../Corporation";
import { Material }                     from "../Material";
import { Product }                      from "../Product";
import { Warehouse }                    from "../Warehouse";

import { numeralWrapper }               from "../../ui/numeralFormat";

import { isString }                     from "../../../utils/helpers/isString";

// Creates the UI for a single Product type
function ProductComponent(props) {
    const corp = props.corp;
    const division = props.division;
    const warehouse = props.warehouse;
    const city = props.city;
    const product = props.product;
    const eventHandler = props.eventHandler;

    // Numeraljs formatters
    const nf = "0.000";
    const nfB = "0.000a"; // For numbers that might be big

    const hasUpgradeDashboard = division.hasResearch("uPgrade: Dashboard");

    // Total product gain = production - sale
    const totalGain = product.data[city][1] - product.data[city][2];

    // Sell button
    let sellButtonText;
    if (product.sllman[city][0]) {
        if (isString(product.sllman[city][1])) {
            sellButtonText = `Sell (${numeralWrapper.format(product.data[city][2], nfB)}/${product.sllman[city][1]})`;
        } else {
            sellButtonText = `Sell (${numeralWrapper.format(product.data[city][2], nfB)}/${numeralWrapper.format(product.sllman[city][1], nfB)})`;
        }
    } else {
        sellButtonText = "Sell (0.000/0.000)";
    }

    if (product.marketTa2) {
        sellButtonText += (" @ " + numeralWrapper.formatMoney(product.marketTa2Price[city]));
    } else if (product.marketTa1) {
        const markupLimit = product.rat / product.mku;
        sellButtonText += (" @ " + numeralWrapper.formatMoney(product.pCost + markupLimit));
    } else if (product.sCost) {
        if (isString(product.sCost)) {
            sellButtonText += (" @ " + product.sCost);
        } else {
            sellButtonText += (" @ " + numeralWrapper.format(product.sCost, "$0.000a"));
        }
    }
    const sellButtonOnClick = eventHandler.createSellProductPopup.bind(eventHandler, product, city);

    // Limit Production button
    let limitProductionButtonText = "Limit Production";
    if (product.prdman[city][0]) {
        limitProductionButtonText += " (" + numeralWrapper.format(product.prdman[city][1], nf) + ")";
    }
    const limitProductionButtonOnClick = eventHandler.createLimitProductProdutionPopup.bind(eventHandler, product, city);

    // Discontinue Button
    const discontinueButtonOnClick = eventHandler.createDiscontinueProductPopup.bind(eventHandler, product, division);

    // Market TA button
    const marketTaButtonOnClick = eventHandler.createProductMarketTaPopup.bind(eventHandler, product, division);

    // Unfinished Product
    if (!product.fin) {
        if (hasUpgradeDashboard) {
            return (
                <div className={"cmpy-mgmt-warehouse-product-div"} key={product.name}>
                    <p>Designing {product.name}...</p><br />
                    <p>{numeralWrapper.format(product.prog, "0.00")}% complete</p>
                    <br />

                    <div>
                        <button className={"std-button"} onClick={sellButtonOnClick}>
                            {sellButtonText}
                        </button><br />
                        <button className={"std-button"} onClick={limitProductionButtonOnClick}>
                            {limitProductionButtonText}
                        </button>
                        <button className={"std-button"} onClick={discontinueButtonOnClick}>
                            Discontinue
                        </button>
                        {
                            division.hasResearch("Market-TA.I") &&
                            <button className={"std-button"} onClick={marketTaButtonOnClick}>
                                Market-TA
                            </button>
                        }
                    </div>
                </div>
            )
        } else {
            return (
                <div className={"cmpy-mgmt-warehouse-product-div"} key={product.name}>
                    <p>Designing {product.name}...</p><br />
                    <p>{numeralWrapper.format(product.prog, "0.00")}% complete</p>
                </div>
            );
        }
    }

    return (
        <div className={"cmpy-mgmt-warehouse-product-div"} key={props.key}>
            <p className={"tooltip"}>
                {product.name}: {numeralWrapper.format(product.data[city][0], nfB)} ({numeralWrapper.format(totalGain, nfB)}/s)
                <span className={"tooltiptext"}>
                    Prod: {numeralWrapper.format(product.data[city][1], nfB)}/s
                    <br />
                    Sell: {numeralWrapper.format(product.data[city][2], nfB)} /s
                </span>
            </p><br />
            <p className={"tooltip"}>
                Rating: {numeralWrapper.format(product.rat, nf)}
                <span className={"tooltiptext"}>
                    Quality: {numeralWrapper.format(product.qlt, nf)} <br />
                    Performance: {numeralWrapper.format(product.per, nf)} <br />
                    Durability: {numeralWrapper.format(product.dur, nf)} <br />
                    Reliability: {numeralWrapper.format(product.rel, nf)} <br />
                    Aesthetics: {numeralWrapper.format(product.aes, nf)} <br />
                    Features: {numeralWrapper.format(product.fea, nf)}
                    {
                        corp.unlockUpgrades[2] === 1 && <br />
                    }
                    {
                        corp.unlockUpgrades[2] === 1 &&
                        "Demand: " + numeralWrapper.format(product.dmd, nf)
                    }
                    {
                        corp.unlockUpgrades[3] === 1 && <br />
                    }
                    {
                        corp.unlockUpgrades[3] === 1 &&
                        "Competition: " + numeralWrapper.format(product.cmp, nf)
                    }

                </span>
            </p><br />
            <p className={"tooltip"}>
                Est. Production Cost:  {numeralWrapper.formatMoney(product.pCost / ProductProductionCostRatio)}
                <span className={"tooltiptext"}>
                An estimate of the material cost it takes to create this Product.
                </span>
            </p><br />
            <p className={"tooltip"}>
                Est. Market Price: {numeralWrapper.formatMoney(product.pCost)}
                <span className={"tooltiptext"}>
                    An estimate of how much consumers are willing to pay for this product.
                    Setting the sale price above this may result in less sales. Setting the sale price below this may result
                    in more sales.
                </span>
            </p>

            <div>
                <button className={"std-button"} onClick={sellButtonOnClick}>
                    {sellButtonText}
                </button><br />
                <button className={"std-button"} onClick={limitProductionButtonOnClick}>
                    {limitProductionButtonText}
                </button>
                <button className={"std-button"} onClick={discontinueButtonOnClick}>
                    Discontinue
                </button>
                {
                    division.hasResearch("Market-TA.I") &&
                    <button className={"std-button"} onClick={marketTaButtonOnClick}>
                        Market-TA
                    </button>
                }
            </div>
        </div>
    )
}

// Creates the UI for a single Material type
function MaterialComponent(props) {
    const corp = props.corp;
    const division = props.division;
    const warehouse = props.warehouse;
    const city = props.city;
    const mat = props.mat;
    const eventHandler = props.eventHandler;
    const markupLimit = mat.getMarkupLimit();
    const office = division.offices[city];
    if (!(office instanceof OfficeSpace)) {
        throw new Error(`Could not get OfficeSpace object for this city (${city})`);
    }

    // Numeraljs formatter
    const nf = "0.000";
    const nfB = "0.000a"; // For numbers that might be biger

    // Total gain or loss of this material (per second)
    const totalGain = mat.buy + mat.prd + mat.imp - mat.sll - mat.totalExp;

    // Competition and demand info, if they're unlocked
    let cmpAndDmdText = "";
    if (corp.unlockUpgrades[2] === 1) {
        cmpAndDmdText += "<br>Demand: " + numeralWrapper.format(mat.dmd, nf);
    }
    if (corp.unlockUpgrades[3] === 1) {
        cmpAndDmdText += "<br>Competition: " + numeralWrapper.format(mat.cmp, nf);
    }

    // Flag that determines whether this industry is "new" and the current material should be
    // marked with flashing-red lights
    const tutorial = division.newInd && Object.keys(division.reqMats).includes(mat.name) &&
                     mat.buy === 0 && mat.imp === 0;

    // Purchase material button
    const purchaseButtonText = `Buy (${numeralWrapper.format(mat.buy, nf)})`;
    const purchaseButtonClass = tutorial ? "std-button flashing-button tooltip" : "std-button";
    const purchaseButtonOnClick = eventHandler.createPurchaseMaterialPopup.bind(eventHandler, mat, division, warehouse);

    // Export material button
    const exportButtonOnClick = eventHandler.createExportMaterialPopup.bind(eventHandler, mat);

    // Sell material button
    let sellButtonText;
    if (mat.sllman[0]) {
        if (isString(mat.sllman[1])) {
            sellButtonText = `Sell (${numeralWrapper.format(mat.sll, nf)}/${mat.sllman[1]})`
        } else {
            sellButtonText = `Sell (${numeralWrapper.format(mat.sll, nf)}/${numeralWrapper.format(mat.sllman[1], nf)})`;
        }

        if (mat.marketTa2) {
            sellButtonText += " @ " + numeralWrapper.formatMoney(mat.marketTa2Price);
        } else if (mat.marketTa1) {
            sellButtonText += " @ " + numeralWrapper.formatMoney(mat.bCost + markupLimit);
        } else if (mat.sCost) {
            if (isString(mat.sCost)) {
                var sCost = mat.sCost.replace(/MP/g, mat.bCost);
                sellButtonText += " @ " + numeralWrapper.formatMoney(eval(sCost));
            } else {
                sellButtonText += " @ " + numeralWrapper.formatMoney(mat.sCost);
            }
        }
    } else {
        sellButtonText = "Sell (0.000/0.000)";
    }
    const sellButtonOnClick = eventHandler.createSellMaterialPopup.bind(eventHandler, mat);

    // Market TA button
    const marketTaButtonOnClick = eventHandler.createMaterialMarketTaPopup.bind(eventHandler, mat, division);

    return (
        <div className={"cmpy-mgmt-warehouse-material-div"} key={props.key}>
            <div style={{display: "inline-block"}}>
                <p className={"tooltip"}>
                    {mat.name}: {numeralWrapper.format(mat.qty, nfB)} ({numeralWrapper.format(totalGain, nfB)}/s)
                    <span className={"tooltiptext"}>
                        Buy: {numeralWrapper.format(mat.buy, nfB)} <br />
                        Prod: {numeralWrapper.format(mat.prd, nfB)} <br />
                        Sell: {numeralWrapper.format(mat.sll, nfB)} <br />
                        Export: {numeralWrapper.format(mat.totalExp, nfB)} <br />
                        Import: {numeralWrapper.format(mat.imp, nfB)}
                        {
                            corp.unlockUpgrades[2] === 1 && <br />
                        }
                        {
                            corp.unlockUpgrades[2] === 1 &&
                            "Demand: " + numeralWrapper.format(mat.dmd, nf)
                        }
                        {
                            corp.unlockUpgrades[3] === 1 && <br />
                        }
                        {
                            corp.unlockUpgrades[3] === 1 &&
                            "Competition: " + numeralWrapper.format(mat.cmp, nf)
                        }
                    </span>
                </p><br />
                <p className={"tooltip"}>
                    MP: {numeralWrapper.formatMoney(mat.bCost)}
                    <span className={"tooltiptext"}>
                        Market Price: The price you would pay if you were to buy this material on the market
                    </span>
                </p> <br />
                <p className={"tooltip"}>
                    Quality: {numeralWrapper.format(mat.qlt, "0.00a")}
                    <span className={"tooltiptext"}>
                        The quality of your material. Higher quality will lead to more sales
                    </span>
                </p>
            </div>

            <div style={{display: "inline-block"}}>
                <button className={purchaseButtonClass} onClick={purchaseButtonOnClick}>
                    {purchaseButtonText}
                    {
                        tutorial &&
                        <span className={"tooltiptext"}>
                            Purchase your required materials to get production started!
                        </span>
                    }
                </button>

                {
                    corp.unlockUpgrades[0] === 1 &&
                    <button className={"std-button"} onClick={exportButtonOnClick}>
                        Export
                    </button>
                }
                <br />

                <button className={"std-button"} onClick={sellButtonOnClick}>
                    {sellButtonText}
                </button>

                {
                    division.hasResearch("Market-TA.I") &&
                    <button className={"std-button"} onClick={marketTaButtonOnClick}>
                        Market-TA
                    </button>
                }

            </div>
        </div>
    )
}

export class IndustryWarehouse extends BaseReactComponent {
    renderWarehouseUI() {
        const corp = this.corp();
        const division = this.routing().currentDivision; // Validated in render()
        const warehouse = division.warehouses[this.props.currentCity]; // Validated in render()

        // General Storage information at the top
        const sizeUsageStyle = {
            color: warehouse.sizeUsed >= warehouse.size ? "red" : "white",
            margin: "5px",
        }

        // Upgrade Warehouse size button
        const sizeUpgradeCost = WarehouseUpgradeBaseCost * Math.pow(1.07, warehouse.level + 1);
        const canAffordUpgrade = (corp.funds.gt(sizeUpgradeCost));
        const upgradeWarehouseClass = canAffordUpgrade ? "std-button" : "a-link-button-inactive";
        const upgradeWarehouseOnClick = () => {
            ++warehouse.level;
            warehouse.updateSize(corp, division);
            corp.funds = corp.funds.minus(sizeUpgradeCost);
            corp.rerender();
            return;
        }

        // Industry material Requirements
        let generalReqsText = "This Industry uses [" + Object.keys(division.reqMats).join(", ") +
                      "] in order to ";
        if (division.prodMats.length > 0) {
            generalReqsText += "produce [" + division.prodMats.join(", ") + "] ";
            if (division.makesProducts) {
                generalReqsText += " and " + division.getProductDescriptionText();
            }
        } else if (division.makesProducts) {
            generalReqsText += (division.getProductDescriptionText() + ".");
        }

        const ratioLines = [];
        for (const matName in division.reqMats) {
            if (division.reqMats.hasOwnProperty(matName)) {
                const text = [" *", division.reqMats[matName], matName].join(" ");
                ratioLines.push((
                    <div key={matName}>
                        <p>{text}</p>
                    </div>
                ));
            }
        }

        let createdItemsText = "in order to create ";
        if (division.prodMats.length > 0) {
            createdItemsText += "one of each produced Material (" + division.prodMats.join(", ") + ") ";
            if (division.makesProducts) {
                createdItemsText += "or to create one of its Products";
            }
        } else if (division.makesProducts) {
            createdItemsText += "one of its Products";
        }

        // Current State:
        let stateText;
        switch(division.state) {
            case "START":
                stateText = "Current state: Preparing...";
                break;
            case "PURCHASE":
                stateText = "Current state: Purchasing materials...";
                break;
            case "PRODUCTION":
                stateText = "Current state: Producing materials and/or products...";
                break;
            case "SALE":
                stateText = "Current state: Selling materials and/or products...";
                break;
            case "EXPORT":
                stateText = "Current state: Exporting materials and/or products...";
                break;
            default:
                console.error(`Invalid state: ${division.state}`);
                break;
        }

        // Smart Supply Checkbox
        const smartSupplyCheckboxId = "cmpy-mgmt-smart-supply-checkbox";
        const smartSupplyOnChange = (e) => {
            warehouse.smartSupplyEnabled = e.target.checked;
            corp.rerender();
        }

        // Materials that affect Production multiplier
        const prodMultiplierMats = ["Hardware", "Robots", "AICores", "RealEstate"];

        // Returns a boolean indicating whether the given material is relevant for the
        // current industry.
        function isRelevantMaterial(matName) {
            if (Object.keys(division.reqMats).includes(matName))    { return true; }
            if (division.prodMats.includes(matName))                { return true; }
            if (prodMultiplierMats.includes(matName))               { return true; }

            return false;
        }

        // Create React components for materials
        const mats = [];
        for (const matName in warehouse.materials) {
            if (warehouse.materials[matName] instanceof Material) {
                // Only create UI for materials that are relevant for the industry
                if (isRelevantMaterial(matName)) {
                    mats.push(MaterialComponent({
                        city: this.props.currentCity,
                        corp: corp,
                        division: division,
                        eventHandler: this.eventHandler(),
                        key: matName,
                        mat: warehouse.materials[matName],
                        warehouse: warehouse,
                    }));
                }
            }
        }

        // Create React components for products
        const products = [];
        if (division.makesProducts && Object.keys(division.products).length > 0) {
            for (const productName in division.products) {
                if (division.products[productName] instanceof Product) {
                    products.push(ProductComponent({
                        city: this.props.currentCity,
                        corp: corp,
                        division: division,
                        eventHandler: this.eventHandler(),
                        key: productName,
                        product: division.products[productName],
                        warehouse: warehouse,
                    }));
                }
            }
        }

        return (
            <div className={"cmpy-mgmt-warehouse-panel"}>
                <p className={"tooltip"} style={sizeUsageStyle}>
                    Storage: {numeralWrapper.format(warehouse.sizeUsed, "0.000")} / {numeralWrapper.format(warehouse.size, "0.000")}
                    <span className={"tooltiptext"} dangerouslySetInnerHTML={{__html: warehouse.breakdown}}></span>
                </p>

                <button className={upgradeWarehouseClass} onClick={upgradeWarehouseOnClick}>
                    Upgrade Warehouse Size - {numeralWrapper.formatMoney(sizeUpgradeCost)}
                </button>

                <p>{generalReqsText}. The exact requirements for production are:</p><br />
                {ratioLines}<br />
                <p>{createdItemsText}</p>
                <p>
                    To get started with production, purchase your required materials
                    or import them from another of your company's divisions.
                </p><br />

                <p>{stateText}</p>

                {
                    corp.unlockUpgrades[1] &&
                    <div>
                        <label style={{color: "white"}} htmlFor={smartSupplyCheckboxId}>
                            Enable Smart Supply
                        </label>
                        <input  type={"checkbox"}
                                id={smartSupplyCheckboxId}
                                onChange={smartSupplyOnChange}
                                style={{margin: "3px"}}
                                checked={warehouse.smartSupplyEnabled}
                        />
                    </div>
                }

                {mats}

                {products}

            </div>
        )
    }

    render() {
        const corp = this.corp();
        const division = this.routing().currentDivision;
        if (division == null) {
            throw new Error(`Routing does not hold reference to the current Industry`);
        }
        const warehouse = division.warehouses[this.props.currentCity];

        const newWarehouseOnClick = this.eventHandler().purchaseWarehouse.bind(this.eventHandler(), division, this.props.currentCity);

        if (warehouse instanceof Warehouse) {
            return this.renderWarehouseUI();
        } else {
            return (
                <div className={"cmpy-mgmt-warehouse-panel"}>
                    <button className={"std-button"} onClick={newWarehouseOnClick}>
                        Purchase Warehouse ({numeralWrapper.formatMoney(WarehouseInitialCost)})
                    </button>
                </div>
            )
        }
    }
}
