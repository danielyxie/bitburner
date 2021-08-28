// React Component for managing the Corporation's Industry UI
// This Industry component does NOT include the city tabs at the top
import React from "react";

import { IndustryOffice } from "./IndustryOffice";
import { IndustryOverview } from "./IndustryOverview";
import { IndustryWarehouse } from "./IndustryWarehouse";

interface IProps {
    routing: any;
    eventHandler: any;
    corp: any;
    currentCity: string;
}

export function Industry(props: IProps): React.ReactElement {
    return (
        <div>
            <div className={"cmpy-mgmt-industry-left-panel"}>
                <IndustryOverview
                    routing={props.routing}
                    eventHandler={props.eventHandler}
                    corp={props.corp}
                    currentCity={props.currentCity} />
                <IndustryOffice 
                    routing={props.routing}
                    eventHandler={props.eventHandler}
                    corp={props.corp}
                    currentCity={props.currentCity} />
            </div>
            <div className={"cmpy-mgmt-industry-right-panel"}>
                <IndustryWarehouse
                    corp={props.corp}
                    routing={props.routing}
                    currentCity={props.currentCity}
                    eventHandler={props.eventHandler} />
            </div>
        </div>
    )
}
