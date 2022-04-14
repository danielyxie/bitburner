// React Component for displaying an Industry's warehouse information
// (right-side panel in the Industry UI)
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import React, { useState } from "react";

import type { IPlayer } from "../../PersonObjects/IPlayer";
import { numeralWrapper } from "../../ui/numeralFormat";
import { PurchaseWarehouse } from "../Actions";
import { CorporationConstants } from "../data/Constants";
import type { ICorporation } from "../ICorporation";
import type { IIndustry } from "../IIndustry";
import { Material } from "../Material";
import { MaterialSizes } from "../MaterialSizes";
import { Product } from "../Product";
import { Warehouse } from "../Warehouse";

import { useCorporation, useDivision } from "./Context";
import { isRelevantMaterial } from "./Helpers";
import { IndustryProductEquation } from "./IndustryProductEquation";
import { MaterialElem } from "./MaterialElem";
import { SmartSupplyModal } from "./modals/SmartSupplyModal";
import { MoneyCost } from "./MoneyCost";
import { ProductElem } from "./ProductElem";

interface IProps {
  corp: ICorporation;
  division: IIndustry;
  warehouse: Warehouse | 0;
  currentCity: string;
  player: IPlayer;
  rerender: () => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    retainHeight: {
      minHeight: "3em",
    },
  }),
);

function WarehouseRoot(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
  const [smartSupplyOpen, setSmartSupplyOpen] = useState(false);
  if (props.warehouse === 0) return <></>;

  // Upgrade Warehouse size button
  const sizeUpgradeCost = CorporationConstants.WarehouseUpgradeBaseCost * Math.pow(1.07, props.warehouse.level + 1);
  const canAffordUpgrade = corp.funds > sizeUpgradeCost;
  function upgradeWarehouseOnClick(): void {
    if (division === null) return;
    if (props.warehouse === 0) return;
    if (!canAffordUpgrade) return;
    ++props.warehouse.level;
    props.warehouse.updateSize(corp, division);
    corp.funds = corp.funds - sizeUpgradeCost;
    props.rerender();
  }

  const classes = useStyles();

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
  for (const matName of Object.keys(props.warehouse.materials)) {
    if (!(props.warehouse.materials[matName] instanceof Material)) continue;
    // Only create UI for materials that are relevant for the industry or in stock
    const isInStock = props.warehouse.materials[matName].qty > 0;
    const isRelevant = isRelevantMaterial(matName, division);
    if (!isInStock && !isRelevant) continue;
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
    for (const productName of Object.keys(division.products)) {
      const product = division.products[productName];
      if (!(product instanceof Product)) continue;
      products.push(
        <ProductElem rerender={props.rerender} city={props.currentCity} key={productName} product={product} />,
      );
    }
  }

  const breakdownItems: JSX.Element[] = [];
  for (const matName of Object.keys(props.warehouse.materials)) {
    const mat = props.warehouse.materials[matName];
    if (!MaterialSizes.hasOwnProperty(matName)) continue;
    if (mat.qty === 0) continue;
    breakdownItems.push(
      <>
        {matName}: {numeralWrapper.format(mat.qty * MaterialSizes[matName], "0,0.0")}
      </>,
    );
  }

  for (const prodName of Object.keys(division.products)) {
    const prod = division.products[prodName];
    if (prod === undefined) continue;
    breakdownItems.push(
      <>
        {prodName}: {numeralWrapper.format(prod.data[props.warehouse.loc][0] * prod.siz, "0,0.0")}
      </>,
    );
  }

  let breakdown;
  if (breakdownItems && breakdownItems.length > 0) {
    breakdown = breakdownItems.reduce(
      (previous: JSX.Element, current: JSX.Element): JSX.Element =>
        (previous && (
          <>
            {previous}
            <br />
            {current}
          </>
        )) || <>{current}</>,
    );
  } else {
    breakdown = <>No items in storage.</>;
  }

  return (
    <Paper>
      <Box display="flex" alignItems="center">
        <Tooltip
          title={
            props.warehouse.sizeUsed !== 0 ? (
              <Typography>
                <>{breakdown}</>
              </Typography>
            ) : (
              ""
            )
          }
        >
          <Typography color={props.warehouse.sizeUsed >= props.warehouse.size ? "error" : "primary"}>
            Storage: {numeralWrapper.formatBigNumber(props.warehouse.sizeUsed)} /{" "}
            {numeralWrapper.formatBigNumber(props.warehouse.size)}
          </Typography>
        </Tooltip>
      </Box>

      <Button disabled={!canAffordUpgrade} onClick={upgradeWarehouseOnClick}>
        Upgrade Warehouse Size -&nbsp;
        <MoneyCost money={sizeUpgradeCost} corp={corp} />
      </Button>

      <Typography>This industry uses the following equation for its production: </Typography>
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

      <Typography className={classes.retainHeight}>{stateText}</Typography>

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
  const disabled = corp.funds < CorporationConstants.WarehouseInitialCost;
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
