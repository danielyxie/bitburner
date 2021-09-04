// React Component for managing the Corporation's Industry UI
// This Industry component does NOT include the city tabs at the top
import React from "react";

import { IndustryOffice } from "./IndustryOffice";
import { IndustryOverview } from "./IndustryOverview";
import { IndustryWarehouse } from "./IndustryWarehouse";
import { ICorporation } from "../ICorporation";
import { CorporationRouting } from "./Routing";
import { IPlayer } from "../../PersonObjects/IPlayer";

interface IProps {
    routing: CorporationRouting;
    corp: ICorporation;
    currentCity: string;
    player: IPlayer;
}

export function Industry(props: IProps): React.ReactElement {
    return (
        <div>
            <div className={"cmpy-mgmt-industry-left-panel"}>
                <IndustryOverview
                    player={props.player}
                    routing={props.routing}
                    corp={props.corp}
                    currentCity={props.currentCity} />
                <IndustryOffice
                    player={props.player}
                    routing={props.routing}
                    corp={props.corp}
                    currentCity={props.currentCity} />
            </div>
            <div className={"cmpy-mgmt-industry-right-panel"}>
                <IndustryWarehouse
                    player={props.player}
                    corp={props.corp}
                    routing={props.routing}
                    currentCity={props.currentCity} />
            </div>
        </div>
    )
}
