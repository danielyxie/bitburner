// React Components for the Corporation UI's City navigation tabs
// These allow player to navigate between different cities for each industry
import React from "react";
import { CityTab } from "./CityTab";
import { ExpandNewCityPopup } from "./ExpandNewCityPopup";
import { createPopup } from "../../ui/React/createPopup";
import { ICorporation } from "../ICorporation";
import { CorporationRouting } from "./Routing";

interface IProps {
    routing: CorporationRouting;
    onClicks: {[key: string]: () => void};
    city: string; // currentCity
    cityStateSetter: (city: string) => void;
    corp: ICorporation;
}

export function CityTabs(props: IProps): React.ReactElement {
    const division = props.routing.currentDivision;

    function openExpandNewCityModal(): void {
        if(division === null) return;
        const popupId = "cmpy-mgmt-expand-city-popup";
        createPopup(popupId, ExpandNewCityPopup, {
            popupId: popupId,
            corp: props.corp,
            division: division,
            cityStateSetter: props.cityStateSetter,
        });
    }

    return <>
        {
            Object.keys(props.onClicks).map((cityName: string) => <CityTab current={props.city === cityName} key={cityName} name={cityName} onClick={props.onClicks[cityName]} />,
            )
        }
        <CityTab
            current={false}
            key={"Expand into new City"}
            name={"Expand into new City"}
            onClick={openExpandNewCityModal}
        />
    </>;
}