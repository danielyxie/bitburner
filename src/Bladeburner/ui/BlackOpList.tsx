import React from "react";
import { BlackOperations } from "../BlackOperations";
import { BlackOperation } from "../BlackOperation";
import { BlackOpElem } from "./BlackOpElem";
import { IBladeburner } from "../IBladeburner";
import { IPlayer } from "../../PersonObjects/IPlayer";

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
}

export function BlackOpList(props: IProps): React.ReactElement {
  let blackops: BlackOperation[] = [];
  for (const blackopName in BlackOperations) {
    if (BlackOperations.hasOwnProperty(blackopName)) {
      blackops.push(BlackOperations[blackopName]);
    }
  }
  blackops.sort(function (a, b) {
    return a.reqdRank - b.reqdRank;
  });

  blackops = blackops.filter(
    (blackop: BlackOperation, i: number) => !(
        props.bladeburner.blackops[blackops[i].name] == null &&
        i !== 0 &&
        props.bladeburner.blackops[blackops[i - 1].name] == null
      ),
  );

  blackops = blackops.reverse();

  return (
    <>
      {blackops.map((blackop: BlackOperation) => (
        <li key={blackop.name} className="bladeburner-action">
          <BlackOpElem bladeburner={props.bladeburner} action={blackop} player={props.player} />
        </li>
      ))}
    </>
  );
}
