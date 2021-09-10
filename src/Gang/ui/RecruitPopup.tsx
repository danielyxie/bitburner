/**
 * React Component for the popup used to recruit new gang members.
 */
import React, { useState } from "react";
import { Gang } from "../Gang";
import { removePopup } from "../../ui/React/createPopup";
import { dialogBoxCreate } from "../../../utils/DialogBox";

interface IRecruitPopupProps {
  gang: Gang;
  popupId: string;
  onRecruit: () => void;
}

export function RecruitPopup(props: IRecruitPopupProps): React.ReactElement {
  const [name, setName] = useState("");

  function recruit(): void {
    if (name === "") {
      dialogBoxCreate("You must enter a name for your Gang member!");
      return;
    }
    if (!props.gang.canRecruitMember()) {
      dialogBoxCreate("You cannot recruit another Gang member!");
      return;
    }

    // At this point, the only way this can fail is if you already
    // have a gang member with the same name
    if (!props.gang.recruitMember(name)) {
      dialogBoxCreate("You already have a gang member with this name!");
      return;
    }

    props.onRecruit();
    removePopup(props.popupId);
  }

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) recruit();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setName(event.target.value);
  }

  return (
    <>
      <p className="noselect">Enter a name for your new Gang member:</p>
      <br />
      <input
        autoFocus
        onKeyUp={onKeyUp}
        onChange={onChange}
        className="text-input noselect"
        type="text"
        placeholder="unique name"
      />
      <a className="std-button" onClick={recruit}>
        Recruit Gang Member
      </a>
    </>
  );
}
