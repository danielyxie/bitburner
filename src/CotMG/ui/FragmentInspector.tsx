import React, { useState, useEffect } from "react";
import { ActiveFragment } from "../ActiveFragment";
import { IStaneksGift } from "../IStaneksGift";
import { FragmentType, Effect } from "../FragmentType";
import { numeralWrapper } from "../../ui/numeralFormat";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

type IProps = {
  gift: IStaneksGift;
  fragment: ActiveFragment | undefined;
  x: number;
  y: number;
};

export function FragmentInspector(props: IProps): React.ReactElement {
  const [, setC] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setC(new Date()), 250);

    return () => clearInterval(id);
  }, []);

  if (props.fragment === undefined) {
    return (
      <Paper>
        <Typography>
          ID: N/A
          <br />
          Effect: N/A
          <br />
          Magnitude: N/A
          <br />
          Charge: N/A
          <br />
          Heat: N/A
          <br />
          Effect: N/A
          <br />
          [X, Y] N/A
          <br />
          [X, Y] {props.x}, {props.y}
        </Typography>
      </Paper>
    );
  }
  const f = props.fragment.fragment();

  let charge = numeralWrapper.formatStaneksGiftCharge(props.fragment.highestCharge * props.fragment.numCharge);
  let effect = "N/A";
  // Boosters and cooling don't deal with heat.
  if ([FragmentType.Booster, FragmentType.None, FragmentType.Delete].includes(f.type)) {
    charge = "N/A";
    effect = `${f.power}x adjacent fragment power`;
  } else if (Effect(f.type).includes("+x%")) {
    effect = Effect(f.type).replace(/-*x%/, numeralWrapper.formatPercentage(props.gift.effect(props.fragment) - 1));
  } else if (Effect(f.type).includes("-x%")) {
    const effectAmt = props.gift.effect(props.fragment);
    const perc = numeralWrapper.formatPercentage(1 - 1 / effectAmt);
    effect = Effect(f.type).replace(/-x%/, perc);
  }

  return (
    <Paper>
      <Typography>
        ID: {props.fragment.id}
        <br />
        Effect: {effect}
        <br />
        Base Power: {numeralWrapper.formatStaneksGiftPower(f.power)}
        <br />
        Charge: {charge}
        <br />
        <br />
        root [X, Y] {props.fragment.x}, {props.fragment.y}
        <br />
        [X, Y] {props.x}, {props.y}
      </Typography>
    </Paper>
  );
}
