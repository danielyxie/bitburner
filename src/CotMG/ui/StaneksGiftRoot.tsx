import React from "react";
import { Grid } from "./Grid";
import { IStaneksGift } from "../IStaneksGift";
import Typography from "@mui/material/Typography";

type IProps = {
  staneksGift: IStaneksGift;
};

export function StaneksGiftRoot({ staneksGift }: IProps): React.ReactElement {
  return (
    <>
      <Typography variant="h4">Stanek's Gift</Typography>
      <Typography>
        The gift is a grid on which you can place upgrades called fragments. The main type of fragment increases a stat,
        like your hacking skill or agility exp. Once a stat fragment is placed it then needs to be charged via scripts
        in order to become useful. The other kind of fragment is called booster fragments. They increase the efficiency
        of the charged happening on fragments neighboring them (no diagonal)
      </Typography>
      <Grid gift={staneksGift} />
    </>
  );
}
