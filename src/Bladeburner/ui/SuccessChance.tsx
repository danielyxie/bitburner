import React from "react";
import { formatNumber } from "../../utils/StringHelperFunctions";
import { StealthIcon } from "./StealthIcon";
import { KillIcon } from "./KillIcon";
import { Action } from "../Action";
import { Bladeburner } from "../Bladeburner";
import { Player } from "../../Player";

interface IProps {
  bladeburner: Bladeburner;
  action: Action;
}

export function SuccessChance(props: IProps): React.ReactElement {
  const estimatedSuccessChance = props.action.getEstSuccessChance(props.bladeburner, Player);

  let chance = <></>;
  if (estimatedSuccessChance[0] === estimatedSuccessChance[1]) {
    chance = <>{formatNumber(estimatedSuccessChance[0] * 100, 1)}%</>;
  } else {
    chance = (
      <>
        {formatNumber(estimatedSuccessChance[0] * 100, 1)}% ~ {formatNumber(estimatedSuccessChance[1] * 100, 1)}%
      </>
    );
  }

  return (
    <>
      Estimated success chance: {chance} {props.action.isStealth ? <StealthIcon /> : <></>}
      {props.action.isKill ? <KillIcon /> : <></>}
    </>
  );
}
