// React Component for displaying an Industry's overview information
// (top-left panel in the Industry UI)
import React, { useState } from "react";

import { OfficeSpace } from "../OfficeSpace";
import { Industries } from "../IndustryData";
import { IndustryUpgrades } from "../IndustryUpgrades";
import { numeralWrapper } from "../../ui/numeralFormat";
import { createProgressBarText } from "../../utils/helpers/createProgressBarText";
import { MakeProductModal } from "./MakeProductModal";
import { ResearchPopup } from "./ResearchPopup";
import { createPopup } from "../../ui/React/createPopup";
import { Money } from "../../ui/React/Money";
import { MoneyRate } from "../../ui/React/MoneyRate";
import { StatsTable } from "../../ui/React/StatsTable";
import { StaticModal } from "../../ui/React/StaticModal";
import { MoneyCost } from "./MoneyCost";
import { useCorporation, useDivision } from "./Context";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import HelpIcon from "@mui/icons-material/Help";
import Box from "@mui/material/Box";

function MakeProductButton(): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const [makeOpen, setMakeOpen] = useState(false);

  const hasMaxProducts = division.hasMaximumNumberProducts();

  function shouldFlash(): boolean {
    return Object.keys(division.products).length === 0;
  }

  let createProductButtonText = "";
  switch (division.type) {
    case Industries.Food:
      createProductButtonText = "Build Restaurant";
      break;
    case Industries.Tobacco:
      createProductButtonText = "Create Product";
      break;
    case Industries.Pharmaceutical:
      createProductButtonText = "Create Drug";
      break;
    case Industries.Computer:
    case "Computer":
      createProductButtonText = "Create Product";
      break;
    case Industries.Robotics:
      createProductButtonText = "Design Robot";
      break;
    case Industries.Software:
      createProductButtonText = "Develop Software";
      break;
    case Industries.Healthcare:
      createProductButtonText = "Build Hospital";
      break;
    case Industries.RealEstate:
      createProductButtonText = "Develop Property";
      break;
    default:
      createProductButtonText = "Create Product";
      return <></>;
  }

  return (
    <>
      <Tooltip
        title={
          hasMaxProducts ? (
            <Typography>
              ou have reached the maximum number of products: {division.getMaximumNumberProducts()}
            </Typography>
          ) : (
            ""
          )
        }
      >
        <Button
          color={shouldFlash() ? "error" : "primary"}
          onClick={() => setMakeOpen(true)}
          disabled={corp.funds.lt(0)}
        >
          {createProductButtonText}
        </Button>
      </Tooltip>
      <MakeProductModal open={makeOpen} onClose={() => setMakeOpen(false)} />
    </>
  );
}
function Text(): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const [helpOpen, setHelpOpen] = useState(false);
  const vechain = corp.unlockUpgrades[4] === 1;
  const profit = division.lastCycleRevenue.minus(division.lastCycleExpenses).toNumber();

  let advertisingInfo = false;
  const advertisingFactors = division.getAdvertisingFactors();
  const awarenessFac = advertisingFactors[1];
  const popularityFac = advertisingFactors[2];
  const ratioFac = advertisingFactors[3];
  const totalAdvertisingFac = advertisingFactors[0];
  if (vechain) {
    advertisingInfo = true;
  }

  function convertEffectFacToGraphic(fac: number): string {
    return createProgressBarText({
      progress: fac,
      totalTicks: 20,
    });
  }

  function openResearchPopup(): void {
    const popupId = "corporation-research-popup-box";
    createPopup(popupId, ResearchPopup, {
      industry: division,
      popupId: popupId,
    });
  }

  return (
    <>
      <Typography>
        Industry: {division.type} (Corp Funds: <Money money={corp.funds.toNumber()} />)
      </Typography>
      <br />
      <StatsTable
        rows={[
          ["Awareness:", numeralWrapper.format(division.awareness, "0.000")],
          ["Popularity:", numeralWrapper.format(division.popularity, "0.000")],
        ]}
      />
      {advertisingInfo !== false && (
        <Tooltip
          title={
            <>
              <Typography>Total multiplier for this industrys sales due to its awareness and popularity</Typography>
              <StatsTable
                rows={[
                  ["Awareness Bonus:", "x" + numeralWrapper.format(Math.pow(awarenessFac, 0.85), "0.000")],
                  ["Popularity Bonus:", "x" + numeralWrapper.format(Math.pow(popularityFac, 0.85), "0.000")],
                  ["Ratio Multiplier:", "x" + numeralWrapper.format(Math.pow(ratioFac, 0.85), "0.000")],
                ]}
              />
            </>
          }
        >
          <Typography>Advertising Multiplier: x{numeralWrapper.format(totalAdvertisingFac, "0.000")}</Typography>
        </Tooltip>
      )}
      <br />
      <StatsTable
        rows={[
          ["Revenue:", <MoneyRate money={division.lastCycleRevenue.toNumber()} />],
          ["Expenses:", <MoneyRate money={division.lastCycleExpenses.toNumber()} />],
          ["Profit:", <MoneyRate money={profit} />],
        ]}
      />
      <br />
      <Box display="flex" alignItems="center">
        <Tooltip
          title={
            <Typography>
              Production gain from owning production-boosting materials such as hardware, Robots, AI Cores, and Real
              Estate.
            </Typography>
          }
        >
          <Typography>Production Multiplier: {numeralWrapper.format(division.prodMult, "0.00")}</Typography>
        </Tooltip>
        <IconButton onClick={() => setHelpOpen(true)}>
          <HelpIcon />
        </IconButton>
        <StaticModal open={helpOpen} onClose={() => setHelpOpen(false)}>
          <Typography>
            Owning Hardware, Robots, AI Cores, and Real Estate can boost your Industry's production. The effect these
            materials have on your production varies between Industries. For example, Real Estate may be very effective
            for some Industries, but ineffective for others.
            <br />
            <br />
            This division's production multiplier is calculated by summing the individual production multiplier of each
            of its office locations. This production multiplier is applied to each office. Therefore, it is beneficial
            to expand into new cities as this can greatly increase the production multiplier of your entire Division.
            <br />
            <br />
            Below are approximations for how effective each material is at boosting this industry's production
            multiplier (Bigger bars = more effective):
            <br />
            <br />
            Hardware:&nbsp;&nbsp;&nbsp; {convertEffectFacToGraphic(division.hwFac)}
            <br />
            Robots:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {convertEffectFacToGraphic(division.robFac)}
            <br />
            AI Cores:&nbsp;&nbsp;&nbsp; {convertEffectFacToGraphic(division.aiFac)}
            <br />
            Real Estate: {convertEffectFacToGraphic(division.reFac)}
          </Typography>
        </StaticModal>
      </Box>

      <Box display="flex" alignItems="center">
        <Tooltip
          title={
            <Typography>
              Scientific Research increases the quality of the materials and products that you produce.
            </Typography>
          }
        >
          <Typography>Scientific Research: {numeralWrapper.format(division.sciResearch.qty, "0.000a")}</Typography>
        </Tooltip>
        <Button sx={{ mx: 1 }} onClick={openResearchPopup}>
          Research
        </Button>
      </Box>
    </>
  );
}

