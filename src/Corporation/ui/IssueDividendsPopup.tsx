import React, { useState } from "react";
import { removePopup } from "../../ui/React/createPopup";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { CorporationConstants } from "../data/Constants";
import { ICorporation } from "../ICorporation";
import { IssueDividends } from "../Actions";

interface IProps {
  popupId: string;
  corp: ICorporation;
}

// Create a popup that lets the player issue & manage dividends
// This is created when the player clicks the "Issue Dividends" button in the overview panel
export function IssueDividendsPopup(props: IProps): React.ReactElement {
  const [percent, setPercent] = useState<number | null>(null);

  function issueDividends(): void {
    if (percent === null) return;
    try {
      IssueDividends(props.corp, percent / 100);
    } catch (err) {
      dialogBoxCreate(err + "");
    }

    removePopup(props.popupId);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) issueDividends();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setPercent(null);
    else setPercent(parseFloat(event.target.value));
  }

  return (
    <>
      <p>
        Dividends are a distribution of a portion of the corporation's profits
        to the shareholders. This includes yourself, as well.
        <br />
        <br />
        In order to issue dividends, simply allocate some percentage of your
        corporation's profits to dividends. This percentage must be an integer
        between 0 and {CorporationConstants.DividendMaxPercentage}. (A
        percentage of 0 means no dividends will be issued
        <br />
        <br />
        Two important things to note:
        <br />
        * Issuing dividends will negatively affect your corporation's stock
        price
        <br />
        * Dividends are taxed. Taxes start at 50%, but can be decreased
        <br />
        <br />
        Example: Assume your corporation makes $100m / sec in profit and you
        allocate 40% of that towards dividends. That means your corporation will
        gain $60m / sec in funds and the remaining $40m / sec will be paid as
        dividends. Since your corporation starts with 1 billion shares, every
        shareholder will be paid $0.04 per share per second before taxes.
      </p>
      <input
        autoFocus={true}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="text-input"
        placeholder="Dividend %"
        type="number"
        style={{ margin: "5px" }}
      />
      <button
        onClick={issueDividends}
        className="std-button"
        style={{ display: "inline-block" }}
      >
        Allocate Dividend Percentage
      </button>
    </>
  );
}
