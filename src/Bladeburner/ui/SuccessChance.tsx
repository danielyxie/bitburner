import React from "react";
import { formatNumber } from "../../../utils/StringHelperFunctions";

interface IProps {
  chance: number[];
}

export function SuccessChance(props: IProps): React.ReactElement {
  if (props.chance[0] === props.chance[1]) {
    return <>{formatNumber(props.chance[0] * 100, 1)}%</>;
  }

  return (
    <>
      {formatNumber(props.chance[0] * 100, 1)}% ~{" "}
      {formatNumber(props.chance[1] * 100, 1)}%
    </>
  );
}
