// React Component for displaying Corporation Overview info
import React from "react";
import { LevelableUpgrade } from "./LevelableUpgrade";
import { UnlockUpgrade } from "./UnlockUpgrade";
import { BribeFactionPopup } from "./BribeFactionPopup";
import { SellSharesPopup } from "./SellSharesPopup";
import { BuybackSharesPopup } from "./BuybackSharesPopup";
import { IssueDividendsPopup } from "./IssueDividendsPopup";
import { IssueNewSharesPopup } from "./IssueNewSharesPopup";
import { FindInvestorsPopup } from "./FindInvestorsPopup";
import { GoPublicPopup } from "./GoPublicPopup";

import { CorporationConstants } from "../data/Constants";
import { CorporationUnlockUpgrade, CorporationUnlockUpgrades } from "../data/CorporationUnlockUpgrades";
import { CorporationUpgrade, CorporationUpgrades } from "../data/CorporationUpgrades";

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
  rerender: () => void;
}
export function Overview({ corp, player, rerender }: IProps): React.ReactElement {
  const profit: number = corp.revenue.minus(corp.expenses).toNumber();

  return (
    <div>
      <p>
        Total Funds: <Money money={corp.funds.toNumber()} />
        <br />
        Total Revenue: <Money money={corp.revenue.toNumber()} /> / s<br />
        Total Expenses: <Money money={corp.expenses.toNumber()} /> / s
        <br />
        Total Profits: <Money money={profit} /> / s<br />
        <DividendsStats corp={corp} profit={profit} />
        Publicly Traded: {corp.public ? "Yes" : "No"}
        <br />
        Owned Stock Shares: {numeralWrapper.format(corp.numShares, "0.000a")}
        <br />
        Stock Price: {corp.public ? <Money money={corp.sharePrice} /> : "N/A"}
        <br />
      </p>
      <p className="tooltip">
        Total Stock Shares: {numeralWrapper.format(corp.totalShares, "0.000a")}
        <span className="tooltiptext">
          Outstanding Shares: {numeralWrapper.format(corp.issuedShares, "0.000a")}
          <br />
          Private Shares: {numeralWrapper.format(corp.totalShares - corp.issuedShares - corp.numShares, "0.000a")}
        </span>
      </p>
      <br />
      <br />
      <Mult name="Production Multiplier: " mult={corp.getProductionMultiplier()} />
      <Mult name="Storage Multiplier: " mult={corp.getStorageMultiplier()} />
      <Mult name="Advertising Multiplier: " mult={corp.getAdvertisingMultiplier()} />
      <Mult name="Empl. Creativity Multiplier: " mult={corp.getEmployeeCreMultiplier()} />
      <Mult name="Empl. Charisma Multiplier: " mult={corp.getEmployeeChaMultiplier()} />
      <Mult name="Empl. Intelligence Multiplier: " mult={corp.getEmployeeIntMultiplier()} />
      <Mult name="Empl. Efficiency Multiplier: " mult={corp.getEmployeeEffMultiplier()} />
      <Mult name="Sales Multiplier: " mult={corp.getSalesMultiplier()} />
      <Mult name="Scientific Research Multiplier: " mult={corp.getScientificResearchMultiplier()} />
      <br />
      <BonusTime corp={corp} />
      <div>
        <Button
          className="a-link-button"
          display="inline-block"
          onClick={() => corp.getStarterGuide(player)}
          text="Getting Started Guide"
          tooltip={
            "Get a copy of and read 'The Complete Handbook for Creating a Successful Corporation.' " +
            "This is a .lit file that guides you through the beginning of setting up a Corporation and " +
            "provides some tips/pointers for helping you get started with managing it."
          }
        />
        {corp.public ? (
          <PublicButtons corp={corp} player={player} rerender={rerender} />
        ) : (
          <PrivateButtons corp={corp} player={player} rerender={rerender} />
        )}
        <BribeButton corp={corp} player={player} />
      </div>
      <br />
      <Upgrades corp={corp} player={player} rerender={rerender} />
    </div>
  );
}

