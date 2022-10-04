import React from "react";
import { ContractElem } from "./ContractElem";
import { Bladeburner } from "../Bladeburner";

interface IProps {
  bladeburner: Bladeburner;
}

export function ContractList(props: IProps): React.ReactElement {
  const names = Object.keys(props.bladeburner.contracts);
  const contracts = props.bladeburner.contracts;
  return (
    <>
      {names.map((name: string) => (
        <ContractElem key={name} bladeburner={props.bladeburner} action={contracts[name]} />
      ))}
    </>
  );
}
