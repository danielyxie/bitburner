// Root React Component for the Corporation UI
import React from "react";

import { HeaderTabs } from "./HeaderTabs";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { ICorporation } from "../ICorporation";

interface IProps {
  corp: ICorporation;
  player: IPlayer;
}

export function CorporationRoot(props: IProps): React.ReactElement {
  return (
    <div>
      <HeaderTabs corp={props.corp} player={props.player} />
    </div>
  );
}
