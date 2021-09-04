// React Component for the element that contains the actual info/data
// for the Corporation UI. This panel lies below the header tabs and will
// be filled with whatever is needed based on the routing/navigation
import React, { useState } from "react";

import { CityTabs } from "./CityTabs";
import { Industry } from "./Industry";
import { Overview } from "./Overview";

import { OfficeSpace } from "../OfficeSpace";

import { CityName } from "../../Locations/data/CityNames";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { ICorporation } from "../ICorporation";
import { CorporationRouting } from "./Routing";

interface IProps {
    corp: ICorporation;
    routing: CorporationRouting;
    player: IPlayer;
}

export function MainPanel(props: IProps): React.ReactElement {
    const [division, setDivision] = useState("");
    const [city, setCity] = useState<string>(CityName.Sector12);

    // We can pass this setter to child components
    function changeCityState(newCity: string): void {
        if (Object.values(CityName).includes(newCity as CityName)) {
            setCity(newCity);
        } else {
            console.error(`Tried to change MainPanel's city state to an invalid city: ${newCity}`);
        }
    }

    function renderOverviewPage(): React.ReactElement {
        return (
            <div id="cmpy-mgmt-panel">
                <Overview {...props} />
            </div>
        )
    }

    function renderDivisionPage(): React.ReactElement {
        // Note: Division is the same thing as Industry...I wasn't consistent with naming
        const division = props.routing.currentDivision;
        if (division == null) {
            throw new Error(`Routing does not hold reference to the current Industry`);
        }

        // City tabs
        const onClicks: { [key: string]: () => void } = {};
        for (const cityName in division.offices) {
            if (division.offices[cityName] instanceof OfficeSpace) {
                onClicks[cityName] = () => {
                    setCity(cityName);
                    props.corp.rerender(props.player);
                }
            }
        }

        const cityTabs = (
            <CityTabs
                {...props}
                corp={props.corp}
                city={city}
                onClicks={onClicks}
                cityStateSetter={changeCityState}
            />
        )

        return (
            <div id="cmpy-mgmt-panel">
                {cityTabs}
                <Industry {...props} currentCity={city} />
            </div>
        )
    }

    if (props.routing.isOnOverviewPage()) {
        // Corporation overview Content
        return renderOverviewPage();
    } else {
        // Division content

        // First, check if we're at a new division. If so, we need to reset the city to Sector-12
        // Otherwise, just switch the 'city' state
        const currentDivision = props.routing.current();
        if (currentDivision !== division) {
            setDivision(currentDivision);
            setCity(CityName.Sector12);
        }

        return renderDivisionPage();
    }
}
