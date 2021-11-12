// React Component for displaying Corporation Overview info
import React, { useState } from "react";
import { LevelableUpgrade } from "./LevelableUpgrade";
import { UnlockUpgrade } from "./UnlockUpgrade";
import { BribeFactionModal } from "./BribeFactionModal";
import { SellSharesModal } from "./SellSharesModal";
import { BuybackSharesModal } from "./BuybackSharesModal";
import { IssueDividendsModal } from "./IssueDividendsModal";
import { IssueNewSharesModal } from "./IssueNewSharesModal";
import { FindInvestorsModal } from "./FindInvestorsModal";
import { GoPublicModal } from "./GoPublicModal";
import { Factions } from "../../Faction/Factions";

import { CorporationConstants } from "../data/Constants";
import { CorporationUnlockUpgrade, CorporationUnlockUpgrades } from "../data/CorporationUnlockUpgrades";
import { CorporationUpgrade, CorporationUpgrades } from "../data/CorporationUpgrades";

import { CONSTANTS } from "../../Constants";
import { numeralWrapper } from "../../ui/numeralFormat";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { Money } from "../../ui/React/Money";
import { MoneyRate } from "../../ui/React/MoneyRate";
import { StatsTable } from "../../ui/React/StatsTable";
import { use } from "../../ui/Context";
import { useCorporation } from "./Context";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

interface IProps {
  rerender: () => void;
}
export function Overview({ rerender }: IProps): React.ReactElement {
  const player = use.Player();
  const corp = useCorporation();
  const profit: number = corp.revenue.minus(corp.expenses).toNumber();

  const multRows: any[][] = [];
  function appendMult(name: string, value: number): void {
    if (value === 1) return;
    multRows.push([name, numeralWrapper.format(value, "0.000")]);
  }
  appendMult("Production Multiplier: ", corp.getProductionMultiplier());
  appendMult("Storage Multiplier: ", corp.getStorageMultiplier());
  appendMult("Advertising Multiplier: ", corp.getAdvertisingMultiplier());
  appendMult("Empl. Creativity Multiplier: ", corp.getEmployeeCreMultiplier());
  appendMult("Empl. Charisma Multiplier: ", corp.getEmployeeChaMultiplier());
  appendMult("Empl. Intelligence Multiplier: ", corp.getEmployeeIntMultiplier());
  appendMult("Empl. Efficiency Multiplier: ", corp.getEmployeeEffMultiplier());
  appendMult("Sales Multiplier: ", corp.getSalesMultiplier());
  appendMult("Scientific Research Multiplier: ", corp.getScientificResearchMultiplier());

  return (
    <>
      <StatsTable
        rows={[
          ["Total Funds:", <Money money={corp.funds.toNumber()} />],
          ["Total Revenue:", <MoneyRate money={corp.revenue.toNumber()} />],
          ["Total Expenses:", <MoneyRate money={corp.expenses.toNumber()} />],
          ["Publicly Traded:", corp.public ? "Yes" : "No"],
          ["Owned Stock Shares:", numeralWrapper.format(corp.numShares, "0.000a")],
          ["Stock Price:", corp.public ? <Money money={corp.sharePrice} /> : "N/A"],
        ]}
      />
      <br />
      <Box display="flex">
        <Tooltip
          title={
            <StatsTable
              rows={[
                ["Outstanding Shares:", numeralWrapper.format(corp.issuedShares, "0.000a")],
                [
                  "Private Shares:",
                  numeralWrapper.format(corp.totalShares - corp.issuedShares - corp.numShares, "0.000a"),
                ],
              ]}
            />
          }
        >
          <Typography>Total Stock Shares: {numeralWrapper.format(corp.totalShares, "0.000a")}</Typography>
        </Tooltip>
      </Box>
      <br />
      <DividendsStats profit={profit} />
      <br />
      <StatsTable rows={multRows} />
      <br />
      <BonusTime />
      <Tooltip
        title={
          <Typography>
            Get a copy of and read 'The Complete Handbook for Creating a Successful Corporation.' This is a .lit file
            that guides you through the beginning of setting up a Corporation and provides some tips/pointers for
            helping you get started with managing it.
          </Typography>
        }
      >
        <Button onClick={() => corp.getStarterGuide(player)}>Getting Started Guide</Button>
      </Tooltip>
      {corp.public ? <PublicButtons rerender={rerender} /> : <PrivateButtons rerender={rerender} />}
      <BribeButton />
      <br />
      <Upgrades rerender={rerender} />
    </>
  );
}

