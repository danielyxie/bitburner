// Root React Component for the Corporation UI
import React from "react";

import { HeaderTabs } from "./HeaderTabs";
import { MainPanel } from "./MainPanel";

interface IProps {
    corp: any;
    eventHandler: any;
    routing: any;
}

export function CorporationRoot(props: IProps): React.ReactElement {
    return (
        <div>
            <HeaderTabs corp={props.corp} eventHandler={props.eventHandler} routing={props.routing} />
            <MainPanel corp={props.corp} eventHandler={props.eventHandler} routing={props.routing} />
        </div>
    )
}
