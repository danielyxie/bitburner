import React, { useState } from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { removePopup } from "../../ui/React/createPopup";
import { CorporationConstants } from "../data/Constants";
import { ICorporation } from "../ICorporation";

interface IProps {
  corp: ICorporation;
  player: IPlayer;
  popupId: string;
}

// Create a popup that lets the player sell Corporation shares
// This is created when the player clicks the "Sell Shares" button in the overview panel
export function SellSharesPopup(props: IProps): React.ReactElement {
  const [shares, setShares] = useState<number | null>(null);

  function changeShares(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setShares(null);
    else setShares(Math.round(parseFloat(event.target.value)));
  }

  function ProfitIndicator(props: {
    shares: number | null;
    corp: ICorporation;
  }): React.ReactElement {
    if (props.shares === null) return <></>;
    if (isNaN(props.shares) || props.shares <= 0) {
      return <>ERROR: Invalid value entered for number of shares to sell</>;
    } else if (props.shares > props.corp.numShares) {
      return <>You don't have this many shares to sell!</>;
    } else {
      const stockSaleResults = props.corp.calculateShareSale(props.shares);
      const profit = stockSaleResults[0];
      return (
        <>
          Sell {props.shares} shares for a total of{" "}
          {numeralWrapper.formatMoney(profit)}
        </>
      );
    }
  }

  function sell(): void {
    if (shares === null) return;
    if (isNaN(shares) || shares <= 0) {
      dialogBoxCreate("ERROR: Invalid value for number of shares");
    } else if (shares > props.corp.numShares) {
      dialogBoxCreate("ERROR: You don't have this many shares to sell");
    } else {
      const stockSaleResults = props.corp.calculateShareSale(shares);
      const profit = stockSaleResults[0];
      const newSharePrice = stockSaleResults[1];
      const newSharesUntilUpdate = stockSaleResults[2];

      props.corp.numShares -= shares;
      if (isNaN(props.corp.issuedShares)) {
        console.error(
          `Corporation issuedShares is NaN: ${props.corp.issuedShares}`,
        );
        const res = props.corp.issuedShares;
        if (isNaN(res)) {
          props.corp.issuedShares = 0;
        } else {
          props.corp.issuedShares = res;
        }
      }
      props.corp.issuedShares += shares;
      props.corp.sharePrice = newSharePrice;
      props.corp.shareSalesUntilPriceUpdate = newSharesUntilUpdate;
      props.corp.shareSaleCooldown = CorporationConstants.SellSharesCooldown;
      props.player.gainMoney(profit);
      props.player.recordMoneySource(profit, "corporation");
      removePopup(props.popupId);
      dialogBoxCreate(
        `Sold ${numeralWrapper.formatMoney(shares)} shares for ` +
          `${numeralWrapper.formatMoney(profit)}. ` +
          `The corporation's stock price fell to ${numeralWrapper.formatMoney(
            props.corp.sharePrice,
          )} ` +
          `as a result of dilution.`,
      );

      props.corp.rerender(props.player);
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) sell();
  }

  return (
    <>
      <p>
        Enter the number of shares you would like to sell. The money from
        selling your shares will go directly to you (NOT your Corporation).
        <br />
        <br />
        Selling your shares will cause your corporation's stock price to fall
        due to dilution. Furthermore, selling a large number of shares all at
        once will have an immediate effect in reducing your stock price.
        <br />
        <br />
        The current price of your company's stock is{" "}
        {numeralWrapper.formatMoney(props.corp.sharePrice)}
      </p>
      <ProfitIndicator shares={shares} corp={props.corp} />
      <br />
      <input
        autoFocus={true}
        className="text-input"
        type="number"
        placeholder="Shares to sell"
        style={{ margin: "5px" }}
        onChange={changeShares}
        onKeyDown={onKeyDown}
      />
      <button
        onClick={sell}
        className="a-link-button"
        style={{ display: "inline-block" }}
      >
        Sell shares
      </button>
    </>
  );
}
