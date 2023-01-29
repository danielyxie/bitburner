import React from "react";
import { IAction } from "../IAction";
import { IBladeburner } from "../IBladeburner";
import { BladeburnerConstants } from "../data/Constants";
import { use } from "../../ui/Context";

import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface IProps {
  action: IAction;
  isActive: boolean;
  bladeburner: IBladeburner;
  rerender: () => void;
}

export function ActionLevel({ action, isActive, bladeburner, rerender }: IProps): React.ReactElement {
  const player = use.Player();

  const canIncrease = action.level < action.maxLevel;
  const canDecrease = action.level > 1;

  function increaseLevel(): void {
    if (!canIncrease) return;
    ++action.level;
    if (isActive) bladeburner.startAction(player, bladeburner.action);
    rerender();
  }

  function decreaseLevel(): void {
    if (!canDecrease) return;
    --action.level;
    if (isActive) bladeburner.startAction(player, bladeburner.action);
    rerender();
  }

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Box display="flex">
        <Tooltip
          title={
            <Typography>
              {action.getSuccessesNeededForNextLevel(BladeburnerConstants.ContractSuccessesPerLevel)} successes needed
              for next level
            </Typography>
          }
        >
          <Typography>
            Level: {action.level} / {action.maxLevel}
          </Typography>
        </Tooltip>
      </Box>
      <Tooltip title={isActive ? <Typography>WARNING: changing the level will restart the Operation</Typography> : ""}>
        <span>
          <IconButton disabled={!canIncrease} onClick={increaseLevel}>
            <ArrowDropUpIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={isActive ? <Typography>WARNING: changing the level will restart the Operation</Typography> : ""}>
        <span>
          <IconButton disabled={!canDecrease} onClick={decreaseLevel}>
            <ArrowDropDownIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}
