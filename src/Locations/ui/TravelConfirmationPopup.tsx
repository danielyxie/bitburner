import React from "react";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { CONSTANTS } from "../../Constants";
import { Money } from "../../ui/React/Money";
import { removePopup } from "../../ui/React/createPopup";

interface IProps {
  player: IPlayer;
  city: string;
  travel: () => void;
  popupId: string;
}

export function TravelConfirmationPopup(props: IProps): React.ReactElement {
  const cost = CONSTANTS.TravelCost;
  function travel(): void {
    props.travel();
    removePopup(props.popupId);
  }

  return (
    <>
      <span>
        Would you like to travel to {props.city}? The trip will cost <Money money={cost} player={props.player} />.
      </span>
      <br />
      <br />
      <button className="std-button" onClick={travel}>
        Travel
      </button>
    </>
  );
}
