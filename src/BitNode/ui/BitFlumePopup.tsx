import React from "react";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { IRouter } from "../../ui/Router";
import { removePopup } from "../../ui/React/createPopup";

interface IProps {
  player: IPlayer;
  router: IRouter;
  popupId: string;
}

export function BitFlumePopup(props: IProps): React.ReactElement {
  function flume(): void {
    props.router.toBitVerse(true, false);
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
