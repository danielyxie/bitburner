import React from "react";
import { GeneralActionElem } from "./GeneralActionElem";
import { Action } from "../Action";
import { GeneralActions } from "../GeneralActions";
import { Bladeburner } from "../Bladeburner";

interface IProps {
  bladeburner: Bladeburner;
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
        <GeneralActionElem key={action.name} bladeburner={props.bladeburner} action={action} />
      ))}
    </>
  );
}
