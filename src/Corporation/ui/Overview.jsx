// React Component for displaying Corporation Overview info
import React from "react";
import { BaseReactComponent }           from "./BaseReactComponent";
import { LevelableUpgrade }             from "./LevelableUpgrade";
import { UnlockUpgrade }                from "./UnlockUpgrade";

import { BribeThreshold }               from "../Corporation";
import { CorporationUnlockUpgrades }    from "../data/CorporationUnlockUpgrades";
import { CorporationUpgrades }          from "../data/CorporationUpgrades";

import { CONSTANTS } from "../../Constants";
import { numeralWrapper } from "../../ui/numeralFormat";

export class Overview extends BaseReactComponent {
    // Generic Function for Creating a button
    createButton(props) {
        let className = props.class ? props.class : "std-button";
        const displayStyle = props.display ? props.display : "block";
        const hasTooltip = (props.tooltip != null);
        if (hasTooltip) {
            className += " tooltip";
        }

        return (
            <a className={className} onClick={props.onClick} style={{display: {displayStyle}}}>
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
    getOverviewText() {
        // Formatted text for profit
        var profit = this.corp().revenue.minus(this.corp().expenses).toNumber(),
            profitStr = profit >= 0 ? numeralWrapper.formatMoney(profit) : "-" + numeralWrapper.format(-1 * profit, "$0.000a");

        // Formatted text for dividend information, if applicable
        let dividendStr = "";
        if (this.corp().dividendPercentage > 0 && profit > 0) {
            const totalDividends = (this.corp().dividendPercentage / 100) * profit;
            const retainedEarnings = profit - totalDividends;
            const dividendsPerShare = totalDividends / this.corp().totalShares;
            const playerEarnings = this.corp().numShares * dividendsPerShare;

            dividendStr = `Retained Profits (after dividends): ${numeralWrapper.format(retainedEarnings, "$0.000a")} / s<br><br>` +
                          `Dividend Percentage: ${numeralWrapper.format(this.corp().dividendPercentage / 100, "0%")}<br>` +
                          `Dividends per share: ${numeralWrapper.format(dividendsPerShare, "$0.000a")} / s<br>` +
                          `Your earnings as a shareholder (Pre-Tax): ${numeralWrapper.format(playerEarnings, "$0.000a")} / s<br>` +
                          `Dividend Tax Rate: ${this.corp().dividendTaxPercentage}%<br>` +
                          `Your earnings as a shareholder (Post-Tax): ${numeralWrapper.format(playerEarnings * (1 - (this.corp().dividendTaxPercentage / 100)), "$0.000a")} / s<br><br>`;
        }

        let txt = "Total Funds: " + numeralWrapper.format(this.corp().funds.toNumber(), '$0.000a') + "<br>" +
                  "Total Revenue: " + numeralWrapper.format(this.corp().revenue.toNumber(), "$0.000a") + " / s<br>" +
                  "Total Expenses: " + numeralWrapper.format(this.corp().expenses.toNumber(), "$0.000a") + "/ s<br>" +
                  "Total Profits: " + profitStr + " / s<br>" +
                  dividendStr +
                  "Publicly Traded: " + (this.corp().public ? "Yes" : "No") + "<br>" +
                  "Owned Stock Shares: " + numeralWrapper.format(this.corp().numShares, '0.000a') + "<br>" +
                  "Stock Price: " + (this.corp().public ? numeralWrapper.formatMoney(this.corp().sharePrice) : "N/A") + "<br>" +
                  "<p class='tooltip'>Total Stock Shares: " + numeralWrapper.format(this.corp().totalShares, "0.000a") +
                  "<span class='tooltiptext'>" +
                      `Outstanding Shares: ${numeralWrapper.format(this.corp().issuedShares, "0.000a")}<br>` +
                      `Private Shares: ${numeralWrapper.format(this.corp().totalShares - this.corp().issuedShares - this.corp().numShares, "0.000a")}` +
                  "</span></p><br><br>";

        const storedTime = this.corp().storedCycles * CONSTANTS.MilliPerCycle / 1000;
        if (storedTime > 15) {
            txt += `Bonus Time: ${storedTime} seconds<br><br>`;
        }

        let prodMult        = this.corp().getProductionMultiplier(),
            storageMult     = this.corp().getStorageMultiplier(),
            advMult         = this.corp().getAdvertisingMultiplier(),
            empCreMult      = this.corp().getEmployeeCreMultiplier(),
            empChaMult      = this.corp().getEmployeeChaMultiplier(),
            empIntMult      = this.corp().getEmployeeIntMultiplier(),
            empEffMult      = this.corp().getEmployeeEffMultiplier(),
            salesMult       = this.corp().getSalesMultiplier(),
            sciResMult      = this.corp().getScientificResearchMultiplier();
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
    renderButtons() {
        // Create a "Getting Started Guide" button that lets player view the
        // handbook and adds it to the players home computer
        const getStarterGuideOnClick = this.corp().getStarterGuide.bind(this.corp());
        const getStarterGuideBtn = this.createButton({
            class: "a-link-button",
            display: "inline-block",
            onClick: getStarterGuideOnClick,
            text: "Getting Started Guide",
            tooltip: "Get a copy of and read 'The Complete Handbook for Creating a Successful Corporation.' " +
                     "This is a .lit file that guides you through the beginning of setting up a Corporation and " +
                     "provides some tips/pointers for helping you get started with managing it.",
        });

        // Create a "Bribe Factions" button if your Corporation is powerful enough.
        // This occurs regardless of whether you're public or private
        const canBribe = (this.corp().determineValuation() >= BribeThreshold);
        const bribeFactionsOnClick = this.eventHandler().createBribeFactionsPopup.bind(this.eventHandler());
        const bribeFactionsClass = (canBribe ? "a-link-button" : "a-link-button-inactive");
        const bribeFactionsBtn = this.createButton({
            class: bribeFactionsClass,
            display: "inline-block",
            onClick: bribeFactionsOnClick,
            text: "Bribe Factions",
            tooltip: (canBribe
                        ? "Use your Corporations power and influence to bribe Faction leaders in exchange for reputation"
                        : "Your Corporation is not powerful enough to bribe Faction leaders"),

        });

        const generalBtns = {
            bribeFactions: bribeFactionsBtn,
            getStarterGuide: getStarterGuideBtn,
        };

        if (this.corp().public) {
            return this.renderPublicButtons(generalBtns);
        } else {
            return this.renderPrivateButtons(generalBtns);
        }
    }


    // Render the buttons for when your Corporation is still private
    renderPrivateButtons(generalBtns) {
        const fundingAvailable = (this.corp().fundingRound < 4);
        const findInvestorsClassName = fundingAvailable ? "std-button" : "a-link-button-inactive";
        const findInvestorsTooltip = fundingAvailable ? "Search for private investors who will give you startup funding in exchangefor equity (stock shares) in your company" : null;

        const findInvestorsOnClick = this.corp().getInvestment.bind(this.corp());
        const goPublicOnClick = this.corp().goPublic.bind(this.corp());

        const findInvestorsBtn = this.createButton({
            class: findInvestorsClassName,
            onClick: findInvestorsOnClick,
            style: "inline-block",
            text: "Find Investors",
            tooltip: findInvestorsTooltip
        });
        const goPublicBtn = this.createButton({
            class: "std-button",
            onClick: goPublicOnClick,
            style: "inline-block",
            text: "Go Public",
            tooltip: "Become a publicly traded and owned entity. Going public " +
                     "involves issuing shares for an IPO. Once you are a public " +
                     "company, your shares will be traded on the stock market."
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
    renderPublicButtons(generalBtns) {
        const corp = this.corp();

        const sellSharesOnClick = this.eventHandler().createSellSharesPopup.bind(this.eventHandler());
        const sellSharesOnCd = (corp.shareSaleCooldown > 0);
        const sellSharesClass = sellSharesOnCd ? "a-link-button-inactive" : "std-button";
        const sellSharesTooltip = sellSharesOnCd
                                    ? "Cannot sell shares for " + corp.convertCooldownToString(corp.shareSaleCooldown)
                                    : "Sell your shares in the company. The money earned from selling your " +
                                      "shares goes into your personal account, not the Corporation's. " +
                                      "This is one of the only ways to profit from your business venture."
        const sellSharesBtn = this.createButton({
            class: sellSharesClass,
            display: "inline-block",
            onClick: sellSharesOnClick,
            text: "Sell Shares",
            tooltip: sellSharesTooltip,
        });

        const buybackSharesOnClick = this.eventHandler().createBuybackSharesPopup.bind(this.eventHandler());
        const buybackSharesBtn = this.createButton({
            class: "std-button",
            display: "inline-block",
            onClick: buybackSharesOnClick,
            text: "Buyback shares",
            tooltip: "Buy back shares you that previously issued or sold at market price.",
        });

        const issueNewSharesOnClick = this.eventHandler().createIssueNewSharesPopup.bind(this.eventHandler());
        const issueNewSharesOnCd = (corp.issueNewSharesCooldown > 0);
        const issueNewSharesClass = issueNewSharesOnCd ? "a-link-button-inactive" : "std-button";
        const issueNewSharesTooltip = issueNewSharesOnCd
                                        ? "Cannot issue new shares for " + corp.convertCooldownToString(corp.issueNewSharesCooldown)
                                        : "Issue new equity shares to raise capital.";
        const issueNewSharesBtn = this.createButton({
            class: issueNewSharesClass,
            display: "inline-block",
            onClick: issueNewSharesOnClick,
            text: "Issue New Shares",
            tooltip: issueNewSharesTooltip,
        });

        const issueDividendsOnClick = this.eventHandler().createIssueDividendsPopup.bind(this.eventHandler());
        const issueDividendsBtn = this.createButton({
            class: "std-button",
            display: "inline-block",
            onClick: issueDividendsOnClick,
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
    renderUpgrades() {
        // Don't show upgrades
        if (this.corp().divisions.length <= 0) { return; }

        // Create an array of all Unlocks
        const unlockUpgrades = [];
        Object.values(CorporationUnlockUpgrades).forEach((unlockData) => {
            if (this.corp().unlockUpgrades[unlockData[0]] === 0) {
                unlockUpgrades.push(this.renderUnlockUpgrade(unlockData));
            }
        });

        // Create an array of properties of all unlocks
        const levelableUpgradeProps = [];
        for (let i = 0; i < this.corp().upgrades.length; ++i) {
            const upgradeData = CorporationUpgrades[i];
            const level  = this.corp().upgrades[i];

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
                    levelableUpgradeProps.map((data) => {
                        return this.renderLevelableUpgrade(data);
                    })
                }
            </div>
        )
    }

    renderUnlockUpgrade(data) {
        return (
            <UnlockUpgrade
                {...this.props}
                upgradeData={data}
                key={data[0]}
            />
        )
    }

    renderLevelableUpgrade(data) {
        return (
            <LevelableUpgrade
                {...this.props}
                upgradeData={data.upgradeData}
                upgradeLevel={data.upgradeLevel}
                key={data.upgradeData[0]}
            />
        )

    }

    render() {
        return (
            <div>
                <p dangerouslySetInnerHTML={{__html: this.getOverviewText()}}></p>
                {this.renderButtons()}
                <br />
                {this.renderUpgrades()}
            </div>
        )
    }
}
