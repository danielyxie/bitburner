import React, { useState } from "react";
import { removePopup } from "../../ui/React/createPopup";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { Action } from "../Action";
import { IBladeburner } from "../IBladeburner";

interface IProps {
  bladeburner: IBladeburner;
  action: Action;
  popupId: string;
}

export function TeamSizePopup(props: IProps): React.ReactElement {
  const [teamSize, setTeamSize] = useState<number | undefined>();

  function confirmTeamSize(): void {
    if (teamSize === undefined) return;
    const num = Math.round(teamSize);
    if (isNaN(num) || num < 0) {
      dialogBoxCreate(
        "Invalid value entered for number of Team Members (must be numeric, positive)",
      );
    } else {
      props.action.teamCount = num;
    }
    removePopup(props.popupId);
  }

  return (
    <>
      <p>
        Enter the amount of team members you would like to take on this Op. If
        you do not have the specified number of team members, then as many as
        possible will be used. Note that team members may be lost during
        operations.
      </p>
      <input
        autoFocus
        type="number"
        placeholder="Team size"
        className="text-input"
        onChange={(event) => setTeamSize(parseFloat(event.target.value))}
      />
      <a className="a-link-button" onClick={confirmTeamSize}>
        Confirm
      </a>
    </>
  );
}