function Upgrades(props: { office: OfficeSpace; rerender: () => void }): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const upgrades = [];
  for (const index in IndustryUpgrades) {
    const upgrade = IndustryUpgrades[index];

    // AutoBrew research disables the Coffee upgrade
    if (division.hasResearch("AutoBrew") && upgrade[4] === "Coffee") {
      continue;
    }

    const i = upgrade[0];
    const baseCost = upgrade[1];
    const priceMult = upgrade[2];
    let cost = 0;
    switch (i) {
      case 0: //Coffee, cost is static per employee
        cost = props.office.employees.length * baseCost;
        break;
      default:
        cost = baseCost * Math.pow(priceMult, division.upgrades[i]);
        break;
    }

    function onClick(): void {
      if (corp.funds.lt(cost)) return;
      corp.funds = corp.funds.minus(cost);
      division.upgrade(upgrade, {
        corporation: corp,
        office: props.office,
      });
      props.rerender();
    }

    upgrades.push(
      <Tooltip key={index} title={upgrade[5]}>
        <span>
          <Button disabled={corp.funds.lt(cost)} onClick={onClick}>
            {upgrade[4]} -&nbsp;
            <MoneyCost money={cost} corp={corp} />
          </Button>
        </span>
      </Tooltip>,
    );
  }

  return <>{upgrades}</>;
}

interface IProps {
  currentCity: string;
  office: OfficeSpace;
  rerender: () => void;
}

export function IndustryOverview(props: IProps): React.ReactElement {
  const division = useDivision();

  return (
    <Paper>
      <Text />
      <br />
      <Typography>Purchases & Upgrades</Typography>
      <Upgrades office={props.office} rerender={props.rerender} /> <br />
      {division.makesProducts && <MakeProductButton />}
    </Paper>
  );
}
