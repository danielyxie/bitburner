// React Component for displaying an Industry's warehouse information
// (right-side panel in the Industry UI)
import React, { useState } from "react";

import { CorporationConstants } from "../data/Constants";
import { Material } from "../Material";
import { Product } from "../Product";
import { Warehouse } from "../Warehouse";
import { SmartSupplyModal } from "./SmartSupplyModal";
import { ProductElem } from "./ProductElem";
import { MaterialElem } from "./MaterialElem";
import { MaterialSizes } from "../MaterialSizes";

import { numeralWrapper } from "../../ui/numeralFormat";

import { ICorporation } from "../ICorporation";
import { IIndustry } from "../IIndustry";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { MoneyCost } from "./MoneyCost";
import { isRelevantMaterial } from "./Helpers";
import { IndustryProductEquation } from "./IndustryProductEquation";
import { PurchaseWarehouse } from "../Actions";
import { useCorporation, useDivision } from "./Context";

import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface IProps {
  corp: ICorporation;
  division: IIndustry;
  warehouse: Warehouse | 0;
  currentCity: string;
  player: IPlayer;
  rerender: () => void;
}

function WarehouseRoot(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const [smartSupplyOpen, setSmartSupplyOpen] = useState(false);
  if (props.warehouse === 0) return <></>;

  // Upgrade Warehouse size button
  const sizeUpgradeCost = CorporationConstants.WarehouseUpgradeBaseCost * Math.pow(1.07, props.warehouse.level + 1);
  const canAffordUpgrade = corp.funds.gt(sizeUpgradeCost);
  function upgradeWarehouseOnClick(): void {
    if (division === null) return;
    if (props.warehouse === 0) return;
    if (!canAffordUpgrade) return;
    ++props.warehouse.level;
    props.warehouse.updateSize(corp, division);
    corp.funds = corp.funds.minus(sizeUpgradeCost);
    props.rerender();
  }

  // Current State:
  let stateText;
  switch (division.state) {
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

  // Create React components for materials
  const mats = [];
  for (const matName in props.warehouse.materials) {
    if (!(props.warehouse.materials[matName] instanceof Material)) continue;
    // Only create UI for materials that are relevant for the industry
    if (!isRelevantMaterial(matName, division)) continue;
    mats.push(
      <MaterialElem
        rerender={props.rerender}
        city={props.currentCity}
        key={matName}
        mat={props.warehouse.materials[matName]}
        warehouse={props.warehouse}
      />,
    );
  }

  // Create React components for products
  const products = [];
  if (division.makesProducts && Object.keys(division.products).length > 0) {
    for (const productName in division.products) {
      const product = division.products[productName];
      if (!(product instanceof Product)) continue;
      products.push(
        <ProductElem rerender={props.rerender} city={props.currentCity} key={productName} product={product} />,
      );
    }
  }

  let breakdown = <></>;
  for (const matName in props.warehouse.materials) {
    const mat = props.warehouse.materials[matName];
    if (!MaterialSizes.hasOwnProperty(matName)) continue;
    if (mat.qty === 0) continue;
    breakdown = (
      <>
        {breakdown}
        {matName}: {numeralWrapper.format(mat.qty * MaterialSizes[matName], "0,0.0")}
        <br />
      </>
    );
  }

  for (const prodName in division.products) {
    const prod = division.products[prodName];
    if (prod === undefined) continue;
    breakdown = (
      <>
        {breakdown}
        {prodName}: {numeralWrapper.format(prod.data[props.warehouse.loc][0] * prod.siz, "0,0.0")}
      </>
    );
  }

  return (
    <Paper>
      <Box display="flex" alignItems="center">
        <Tooltip title={props.warehouse.sizeUsed !== 0 ? <Typography>{breakdown}</Typography> : ""}>
          <Typography color={props.warehouse.sizeUsed >= props.warehouse.size ? "error" : "primary"}>
            Storage: {numeralWrapper.formatBigNumber(props.warehouse.sizeUsed)} /{" "}
            {numeralWrapper.formatBigNumber(props.warehouse.size)}
          </Typography>
        </Tooltip>

        <Button disabled={!canAffordUpgrade} onClick={upgradeWarehouseOnClick}>
          Upgrade Warehouse Size -&nbsp;
          <MoneyCost money={sizeUpgradeCost} corp={corp} />
        </Button>
      </Box>

      <Typography>This industry uses the following equation for it's production: </Typography>
      <br />
      <Typography>
        <IndustryProductEquation key={division.name} division={division} />
      </Typography>
      <br />
      <Typography>
        To get started with production, purchase your required materials or import them from another of your company's
        divisions.
      </Typography>
      <br />

      <Typography>{stateText}</Typography>

      {corp.unlockUpgrades[1] && (
        <>
          <Button onClick={() => setSmartSupplyOpen(true)}>Configure Smart Supply</Button>
          <SmartSupplyModal
            open={smartSupplyOpen}
            onClose={() => setSmartSupplyOpen(false)}
            warehouse={props.warehouse}
          />
        </>
      )}

      {mats}

      {products}
    </Paper>
  );
}

export function IndustryWarehouse(props: IProps): React.ReactElement {
  if (props.warehouse instanceof Warehouse) {
    return <WarehouseRoot {...props} />;
  } else {
    return <EmptyWarehouse rerender={props.rerender} city={props.currentCity} />;
  }
}

interface IEmptyProps {
  city: string;
  rerender: () => void;
}

function EmptyWarehouse(props: IEmptyProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const disabled = corp.funds.lt(CorporationConstants.WarehouseInitialCost);
  function purchaseWarehouse(): void {
    if (disabled) return;
    PurchaseWarehouse(corp, division, props.city);
    props.rerender();
  }
  return (
    <Paper>
      <Button onClick={purchaseWarehouse} disabled={disabled}>
        Purchase Warehouse (
        <MoneyCost money={CorporationConstants.WarehouseInitialCost} corp={corp} />)
      </Button>
    </Paper>
  );
}
