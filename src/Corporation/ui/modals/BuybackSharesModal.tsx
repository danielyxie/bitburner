import React, { useState } from "react";
import { Modal } from "../../../ui/React/Modal";
import { numeralWrapper } from "../../../ui/numeralFormat";
import { use } from "../../../ui/Context";
import { useCorporation } from "../Context";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NumberInput } from "../../../ui/React/NumberInput";
import { BuyBackShares } from "../../Actions";
import { dialogBoxCreate } from "../../../ui/React/DialogBox";
import { KEY } from "../../../utils/helpers/keyCodes";

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
  const [shares, setShares] = useState<number>(NaN);

  const currentStockPrice = corp.sharePrice;
  const buybackPrice = currentStockPrice * 1.1;
  const disabled =
    shares === null ||
    isNaN(shares) ||
    shares <= 0 ||
    shares > corp.issuedShares ||
    shares * buybackPrice > player.money;

  function buy(): void {
    if (disabled) return;
    try {
      BuyBackShares(corp, shares);
    } catch (err) {
      dialogBoxCreate(err + "");
    }
    props.onClose();
    props.rerender();
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
    if (event.key === KEY.ENTER) buy();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Enter the number of outstanding shares you would like to buy back. These shares must be bought at a 10% premium.
        However, repurchasing shares from the market tends to lead to an increase in stock price.
        <br />
        <br />
        To purchase these shares, you must use your own money (NOT your Corporation's funds).
        <br />
        <br />
        The current buyback price of your company's stock is {numeralWrapper.formatMoney(buybackPrice)}. Your company
        currently has {numeralWrapper.formatBigNumber(corp.issuedShares)} outstanding stock shares.
      </Typography>
      <CostIndicator />
      <br />
      <NumberInput autoFocus={true} placeholder="Shares to buyback" onChange={setShares} onKeyDown={onKeyDown} />
      <Button disabled={disabled} onClick={buy}>
        Buy shares
      </Button>
    </Modal>
  );
}
