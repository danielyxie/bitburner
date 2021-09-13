import React from "react";
import { Company } from "../Company";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { removePopup } from "../../ui/React/createPopup";

interface IProps {
  locName: string;
  company: Company;
  player: IPlayer;
  onQuit: () => void;
  popupId: string;
}

export function QuitJobPopup(props: IProps): React.ReactElement {
  function quit(): void {
    props.player.quitJob(props.locName);
    props.onQuit();
    removePopup(props.popupId);
  }

  return (
    <>
      Would you like to quit your job at {props.company.name}?
      <br />
      <br />
      <button autoFocus={true} className="std-button" onClick={quit}>
        Quit
      </button>
    </>
  );
}
