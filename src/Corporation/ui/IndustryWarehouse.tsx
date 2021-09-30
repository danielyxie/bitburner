// React Component for displaying an Industry's warehouse information
// (right-side panel in the Industry UI)
import React, { useState } from "react";

import { CorporationConstants } from "../data/Constants";
import { OfficeSpace } from "../OfficeSpace";
import { Material } from "../Material";
import { Product } from "../Product";
import { Warehouse } from "../Warehouse";
import { ExportPopup } from "./ExportPopup";
import { MaterialMarketTaPopup } from "./MaterialMarketTaPopup";
import { SellMaterialPopup } from "./SellMaterialPopup";
import { PurchaseMaterialPopup } from "./PurchaseMaterialPopup";
import { SmartSupplyModal } from "./SmartSupplyModal";
import { ProductElem } from "./ProductElem";
import { MaterialSizes } from "../MaterialSizes";

import { numeralWrapper } from "../../ui/numeralFormat";
import { createPopup } from "../../ui/React/createPopup";

import { isString } from "../../utils/helpers/isString";
import { ICorporation } from "../ICorporation";
import { IIndustry } from "../IIndustry";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Money } from "../../ui/React/Money";
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

interface IMaterialProps {
  warehouse: Warehouse;
  city: string;
  mat: Material;
  rerender: () => void;
}

// Creates the UI for a single Material type
function MaterialComponent(props: IMaterialProps): React.ReactElement {
  const corp = useCorporation();
  const division = useDivision();
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
  const purchaseButtonClass = tutorial ? "std-button flashing-button tooltip" : "std-button";

  function openPurchaseMaterialPopup(): void {
    const popupId = "cmpy-mgmt-material-purchase-popup";
    createPopup(popupId, PurchaseMaterialPopup, {
      mat: mat,
      industry: division,
      warehouse: warehouse,
      corp: corp,
      popupId: popupId,
    });
  }

  function openExportPopup(): void {
    const popupId = "cmpy-mgmt-export-popup";
    createPopup(popupId, ExportPopup, {
      mat: mat,
      corp: corp,
      popupId: popupId,
    });
  }

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

  function openSellMaterialPopup(): void {
    const popupId = "cmpy-mgmt-material-sell-popup";
    createPopup(popupId, SellMaterialPopup, {
      mat: mat,
      corp: corp,
      popupId: popupId,
    });
  }

  function openMaterialMarketTaPopup(): void {
    const popupId = "cmpy-mgmt-export-popup";
    createPopup(popupId, MaterialMarketTaPopup, {
      mat: mat,
      industry: division,
      corp: corp,
      popupId: popupId,
    });
  }

  function shouldFlash(): boolean {
    return division.prodMats.includes(props.mat.name) && !mat.sllman[0];
  }

  return (
    <div className={"cmpy-mgmt-warehouse-material-div"}>
      <div style={{ display: "inline-block" }}>
        <p className={"tooltip"}>
          {mat.name}: {numeralWrapper.format(mat.qty, nfB)} ({numeralWrapper.format(totalGain, nfB)}/s)
          <span className={"tooltiptext"}>
            Buy: {numeralWrapper.format(mat.buy, nfB)} <br />
            Prod: {numeralWrapper.format(mat.prd, nfB)} <br />
            Sell: {numeralWrapper.format(mat.sll, nfB)} <br />
            Export: {numeralWrapper.format(mat.totalExp, nfB)} <br />
            Import: {numeralWrapper.format(mat.imp, nfB)}
            {corp.unlockUpgrades[2] === 1 && <br />}
            {corp.unlockUpgrades[2] === 1 && "Demand: " + numeralWrapper.format(mat.dmd, nf)}
            {corp.unlockUpgrades[3] === 1 && <br />}
            {corp.unlockUpgrades[3] === 1 && "Competition: " + numeralWrapper.format(mat.cmp, nf)}
          </span>
        </p>
        <br />
        <p className={"tooltip"}>
          MP: {numeralWrapper.formatMoney(mat.bCost)}
          <span className={"tooltiptext"}>
            Market Price: The price you would pay if you were to buy this material on the market
          </span>
        </p>{" "}
        <br />
        <p className={"tooltip"}>
          Quality: {numeralWrapper.format(mat.qlt, "0.00a")}
          <span className={"tooltiptext"}>The quality of your material. Higher quality will lead to more sales</span>
        </p>
      </div>

      <div style={{ display: "inline-block" }}>
        <Button
          className={purchaseButtonClass}
          onClick={openPurchaseMaterialPopup}
          disabled={props.warehouse.smartSupplyEnabled && Object.keys(division.reqMats).includes(props.mat.name)}
        >
          {purchaseButtonText}
          {tutorial && (
            <span className={"tooltiptext"}>Purchase your required materials to get production started!</span>
          )}
        </Button>

        {corp.unlockUpgrades[0] === 1 && <Button onClick={openExportPopup}>Export</Button>}
        <br />

        <Button className={`std-button${shouldFlash() ? " flashing-button" : ""}`} onClick={openSellMaterialPopup}>
          {sellButtonText}
        </Button>

        {division.hasResearch("Market-TA.I") && <Button onClick={openMaterialMarketTaPopup}>Market-TA</Button>}
      </div>
    </div>
  );
}

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

  const ratioLines = [];
  for (const matName in division.reqMats) {
    if (division.reqMats.hasOwnProperty(matName)) {
      const text = [" *", division.reqMats[matName], matName].join(" ");
      ratioLines.push(
        <div key={matName}>
          <p>{text}</p>
        </div>,
      );
    }
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
      <MaterialComponent
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
    if (matName === "RealEstate") continue;
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

  return (
    <div className={"cmpy-mgmt-warehouse-panel"}>
      <Box display="flex" alignItems="center">
        <Tooltip title={props.warehouse.sizeUsed !== 0 ? breakdown : ""}>
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
        <IndustryProductEquation division={division} />
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
    </div>
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
