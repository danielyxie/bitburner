import React from "react";
import Button from "@mui/material/Button";

import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { GetServer } from "../../Server/AllServers";
import { SpecialServers } from "../../Server/data/SpecialServers";


import { CONSTANTS } from "../../Constants";
import { Player } from "../../Player";

import { Money } from "../../ui/React/Money";

/**
 * Attempt to purchase a TOR router using the button.
 */
 export function purchaseTorRouter(): void {
  if (Player.hasTorRouter()) {
    dialogBoxCreate(`You already have a TOR Router!`);
    return;
  }
  if (!Player.canAfford(CONSTANTS.TorRouterCost)) {
    dialogBoxCreate("You cannot afford to purchase the TOR router!");
    return;
  }
  Player.loseMoney(CONSTANTS.TorRouterCost, "other");

  const darkweb = GetServer(SpecialServers.DarkWeb);
  if (!darkweb) {
    throw new Error("Dark web is not a server.");
  }

  Player.getHomeComputer().serversOnNetwork.push(darkweb.hostname);
  darkweb.serversOnNetwork.push(Player.getHomeComputer().hostname);
  dialogBoxCreate(
    "You have purchased a TOR router!\n" +
      "You now have access to the dark web from your home computer.\n" +
      "Use the scan/scan-analyze commands to search for the dark web connection.",
  );
}

type IProps = {
  rerender: () => void;
};

export function TorButton(props: IProps): React.ReactElement {
  function buy(): void {
    purchaseTorRouter();
    props.rerender();
  }

  if (Player.hasTorRouter()) {
    return <Button>TOR Router - Purchased</Button>;
  }

  return (
    <Button disabled={!Player.canAfford(CONSTANTS.TorRouterCost)} onClick={buy}>
      Purchase TOR router -&nbsp;
      <Money money={CONSTANTS.TorRouterCost} forPurchase={true} />
    </Button>
  );
}
