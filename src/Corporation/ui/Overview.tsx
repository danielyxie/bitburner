// React Component for displaying Corporation Overview info
import React from "react";
import { LevelableUpgrade }             from "./LevelableUpgrade";
import { UnlockUpgrade }                from "./UnlockUpgrade";
import { BribeFactionPopup }            from "./BribeFactionPopup";
import { SellSharesPopup }              from "./SellSharesPopup";
import { BuybackSharesPopup }           from "./BuybackSharesPopup";

import { CorporationConstants }         from "../data/Constants";
import { CorporationUnlockUpgrades }    from "../data/CorporationUnlockUpgrades";
import { CorporationUpgrades }          from "../data/CorporationUpgrades";

import { CONSTANTS } from "../../Constants";
import { numeralWrapper } from "../../ui/numeralFormat";
import { convertTimeMsToTimeElapsedString } from "../../../utils/StringHelperFunctions";
import { createPopup } from "../../ui/React/createPopup";
import { IPlayer } from "../../PersonObjects/IPlayer";

interface IProps {
    corp: any;
    eventHandler: any;
    player: IPlayer;
}

export function Overview(props: IProps): React.ReactElement {
    // Generic Function for Creating a button
    function createButton(props: any) {
        let className = props.class ? props.class : "std-button";
        const displayStyle = props.display ? props.display : "block";
        const hasTooltip = (props.tooltip != null);
        if (hasTooltip) {
            className += " tooltip";
        }

        return (
            <a className={className} onClick={props.onClick} style={{display: displayStyle}}>
                {props.text}
                {
                    hasTooltip &&
                    <span className={"tooltiptext"}>
                        {props.tooltip}
                    </span>
                }
            </a>
        )
    }

    // Returns a string with general information about Corporation
    function getOverviewText() {
        // Formatted text for profit
        const profit = props.corp.revenue.minus(props.corp.expenses).toNumber(),
            profitStr = profit >= 0 ? numeralWrapper.formatMoney(profit) : "-" + numeralWrapper.format(-1 * profit, "$0.000a");

        // Formatted text for dividend information, if applicable
        let dividendStr = "";
        if (props.corp.dividendPercentage > 0 && profit > 0) {
            const totalDividends = (props.corp.dividendPercentage / 100) * profit;
            const retainedEarnings = profit - totalDividends;
            const dividendsPerShare = totalDividends / props.corp.totalShares;
            const playerEarnings = props.corp.numShares * dividendsPerShare;

            dividendStr = `Retained Profits (after dividends): ${numeralWrapper.format(retainedEarnings, "$0.000a")} / s<br><br>` +
                          `Dividend Percentage: ${numeralWrapper.format(props.corp.dividendPercentage / 100, "0%")}<br>` +
                          `Dividends per share: ${numeralWrapper.format(dividendsPerShare, "$0.000a")} / s<br>` +
                          `Your earnings as a shareholder (Pre-Tax): ${numeralWrapper.format(playerEarnings, "$0.000a")} / s<br>` +
                          `Dividend Tax Rate: ${props.corp.dividendTaxPercentage}%<br>` +
                          `Your earnings as a shareholder (Post-Tax): ${numeralWrapper.format(playerEarnings * (1 - (props.corp.dividendTaxPercentage / 100)), "$0.000a")} / s<br><br>`;
        }

        let txt = "Total Funds: " + numeralWrapper.format(props.corp.funds.toNumber(), '$0.000a') + "<br>" +
                  "Total Revenue: " + numeralWrapper.format(props.corp.revenue.toNumber(), "$0.000a") + " / s<br>" +
                  "Total Expenses: " + numeralWrapper.format(props.corp.expenses.toNumber(), "$0.000a") + " / s<br>" +
                  "Total Profits: " + profitStr + " / s<br>" +
                  dividendStr +
                  "Publicly Traded: " + (props.corp.public ? "Yes" : "No") + "<br>" +
                  "Owned Stock Shares: " + numeralWrapper.format(props.corp.numShares, '0.000a') + "<br>" +
                  "Stock Price: " + (props.corp.public ? numeralWrapper.formatMoney(props.corp.sharePrice) : "N/A") + "<br>" +
                  "<p class='tooltip'>Total Stock Shares: " + numeralWrapper.format(props.corp.totalShares, "0.000a") +
                  "<span class='tooltiptext'>" +
                      `Outstanding Shares: ${numeralWrapper.format(props.corp.issuedShares, "0.000a")}<br>` +
                      `Private Shares: ${numeralWrapper.format(props.corp.totalShares - props.corp.issuedShares - props.corp.numShares, "0.000a")}` +
                  "</span></p><br><br>";

        const storedTime = props.corp.storedCycles * CONSTANTS.MilliPerCycle;
        if (storedTime > 15000) {
            txt += `Bonus time: ${convertTimeMsToTimeElapsedString(storedTime)}<br><br>`;
        }

        const prodMult        = props.corp.getProductionMultiplier(),
            storageMult     = props.corp.getStorageMultiplier(),
            advMult         = props.corp.getAdvertisingMultiplier(),
            empCreMult      = props.corp.getEmployeeCreMultiplier(),
            empChaMult      = props.corp.getEmployeeChaMultiplier(),
            empIntMult      = props.corp.getEmployeeIntMultiplier(),
            empEffMult      = props.corp.getEmployeeEffMultiplier(),
            salesMult       = props.corp.getSalesMultiplier(),
            sciResMult      = props.corp.getScientificResearchMultiplier();
        if (prodMult > 1)       {txt += "Production Multiplier: " + numeralWrapper.format(prodMult, "0.000") + "<br>";}
        if (storageMult > 1)    {txt += "Storage Multiplier: " + numeralWrapper.format(storageMult, "0.000") + "<br>";}
        if (advMult > 1)        {txt += "Advertising Multiplier: " + numeralWrapper.format(advMult, "0.000") + "<br>";}
        if (empCreMult > 1)     {txt += "Empl. Creativity Multiplier: " + numeralWrapper.format(empCreMult, "0.000") + "<br>";}
        if (empChaMult > 1)     {txt += "Empl. Charisma Multiplier: " + numeralWrapper.format(empChaMult, "0.000") + "<br>";}
        if (empIntMult > 1)     {txt += "Empl. Intelligence Multiplier: " + numeralWrapper.format(empIntMult, "0.000") + "<br>";}
        if (empEffMult > 1)     {txt += "Empl. Efficiency Multiplier: " + numeralWrapper.format(empEffMult, "0.000") + "<br>";}
        if (salesMult > 1)      {txt += "Sales Multiplier: " + numeralWrapper.format(salesMult, "0.000") + "<br>";}
        if (sciResMult > 1)     {txt += "Scientific Research Multiplier: " + numeralWrapper.format(sciResMult, "0.000") + "<br>";}

        return txt;
    }

    // Render the buttons that lie below the overview text.
    // These are mainly for things such as managing finances/stock
    function renderButtons() {
        // Create a "Getting Started Guide" button that lets player view the
        // handbook and adds it to the players home computer
        const getStarterGuideOnClick = props.corp.getStarterGuide.bind(props.corp);
        const getStarterGuideBtn = createButton({
            class: "a-link-button",
            display: "inline-block",
            onClick: getStarterGuideOnClick,
            text: "Getting Started Guide",
            tooltip: "Get a copy of and read 'The Complete Handbook for Creating a Successful Corporation.' " +
                     "This is a .lit file that guides you through the beginning of setting up a Corporation and " +
                     "provides some tips/pointers for helping you get started with managing it.",
        });

        function openBribeFactionPopup() {
            const popupId = "corp-bribe-popup";
            createPopup(popupId, BribeFactionPopup, {
                player: props.player,
                popupId: popupId,
                corp: props.corp,
            });
        }

        // Create a "Bribe Factions" button if your Corporation is powerful enough.
        // This occurs regardless of whether you're public or private
        const canBribe = (props.corp.determineValuation() >= CorporationConstants.BribeThreshold) || true;
        const bribeFactionsClass = (canBribe ? "a-link-button" : "a-link-button-inactive");
        const bribeFactionsBtn = createButton({
            class: bribeFactionsClass,
            display: "inline-block",
            onClick: openBribeFactionPopup,
            text: "Bribe Factions",
            tooltip: (canBribe
                        ? "Use your Corporations power and influence to bribe Faction leaders in exchange for reputation"
                        : "Your Corporation is not powerful enough to bribe Faction leaders"),

        });

        const generalBtns = {
            bribeFactions: bribeFactionsBtn,
            getStarterGuide: getStarterGuideBtn,
        };

        if (props.corp.public) {
            return renderPublicButtons(generalBtns);
        } else {
            return renderPrivateButtons(generalBtns);
        }
    }


    // Render the buttons for when your Corporation is still private
    function renderPrivateButtons(generalBtns: any) {
        const fundingAvailable = (props.corp.fundingRound < 4);
        const findInvestorsClassName = fundingAvailable ? "std-button" : "a-link-button-inactive";
        const findInvestorsTooltip = fundingAvailable ? "Search for private investors who will give you startup funding in exchangefor equity (stock shares) in your company" : null;

        const findInvestorsOnClick = props.corp.getInvestment.bind(props.corp);
        const goPublicOnClick = props.corp.goPublic.bind(props.corp);

        const findInvestorsBtn = createButton({
            class: findInvestorsClassName,
            onClick: findInvestorsOnClick,
            style: "inline-block",
            text: "Find Investors",
            tooltip: findInvestorsTooltip,
            display: "inline-block",
        });
        const goPublicBtn = createButton({
            class: "std-button",
            onClick: goPublicOnClick,
            style: "inline-block",
            display: "inline-block",
            text: "Go Public",
            tooltip: "Become a publicly traded and owned entity. Going public " +
                     "involves issuing shares for an IPO. Once you are a public " +
                     "company, your shares will be traded on the stock market.",
        });

        return (
            <div>
                {generalBtns.getStarterGuide}
                {findInvestorsBtn}
                {goPublicBtn}
                <br />
                {generalBtns.bribeFactions}
            </div>
        )

    }

    // Render the buttons for when your Corporation has gone public
    function renderPublicButtons(generalBtns: any) {
        const corp = props.corp;

        const sellSharesOnCd = (corp.shareSaleCooldown > 0);
        const sellSharesClass = sellSharesOnCd ? "a-link-button-inactive" : "std-button";
        const sellSharesTooltip = sellSharesOnCd
                                    ? "Cannot sell shares for " + corp.convertCooldownToString(corp.shareSaleCooldown)
                                    : "Sell your shares in the company. The money earned from selling your " +
                                      "shares goes into your personal account, not the Corporation's. " +
                                      "This is one of the only ways to profit from your business venture."
        const sellSharesBtn = createButton({
            class: sellSharesClass,
            display: "inline-block",
            onClick: function(event: MouseEvent) {
                if(!event.isTrusted) return;
                const popupId = "cmpy-mgmt-sell-shares-popup";
                createPopup(popupId, SellSharesPopup, {
                    corp: props.corp,
                    player: props.player,
                    popupId: popupId,
                });
            },
            text: "Sell Shares",
            tooltip: sellSharesTooltip,
        });

        function openBuybackSharesPopup() {
            const popupId = "corp-buyback-shares-popup";
            createPopup(popupId, BuybackSharesPopup, {
                player: props.player,
                popupId: popupId,
                corp: props.corp,
            });
        }

        const buybackSharesBtn = createButton({
            class: "std-button",
            display: "inline-block",
            onClick: openBuybackSharesPopup,
            text: "Buyback shares",
            tooltip: "Buy back shares you that previously issued or sold at market price.",
        });

        const issueNewSharesOnCd = (corp.issueNewSharesCooldown > 0);
        const issueNewSharesClass = issueNewSharesOnCd ? "a-link-button-inactive" : "std-button";
        const issueNewSharesTooltip = issueNewSharesOnCd
                                        ? "Cannot issue new shares for " + corp.convertCooldownToString(corp.issueNewSharesCooldown)
                                        : "Issue new equity shares to raise capital.";
        const issueNewSharesBtn = createButton({
            class: issueNewSharesClass,
            display: "inline-block",
            onClick: props.eventHandler.createIssueNewSharesPopup,
            text: "Issue New Shares",
            tooltip: issueNewSharesTooltip,
        });

        const issueDividendsBtn = createButton({
            class: "std-button",
            display: "inline-block",
            onClick: props.eventHandler.createIssueDividendsPopup,
            text: "Issue Dividends",
            tooltip: "Manage the dividends that are paid out to shareholders (including yourself)",
        });

        return (
            <div>
                {generalBtns.getStarterGuide}
                {sellSharesBtn}
                {buybackSharesBtn}
                <br />
                {issueNewSharesBtn}
                {issueDividendsBtn}
                <br />
                {generalBtns.bribeFactions}
            </div>
        )
    }

    // Render the UI for Corporation upgrades
    function renderUpgrades() {
        // Don't show upgrades
        if (props.corp.divisions.length <= 0) { return; }

        // Create an array of all Unlocks
        const unlockUpgrades: React.ReactElement[] = [];
        Object.values(CorporationUnlockUpgrades).forEach((unlockData) => {
            if (props.corp.unlockUpgrades[unlockData[0]] === 0) {
                unlockUpgrades.push(<UnlockUpgrade
                    corp={props.corp}
                    upgradeData={unlockData}
                    key={unlockData[0]}
                />);
            }
        });

        // Create an array of properties of all unlocks
        const levelableUpgradeProps = [];
        for (let i = 0; i < props.corp.upgrades.length; ++i) {
            const upgradeData = CorporationUpgrades[i];
            const level  = props.corp.upgrades[i];

            levelableUpgradeProps.push({
                upgradeData: upgradeData,
                upgradeLevel: level,
            });
        }


        return (
            <div className={"cmpy-mgmt-upgrade-container"}>
                <h1 className={"cmpy-mgmt-upgrade-header"}> Unlocks </h1>
                {unlockUpgrades}

                <h1 className={"cmpy-mgmt-upgrade-header"}> Upgrades </h1>
                {
                    levelableUpgradeProps.map((data: any) => <LevelableUpgrade
                            corp={props.corp}
                            upgradeData={data.upgradeData}
                            upgradeLevel={data.upgradeLevel}
                            key={data.upgradeData[0]}
                        />,
                    )
                }
            </div>
        )
    }


    return (
        <div>
            <p dangerouslySetInnerHTML={{__html: getOverviewText()}}></p>
            {renderButtons()}
            <br />
            {renderUpgrades()}
        </div>
    )
}
