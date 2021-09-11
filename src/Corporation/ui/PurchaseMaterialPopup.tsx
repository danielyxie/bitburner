import React, { useState } from "react";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { removePopup } from "../../ui/React/createPopup";
import { MaterialSizes } from "../MaterialSizes";
import { Warehouse } from "../Warehouse";
import { Material } from "../Material";
import { IIndustry } from "../IIndustry";
import { ICorporation } from "../ICorporation";
import { numeralWrapper } from "../../ui/numeralFormat";
import { BuyMaterial } from "../Actions";

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

interface IProps {
  mat: Material;
  industry: IIndustry;
  warehouse: Warehouse;
  corp: ICorporation;
  popupId: string;
}

function BulkPurchase(props: IProps): React.ReactElement {
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
      if (props.corp.funds.gt(cost)) {
        props.corp.funds = props.corp.funds.minus(cost);
        props.mat.qty += amount;
      } else {
        dialogBoxCreate(`You cannot afford this purchase.`);
        return;
      }

      removePopup(props.popupId);
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
      <p>
        Enter the amount of {props.mat.name} you would like to bulk purchase. This purchases the specified amount
        instantly (all at once).
      </p>
      <BulkPurchaseText warehouse={props.warehouse} mat={props.mat} amount={buyAmt} />
      <input
        onChange={onChange}
        type="number"
        placeholder="Bulk Purchase amount"
        style={{ margin: "5px" }}
        onKeyDown={onKeyDown}
      />
      <button className="std-button">Confirm Bulk Purchase</button>
    </>
  );
}

// Create a popup that lets the player purchase a Material
export function PurchaseMaterialPopup(props: IProps): React.ReactElement {
  const [buyAmt, setBuyAmt] = useState(props.mat.buy ? props.mat.buy : null);

  function purchaseMaterial(): void {
    if (buyAmt === null) return;
    try {
      BuyMaterial(props.mat, buyAmt);
    } catch (err) {
      dialogBoxCreate(err + "");
    }

    removePopup(props.popupId);
  }

  function clearPurchase(): void {
    props.mat.buy = 0;
    removePopup(props.popupId);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) purchaseMaterial();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setBuyAmt(parseFloat(event.target.value));
  }

  return (
    <>
      <p>
        Enter the amount of {props.mat.name} you would like to purchase per second. This material's cost changes
        constantly.
      </p>
      <input
        onChange={onChange}
        className="text-input"
        autoFocus={true}
        placeholder="Purchase amount"
        type="number"
        style={{ margin: "5px" }}
        onKeyDown={onKeyDown}
      />
      <button onClick={purchaseMaterial} className="std-button">
        Confirm
      </button>
      <button onClick={clearPurchase} className="std-button">
        Clear Purchase
      </button>
      {props.industry.hasResearch("Bulk Purchasing") && (
        <BulkPurchase
          corp={props.corp}
          mat={props.mat}
          industry={props.industry}
          warehouse={props.warehouse}
          popupId={props.popupId}
        />
      )}
    </>
  );
}
