import React from "react";

import type { IPlayer } from "../../PersonObjects/IPlayer";
import type { Action } from "../Action";
import { GeneralActions } from "../GeneralActions";
import type { IBladeburner } from "../IBladeburner";

import { GeneralActionElem } from "./GeneralActionElem";

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
}

export function GeneralActionList(props: IProps): React.ReactElement {
  const actions: Action[] = [];
  for (const name of Object.keys(GeneralActions)) {
    if (GeneralActions.hasOwnProperty(name)) {
      actions.push(GeneralActions[name]);
    }
  }
  return (
    <>
      {actions.map((action: Action) => (
        <GeneralActionElem key={action.name} bladeburner={props.bladeburner} action={action} player={props.player} />
      ))}
    </>
  );
}
