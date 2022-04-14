import React from "react";

import { formatNumber } from "../../utils/StringHelperFunctions";
import type { IAction } from "../IAction";
import type { IBladeburner } from "../IBladeburner";

import { KillIcon } from "./KillIcon";
import { StealthIcon } from "./StealthIcon";

interface IProps {
  bladeburner: IBladeburner;
  action: IAction;
}

export function SuccessChance(props: IProps): React.ReactElement {
  const estimatedSuccessChance = props.action.getEstSuccessChance(props.bladeburner);

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
