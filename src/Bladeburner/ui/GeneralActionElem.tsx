import React, { useState } from "react";
import { ActionTypes } from "../data/ActionTypes";
import { createProgressBarText } from "../../utils/helpers/createProgressBarText";
import { formatNumber, convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { IBladeburner } from "../IBladeburner";
import { IAction } from "../IAction";
import { GeneralActions } from "../data/GeneralActions";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { CopyableText } from "../../ui/React/CopyableText";

import { StartButton } from "./StartButton";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
  action: IAction;
}

export function GeneralActionElem(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }
  const isActive = props.action.name === props.bladeburner.action.name;
  const computedActionTimeCurrent = Math.min(
    props.bladeburner.actionTimeCurrent + props.bladeburner.actionTimeOverflow,
    props.bladeburner.actionTimeToComplete,
  );
  const actionTime = (function (): number {
    switch (props.action.name) {
      case "Training":
      case "Field Analysis":
        return 30;
      case "Diplomacy":
      case "Hyperbolic Regeneration Chamber":
        return 60;
      case "Incite Violence":
        return 600;
      case "Recruitment":
        return props.bladeburner.getRecruitmentTime(props.player);
    }
    return -1; // dead code
  })();
  const successChance =
    props.action.name === "Recruitment"
      ? Math.max(0, Math.min(props.bladeburner.getRecruitmentSuccessChance(props.player), 1))
      : -1;

  const actionData = GeneralActions[props.action.name];
  if (actionData === undefined) {
    throw new Error(`Cannot find data for ${props.action.name}`);
  }

  return (
    <Paper sx={{ my: 1, p: 1 }}>
      {isActive ? (
        <>
          <CopyableText value={props.action.name} />
          <Typography>
            (IN PROGRESS - {formatNumber(computedActionTimeCurrent, 0)} /{" "}
            {formatNumber(props.bladeburner.actionTimeToComplete, 0)})
          </Typography>
          <Typography>
            {createProgressBarText({
              progress: computedActionTimeCurrent / props.bladeburner.actionTimeToComplete,
            })}
          </Typography>
        </>
      ) : (
        <Box display="flex" flexDirection="row" alignItems="center">
          <CopyableText value={props.action.name} />
          <StartButton
            bladeburner={props.bladeburner}
            type={ActionTypes[props.action.name as string]}
            name={props.action.name}
            rerender={rerender}
          />
        </Box>
      )}
      <br />
      <br />
      <Typography>{actionData.desc}</Typography>
      <br />
      <br />
      <Typography>
        Time Required: {convertTimeMsToTimeElapsedString(actionTime * 1000)}
        {successChance !== -1 && (
          <>
            <br />
            Estimated success chance: {formatNumber(successChance * 100, 1)}%
          </>
        )}
      </Typography>
    </Paper>
  );
}
