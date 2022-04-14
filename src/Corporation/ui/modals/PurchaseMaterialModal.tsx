import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

import { numeralWrapper } from "../../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../ui/React/DialogBox";
import { Modal } from "../../../ui/React/Modal";
import { KEY } from "../../../utils/helpers/keyCodes";
import { BulkPurchase, BuyMaterial } from "../../Actions";
import type { Material } from "../../Material";
import { MaterialSizes } from "../../MaterialSizes";
import type { Warehouse } from "../../Warehouse";
import { useCorporation, useDivision } from "../Context";

interface IBulkPurchaseTextProps {
  warehouse: Warehouse;
  mat: Material;
  amount: string;
}

interface IBPProps {
  onClose: () => void;
  mat: Material;
  warehouse: Warehouse;
}

function BulkPurchaseSection(props: IBPProps): React.ReactElement {
  const corp = useCorporation();
  const [buyAmt, setBuyAmt] = useState("");
  const [disabled, setDisabled] = useState(false);

  function BulkPurchaseText(props: IBulkPurchaseTextProps): React.ReactElement {
    const parsedAmt = parseFloat(props.amount);
    const cost = parsedAmt * props.mat.bCost;

    const matSize = MaterialSizes[props.mat.name];
    const maxAmount = (props.warehouse.size - props.warehouse.sizeUsed) / matSize;

    if (parsedAmt > maxAmount) {
      setDisabled(true);
      return (
        <>
          <Typography color={"error"}>Not enough warehouse space to purchase this amount</Typography>
        </>
      );
    } else if (isNaN(cost) || parsedAmt < 0) {
      setDisabled(true);
      return (
        <>
          <Typography color={"error"}>Invalid input for Bulk Purchase amount</Typography>
        </>
      );
    } else {
      setDisabled(false);
      return (
        <>
          <Typography>
            Purchasing {numeralWrapper.format(parsedAmt, "0,0.00")} of {props.mat.name} will cost{" "}
            {numeralWrapper.formatMoney(cost)}
          </Typography>
        </>
      );
    }
  }

  function bulkPurchase(): void {
    try {
      BulkPurchase(corp, props.warehouse, props.mat, parseFloat(buyAmt));
    } catch (err) {
      dialogBoxCreate(err + "");
    }
    props.onClose();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === KEY.ENTER) bulkPurchase();
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
      <Button disabled={disabled} onClick={bulkPurchase}>
        Confirm Bulk Purchase
      </Button>
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
    if (event.key === KEY.ENTER) purchaseMaterial();
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
          <BulkPurchaseSection onClose={props.onClose} mat={props.mat} warehouse={props.warehouse} />
        )}
      </>
    </Modal>
  );
}
