import React, { useState } from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { removePopup } from "../../ui/React/createPopup";
import { getRandomInt } from "../../../utils/helpers/getRandomInt";
import { CorporationConstants } from "../data/Constants";
import { ICorporation } from "../ICorporation";

interface IEffectTextProps {
  corp: ICorporation;
  shares: number | null;
}

function EffectText(props: IEffectTextProps): React.ReactElement {
  if (props.shares === null) return <></>;
  const newSharePrice = Math.round(props.corp.sharePrice * 0.9);
  const maxNewSharesUnrounded = Math.round(props.corp.totalShares * 0.2);
  const maxNewShares = maxNewSharesUnrounded - (maxNewSharesUnrounded % 1e6);
  let newShares = props.shares;
  if (isNaN(newShares)) {
    return <p>Invalid input</p>;
  }

  // Round to nearest ten-millionth
  newShares /= 10e6;
  newShares = Math.round(newShares) * 10e6;

  if (newShares < 10e6) {
    return <p>Must issue at least 10 million new shares</p>;
  }

  if (newShares > maxNewShares) {
    return <p>You cannot issue that many shares</p>;
  }

  return (
    <p>
      Issue ${numeralWrapper.format(newShares, "0.000a")} new shares for{" "}
      {numeralWrapper.formatMoney(newShares * newSharePrice)}?
    </p>
  );
}

interface IProps {
  corp: ICorporation;
  popupId: string;
}

// Create a popup that lets the player issue new shares
// This is created when the player clicks the "Issue New Shares" buttons in the overview panel
export function IssueNewSharesPopup(props: IProps): React.ReactElement {
  const [shares, setShares] = useState<number | null>(null);
  const maxNewSharesUnrounded = Math.round(props.corp.totalShares * 0.2);
  const maxNewShares = maxNewSharesUnrounded - (maxNewSharesUnrounded % 1e6);

  function issueNewShares(): void {
    if (shares === null) return;
    const newSharePrice = Math.round(props.corp.sharePrice * 0.9);
    let newShares = shares;
    if (isNaN(newShares)) {
      dialogBoxCreate("Invalid input for number of new shares");
      return;
    }

    // Round to nearest ten-millionth
    newShares = Math.round(newShares / 10e6) * 10e6;

    if (newShares < 10e6 || newShares > maxNewShares) {
      dialogBoxCreate("Invalid input for number of new shares");
      return;
    }

    const profit = newShares * newSharePrice;
    props.corp.issueNewSharesCooldown = CorporationConstants.IssueNewSharesCooldown;
    props.corp.totalShares += newShares;

    // Determine how many are bought by private investors
    // Private investors get up to 50% at most
    // Round # of private shares to the nearest millionth
    let privateShares = getRandomInt(0, Math.round(newShares / 2));
    privateShares = Math.round(privateShares / 1e6) * 1e6;

    props.corp.issuedShares += newShares - privateShares;
    props.corp.funds = props.corp.funds.plus(profit);
    props.corp.immediatelyUpdateSharePrice();

    removePopup(props.popupId);
    dialogBoxCreate(
      `Issued ${numeralWrapper.format(newShares, "0.000a")} and raised ` +
        `${numeralWrapper.formatMoney(profit)}. ${numeralWrapper.format(privateShares, "0.000a")} ` +
        `of these shares were bought by private investors.<br><br>` +
        `Stock price decreased to ${numeralWrapper.formatMoney(props.corp.sharePrice)}`,
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
    <>
      <p>
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
      </p>
      <EffectText corp={props.corp} shares={shares} />
      <input
        className="text-input"
        autoFocus={true}
        placeholder="# New Shares"
        style={{ margin: "5px" }}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <button onClick={issueNewShares} className="std-button" style={{ display: "inline-block" }}>
        Issue New Shares
      </button>
    </>
  );

  // let issueBtn, newSharesInput;
  // const dynamicText = createElement("p", {
  //     display: "block",
  // });

  // function updateDynamicText(corp) {

  // }

  // createPopup(popupId, [descText, dynamicText, newSharesInput, issueBtn, cancelBtn]);
  // newSharesInput.focus();
}
