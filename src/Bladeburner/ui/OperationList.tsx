import React from "react";
import { OperationElem } from "./OperationElem";
import { IBladeburner } from "../IBladeburner";
import { IPlayer } from "../../PersonObjects/IPlayer";

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
}

export function OperationList(props: IProps): React.ReactElement {
  const names = Object.keys(props.bladeburner.operations);
  const operations = props.bladeburner.operations;
  return (
    <>
      {names.map((name: string) => (
        <OperationElem key={name} bladeburner={props.bladeburner} action={operations[name]} player={props.player} />
      ))}
    </>
  );
}
