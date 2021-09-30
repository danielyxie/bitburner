import React, { useState } from "react";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Modal } from "../../ui/React/Modal";
import { CorporationConstants } from "../data/Constants";
import { IssueDividends } from "../Actions";
import { useCorporation } from "./Context";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
interface IProps {
  open: boolean;
  onClose: () => void;
}

// Create a popup that lets the player issue & manage dividends
// This is created when the player clicks the "Issue Dividends" button in the overview panel
export function IssueDividendsModal(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const [percent, setPercent] = useState(0);

  const canIssue = !isNaN(percent) && percent >= 0 && percent <= CorporationConstants.DividendMaxPercentage * 100;
  function issueDividends(): void {
    if (!canIssue) return;
    if (percent === null) return;
    try {
      IssueDividends(corp, percent / 100);
    } catch (err) {
      dialogBoxCreate(err + "");
    }

    props.onClose();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) issueDividends();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setPercent(0);
    else {
      let p = parseFloat(event.target.value);
      if (p > 50) p = 50;
      if (p < 0) p = 0;
      setPercent(p);
    }
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Dividends are a distribution of a portion of the corporation's profits to the shareholders. This includes
        yourself, as well.
        <br />
        <br />
        In order to issue dividends, simply allocate some percentage of your corporation's profits to dividends. This
        percentage must be an integer between 0 and {CorporationConstants.DividendMaxPercentage}. (A percentage of 0
        means no dividends will be issued
        <br />
        <br />
        Two important things to note:
        <br />
        * Issuing dividends will negatively affect your corporation's stock price
        <br />
        * Dividends are taxed. Taxes start at 50%, but can be decreased
        <br />
        <br />
        Example: Assume your corporation makes $100m / sec in profit and you allocate 40% of that towards dividends.
        That means your corporation will gain $60m / sec in funds and the remaining $40m / sec will be paid as
        dividends. Since your corporation starts with 1 billion shares, every shareholder will be paid $0.04 per share
        per second before taxes.
      </Typography>
      <TextField
        autoFocus
        value={percent}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Dividend %"
        type="number"
      />
      <Button disabled={!canIssue} sx={{ mx: 1 }} onClick={issueDividends}>
        Allocate Dividend Percentage
      </Button>
    </Modal>
  );
}
