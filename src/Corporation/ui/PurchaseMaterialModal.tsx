import React, { useState } from "react";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { MaterialSizes } from "../MaterialSizes";
import { Warehouse } from "../Warehouse";
import { Material } from "../Material";
import { numeralWrapper } from "../../ui/numeralFormat";
import { BulkPurchaseMaterial, BuyMaterial } from "../Actions";
import { Modal } from "../../ui/React/Modal";
import { useDivision } from "./Context";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface IBulkPurchaseTextProps {
  warehouse: Warehouse;
  mat: Material;
  amount: string;
}

function BulkPurchaseText(props: IBulkPurchaseTextProps): React.ReactElement {
  const parsedAmt = parseFloat(props.amount);
  const cost = parsedAmt * props.mat.bCost;

  const matSize = MaterialSizes[props.mat.name];
  const maxAmount = (props.warehouse.size - props.warehouse.sizeUsed) / matSize;

  if (parsedAmt * matSize > maxAmount) {
    return (
      <>
        <Typography color={"error"}>Not enough warehouse space to purchase this amount</Typography>
      </>
    );
  } else if (isNaN(cost) || parsedAmt < 0) {
    return (
      <>
        <Typography color={"error"}>Invalid input for Bulk Purchase amount</Typography>
      </>
    );
  } else {
    return (
      <>
        <Typography>
          Purchasing {numeralWrapper.format(parsedAmt, "0,0.00")} of {props.mat.name} will cost{" "}
          {numeralWrapper.formatMoney(cost)} at current market price
        </Typography>
      </>
    );
  }
}

interface IProps {
  open: boolean;
  onClose: () => void;
  mat: Material;
  warehouse: Warehouse;
}

// Create a popup that lets the player purchase a Material
export function PurchaseMaterialModal(props: IProps): React.ReactElement {
  const division = useDivision();
  const [buyAmt, setBuyAmt] = useState(props.mat.buy ? props.mat.buy : 0);
  const [buyBulkAmt, setBuyBulkAmt] = useState(props.mat.buyBulk ? props.mat.buyBulk : 0);

  function purchaseMaterial(): void {
    if (buyAmt === null) return;
    try {
      BuyMaterial(props.mat, buyAmt);
    } catch (err) {
      dialogBoxCreate(err + "");
    }
    
    if (buyAmt === null) return;
    try {
      BulkPurchaseMaterial(props.mat, buyAmt);
    } catch (err) {
      dialogBoxCreate(err + "");
    }

    props.onClose();
  }

  function clearPurchase(): void {
    props.mat.buy = 0;
    props.mat.buyBulk = 0;
    props.onClose();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) purchaseMaterial();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setBuyAmt(parseFloat(event.target.value));
  }

  function onBulkChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setBuyBulkAmt(parseFloat(event.target.value));
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <>
        <Typography>
          Enter the amount of {props.mat.name} you would like to purchase per second. This material's cost changes
          constantly.
        </Typography>
        <TextField
          value={buyAmt}
          onChange={onChange}
          autoFocus={true}
          placeholder="Purchase amount"
          type="number"
          onKeyDown={onKeyDown}
          disabled={props.warehouse.smartSupplyEnabled && Object.keys(division.reqMats).includes(props.mat.name)}
        />
        <Typography>
          Enter the amount of {props.mat.name} you would like to bulk purchase. That amount materials will be purchased at the start of the next market cycle.
        </Typography>
        <BulkPurchaseText warehouse={props.warehouse} mat={props.mat} amount={buyBulkAmt} />
        <TextField
          value={buyBulkAmt}
          onChange={onBulkChange}
          type="number"
          placeholder="Bulk Purchase amount"
          onKeyDown={onKeyDown}
        />
        <Button onClick={purchaseMaterial}>Confirm</Button>
        <Button onClick={clearPurchase}>Clear Purchase</Button>
      </>
    </Modal>
  );
}
