// React Component for displaying Corporation Overview info
import React from "react";
import { LevelableUpgrade }             from "./LevelableUpgrade";
import { UnlockUpgrade }                from "./UnlockUpgrade";
import { BribeFactionPopup }            from "./BribeFactionPopup";
import { SellSharesPopup }              from "./SellSharesPopup";
import { BuybackSharesPopup }           from "./BuybackSharesPopup";
import { IssueDividendsPopup }          from "./IssueDividendsPopup";
import { IssueNewSharesPopup }          from "./IssueNewSharesPopup";
import { FindInvestorsPopup }           from "./FindInvestorsPopup";
import { GoPublicPopup }                from "./GoPublicPopup";

import { CorporationConstants }         from "../data/Constants";
import {
    CorporationUnlockUpgrade,
    CorporationUnlockUpgrades }    from "../data/CorporationUnlockUpgrades";
import {
    CorporationUpgrade,
    CorporationUpgrades }               from "../data/CorporationUpgrades";

import { CONSTANTS } from "../../Constants";
import { numeralWrapper } from "../../ui/numeralFormat";
import { convertTimeMsToTimeElapsedString } from "../../../utils/StringHelperFunctions";
import { createPopup } from "../../ui/React/createPopup";
import { Money } from "../../ui/React/Money";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { ICorporation } from "../ICorporation";

interface IProps {
    corp: ICorporation;
    player: IPlayer;
}

interface GeneralBtns {
    bribeFactions: React.ReactElement;
}

