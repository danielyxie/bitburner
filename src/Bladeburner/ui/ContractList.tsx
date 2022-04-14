import React from "react";

import type { IPlayer } from "../../PersonObjects/IPlayer";
import type { IBladeburner } from "../IBladeburner";

import { ContractElem } from "./ContractElem";

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
}

export function ContractList(props: IProps): React.ReactElement {
  const names = Object.keys(props.bladeburner.contracts);
  const contracts = props.bladeburner.contracts;
  return (
    <>
      {names.map((name: string) => (
        <ContractElem key={name} bladeburner={props.bladeburner} action={contracts[name]} player={props.player} />
      ))}
    </>
  );
}
