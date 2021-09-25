import React from "react";
import Button from "@mui/material/Button";

import { purchaseTorRouter } from "../LocationsHelpers";

import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";

import { Money } from "../../ui/React/Money";

type IProps = {
  p: IPlayer;
  rerender: () => void;
};

export function TorButton(props: IProps): React.ReactElement {
  function buy(): void {
    purchaseTorRouter(props.p);
    props.rerender();
  }

  if (props.p.hasTorRouter()) {
    return <Button>TOR Router - Purchased</Button>;
  }

  return (
    <Button disabled={!props.p.canAfford(CONSTANTS.TorRouterCost)} onClick={buy}>
      Purchase TOR router - <Money money={CONSTANTS.TorRouterCost} player={props.p} />
    </Button>
  );
}