export function Overview(props: IProps): React.ReactElement {
    // Generic Function for Creating a button
    interface ICreateButtonProps {
        text: string;
        class?: string;
        className?: string;
        display?: string;
        tooltip?: string;
        onClick?: (event: React.MouseEvent) => void;
    }

    function Button(props: ICreateButtonProps): React.ReactElement {
        let className = props.className ? props.className : "std-button";
        const hasTooltip = props.tooltip != null;
        if(hasTooltip) className += " tooltip";
        return (
            <a
                className={className}
                onClick={props.onClick}
                style={{display: props.display ? props.display : "block"}}>
                {props.text}
                {
                    hasTooltip &&
                    <span className={"tooltiptext"}>
                        {props.tooltip}
                    </span>
                }
            </a>
        );
    }

    function createButton(props: ICreateButtonProps): React.ReactElement {
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

    function openBribeFactionPopup(): void {
        const popupId = "corp-bribe-popup";
        createPopup(popupId, BribeFactionPopup, {
            player: props.player,
            popupId: popupId,
            corp: props.corp,
        });
    }

    const profit: number = props.corp.revenue.minus(props.corp.expenses).toNumber();

    function DividendsStats() {
        if(props.corp.dividendPercentage <= 0 || profit <= 0) return (<></>);
        const totalDividends = (props.corp.dividendPercentage / 100) * profit;
        const retainedEarnings = profit - totalDividends;
        const dividendsPerShare = totalDividends / props.corp.totalShares;
        const playerEarnings = props.corp.numShares * dividendsPerShare;
        return (<>
            Retained Profits (after dividends): {Money(retainedEarnings)} / s<br /><br />
            Dividend Percentage: {numeralWrapper.format(props.corp.dividendPercentage / 100, "0%")}<br />
            Dividends per share: {Money(dividendsPerShare)} / s<br />
            Your earnings as a shareholder (Pre-Tax): {Money(playerEarnings)} / s<br />
            Dividend Tax Rate: {props.corp.dividendTaxPercentage}%<br />
            Your earnings as a shareholder (Post-Tax): {Money(playerEarnings * (1 - (props.corp.dividendTaxPercentage / 100)))} / s<br /><br />
        </>);
    }

    function Mult(props: {name: string, mult: number}): React.ReactElement {
        if(props.mult <= 1) return (<></>);
        return (<p>{props.name}{numeralWrapper.format(props.mult, "0.000")}<br /></p>);
    }

    // Returns a string with general information about Corporation
    function BonusTime(): React.ReactElement {
        const storedTime = props.corp.storedCycles * CONSTANTS.MilliPerCycle;
        if (storedTime <= 15000) return (<></>);
        return (<p>Bonus time: {convertTimeMsToTimeElapsedString(storedTime)}<br /><br /></p>);
    }

    function BribeButton(): React.ReactElement {
        const canBribe = (props.corp.determineValuation() >= CorporationConstants.BribeThreshold) || true;
        const bribeFactionsClass = (canBribe ? "a-link-button" : "a-link-button-inactive");
        return <Button
            className={bribeFactionsClass}
            display="inline-block"
            onClick={openBribeFactionPopup}
            text="Bribe Factions"
            tooltip={(canBribe
                        ? "Use your Corporations power and influence to bribe Faction leaders in exchange for reputation"
                        : "Your Corporation is not powerful enough to bribe Faction leaders")}
        />
    }

    function openFindInvestorsPopup(): void {
        const popupId = "cmpy-mgmt-find-investors-popup";
        createPopup(popupId, FindInvestorsPopup, {
            player: props.player,
            popupId: popupId,
            corp: props.corp,
        });
    }

    function openGoPublicPopup(): void {
        const popupId = "cmpy-mgmt-go-public-popup";
        createPopup(popupId, GoPublicPopup, {
            player: props.player,
            popupId: popupId,
            corp: props.corp,
        });
    }

    // Render the buttons for when your Corporation is still private
    function PrivateButtons(): React.ReactElement {
        const fundingAvailable = (props.corp.fundingRound < 4);
        const findInvestorsClassName = fundingAvailable ? "std-button" : "a-link-button-inactive";
        const findInvestorsTooltip = fundingAvailable ? "Search for private investors who will give you startup funding in exchangefor equity (stock shares) in your company" : undefined;

        return (
            <>
                <Button
                    className={findInvestorsClassName}
                    onClick={openFindInvestorsPopup}
                    text="Find Investors"
                    tooltip={findInvestorsTooltip}
                    display="inline-block"
                />
                <Button
                    className="std-button"
                    onClick={openGoPublicPopup}
                    display="inline-block"
                    text="Go Public"
                    tooltip={"Become a publicly traded and owned entity. Going public " +
                             "involves issuing shares for an IPO. Once you are a public " +
                             "company, your shares will be traded on the stock market."}
                />
                <br />
            </>
        )

    }

    function openSellSharesPopup(): void {
        const popupId = "cmpy-mgmt-sell-shares-popup";
        createPopup(popupId, SellSharesPopup, {
            corp: props.corp,
            player: props.player,
            popupId: popupId,
        });
    }

    function openBuybackSharesPopup(): void {
        const popupId = "corp-buyback-shares-popup";
        createPopup(popupId, BuybackSharesPopup, {
            player: props.player,
            popupId: popupId,
            corp: props.corp,
        });
    }

    function openIssueNewSharesPopup(): void {
        const popupId = "cmpy-mgmt-issue-new-shares-popup";
        createPopup(popupId, IssueNewSharesPopup, {
            popupId: popupId,
            corp: props.corp,
        });
    }

    function openIssueDividendsPopup(): void {
        const popupId = "cmpy-mgmt-issue-dividends-popup";
        createPopup(popupId, IssueDividendsPopup, {
            popupId: popupId,
            corp: props.corp,
        });
    }

    // Render the buttons for when your Corporation has gone public
    function PublicButtons(): React.ReactElement {
        const corp = props.corp;

        const sellSharesOnCd = (corp.shareSaleCooldown > 0);
        const sellSharesClass = sellSharesOnCd ? "a-link-button-inactive" : "std-button";
        const sellSharesTooltip = sellSharesOnCd
                                    ? "Cannot sell shares for " + corp.convertCooldownToString(corp.shareSaleCooldown)
                                    : "Sell your shares in the company. The money earned from selling your " +
                                      "shares goes into your personal account, not the Corporation's. " +
                                      "This is one of the only ways to profit from your business venture."

        const issueNewSharesOnCd = (corp.issueNewSharesCooldown > 0);
        const issueNewSharesClass = issueNewSharesOnCd ? "a-link-button-inactive" : "std-button";
        const issueNewSharesTooltip = issueNewSharesOnCd
                                        ? "Cannot issue new shares for " + corp.convertCooldownToString(corp.issueNewSharesCooldown)
                                        : "Issue new equity shares to raise capital.";

        return (
            <>
                <Button
                    className={sellSharesClass}
                    display="inline-block"
                    onClick={openSellSharesPopup}
                    text="Sell Shares"
                    tooltip={sellSharesTooltip}
                />
                <Button
                    className="std-button"
                    display="inline-block"
                    onClick={openBuybackSharesPopup}
                    text="Buyback shares"
                    tooltip="Buy back shares you that previously issued or sold at market price."
                />
                <br />
                <Button
                    className={issueNewSharesClass}
                    display="inline-block"
                    onClick={openIssueNewSharesPopup}
                    text="Issue New Shares"
                    tooltip={issueNewSharesTooltip}
                />
                <Button
                    className="std-button"
                    display="inline-block"
                    onClick={openIssueDividendsPopup}
                    text="Issue Dividends"
                    tooltip="Manage the dividends that are paid out to shareholders (including yourself)"
                />
                <br />
            </>
        )
    }

    // Render the UI for Corporation upgrades
    function Upgrades(): React.ReactElement {
        // Don't show upgrades
        if (props.corp.divisions.length <= 0) { return (<></>); }

        return (
            <div className={"cmpy-mgmt-upgrade-container"}>
                <h1 className={"cmpy-mgmt-upgrade-header"}> Unlocks </h1>
                {
                    Object.values(CorporationUnlockUpgrades)
                        .filter((upgrade: CorporationUnlockUpgrade) => props.corp.unlockUpgrades[upgrade[0]] === 0)
                        .map((upgrade: CorporationUnlockUpgrade) => 
                            <UnlockUpgrade
                                player={props.player}
                                corp={props.corp}
                                upgradeData={upgrade}
                                key={upgrade[0]}
                            />)
                }

                <h1 className={"cmpy-mgmt-upgrade-header"}> Upgrades </h1>
                {
                    props.corp.upgrades
                        .map((level: number, i: number) => CorporationUpgrades[i])
                        .map((upgrade: CorporationUpgrade) => <LevelableUpgrade
                            player={props.player}
                            corp={props.corp}
                            upgrade={upgrade}
                            key={upgrade[0]}
                        />,
                    )
                }
            </div>
        );
    }


    return (
        <div>
            <p>
                Total Funds: {Money(props.corp.funds.toNumber())}<br />
                Total Revenue: {Money(props.corp.revenue.toNumber())} / s<br />
                Total Expenses: {Money(props.corp.expenses.toNumber())} / s<br />
                Total Profits: {Money(profit)} / s<br />
                <DividendsStats />
                Publicly Traded: {(props.corp.public ? "Yes" : "No")}<br />
                Owned Stock Shares: {numeralWrapper.format(props.corp.numShares, '0.000a')}<br />
                Stock Price: {(props.corp.public ? Money(props.corp.sharePrice) : "N/A")}<br />
            </p>
            <p className='tooltip'>
                Total Stock Shares: {numeralWrapper.format(props.corp.totalShares, "0.000a")}
                <span className='tooltiptext'>
                    Outstanding Shares: {numeralWrapper.format(props.corp.issuedShares, "0.000a")}<br />
                    Private Shares: {numeralWrapper.format(props.corp.totalShares - props.corp.issuedShares - props.corp.numShares, "0.000a")}
                </span>
            </p>
            <br /><br />
            <Mult name="Production Multiplier: " mult={props.corp.getProductionMultiplier()} />
            <Mult name="Storage Multiplier: " mult={props.corp.getStorageMultiplier()} />
            <Mult name="Advertising Multiplier: " mult={props.corp.getAdvertisingMultiplier()} />
            <Mult name="Empl. Creativity Multiplier: " mult={props.corp.getEmployeeCreMultiplier()} />
            <Mult name="Empl. Charisma Multiplier: " mult={props.corp.getEmployeeChaMultiplier()} />
            <Mult name="Empl. Intelligence Multiplier: " mult={props.corp.getEmployeeIntMultiplier()} />
            <Mult name="Empl. Efficiency Multiplier: " mult={props.corp.getEmployeeEffMultiplier()} />
            <Mult name="Sales Multiplier: " mult={props.corp.getSalesMultiplier()} />
            <Mult name="Scientific Research Multiplier: " mult={props.corp.getScientificResearchMultiplier()} />
            <br />
            <BonusTime />
            <div>
                <Button 
                    className="a-link-button"
                    display="inline-block"
                    onClick={() => props.corp.getStarterGuide(props.player)}
                    text="Getting Started Guide"
                    tooltip={"Get a copy of and read 'The Complete Handbook for Creating a Successful Corporation.' " +
                             "This is a .lit file that guides you through the beginning of setting up a Corporation and " +
                             "provides some tips/pointers for helping you get started with managing it."}
                />
                { props.corp.public ?
                    <PublicButtons /> :
                    <PrivateButtons />
                }
                <BribeButton />
            </div>
            <br />
            <Upgrades />
        </div>
    )
}
