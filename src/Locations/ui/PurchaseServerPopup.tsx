/**
 * React Component for the popup used to purchase a new server.
 */
import React, { useState } from "react";
import { removePopup } from "../../ui/React/createPopup";
import { purchaseServer } from "../../Server/ServerPurchases";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Money } from "../../ui/React/Money";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { StdButton } from "../../ui/React/StdButton";

interface IPurchaseServerPopupProps {
  ram: number;
  cost: number;
  p: IPlayer;
  popupId: string;
  rerender: () => void;
}

export function PurchaseServerPopup(props: IPurchaseServerPopupProps): React.ReactElement {
  const [hostname, setHostname] = useState("");

  function tryToPurchaseServer(): void {
    purchaseServer(hostname, props.ram, props.cost, props.p);

    removePopup(props.popupId);
  }

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) tryToPurchaseServer();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setHostname(event.target.value);
  }

  return (
    <>
      Would you like to purchase a new server with {numeralWrapper.formatRAM(props.ram)} of RAM for{" "}
      <Money money={props.cost} player={props.p} />?
      <br />
      <br />
      Please enter the server hostname below:
      <br />
      <div className="popup-box-input-div">
        <input
          autoFocus
          onKeyUp={onKeyUp}
          onChange={onChange}
          className="text-input noselect"
          type="text"
          placeholder="Unique Hostname"
        />
        <StdButton onClick={tryToPurchaseServer} text="Purchase Server" disabled={!props.p.canAfford(props.cost)} />
      </div>
    </>
  );
}
