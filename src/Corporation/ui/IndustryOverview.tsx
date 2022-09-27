// React Component for displaying an Industry's overview information
// (top-left panel in the Industry UI)
import React, { useState } from "react";

import { Industries } from "../IndustryData";
import { HireAdVert } from "../Actions";
import { numeralWrapper } from "../../ui/numeralFormat";
import { createProgressBarText } from "../../utils/helpers/createProgressBarText";
import { MakeProductModal } from "./modals/MakeProductModal";
import { ResearchModal } from "./modals/ResearchModal";
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
              You have reached the maximum number of products: {division.getMaximumNumberProducts()}
            </Typography>
          ) : (
            ""
          )
        }
      >
        <Button color={shouldFlash() ? "error" : "primary"} onClick={() => setMakeOpen(true)} disabled={corp.funds < 0}>
          {createProductButtonText}
        </Button>
      </Tooltip>
      <MakeProductModal open={makeOpen} onClose={() => setMakeOpen(false)} />
    </>
  );
}

interface IProps {
  rerender: () => void;
}

export function IndustryOverview(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const [helpOpen, setHelpOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
  const vechain = corp.unlockUpgrades[4] === 1;
  const profit = division.lastCycleRevenue - division.lastCycleExpenses;

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

  return (
    <Paper>
      <Typography>
        Industry: {division.type} (Corp Funds: <Money money={corp.funds} />)
      </Typography>
      <br />
      <StatsTable
        rows={[
          ["Awareness:", numeralWrapper.formatReallyBigNumber(division.awareness)],
          ["Popularity:", numeralWrapper.formatReallyBigNumber(division.popularity)],
        ]}
      />
      {advertisingInfo !== false && (
        <Tooltip
          title={
            <>
              <Typography>Total multiplier for this industry's sales due to its awareness and popularity</Typography>
              <StatsTable
                rows={[
                  ["Awareness Bonus:", "x" + numeralWrapper.formatReallyBigNumber(Math.pow(awarenessFac, 0.85))],
                  ["Popularity Bonus:", "x" + numeralWrapper.formatReallyBigNumber(Math.pow(popularityFac, 0.85))],
                  ["Ratio Multiplier:", "x" + numeralWrapper.formatReallyBigNumber(Math.pow(ratioFac, 0.85))],
                ]}
              />
            </>
          }
        >
          <Typography>Advertising Multiplier: x{numeralWrapper.formatReallyBigNumber(totalAdvertisingFac)}</Typography>
        </Tooltip>
      )}
      <br />
      <StatsTable
        rows={[
          ["Revenue:", <MoneyRate money={division.lastCycleRevenue} />],
          ["Expenses:", <MoneyRate money={division.lastCycleExpenses} />],
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
          <Typography>Production Multiplier: {numeralWrapper.formatReallyBigNumber(division.prodMult)}</Typography>
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
          <Typography>Scientific Research: {numeralWrapper.formatReallyBigNumber(division.sciResearch.qty)}</Typography>
        </Tooltip>
        <Button sx={{ mx: 1 }} onClick={() => setResearchOpen(true)}>
          Research
        </Button>
        <ResearchModal open={researchOpen} onClose={() => setResearchOpen(false)} industry={division} />
      </Box>
      <br />
      <Box display="flex" alignItems="center">
        <Tooltip
          title={
            <Typography>
              Hire AdVert.Inc to advertise your company. Each level of this upgrade grants your company a static
              increase of 3 and 1 to its awareness and popularity, respectively. It will then increase your company's
              awareness by 1%, and its popularity by a random percentage between 1% and 3%. These effects are increased
              by other upgrades that increase the power of your advertising.
            </Typography>
          }
        >
          <Button
            disabled={division.getAdVertCost() > corp.funds}
            onClick={function () {
              HireAdVert(corp, division);
              props.rerender();
            }}
          >
            Hire AdVert -&nbsp; <MoneyCost money={division.getAdVertCost()} corp={corp} />
          </Button>
        </Tooltip>
        {division.makesProducts && <MakeProductButton />}
      </Box>
    </Paper>
  );
}