interface IPrivateButtonsProps {
  corp: ICorporation;
  player: IPlayer;
  rerender: () => void;
}
// Render the buttons for when your Corporation is still private
function PrivateButtons({ corp, player, rerender }: IPrivateButtonsProps): React.ReactElement {
  function openFindInvestorsPopup(): void {
    const popupId = "cmpy-mgmt-find-investors-popup";
    createPopup(popupId, FindInvestorsPopup, {
      rerender,
      player,
      popupId,
      corp: corp,
    });
  }

  function openGoPublicPopup(): void {
    const popupId = "cmpy-mgmt-go-public-popup";
    createPopup(popupId, GoPublicPopup, {
      rerender,
      player,
      popupId,
      corp: corp,
    });
  }

  const fundingAvailable = corp.fundingRound < 4;
  const findInvestorsClassName = fundingAvailable ? "std-button" : "a-link-button-inactive";
  const findInvestorsTooltip = fundingAvailable
    ? "Search for private investors who will give you startup funding in exchangefor equity (stock shares) in your company"
    : undefined;

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
        tooltip={
          "Become a publicly traded and owned entity. Going public " +
          "involves issuing shares for an IPO. Once you are a public " +
          "company, your shares will be traded on the stock market."
        }
      />
      <br />
    </>
  );
}

interface IUpgradeProps {
  corp: ICorporation;
  player: IPlayer;
  rerender: () => void;
}
// Render the UI for Corporation upgrades
function Upgrades({ corp, player, rerender }: IUpgradeProps): React.ReactElement {
  // Don't show upgrades
  if (corp.divisions.length <= 0) {
    return <h1>Upgrades are unlocked once you create an industry.</h1>;
  }

  return (
    <div className={"cmpy-mgmt-upgrade-container"}>
      <h1 className={"cmpy-mgmt-upgrade-header"}> Unlocks </h1>
      {Object.values(CorporationUnlockUpgrades)
        .filter((upgrade: CorporationUnlockUpgrade) => corp.unlockUpgrades[upgrade[0]] === 0)
        .map((upgrade: CorporationUnlockUpgrade) => (
          <UnlockUpgrade rerender={rerender} player={player} corp={corp} upgradeData={upgrade} key={upgrade[0]} />
        ))}

      <h1 className={"cmpy-mgmt-upgrade-header"}> Upgrades </h1>
      {corp.upgrades
        .map((level: number, i: number) => CorporationUpgrades[i])
        .map((upgrade: CorporationUpgrade) => (
          <LevelableUpgrade rerender={rerender} player={player} corp={corp} upgrade={upgrade} key={upgrade[0]} />
        ))}
    </div>
  );
}

interface IPublicButtonsProps {
  corp: ICorporation;
  player: IPlayer;
  rerender: () => void;
}

// Render the buttons for when your Corporation has gone public
function PublicButtons({ corp, player, rerender }: IPublicButtonsProps): React.ReactElement {
  const sellSharesOnCd = corp.shareSaleCooldown > 0;
  const sellSharesClass = sellSharesOnCd ? "a-link-button-inactive" : "std-button";
  const sellSharesTooltip = sellSharesOnCd
    ? "Cannot sell shares for " + corp.convertCooldownToString(corp.shareSaleCooldown)
    : "Sell your shares in the company. The money earned from selling your " +
      "shares goes into your personal account, not the Corporation's. " +
      "This is one of the only ways to profit from your business venture.";

  const issueNewSharesOnCd = corp.issueNewSharesCooldown > 0;
  const issueNewSharesClass = issueNewSharesOnCd ? "a-link-button-inactive" : "std-button";
  const issueNewSharesTooltip = issueNewSharesOnCd
    ? "Cannot issue new shares for " + corp.convertCooldownToString(corp.issueNewSharesCooldown)
    : "Issue new equity shares to raise capital.";

  function openSellSharesPopup(): void {
    const popupId = "cmpy-mgmt-sell-shares-popup";
    createPopup(popupId, SellSharesPopup, {
      corp: corp,
      player,
      popupId,
      rerender,
    });
  }

  function openBuybackSharesPopup(): void {
    const popupId = "corp-buyback-shares-popup";
    createPopup(popupId, BuybackSharesPopup, {
      rerender,
      player,
      popupId,
      corp: corp,
    });
  }

  function openIssueNewSharesPopup(): void {
    const popupId = "cmpy-mgmt-issue-new-shares-popup";
    createPopup(popupId, IssueNewSharesPopup, {
      popupId,
      corp: corp,
    });
  }

  function openIssueDividendsPopup(): void {
    const popupId = "cmpy-mgmt-issue-dividends-popup";
    createPopup(popupId, IssueDividendsPopup, {
      popupId,
      corp: corp,
    });
  }

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
  );
}

