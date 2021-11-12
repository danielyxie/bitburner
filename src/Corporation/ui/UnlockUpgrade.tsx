// React Components for the Unlock upgrade buttons on the overview page
import React from "react";

import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { CorporationUnlockUpgrade } from "../data/CorporationUnlockUpgrades";
import { useCorporation } from "./Context";
import { UnlockUpgrade as UU } from "../Actions";
import { MoneyCost } from "./MoneyCost";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

interface IProps {
  upgradeData: CorporationUnlockUpgrade;
  rerender: () => void;
}

export function UnlockUpgrade(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const data = props.upgradeData;
  const tooltip = data[3];
  function onClick(): void {
    if (corp.funds.lt(data[1])) return;
    try {
      UU(corp, props.upgradeData);
    } catch (err) {
      dialogBoxCreate(err + "");
    }
    props.rerender();
  }

  return (
    <Grid item xs={4}>
      <Box display="flex" alignItems="center" flexDirection="row-reverse">
        <Button disabled={corp.funds.lt(data[1])} sx={{ mx: 1 }} onClick={onClick}>
          <MoneyCost money={data[1]} corp={corp} />
        </Button>
        <Tooltip title={tooltip}>
          <Typography>{data[2]}</Typography>
        </Tooltip>
      </Box>
    </Grid>
  );
}
