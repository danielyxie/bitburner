import React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { CorporationConstants } from "../data/Constants";
import { Modal } from "../../ui/React/Modal";
import { useCorporation } from "./Context";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface IProps {
  open: boolean;
  onClose: () => void;
  rerender: () => void;
}

// Create a popup that lets the player manage exports
export function FindInvestorsModal(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const val = corp.determineValuation();
  let percShares = 0;
  let roundMultiplier = 4;
  switch (corp.fundingRound) {
    case 0: //Seed
      percShares = 0.1;
      roundMultiplier = 4;
      break;
    case 1: //Series A
      percShares = 0.35;
      roundMultiplier = 3;
      break;
    case 2: //Series B
      percShares = 0.25;
      roundMultiplier = 3;
      break;
    case 3: //Series C
      percShares = 0.2;
      roundMultiplier = 2.5;
      break;
    default:
      return <></>;
  }
  const funding = val * percShares * roundMultiplier;
  const investShares = Math.floor(CorporationConstants.INITIALSHARES * percShares);

  function findInvestors(): void {
    corp.fundingRound++;
    corp.addFunds(funding);
    corp.numShares -= investShares;
    props.rerender();
    props.onClose();
  }
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        An investment firm has offered you {numeralWrapper.formatMoney(funding)} in funding in exchange for a{" "}
        {numeralWrapper.format(percShares * 100, "0.000a")}% stake in the company (
        {numeralWrapper.format(investShares, "0.000a")} shares).
        <br />
        <br />
        Do you accept or reject this offer?
        <br />
        <br />
        Hint: Investment firms will offer more money if your corporation is turning a profit
      </Typography>
      <Button onClick={findInvestors}>Accept</Button>
    </Modal>
  );
}
