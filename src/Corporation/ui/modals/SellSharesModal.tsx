import React, { useState } from "react";
import { numeralWrapper } from "../../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../ui/React/DialogBox";
import { Modal } from "../../../ui/React/Modal";
import { use } from "../../../ui/Context";
import { useCorporation } from "../Context";
import { ICorporation } from "../../ICorporation";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Money } from "../../../ui/React/Money";
import { SellShares } from "../../Actions";
import { KEY } from "../../../utils/helpers/keyCodes";
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
    let text = "";
    if (isNaN(props.shares) || props.shares <= 0) {
      text = `ERROR: Invalid value entered for number of shares to sell`;
    } else if (props.shares > corp.numShares) {
      text = `You don't have this many shares to sell!`;
    } else {
      const stockSaleResults = corp.calculateShareSale(props.shares);
      const profit = stockSaleResults[0];
      text = `Sell ${props.shares} shares for a total of ${numeralWrapper.formatMoney(profit)}`;
    }

    return (
      <Typography>
        <small>{text}</small>
      </Typography>
    );
  }

  function sell(): void {
    if (disabled) return;
    try {
      const profit = SellShares(corp, player, shares);
      props.onClose();
      dialogBoxCreate(
        <>
          Sold {numeralWrapper.formatMoney(shares)} shares for
          <Money money={profit} />. The corporation's stock price fell to&nbsp; <Money money={corp.sharePrice} />
          as a result of dilution.
        </>,
      );

      props.rerender();
    } catch (err) {
      dialogBoxCreate(err + "");
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === KEY.ENTER) sell();
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
      <ProfitIndicator shares={shares} corp={corp} />
    </Modal>
  );
}
