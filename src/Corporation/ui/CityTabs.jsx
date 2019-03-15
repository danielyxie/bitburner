// React Components for the Corporation UI's City navigation tabs
// These allow player to navigate between different cities for each industry
import React from "react";
import { BaseReactComponent } from "./BaseReactComponent";

export class CityTabs extends BaseReactComponent {
    constructor(props) {
        // An object with [key = city name] and [value = click handler]
        // needs to be passed into the constructor as the "onClicks" property.
        // We'll make sure that that happens here
        if (props.onClicks == null) {
            throw new Error(`CityTabs component constructed without onClick handlers`);
        }
        if (props.city == null) {
            throw new Error(`CityTabs component constructed without 'city' property`)
        }
        if (props.cityStateSetter == null) {
            throw new Error(`CityTabs component constructed without 'cityStateSetter' property`)
        }

        super(props);
    }

    renderTab(props) {
        let className = "cmpy-mgmt-city-tab";
        if (props.current) {
            className += " current";
        }

        return (
            <button className={className} onClick={props.onClick} key={props.key}>
                {props.key}
            </button>
        )
    }

    render() {
        const division = this.routing().currentDivision;

        const tabs = [];

        // Tabs for each city
        for (const cityName in this.props.onClicks) {
            tabs.push(this.renderTab({
                current: this.props.city === cityName,
                key: cityName,
                onClick: this.props.onClicks[cityName],
            }));
        }

        // Tab to "Expand into new City"
        const newCityOnClick = this.eventHandler().createNewCityPopup.bind(this.eventHandler(), division, this.props.cityStateSetter);

        tabs.push(this.renderTab({
            current: false,
            key: "Expand into new City",
            onClick: newCityOnClick,
        }));

        return tabs;
    }
}
