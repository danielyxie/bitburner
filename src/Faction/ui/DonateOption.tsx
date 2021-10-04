/**
 * React component for a donate option on the Faction UI
 */
import React, { useState } from "react";

import { CONSTANTS } from "../../Constants";
import { Faction } from "../../Faction/Faction";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { repFromDonation } from "../formulas/donation";
import { Favor } from "../../ui/React/Favor";

import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";

import { numeralWrapper } from "../../ui/numeralFormat";

import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { MathComponent } from "mathjax-react";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

type IProps = {
  faction: Faction;
  disabled: boolean;
  favorToDonate: number;
  p: IPlayer;
  rerender: () => void;
};

export function DonateOption(props: IProps): React.ReactElement {
  const [donateAmt, setDonateAmt] = useState<number | null>(null);
  const digits = (CONSTANTS.DonateMoneyToRepDivisor + "").length - 1;

  function canDonate(): boolean {
    if (donateAmt === null) return false;
    if (isNaN(donateAmt) || donateAmt <= 0) return false;
    if (props.p.money.lt(donateAmt)) return false;
    return true;
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const amt = numeralWrapper.parseMoney(event.target.value);
    if (event.target.value === "" || isNaN(amt)) setDonateAmt(null);
    else setDonateAmt(amt);
  }

  function donate(): void {
    const fac = props.faction;
    const amt = donateAmt;
    if (amt === null) return;
    if (!canDonate()) return;
    props.p.loseMoney(amt);
    const repGain = repFromDonation(amt, props.p);
    props.faction.playerReputation += repGain;
    dialogBoxCreate(
      <>
        You just donated <Money money={amt} /> to {fac.name} to gain <Reputation reputation={repGain} /> reputation.
      </>,
    );
    props.rerender();
  }

  function Status(): React.ReactElement {
    if (donateAmt === null) return <></>;
    if (!canDonate()) {
      if (props.p.money.lt(donateAmt)) return <Typography>Insufficient funds</Typography>;
      return <Typography>Invalid donate amount entered!</Typography>;
    }
    return (
      <Typography>
        This donation will result in <Reputation reputation={repFromDonation(donateAmt, props.p)} /> reputation gain
      </Typography>
    );
  }

  return (
    <Paper sx={{ my: 1, p: 1, width: "100%" }}>
      <Status />
      {props.disabled ? (
        <Typography>
          Unlock donations at <Favor favor={props.favorToDonate} /> favor with {props.faction.name}
        </Typography>
      ) : (
        <>
          <TextField
            onChange={onChange}
            placeholder={"Donation amount"}
            disabled={props.disabled}
            InputProps={{
              endAdornment: (
                <Button onClick={donate} disabled={props.disabled || !canDonate()}>
                  donate
                </Button>
              ),
            }}
          />
          <Typography>
            <MathComponent
              tex={String.raw`reputation = \frac{\text{donation amount} \times \text{reputation multiplier}}{10^{${digits}}}`}
            />
          </Typography>
        </>
      )}
    </Paper>
  );
}