// Generic Function for Creating a button
interface ICreateButtonProps {
  text: string;
  className?: string;
  display?: string;
  tooltip?: string;
  onClick?: (event: React.MouseEvent) => void;
}

function Button({ className = "std-button", text, display, tooltip, onClick }: ICreateButtonProps): React.ReactElement {
  const hasTooltip = tooltip != null;
  if (hasTooltip) className += " tooltip";
  return (
    <button className={className} onClick={onClick} style={{ display: display ? display : "block" }}>
      {text}
      {hasTooltip && <span className={"tooltiptext"}>{tooltip}</span>}
    </button>
  );
}

interface IBribeButtonProps {
  player: IPlayer;
  corp: ICorporation;
}
function BribeButton({ player, corp }: IBribeButtonProps): React.ReactElement {
  function openBribeFactionPopup(): void {
    const popupId = "corp-bribe-popup";
    createPopup(popupId, BribeFactionPopup, {
      player,
      popupId,
      corp: corp,
    });
  }

  const canBribe = corp.determineValuation() >= CorporationConstants.BribeThreshold || true;
  const bribeFactionsClass = canBribe ? "a-link-button" : "a-link-button-inactive";
  return (
    <Button
      className={bribeFactionsClass}
      display="inline-block"
      onClick={openBribeFactionPopup}
      text="Bribe Factions"
      tooltip={
        canBribe
          ? "Use your Corporations power and influence to bribe Faction leaders in exchange for reputation"
          : "Your Corporation is not powerful enough to bribe Faction leaders"
      }
    />
  );
}

interface IDividendsStatsProps {
  corp: ICorporation;
  profit: number;
}
function DividendsStats({ corp, profit }: IDividendsStatsProps): React.ReactElement {
  if (corp.dividendPercentage <= 0 || profit <= 0) return <></>;
  const totalDividends = (corp.dividendPercentage / 100) * profit;
  const retainedEarnings = profit - totalDividends;
  const dividendsPerShare = totalDividends / corp.totalShares;
  const playerEarnings = corp.numShares * dividendsPerShare;
  return (
    <>
      Retained Profits (after dividends): <Money money={retainedEarnings} /> / s
      <br />
      <br />
      Dividend Percentage: {numeralWrapper.format(corp.dividendPercentage / 100, "0%")}
      <br />
      Dividends per share: <Money money={dividendsPerShare} /> / s<br />
      Your earnings as a shareholder (Pre-Tax): <Money money={playerEarnings} /> / s<br />
      Dividend Tax Rate: {corp.dividendTaxPercentage}%<br />
      Your earnings as a shareholder (Post-Tax):{" "}
      <Money money={playerEarnings * (1 - corp.dividendTaxPercentage / 100)} /> / s<br />
      <br />
    </>
  );
}

interface IMultProps {
  name: string;
  mult: number;
}
function Mult({ name, mult }: IMultProps): React.ReactElement {
  if (mult <= 1) return <></>;
  return (
    <p>
      {name}
      {numeralWrapper.format(mult, "0.000")}
      <br />
    </p>
  );
}

interface IBonusTimeProps {
  corp: ICorporation;
}
// Returns a string with general information about Corporation
function BonusTime({ corp }: IBonusTimeProps): React.ReactElement {
  const storedTime = corp.storedCycles * CONSTANTS.MilliPerCycle;
  if (storedTime <= 15000) return <></>;
  return (
    <p>
      Bonus time: {convertTimeMsToTimeElapsedString(storedTime)}
      <br />
      <br />
    </p>
  );
}
