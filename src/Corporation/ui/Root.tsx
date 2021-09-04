// Root React Component for the Corporation UI
import React from "react";

import { HeaderTabs } from "./HeaderTabs";
import { MainPanel } from "./MainPanel";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { ICorporation } from "../ICorporation";
import { CorporationRouting } from "./Routing";

interface IProps {
  corp: ICorporation;
  routing: CorporationRouting;
  player: IPlayer;
}

export function CorporationRoot(props: IProps): React.ReactElement {
  return (
    <div>
      <HeaderTabs
        corp={props.corp}
        routing={props.routing}
        player={props.player}
      />
      <MainPanel
        corp={props.corp}
        routing={props.routing}
        player={props.player}
      />
    </div>
  );
}