interface IPrivateButtonsProps {
  rerender: () => void;
}
// Render the buttons for when your Corporation is still private
function PrivateButtons({ rerender }: IPrivateButtonsProps): React.ReactElement {
  const corp = useCorporation();
  const [findInvestorsopen, setFindInvestorsopen] = useState(false);
  const [goPublicopen, setGoPublicopen] = useState(false);

  const fundingAvailable = corp.fundingRound < 4;
  const findInvestorsTooltip = fundingAvailable
    ? "Search for private investors who will give you startup funding in exchange for equity (stock shares) in your company"
    : "";

  return (
    <>
      <Tooltip title={<Typography>{findInvestorsTooltip}</Typography>}>
        <span>
          <Button disabled={!fundingAvailable} onClick={() => setFindInvestorsopen(true)}>
            Find Investors
          </Button>
        </span>
      </Tooltip>
      <Tooltip
        title={
          <Typography>
            Become a publicly traded and owned entity. Going public involves issuing shares for an IPO. Once you are a
            public company, your shares will be traded on the stock market.
          </Typography>
        }
      >
        <Button onClick={() => setGoPublicopen(true)}>Go Public</Button>
      </Tooltip>
      <FindInvestorsModal open={findInvestorsopen} onClose={() => setFindInvestorsopen(false)} rerender={rerender} />
      <GoPublicModal open={goPublicopen} onClose={() => setGoPublicopen(false)} rerender={rerender} />
      <br />
    </>
  );
}

interface IUpgradeProps {
  rerender: () => void;
}
// Render the UI for Corporation upgrades
function Upgrades({ rerender }: IUpgradeProps): React.ReactElement {
  const corp = useCorporation();
  // Don't show upgrades
  if (corp.divisions.length <= 0) {
    return <Typography variant="h4">Upgrades are unlocked once you create an industry.</Typography>;
  }

  return (
    <>
      <Paper sx={{ p: 1, my: 1 }}>
        <Typography variant="h4">Unlocks</Typography>
        <Grid container>
          {Object.values(CorporationUnlockUpgrades)
            .filter((upgrade: CorporationUnlockUpgrade) => corp.unlockUpgrades[upgrade[0]] === 0)
            .map((upgrade: CorporationUnlockUpgrade) => (
              <UnlockUpgrade rerender={rerender} upgradeData={upgrade} key={upgrade[0]} />
            ))}
        </Grid>
      </Paper>
      <Paper sx={{ p: 1, my: 1 }}>
        <Typography variant="h4">Upgrades</Typography>
        <Grid container>
          {corp.upgrades
            .map((level: number, i: number) => CorporationUpgrades[i])
            .map((upgrade: CorporationUpgrade) => (
              <LevelableUpgrade rerender={rerender} upgrade={upgrade} key={upgrade[0]} />
            ))}
        </Grid>
      </Paper>
    </>
  );
}

interface IPublicButtonsProps {
  rerender: () => void;
}

