import React from "react";

import type { IPlayer } from "../../PersonObjects/IPlayer";
import type { BlackOperation } from "../BlackOperation";
import { BlackOperations } from "../BlackOperations";
import type { IBladeburner } from "../IBladeburner";

import { BlackOpElem } from "./BlackOpElem";

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
}

export function BlackOpList(props: IProps): React.ReactElement {
  let blackops: BlackOperation[] = [];
  for (const blackopName of Object.keys(BlackOperations)) {
    if (BlackOperations.hasOwnProperty(blackopName)) {
      blackops.push(BlackOperations[blackopName]);
    }
  }
  blackops.sort(function (a, b) {
    return a.reqdRank - b.reqdRank;
  });

  blackops = blackops.filter(
    (blackop: BlackOperation, i: number) =>
      !(
        props.bladeburner.blackops[blackops[i].name] == null &&
        i !== 0 &&
        props.bladeburner.blackops[blackops[i - 1].name] == null
      ),
  );

  blackops = blackops.reverse();

  return (
    <>
      {blackops.map((blackop: BlackOperation) => (
        <BlackOpElem key={blackop.name} bladeburner={props.bladeburner} action={blackop} player={props.player} />
      ))}
    </>
  );
}
