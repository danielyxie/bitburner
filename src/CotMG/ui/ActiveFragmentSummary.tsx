import React, { useState, useEffect } from "react";
import { ActiveFragment } from "../ActiveFragment";
import { IStaneksGift } from "../IStaneksGift";
import { FragmentType, Effect } from "../FragmentType";
import { numeralWrapper } from "../../ui/numeralFormat";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

type IProps = {
  gift: IStaneksGift;
};

export function ActiveFragmentSummary(props: IProps): React.ReactElement {
  const [, setC] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setC(new Date()), 250);

    return () => clearInterval(id);
  }, []);

  const effects = props.gift.fragments.map((fragment: ActiveFragment) => {
    const f = fragment.fragment();

    let effect = "N/A";
    effect = "[" + fragment.x + "," + fragment.y + "] ";
    // Boosters and cooling don't deal with heat.
    if ([FragmentType.Booster, FragmentType.None, FragmentType.Delete].includes(f.type)) {
      return "";
    } else if (Effect(f.type).includes("+x%")) {
      effect += Effect(f.type).replace(/-*x%/, numeralWrapper.formatPercentage(props.gift.effect(fragment) - 1));
    } else if (Effect(f.type).includes("-x%")) {
      const effectAmt = props.gift.effect(fragment);
      const perc = numeralWrapper.formatPercentage(1 - 1 / effectAmt);
      effect += Effect(f.type).replace(/-x%/, perc);
    }

    return <Typography>{effect}</Typography>;
  });

  return (
    <Paper sx={{ mb: 1 }}>
      <Typography variant="h5">Summary of current effects:</Typography>
      {effects.length <= 0 && <Typography>None currently.</Typography>}
      <Box sx={{ display: "list", width: "fit-content", gridTemplateColumns: "repeat(1, 1fr)" }}>{effects}</Box>
    </Paper>
  );
}
