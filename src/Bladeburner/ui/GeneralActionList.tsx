import React from "react";
import { GeneralActionElem } from "./GeneralActionElem";
import { Action } from "../Action";
import { GeneralActions } from "../GeneralActions";
import { IBladeburner } from "../IBladeburner";
import { IPlayer } from "../../PersonObjects/IPlayer";

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
}

export function GeneralActionList(props: IProps): React.ReactElement {
  const actions: Action[] = [];
  for (const name in GeneralActions) {
    if (GeneralActions.hasOwnProperty(name)) {
      actions.push(GeneralActions[name]);
    }
  }
  return (
    <>
      {actions.map((action: Action) => (
        <li key={action.name} className="bladeburner-action">
          <GeneralActionElem bladeburner={props.bladeburner} action={action} player={props.player} />
        </li>
      ))}
    </>
  );
}
