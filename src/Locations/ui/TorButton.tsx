import Button from "@mui/material/Button";
import React from "react";

import { CONSTANTS } from "../../Constants";
import type { IPlayer } from "../../PersonObjects/IPlayer";
import { Money } from "../../ui/React/Money";
import { purchaseTorRouter } from "../LocationsHelpers";

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
      Purchase TOR router -&nbsp;
      <Money money={CONSTANTS.TorRouterCost} player={props.p} />
    </Button>
  );
}
