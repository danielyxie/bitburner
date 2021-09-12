import React from "react";
import { hackWorldDaemon } from "../../RedPill";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { removePopup } from "../../ui/React/createPopup";

interface IProps {
  player: IPlayer;
  popupId: string;
}

export function BitFlumePopup(props: IProps): React.ReactElement {
  function flume(): void {
    hackWorldDaemon(props.player.bitNodeN, true, false);
    removePopup(props.popupId);
  }
  return (
    <>
      WARNING: USING THIS PROGRAM WILL CAUSE YOU TO LOSE ALL OF YOUR PROGRESS ON THE CURRENT BITNODE.
      <br />
      <br />
      Do you want to travel to the BitNode Nexus? This allows you to reset the current BitNode and select a new one.
      <br />
      <br />
      <button className="std-button" onClick={flume}>
        Travel to the BitVerse
      </button>
    </>
  );
}
