// React Components for the Corporation UI's navigation tabs
// These are the tabs at the top of the UI that let you switch to different
// divisions, see an overview of your corporation, or create a new industry
import React from "react";
import { HeaderTab } from "./HeaderTab";
import { IDivision } from "../IDivision";

interface IProps {
    corp: any;
    eventHandler: any;
    routing: any;
}

export function HeaderTabs(props: IProps): React.ReactElement {
    console.log(props);
    function overviewOnClick() {
        props.routing.routeToOverviewPage();
        props.corp.rerender();
    }

    return (
        <div>
            <HeaderTab
                current={props.routing.isOnOverviewPage()}
                key={"overview"}
                onClick={overviewOnClick}
                text={props.corp.name}
            />
            {
                props.corp.divisions.map((division: IDivision) => 
                    <HeaderTab
                        current={props.routing.isOn(division.name)}
                        key={division.name}
                        onClick={() => {
                            props.routing.routeTo(division.name);
                            props.corp.rerender();
                        }}
                        text={division.name}
                    />)
            }
            <HeaderTab
                current={false}
                onClick={props.eventHandler.createNewIndustryPopup}
                text={"Expand into new Industry"}
            />
        </div>
    )

}
