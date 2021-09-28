import React, { useState } from "react";
import { Modal } from "../../ui/React/Modal";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { use } from "../../ui/Context";
import { useCorporation } from "./Context";

interface IProps {
  open: boolean;
  onClose: () => void;
  rerender: () => void;
}

// Create a popup that lets the player buyback shares
// This is created when the player clicks the "Buyback Shares" button in the overview panel
export function BuybackSharesModal(props: IProps): React.ReactElement {
  const player = use.Player();
  const corp = useCorporation();
  const [shares, setShares] = useState<number | null>(null);

  function changeShares(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setShares(null);
    else setShares(Math.round(parseFloat(event.target.value)));
  }

  const currentStockPrice = corp.sharePrice;
  const buybackPrice = currentStockPrice * 1.1;

  function buy(): void {
    if (shares === null) return;
    const tempStockPrice = corp.sharePrice;
    const buybackPrice = tempStockPrice * 1.1;
    if (isNaN(shares) || shares <= 0) {
      dialogBoxCreate("ERROR: Invalid value for number of shares");
    } else if (shares > corp.issuedShares) {
      dialogBoxCreate("ERROR: There are not this many oustanding shares to buy back");
    } else if (shares * buybackPrice > player.money) {
      dialogBoxCreate(
        "ERROR: You do not have enough money to purchase this many shares (you need " +
          numeralWrapper.format(shares * buybackPrice, "$0.000a") +
          ")",
      );
    } else {
      corp.numShares += shares;
      if (isNaN(corp.issuedShares)) {
        console.warn("Corporation issuedShares is NaN: " + corp.issuedShares);
        console.warn("Converting to number now");
        const res = corp.issuedShares;
        if (isNaN(res)) {
          corp.issuedShares = 0;
        } else {
          corp.issuedShares = res;
        }
      }
      corp.issuedShares -= shares;
      player.loseMoney(shares * buybackPrice);
      props.onClose();
      props.rerender();
    }
  }

  function CostIndicator(): React.ReactElement {
    if (shares === null) return <></>;
    if (isNaN(shares) || shares <= 0) {
      return <>ERROR: Invalid value entered for number of shares to buyback</>;
    } else if (shares > corp.issuedShares) {
      return (
        <>
          There are not this many shares available to buy back. There are only{" "}
          {numeralWrapper.formatBigNumber(corp.issuedShares)} outstanding shares.
        </>
      );
    } else {
      return (
        <>
          Purchase {shares} shares for a total of {numeralWrapper.formatMoney(shares * buybackPrice)}
        </>
      );
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) buy();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <p>
        Enter the number of outstanding shares you would like to buy back. These shares must be bought at a 10% premium.
        However, repurchasing shares from the market tends to lead to an increase in stock price.
        <br />
        <br />
        To purchase these shares, you must use your own money (NOT your Corporation's funds).
        <br />
        <br />
        The current buyback price of your company's stock is {numeralWrapper.formatMoney(buybackPrice)}. Your company
        currently has {numeralWrapper.formatBigNumber(corp.issuedShares)} outstanding stock shares.
      </p>
      <CostIndicator />
      <br />
      <input
        autoFocus={true}
        className="text-input"
        type="number"
        placeholder="Shares to buyback"
        style={{ margin: "5px" }}
        onChange={changeShares}
        onKeyDown={onKeyDown}
      />
      <button onClick={buy} className="a-link-button" style={{ display: "inline-block" }}>
        Buy shares
      </button>
    </Modal>
  );
}
