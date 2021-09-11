import React, { useState } from "react";

import { IPlayer } from "../../PersonObjects/IPlayer";
import { removePopup } from "../../ui/React/createPopup";
import { Money } from "../../ui/React/Money";
import { dialogBoxCreate } from "../../../utils/DialogBox";

interface IProps {
  player: IPlayer;
  popupId: string;
}

export function CreateCorporationPopup(props: IProps): React.ReactElement {
  if (!props.player.canAccessCorporation() || props.player.hasCorporation()) {
    removePopup(props.popupId);
    return <></>;
  }

  const [name, setName] = useState("");
  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setName(event.target.value);
  }

  function selfFund(): void {
    if (!props.player.canAfford(150e9)) {
      dialogBoxCreate("You don't have enough money to create a corporation! You need $150b.");
      return;
    }

    if (name == "") {
      dialogBoxCreate("Invalid company name!");
      return;
    }

    props.player.startCorporation(name);
    props.player.loseMoney(150e9);

    dialogBoxCreate(
      "Congratulations! You just self-funded your own corporation. You can visit " +
        "and manage your company in the City.",
    );
    removePopup(props.popupId);
  }

  function seed(): void {
    if (name == "") {
      dialogBoxCreate("Invalid company name!");
      return;
    }

    props.player.startCorporation(name, 500e6);

    dialogBoxCreate(
      "Congratulations! You just started your own corporation with government seed money. " +
        "You can visit and manage your company in the City.",
    );
    removePopup(props.popupId);
  }

  return (
    <>
      <p>
        Would you like to start a corporation? This will require $150b for registration and initial funding. This $150b
        can either be self-funded, or you can obtain the seed money from the government in exchange for 500 million
        shares
        <br />
        <br />
        If you would like to start one, please enter a name for your corporation below:
      </p>
      <input autoFocus={true} className="text-input" placeholder="Corporation Name" onChange={onChange} value={name} />
      <button className="std-button" onClick={seed} disabled={name == ""}>
        Use seed money
      </button>
      <button className="std-button" onClick={selfFund} disabled={name == "" || !props.player.canAfford(150e9)}>
        Self-Fund (<Money money={150e9} player={props.player} />)
      </button>
    </>
  );
}
