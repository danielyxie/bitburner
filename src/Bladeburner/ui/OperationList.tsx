import React from "react";
import { OperationElem } from "./OperationElem";
import { Bladeburner } from "../Bladeburner";

interface IProps {
  bladeburner: Bladeburner;
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
