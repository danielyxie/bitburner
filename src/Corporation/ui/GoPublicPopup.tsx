import React, { useState } from "react";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { removePopup } from "../../ui/React/createPopup";
import { numeralWrapper } from "../../ui/numeralFormat";
import { ICorporation } from "../ICorporation";
import { IPlayer } from "../../PersonObjects/IPlayer";

interface IProps {
  corp: ICorporation;
  popupId: string;
  player: IPlayer;
  rerender: () => void;
}

// Create a popup that lets the player manage exports
export function GoPublicPopup(props: IProps): React.ReactElement {
  const [shares, setShares] = useState("");
  const initialSharePrice = props.corp.determineValuation() / props.corp.totalShares;

  function goPublic(): void {
    const numShares = parseFloat(shares);
    const initialSharePrice = props.corp.determineValuation() / props.corp.totalShares;
    if (isNaN(numShares)) {
      dialogBoxCreate("Invalid value for number of issued shares");
      return;
    }
    if (numShares > props.corp.numShares) {
      dialogBoxCreate("Error: You don't have that many shares to issue!");
      return;
    }
    props.corp.public = true;
    props.corp.sharePrice = initialSharePrice;
    props.corp.issuedShares = numShares;
    props.corp.numShares -= numShares;
    props.corp.addFunds(numShares * initialSharePrice);
    props.rerender();
    dialogBoxCreate(
      `You took your ${props.corp.name} public and earned ` +
        `${numeralWrapper.formatMoney(numShares * initialSharePrice)} in your IPO`,
    );
    removePopup(props.popupId);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) goPublic();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setShares(event.target.value);
  }

  return (
    <>
      <p>
        Enter the number of shares you would like to issue for your IPO. These shares will be publicly sold and you will
        no longer own them. Your Corporation will receive {numeralWrapper.formatMoney(initialSharePrice)} per share (the
        IPO money will be deposited directly into your Corporation's funds).
        <br />
        <br />
        You have a total of {numeralWrapper.format(props.corp.numShares, "0.000a")} of shares that you can issue.
      </p>
      <input
        className="text-input"
        value={shares}
        onChange={onChange}
        autoFocus={true}
        type="number"
        placeholder="Shares to issue"
        onKeyDown={onKeyDown}
      />
      <button className="std-button" onClick={goPublic}>
        Go Public
      </button>
    </>
  );
}
