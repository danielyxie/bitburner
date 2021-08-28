// React Components for the Corporation UI's City navigation tabs
// These allow player to navigate between different cities for each industry
import React from "react";
import { CityTab } from "./CityTab";

interface IProps {
    eventHandler: any;
    routing: any;
    onClicks: {[key: string]: () => void};
    city: string; // currentCity
    cityStateSetter: any;
}

export function CityTabs(props: IProps): React.ReactElement {
    const division = props.routing.currentDivision;

    const tabs = [];

    // Tabs for each city
    for (const cityName in props.onClicks) {
        tabs.push(
            <CityTab current={props.city === cityName} key={cityName} name={cityName} onClick={props.onClicks[cityName]} />
        );
    }

    tabs.push(
        <CityTab
        current={false}
        key={"Expand into new City"}
        name={"Expand into new City"}
        onClick={() => props.eventHandler.createNewCityPopup(division, props.cityStateSetter)}
        />
    );

    return <>{tabs}</>;
}