// Render the buttons for when your Corporation has gone public
function PublicButtons({ rerender }: IPublicButtonsProps): React.ReactElement {
  const corp = useCorporation();
  const [sellSharesOpen, setSellSharesOpen] = useState(false);
  const [buybackSharesOpen, setBuybackSharesOpen] = useState(false);
  const [issueNewSharesOpen, setIssueNewSharesOpen] = useState(false);
  const [issueDividendsOpen, setIssueDividendsOpen] = useState(false);

  const sellSharesOnCd = corp.shareSaleCooldown > 0;
  const sellSharesTooltip = sellSharesOnCd
    ? "Cannot sell shares for " + corp.convertCooldownToString(corp.shareSaleCooldown)
    : "Sell your shares in the company. The money earned from selling your " +
      "shares goes into your personal account, not the Corporation's. " +
      "This is one of the only ways to profit from your business venture.";

  const issueNewSharesOnCd = corp.issueNewSharesCooldown > 0;
  const issueNewSharesTooltip = issueNewSharesOnCd
    ? "Cannot issue new shares for " + corp.convertCooldownToString(corp.issueNewSharesCooldown)
    : "Issue new equity shares to raise capital.";

  return (
    <>
      <Tooltip title={<Typography>{sellSharesTooltip}</Typography>}>
        <span>
          <Button disabled={sellSharesOnCd} onClick={() => setSellSharesOpen(true)}>
            Sell Shares
          </Button>
        </span>
      </Tooltip>
      <SellSharesModal open={sellSharesOpen} onClose={() => setSellSharesOpen(false)} rerender={rerender} />
      <Tooltip title={<Typography>Buy back shares you that previously issued or sold at market price.</Typography>}>
        <span>
          <Button disabled={corp.issuedShares < 1} onClick={() => setBuybackSharesOpen(true)}>
            Buyback shares
          </Button>
        </span>
      </Tooltip>
      <BuybackSharesModal open={buybackSharesOpen} onClose={() => setBuybackSharesOpen(false)} rerender={rerender} />
      <br />
      <Tooltip title={<Typography>{issueNewSharesTooltip}</Typography>}>
        <span>
          <Button disabled={issueNewSharesOnCd} onClick={() => setIssueNewSharesOpen(true)}>
            Issue New Shares
          </Button>
        </span>
      </Tooltip>
      <IssueNewSharesModal open={issueNewSharesOpen} onClose={() => setIssueNewSharesOpen(false)} />
      <Tooltip
        title={<Typography>Manage the dividends that are paid out to shareholders (including yourself)</Typography>}
      >
        <Button onClick={() => setIssueDividendsOpen(true)}>Issue Dividends</Button>
      </Tooltip>
      <IssueDividendsModal open={issueDividendsOpen} onClose={() => setIssueDividendsOpen(false)} />
      <br />
    </>
  );
}

function BribeButton(): React.ReactElement {
  const player = use.Player();
  const corp = useCorporation();
  const [open, setOpen] = useState(false);
  const canBribe =
    corp.determineValuation() >= CorporationConstants.BribeThreshold &&
    player.factions.filter((f) => Factions[f].getInfo().offersWork()).length > 0;

  function openBribe(): void {
    if (!canBribe) return;
    setOpen(true);
  }

  return (
    <>
      <Tooltip
        title={
          canBribe
            ? "Use your Corporations power and influence to bribe Faction leaders in exchange for reputation"
            : "Your Corporation is not powerful enough to bribe Faction leaders"
        }
      >
        <span>
          <Button disabled={!canBribe} onClick={openBribe}>
            Bribe Factions
          </Button>
        </span>
      </Tooltip>
      <BribeFactionModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

interface IDividendsStatsProps {
  profit: number;
}
function DividendsStats({ profit }: IDividendsStatsProps): React.ReactElement {
  const corp = useCorporation();
  if (corp.dividendPercentage <= 0 || profit <= 0) return <></>;
  const totalDividends = (corp.dividendPercentage / 100) * profit;
  const retainedEarnings = profit - totalDividends;
  const dividendsPerShare = totalDividends / corp.totalShares;
  return (
    <StatsTable
      rows={[
        ["Retained Profits (after dividends):", <MoneyRate money={retainedEarnings} />],
        ["Dividend Percentage:", numeralWrapper.format(corp.dividendPercentage / 100, "0%")],
        ["Dividends per share:", <MoneyRate money={dividendsPerShare} />],
        ["Your earnings as a shareholder (Pre-Tax):", <MoneyRate money={corp.getDividends()} />],
        ["Dividend Tax Rate:", <>{corp.dividendTaxPercentage}%</>],
        [
          "Your earnings as a shareholder (Post-Tax):",
          <MoneyRate money={corp.getDividends() * (1 - corp.dividendTaxPercentage / 100)} />,
        ],
      ]}
    />
  );
}

// Returns a string with general information about Corporation
function BonusTime(): React.ReactElement {
  const corp = useCorporation();
  const storedTime = corp.storedCycles * CONSTANTS.MilliPerCycle;
  if (storedTime <= 15000) return <></>;
  return (
    <Typography>
      Bonus time: {convertTimeMsToTimeElapsedString(storedTime)}
      <br />
      <br />
    </Typography>
  );
}
