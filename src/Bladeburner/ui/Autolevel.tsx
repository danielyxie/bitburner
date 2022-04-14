import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React from "react";

import type { IAction } from "../IAction";

interface IProps {
  action: IAction;
  rerender: () => void;
}

export function Autolevel(props: IProps): React.ReactElement {
  function onAutolevel(event: React.ChangeEvent<HTMLInputElement>): void {
    props.action.autoLevel = event.target.checked;
    props.rerender();
  }
  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Tooltip title={<Typography>Automatically increase operation level when possible</Typography>}>
        <Typography> Autolevel:</Typography>
      </Tooltip>
      <Switch checked={props.action.autoLevel} onChange={onAutolevel} />
    </Box>
  );
}
