import React, { useState } from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Modal } from "../../ui/React/Modal";
import { getRandomInt } from "../../utils/helpers/getRandomInt";
import { CorporationConstants } from "../data/Constants";
import { useCorporation } from "./Context";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface IEffectTextProps {
  shares: number | null;
}

function EffectText(props: IEffectTextProps): React.ReactElement {
  const corp = useCorporation();
  if (props.shares === null) return <></>;
  const newSharePrice = Math.round(corp.sharePrice * 0.9);
  const maxNewSharesUnrounded = Math.round(corp.totalShares * 0.2);
  const maxNewShares = maxNewSharesUnrounded - (maxNewSharesUnrounded % 1e6);
  let newShares = props.shares;
  if (isNaN(newShares)) {
    return <Typography>Invalid input</Typography>;
  }

  // Round to nearest ten-millionth
  newShares /= 10e6;
  newShares = Math.round(newShares) * 10e6;

  if (newShares < 10e6) {
    return <Typography>Must issue at least 10 million new shares</Typography>;
  }

  if (newShares > maxNewShares) {
    return <Typography>You cannot issue that many shares</Typography>;
  }

  return (
    <Typography>
      Issue ${numeralWrapper.format(newShares, "0.000a")} new shares for{" "}
      {numeralWrapper.formatMoney(newShares * newSharePrice)}?
    </Typography>
  );
}

interface IProps {
  open: boolean;
  onClose: () => void;
}

// Create a popup that lets the player issue new shares
// This is created when the player clicks the "Issue New Shares" buttons in the overview panel
export function IssueNewSharesModal(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const [shares, setShares] = useState<number | null>(null);
  const maxNewSharesUnrounded = Math.round(corp.totalShares * 0.2);
  const maxNewShares = maxNewSharesUnrounded - (maxNewSharesUnrounded % 1e6);

  const newShares = Math.round((shares || 0) / 10e6) * 10e6;
  const disabled = shares === null || isNaN(newShares) || newShares < 10e6 || newShares > maxNewShares;

  function issueNewShares(): void {
    if (shares === null) return;
    if (disabled) return;

    const newSharePrice = Math.round(corp.sharePrice * 0.9);
    let newShares = shares;

    // Round to nearest ten-millionth
    newShares = Math.round(newShares / 10e6) * 10e6;

    const profit = newShares * newSharePrice;
    corp.issueNewSharesCooldown = CorporationConstants.IssueNewSharesCooldown;
    corp.totalShares += newShares;

    // Determine how many are bought by private investors
    // Private investors get up to 50% at most
    // Round # of private shares to the nearest millionth
    let privateShares = getRandomInt(0, Math.round(newShares / 2));
    privateShares = Math.round(privateShares / 1e6) * 1e6;

    corp.issuedShares += newShares - privateShares;
    corp.funds = corp.funds.plus(profit);
    corp.immediatelyUpdateSharePrice();
    props.onClose();
    dialogBoxCreate(
      `Issued ${numeralWrapper.format(newShares, "0.000a")} and raised ` +
        `${numeralWrapper.formatMoney(profit)}. ${numeralWrapper.format(privateShares, "0.000a")} ` +
        `of these shares were bought by private investors.<br><br>` +
        `Stock price decreased to ${numeralWrapper.formatMoney(corp.sharePrice)}`,
    );
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) issueNewShares();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setShares(null);
    else setShares(parseFloat(event.target.value));
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        You can issue new equity shares (i.e. stocks) in order to raise capital for your corporation.
        <br />
        <br />
        &nbsp;* You can issue at most {numeralWrapper.formatMoney(maxNewShares)} new shares
        <br />
        &nbsp;* New shares are sold at a 10% discount
        <br />
        &nbsp;* You can only issue new shares once every 12 hours
        <br />
        &nbsp;* Issuing new shares causes dilution, resulting in a decrease in stock price and lower dividends per share
        <br />
        &nbsp;* Number of new shares issued must be a multiple of 10 million
        <br />
        <br />
        When you choose to issue new equity, private shareholders have first priority for up to 50% of the new shares.
        If they choose to exercise this option, these newly issued shares become private, restricted shares, which means
        you cannot buy them back.
      </Typography>
      <EffectText shares={shares} />
      <TextField autoFocus placeholder="# New Shares" onChange={onChange} onKeyDown={onKeyDown} />
      <Button disabled={disabled} onClick={issueNewShares} sx={{ mx: 1 }}>
        Issue New Shares
      </Button>
    </Modal>
  );
}
