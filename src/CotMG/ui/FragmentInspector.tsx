import React, { useState, useEffect } from "react";
import { ActiveFragment } from "../ActiveFragment";
import { FragmentType } from "../FragmentType";
import { numeralWrapper } from "../../ui/numeralFormat";
import { CalculateEffect } from "../formulas/effect";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

type IProps = {
  fragment: ActiveFragment | null;
  x: number;
  y: number;
};

export function FragmentInspector(props: IProps): React.ReactElement {
  const [, setC] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setC(new Date()), 250);

    return () => clearInterval(id);
  }, []);

  if (props.fragment === null) {
    return (
      <Paper>
        <Typography>
          ID: N/A
          <br />
          Type: N/A
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

  let charge = numeralWrapper.formatStaneksGiftCharge(props.fragment.charge);
  // Boosters and cooling don't deal with heat.
  if (f.type === FragmentType.Booster) {
    charge = "N/A";
  }
  const effect = numeralWrapper.format(CalculateEffect(props.fragment.charge, f.power) - 1, "+0.00%");

  return (
    <Paper>
      <Typography>
        ID: {props.fragment.id}
        <br />
        Type: {FragmentType[f.type]}
        <br />
        Power: {numeralWrapper.formatStaneksGiftPower(f.power)}
        <br />
        Charge: {charge}
        <br />
        Effect: {effect}
        <br />
        root [X, Y] {props.fragment.x}, {props.fragment.y}
        <br />
        [X, Y] {props.x}, {props.y}
      </Typography>
    </Paper>
  );
}
