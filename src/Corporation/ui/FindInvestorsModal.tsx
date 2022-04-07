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
  const corporation = useCorporation();
  const val = corporation.determineValuation();
  if (
    corporation.fundingRound >= CorporationConstants.FundingRoundShares.length ||
    corporation.fundingRound >= CorporationConstants.FundingRoundMultiplier.length
  )
    return <></>;
  const percShares = CorporationConstants.FundingRoundShares[corporation.fundingRound];
  const roundMultiplier = CorporationConstants.FundingRoundMultiplier[corporation.fundingRound];
  const funding = val * percShares * roundMultiplier;
  const investShares = Math.floor(CorporationConstants.INITIALSHARES * percShares);

  function findInvestors(): void {
    corporation.fundingRound++;
    corporation.addFunds(funding);
    corporation.numShares -= investShares;
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
