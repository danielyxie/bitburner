import React, { useState } from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Modal } from "../../ui/React/Modal";
import { use } from "../../ui/Context";
import { useCorporation } from "./Context";
import { CorporationConstants } from "../data/Constants";
import { ICorporation } from "../ICorporation";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Money } from "../../ui/React/Money";
interface IProps {
  open: boolean;
  onClose: () => void;
  rerender: () => void;
}

// Create a popup that lets the player sell Corporation shares
// This is created when the player clicks the "Sell Shares" button in the overview panel
export function SellSharesModal(props: IProps): React.ReactElement {
  const player = use.Player();
  const corp = useCorporation();
  const [shares, setShares] = useState<number | null>(null);

  const disabled = shares === null || isNaN(shares) || shares <= 0 || shares > corp.numShares;

  function changeShares(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setShares(null);
    else setShares(Math.round(parseFloat(event.target.value)));
  }

  function ProfitIndicator(props: { shares: number | null; corp: ICorporation }): React.ReactElement {
    if (props.shares === null) return <></>;
    if (isNaN(props.shares) || props.shares <= 0) {
      return <>ERROR: Invalid value entered for number of shares to sell</>;
    } else if (props.shares > corp.numShares) {
      return <>You don't have this many shares to sell!</>;
    } else {
      const stockSaleResults = corp.calculateShareSale(props.shares);
      const profit = stockSaleResults[0];
      return (
        <>
          Sell {props.shares} shares for a total of {numeralWrapper.formatMoney(profit)}
        </>
      );
    }
  }

  function sell(): void {
    if (shares === null) return;
    if (disabled) return;
    const stockSaleResults = corp.calculateShareSale(shares);
    const profit = stockSaleResults[0];
    const newSharePrice = stockSaleResults[1];
    const newSharesUntilUpdate = stockSaleResults[2];

    corp.numShares -= shares;
    if (isNaN(corp.issuedShares)) {
      console.error(`Corporation issuedShares is NaN: ${corp.issuedShares}`);
      const res = corp.issuedShares;
      if (isNaN(res)) {
        corp.issuedShares = 0;
      } else {
        corp.issuedShares = res;
      }
    }
    corp.issuedShares += shares;
    corp.sharePrice = newSharePrice;
    corp.shareSalesUntilPriceUpdate = newSharesUntilUpdate;
    corp.shareSaleCooldown = CorporationConstants.SellSharesCooldown;
    player.gainMoney(profit);
    player.recordMoneySource(profit, "corporation");
    props.onClose();
    dialogBoxCreate(
      <>
        Sold {numeralWrapper.formatMoney(shares)} shares for
        <Money money={profit} />. The corporation's stock price fell to&nbsp; <Money money={corp.sharePrice} />
        as a result of dilution.
      </>,
    );

    props.rerender();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) sell();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Enter the number of shares you would like to sell. The money from selling your shares will go directly to you
        (NOT your Corporation).
        <br />
        <br />
        Selling your shares will cause your corporation's stock price to fall due to dilution. Furthermore, selling a
        large number of shares all at once will have an immediate effect in reducing your stock price.
        <br />
        <br />
        The current price of your company's stock is {numeralWrapper.formatMoney(corp.sharePrice)}
      </Typography>
      <ProfitIndicator shares={shares} corp={corp} />
      <br />
      <TextField
        variant="standard"
        autoFocus
        type="number"
        placeholder="Shares to sell"
        onChange={changeShares}
        onKeyDown={onKeyDown}
      />
      <Button disabled={disabled} onClick={sell} sx={{ mx: 1 }}>
        Sell shares
      </Button>
    </Modal>
  );
}
