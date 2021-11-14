/**
 * React component for a panel that lets you purchase upgrades for a Duplicate
 * Sleeve's Memory (through The Covenant)
 */
import React, { useState } from "react";

import { Sleeve } from "../Sleeve";
import { IPlayer } from "../../IPlayer";

import { numeralWrapper } from "../../../ui/numeralFormat";
import { Money } from "../../../ui/React/Money";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

interface IProps {
  index: number;
  p: IPlayer;
  rerender: () => void;
  sleeve: Sleeve;
}

export function CovenantSleeveMemoryUpgrade(props: IProps): React.ReactElement {
  const [amt, setAmt] = useState(1);

  function changePurchaseAmount(e: React.ChangeEvent<HTMLInputElement>): void {
    let n: number = parseInt(e.target.value);

    if (isNaN(n)) n = 1;
    const maxMemory = 100 - props.sleeve.memory;
    if (n > maxMemory) n = maxMemory;

    setAmt(n);
  }

  function getPurchaseCost(): number {
    if (isNaN(amt)) {
      return Infinity;
    }

    const maxMemory = 100 - props.sleeve.memory;
    if (amt > maxMemory) {
      return Infinity;
    }

    return props.sleeve.getMemoryUpgradeCost(amt);
  }

  function purchaseMemory(): void {
    const cost = getPurchaseCost();
    if (props.p.canAfford(cost)) {
      props.sleeve.upgradeMemory(amt);
      props.p.loseMoney(cost, "sleeves");
      props.rerender();
    }
  }

  // Purchase button props
  const cost = getPurchaseCost();
  const purchaseBtnDisabled = !props.p.canAfford(cost);
  let purchaseBtnContent = <></>;
  if (isNaN(amt)) {
    purchaseBtnContent = <>Invalid value</>;
  } else {
    purchaseBtnContent = (
      <>
        Purchase {amt} memory&nbsp;-&nbsp;
        <Money money={cost} player={props.p} />
      </>
    );
  }

  return (
    <Paper sx={{ my: 1, p: 1 }}>
      <Typography variant="h6" color="primary">
        Upgrade Memory of Sleeve {props.index}
      </Typography>
      <Typography>
        Purchase a memory upgrade for your sleeve. Note that a sleeve's max memory is 100 (current:{" "}
        {numeralWrapper.formatSleeveMemory(props.sleeve.memory)})
      </Typography>

      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography>Amount of memory to purchase (must be an integer):&nbsp;</Typography>
        <TextField onChange={changePurchaseAmount} type={"number"} value={amt} />
      </Box>
      <br />
      <Button disabled={purchaseBtnDisabled} onClick={purchaseMemory}>
        {purchaseBtnContent}
      </Button>
    </Paper>
  );
}
