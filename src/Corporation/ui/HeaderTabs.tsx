// React Components for the Corporation UI's navigation tabs
// These are the tabs at the top of the UI that let you switch to different
// divisions, see an overview of your corporation, or create a new industry
import React from "react";
import { HeaderTab } from "./HeaderTab";
import { IDivision } from "../IDivision";
import { NewIndustryPopup } from "./NewIndustryPopup";
import { createPopup } from "../../ui/React/createPopup";

interface IProps {
    corp: any;
    routing: any;
}

export function HeaderTabs(props: IProps): React.ReactElement {
    function overviewOnClick(): void {
        props.routing.routeToOverviewPage();
        props.corp.rerender();
    }

    function openNewIndustryPopup(): void {
        const popupId = "cmpy-mgmt-expand-industry-popup";
        createPopup(popupId, NewIndustryPopup, {
            corp: props.corp,
            routing: props.routing,
            popupId: popupId,
        });
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
                props.corp.divisions.map((division: IDivision) => <HeaderTab
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
                onClick={openNewIndustryPopup}
                text={"Expand into new Industry"}
            />
        </div>
    )

}
