import React, { useState } from "react";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { MaterialSizes } from "../MaterialSizes";
import { Warehouse } from "../Warehouse";
import { Material } from "../Material";
import { numeralWrapper } from "../../ui/numeralFormat";
import { BuyMaterial } from "../Actions";
import { Modal } from "../../ui/React/Modal";
import { useCorporation, useDivision } from "./Context";
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
    return <>Not enough warehouse space to purchase this amount</>;
  } else if (isNaN(cost)) {
    return <>Invalid put for Bulk Purchase amount</>;
  } else {
    return (
      <>
        Purchasing {numeralWrapper.format(parsedAmt, "0,0.00")} of {props.mat.name} will cost{" "}
        {numeralWrapper.formatMoney(cost)}
      </>
    );
  }
}

interface IBPProps {
  onClose: () => void;
  mat: Material;
  warehouse: Warehouse;
}

function BulkPurchase(props: IBPProps): React.ReactElement {
  const corp = useCorporation();
  const [buyAmt, setBuyAmt] = useState("");

  function bulkPurchase(): void {
    const amount = parseFloat(buyAmt);

    const matSize = MaterialSizes[props.mat.name];
    const maxAmount = (props.warehouse.size - props.warehouse.sizeUsed) / matSize;
    if (amount * matSize > maxAmount) {
      dialogBoxCreate(`You do not have enough warehouse size to fit this purchase`);
      return;
    }

    if (isNaN(amount)) {
      dialogBoxCreate("Invalid input amount");
    } else {
      const cost = amount * props.mat.bCost;
      if (corp.funds.gt(cost)) {
        corp.funds = corp.funds.minus(cost);
        props.mat.qty += amount;
      } else {
        dialogBoxCreate(`You cannot afford this purchase.`);
        return;
      }
      props.onClose();
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) bulkPurchase();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setBuyAmt(event.target.value);
  }

  return (
    <>
      <Typography>
        Enter the amount of {props.mat.name} you would like to bulk purchase. This purchases the specified amount
        instantly (all at once).
      </Typography>
      <BulkPurchaseText warehouse={props.warehouse} mat={props.mat} amount={buyAmt} />
      <TextField
        value={buyAmt}
        onChange={onChange}
        type="number"
        placeholder="Bulk Purchase amount"
        onKeyDown={onKeyDown}
      />
      <Button onClick={bulkPurchase}>Confirm Bulk Purchase</Button>
    </>
  );
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

  function purchaseMaterial(): void {
    if (buyAmt === null) return;
    try {
      BuyMaterial(props.mat, buyAmt);
    } catch (err) {
      dialogBoxCreate(err + "");
    }

    props.onClose();
  }

  function clearPurchase(): void {
    props.mat.buy = 0;
    props.onClose();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) purchaseMaterial();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setBuyAmt(parseFloat(event.target.value));
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
        />
        <Button onClick={purchaseMaterial}>Confirm</Button>
        <Button onClick={clearPurchase}>Clear Purchase</Button>
        {division.hasResearch("Bulk Purchasing") && (
          <BulkPurchase onClose={props.onClose} mat={props.mat} warehouse={props.warehouse} />
        )}
      </>
    </Modal>
  );
}
