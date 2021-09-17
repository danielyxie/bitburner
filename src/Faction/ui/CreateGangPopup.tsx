/**
 * React Component for the popup used to create a new gang.
 */
import React from "react";
import { removePopup } from "../../ui/React/createPopup";
import { StdButton } from "../../ui/React/StdButton";
import { use } from "../../ui/Context";

interface ICreateGangPopupProps {
  popupId: string;
  facName: string;
}

export function CreateGangPopup(props: ICreateGangPopupProps): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const combatGangText =
    "This is a COMBAT gang. Members in this gang will have different tasks than HACKING gangs. " +
    "Compared to hacking gangs, progression with combat gangs can be more difficult as territory management " +
    "is more important. However, well-managed combat gangs can progress faster than hacking ones.";

  const hackingGangText =
    "This is a HACKING gang. Members in this gang will have different tasks than COMBAT gangs. " +
    "Compared to combat gangs, progression with hacking gangs is more straightforward as territory warfare " +
    "is not as important.";

  function isHacking(): boolean {
    return ["NiteSec", "The Black Hand"].includes(props.facName);
  }

  function createGang(): void {
    player.startGang(props.facName, isHacking());
    removePopup(props.popupId);
    router.toGang();
  }

  function onKeyUp(event: React.KeyboardEvent): void {
    if (event.keyCode === 13) createGang();
  }

  return (
    <>
      Would you like to create a new Gang with {props.facName}?
      <br />
      <br />
      Note that this will prevent you from creating a Gang with any other Faction until this BitNode is destroyed. It
      also resets your reputation with this faction.
      <br />
      <br />
      {isHacking() ? hackingGangText : combatGangText}
      <br />
      <br />
      Other than hacking vs combat, there are NO differences between the Factions you can create a Gang with, and each
      of these Factions have all Augmentations available.
      <div className="popup-box-input-div">
        <StdButton
          onClick={createGang}
          onKeyUp={onKeyUp}
          text="Create Gang"
          style={{ float: "right" }}
          autoFocus={true}
        />
      </div>
    </>
  );
}
