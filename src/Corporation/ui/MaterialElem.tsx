// React Component for displaying an Industry's warehouse information
// (right-side panel in the Industry UI)
import React, { useState } from "react";

import { OfficeSpace } from "../OfficeSpace";
import { Material } from "../Material";
import { Warehouse } from "../Warehouse";
import { ExportModal } from "./ExportModal";
import { MaterialMarketTaModal } from "./MaterialMarketTaModal";
import { SellMaterialModal } from "./SellMaterialModal";
import { PurchaseMaterialModal } from "./PurchaseMaterialModal";

import { numeralWrapper } from "../../ui/numeralFormat";

import { isString } from "../../utils/helpers/isString";
import { Money } from "../../ui/React/Money";
import { useCorporation, useDivision } from "./Context";

import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface IMaterialProps {
  warehouse: Warehouse;
  city: string;
  mat: Material;
  rerender: () => void;
}

// Creates the UI for a single Material type
export function MaterialElem(props: IMaterialProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const [purchaseMaterialOpen, setPurchaseMaterialOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [sellMaterialOpen, setSellMaterialOpen] = useState(false);
  const [materialMarketTaOpen, setMaterialMarketTaOpen] = useState(false);
  const warehouse = props.warehouse;
  const city = props.city;
  const mat = props.mat;
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

  // Flag that determines whether this industry is "new" and the current material should be
  // marked with flashing-red lights
  const tutorial =
    division.newInd && Object.keys(division.reqMats).includes(mat.name) && mat.buy === 0 && mat.imp === 0;

  // Purchase material button
  const purchaseButtonText = `Buy (${numeralWrapper.format(mat.buy, nfB)})`;

  // Sell material button
  let sellButtonText: JSX.Element;
  if (mat.sllman[0]) {
    if (isString(mat.sllman[1])) {
      sellButtonText = (
        <>
          Sell ({numeralWrapper.format(mat.sll, nfB)}/{mat.sllman[1]})
        </>
      );
    } else {
      sellButtonText = (
        <>
          Sell ({numeralWrapper.format(mat.sll, nfB)}/{numeralWrapper.format(mat.sllman[1] as number, nfB)})
        </>
      );
    }

    if (mat.marketTa2) {
      sellButtonText = (
        <>
          {sellButtonText} @ <Money money={mat.marketTa2Price} />
        </>
      );
    } else if (mat.marketTa1) {
      sellButtonText = (
        <>
          {sellButtonText} @ <Money money={mat.bCost + markupLimit} />
        </>
      );
    } else if (mat.sCost) {
      if (isString(mat.sCost)) {
        const sCost = (mat.sCost as string).replace(/MP/g, mat.bCost + "");
        sellButtonText = (
          <>
            {sellButtonText} @ <Money money={eval(sCost)} />
          </>
        );
      } else {
        sellButtonText = (
          <>
            {sellButtonText} @ <Money money={mat.sCost} />
          </>
        );
      }
    }
  } else {
    sellButtonText = <>Sell (0.000/0.000)</>;
  }

  return (
    <Paper>
      <Box display="flex">
        <Box>
          <Tooltip
            title={
              <Typography>
                Buy: {numeralWrapper.format(mat.buy, nfB)} <br />
                Prod: {numeralWrapper.format(mat.prd, nfB)} <br />
                Sell: {numeralWrapper.format(mat.sll, nfB)} <br />
                Export: {numeralWrapper.format(mat.totalExp, nfB)} <br />
                Import: {numeralWrapper.format(mat.imp, nfB)}
                {corp.unlockUpgrades[2] === 1 && <br />}
                {corp.unlockUpgrades[2] === 1 && "Demand: " + numeralWrapper.format(mat.dmd, nf)}
                {corp.unlockUpgrades[3] === 1 && <br />}
                {corp.unlockUpgrades[3] === 1 && "Competition: " + numeralWrapper.format(mat.cmp, nf)}
              </Typography>
            }
          >
            <Typography>
              {mat.name}: {numeralWrapper.format(mat.qty, nfB)} ({numeralWrapper.format(totalGain, nfB)}/s)
            </Typography>
          </Tooltip>
          <Tooltip
            title={
              <Typography>
                Market Price: The price you would pay if you were to buy this material on the market
              </Typography>
            }
          >
            <Typography>MP: {numeralWrapper.formatMoney(mat.bCost)}</Typography>
          </Tooltip>
          <Tooltip
            title={<Typography>The quality of your material. Higher quality will lead to more sales</Typography>}
          >
            <Typography>Quality: {numeralWrapper.format(mat.qlt, "0.00a")}</Typography>
          </Tooltip>
        </Box>

        <Box>
          <Tooltip
            title={tutorial ? <Typography>Purchase your required materials to get production started!</Typography> : ""}
          >
            <span>
              <Button
                color={tutorial ? "error" : "primary"}
                onClick={() => setPurchaseMaterialOpen(true)}
                disabled={props.warehouse.smartSupplyEnabled && Object.keys(division.reqMats).includes(props.mat.name)}
              >
                {purchaseButtonText}
              </Button>
            </span>
          </Tooltip>
          <PurchaseMaterialModal
            mat={mat}
            warehouse={warehouse}
            open={purchaseMaterialOpen}
            onClose={() => setPurchaseMaterialOpen(false)}
          />

          {corp.unlockUpgrades[0] === 1 && (
            <>
              <Button onClick={() => setExportOpen(true)}>Export</Button>

              <ExportModal mat={mat} open={exportOpen} onClose={() => setExportOpen(false)} />
            </>
          )}
          <br />

          <Button
            color={division.prodMats.includes(props.mat.name) && !mat.sllman[0] ? "error" : "primary"}
            onClick={() => setSellMaterialOpen(true)}
          >
            {sellButtonText}
          </Button>
          <SellMaterialModal mat={mat} open={sellMaterialOpen} onClose={() => setSellMaterialOpen(false)} />
          {division.hasResearch("Market-TA.I") && (
            <>
              <Button onClick={() => setMaterialMarketTaOpen(true)}>Market-TA</Button>

              <MaterialMarketTaModal
                mat={mat}
                open={materialMarketTaOpen}
                onClose={() => setMaterialMarketTaOpen(false)}
              />
            </>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
