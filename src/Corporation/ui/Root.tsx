// Root React Component for the Corporation UI
import React from "react";

import { HeaderTabs } from "./HeaderTabs";
import { MainPanel } from "./MainPanel";
import { IPlayer } from "../../PersonObjects/IPlayer";

interface IProps {
    corp: any;
    routing: any;
    player: IPlayer;
}

export function CorporationRoot(props: IProps): React.ReactElement {
    return (
        <div>
            <HeaderTabs corp={props.corp} routing={props.routing} />
            <MainPanel corp={props.corp} routing={props.routing} player={props.player} />
        </div>
    )
}
