// React Component for displaying an Industry's overview information
// (top-left panel in the Industry UI)
import React from "react";

import { OfficeSpace }              from "../OfficeSpace";
import { Industries }               from "../IndustryData";
import { IndustryUpgrades }         from "../IndustryUpgrades";
import { numeralWrapper }           from "../../ui/numeralFormat";
import { dialogBoxCreate }          from "../../../utils/DialogBox";
import { createProgressBarText }    from "../../../utils/helpers/createProgressBarText";
import { MakeProductPopup }         from "./MakeProductPopup";
import { createPopup }              from "../../ui/React/createPopup";

interface IProps {
    routing: any;
    corp: any;
    currentCity: string;
}

export function IndustryOverview(props: IProps): React.ReactElement {
    function renderMakeProductButton(): React.ReactElement {
        const division = props.routing.currentDivision; // Validated inside render()

        let createProductButtonText = "";
        let createProductPopupText = "";
        switch(division.type) {
            case Industries.Food:
                createProductButtonText = "Build Restaurant";
                createProductPopupText = "Build and manage a new restaurant!"
                break;
            case Industries.Tobacco:
                createProductButtonText = "Create Product";
                createProductPopupText = "Create a new tobacco product!";
                break;
            case Industries.Pharmaceutical:
                createProductButtonText = "Create Drug";
                createProductPopupText = "Design and develop a new pharmaceutical drug!";
                break;
            case Industries.Computer:
            case "Computer":
                createProductButtonText = "Create Product";
                createProductPopupText = "Design and manufacture a new computer hardware product!";
                break;
            case Industries.Robotics:
                createProductButtonText = "Design Robot";
                createProductPopupText = "Design and create a new robot or robotic system!";
                break;
            case Industries.Software:
                createProductButtonText = "Develop Software";
                createProductPopupText = "Develop a new piece of software!";
                break;
            case Industries.Healthcare:
                createProductButtonText = "Build Hospital";
                createProductPopupText = "Build and manage a new hospital!";
                break;
            case Industries.RealEstate:
                createProductButtonText = "Develop Property";
                createProductPopupText = "Develop a new piece of real estate property!";
                break;
            default:
                createProductButtonText = "Create Product";
                createProductPopupText = "Create a new product!";
                return (<></>);
        }
        createProductPopupText += "<br><br>To begin developing a product, " +
            "first choose the city in which it will be designed. The stats of your employees " +
            "in the selected city affect the properties of the finished product, such as its " +
            "quality, performance, and durability.<br><br>" +
            "You can also choose to invest money in the design and marketing of " +
            "the product. Investing money in its design will result in a superior product. " +
            "Investing money in marketing the product will help the product's sales.";

        const hasMaxProducts = division.hasMaximumNumberProducts();

        const className = hasMaxProducts ? "a-link-button-inactive tooltip" : "std-button";
        const buttonStyle = {
            margin: "6px",
            display: "inline-block",
        }

        function openMakeProductPopup() {
            const popupId = "cmpy-mgmt-create-product-popup";
            createPopup(popupId, MakeProductPopup, {
                popupText: createProductPopupText,
                division: division,
                corp: props.corp,
                popupId: popupId,
            });
        }

        return (
            <button className={className} onClick={openMakeProductPopup} style={buttonStyle}>
                {createProductButtonText}
                {
                    hasMaxProducts &&
                    <span className={"tooltiptext"}>
                        You have reached the maximum number of products: {division.getMaximumNumberProducts()}
                    </span>
                }
            </button>
        )
    }

    function renderText(): React.ReactElement {
        const corp = props.corp;
        const division = props.routing.currentDivision; // Validated inside render()

        const vechain = (corp.unlockUpgrades[4] === 1);
        const profit = division.lastCycleRevenue.minus(division.lastCycleExpenses).toNumber();

        const genInfo = `Industry: ${division.type} (Corp Funds: ${numeralWrapper.formatMoney(corp.funds.toNumber())})`;
        const awareness = `Awareness: ${numeralWrapper.format(division.awareness, "0.000")}`;
        const popularity = `Popularity: ${numeralWrapper.format(division.popularity, "0.000")}`;

        let advertisingInfo = false;
        const advertisingFactors = division.getAdvertisingFactors();
        const awarenessFac = advertisingFactors[1];
        const popularityFac = advertisingFactors[2];
        const ratioFac = advertisingFactors[3];
        const totalAdvertisingFac = advertisingFactors[0];
        if (vechain) { advertisingInfo = true; }

        const revenue = `Revenue: ${numeralWrapper.formatMoney(division.lastCycleRevenue.toNumber())} / s`;
        const expenses = `Expenses: ${numeralWrapper.formatMoney(division.lastCycleExpenses.toNumber())} /s`;
        const profitStr = `Profit: ${numeralWrapper.formatMoney(profit)} / s`;

        function productionMultHelpTipOnClick(): void {
            // Wrapper for createProgressBarText()
            // Converts the industry's "effectiveness factors"
            // into a graphic (string) depicting how high that effectiveness is
            function convertEffectFacToGraphic(fac: number): string {
                return createProgressBarText({
                    progress: fac,
                    totalTicks: 20,
                });
            }

            dialogBoxCreate("Owning Hardware, Robots, AI Cores, and Real Estate " +
                            "can boost your Industry's production. The effect these " +
                            "materials have on your production varies between Industries. " +
                            "For example, Real Estate may be very effective for some Industries, " +
                            "but ineffective for others.<br><br>" +
                            "This division's production multiplier is calculated by summing " +
                            "the individual production multiplier of each of its office locations. " +
                            "This production multiplier is applied to each office. Therefore, it is " +
                            "beneficial to expand into new cities as this can greatly increase the " +
                            "production multiplier of your entire Division.<br><br>" +
                            "Below are approximations for how effective each material is at boosting " +
                            "this industry's production multiplier (Bigger bars = more effective):<br><br>" +
                            `Hardware:&nbsp;&nbsp;&nbsp; ${convertEffectFacToGraphic(division.hwFac)}<br>` +
                            `Robots:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${convertEffectFacToGraphic(division.robFac)}<br>` +
                            `AI Cores:&nbsp;&nbsp;&nbsp; ${convertEffectFacToGraphic(division.aiFac)}<br>` +
                            `Real Estate: ${convertEffectFacToGraphic(division.reFac)}`);
        }

        return (
            <div>
                {genInfo}
                <br /> <br />
                {awareness} <br />
                {popularity} <br />
                {
                    (advertisingInfo !== false) &&
                    <p className={"tooltip"}>Advertising Multiplier: x{numeralWrapper.format(totalAdvertisingFac, "0.000")}
                        <span className={"tooltiptext cmpy-mgmt-advertising-info"}>
                            Total multiplier for this industrys sales due to its awareness and popularity
                            <br />
                            Awareness Bonus: x{numeralWrapper.format(Math.pow(awarenessFac, 0.85), "0.000")}
                            <br />
                            Popularity Bonus: x{numeralWrapper.format(Math.pow(popularityFac, 0.85), "0.000")}
                            <br />
                            Ratio Multiplier: x{numeralWrapper.format(Math.pow(ratioFac, 0.85), "0.000")}
                        </span>
                    </p>
                }
                {advertisingInfo}
                <br /><br />
                {revenue} <br />
                {expenses} <br />
                {profitStr}
                <br /> <br />
                <p className={"tooltip"}>
                    Production Multiplier: {numeralWrapper.format(division.prodMult, "0.00")}
                    <span className={"tooltiptext"}>
                        Production gain from owning production-boosting materials
                        such as hardware, Robots, AI Cores, and Real Estate
                    </span>
                </p>
                <div className={"help-tip"} onClick={productionMultHelpTipOnClick}>?</div>
                <br /> <br />
                <p className={"tooltip"}>
                    Scientific Research: {numeralWrapper.format(division.sciResearch.qty, "0.000a")}
                    <span className={"tooltiptext"}>
                        Scientific Research increases the quality of the materials and
                        products that you produce.
                    </span>
                </p>
                <button className={"help-tip"} onClick={division.createResearchBox.bind(division)}>
                    Research
                </button>
            </div>
        )
    }

    function renderUpgrades(): React.ReactElement[] {
        const corp = props.corp;
        const division = props.routing.currentDivision; // Validated inside render()
        const office = division.offices[props.currentCity];
        if (!(office instanceof OfficeSpace)) {
            throw new Error(`Current City (${props.currentCity}) for UI does not have an OfficeSpace object`);
        }

        const upgrades = [];
        for (const index in IndustryUpgrades) {
            const upgrade = IndustryUpgrades[index];

            // AutoBrew research disables the Coffee upgrade
            if (division.hasResearch("AutoBrew") && upgrade[4] === "Coffee") { continue; }

            const i = upgrade[0];
            const baseCost = upgrade[1];
            const priceMult = upgrade[2];
            let cost = 0;
            switch (i) {
                case 0: //Coffee, cost is static per employee
                    cost = office.employees.length * baseCost;
                    break;
                default:
                    cost = baseCost * Math.pow(priceMult, division.upgrades[i]);
                    break;
            }

            function onClick(): void {
                if (corp.funds.lt(cost)) {
                    dialogBoxCreate("Insufficient funds");
                } else {
                    corp.funds = corp.funds.minus(cost);
                    division.upgrade(upgrade, {
                        corporation: corp,
                        office: office,
                    });
                    // corp.displayDivisionContent(division, city);
                    corp.rerender();
                }
            }

            upgrades.push(renderUpgrade({
                onClick: onClick,
                text: `${upgrade[4]} - ${numeralWrapper.formatMoney(cost)}`,
                tooltip: upgrade[5],
            }));
        }

        return upgrades;
    }

    function renderUpgrade(props: any): React.ReactElement {
        return (
            <div className={"cmpy-mgmt-upgrade-div tooltip"} onClick={props.onClick} key={props.text}>
                {props.text}
                {
                    props.tooltip != null &&
                    <span className={"tooltiptext"}>{props.tooltip}</span>
                }
            </div>
        )
    }

    const division = props.routing.currentDivision;
    if (division == null) {
        throw new Error(`Routing does not hold reference to the current Industry`);
    }

    const makeProductButton = renderMakeProductButton();

    return (
        <div className={"cmpy-mgmt-industry-overview-panel"}>
            {renderText()}
            <br />

            <u className={"industry-purchases-and-upgrades-header"}>Purchases & Upgrades</u><br />
            {renderUpgrades()} <br />

            {
                division.makesProducts &&
                makeProductButton
            }
        </div>
    )
}
