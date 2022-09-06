import React from "react";
import { OperationElem } from "./OperationElem";
import { IBladeburner } from "../IBladeburner";

interface IProps {
  bladeburner: IBladeburner;
}

export function OperationList(props: IProps): React.ReactElement {
  const names = Object.keys(props.bladeburner.operations);
  const operations = props.bladeburner.operations;
  return (
    <>
      {names.map((name: string) => (
        <OperationElem key={name} bladeburner={props.bladeburner} action={operations[name]} />
      ))}
    </>
  );
}
