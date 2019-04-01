// React Component for the element that contains the actual info/data
// for the Corporation UI. This panel lies below the header tabs and will
// be filled with whatever is needed based on the routing/navigation
import React from "react";
import { BaseReactComponent } from "./BaseReactComponent";

import { CityTabs } from "./CityTabs";
import { Industry } from "./Industry";
import { Overview } from "./Overview";
import { overviewPage } from "./Routing";

import { OfficeSpace } from "../Corporation";

import { CityName } from "../../Locations/data/CityNames";

export class MainPanel extends BaseReactComponent {
    constructor(props) {
        super(props);

        this.state = {
            division: "",
            city: CityName.Sector12,
        }
    }

    // We can pass this setter to child components
    changeCityState(newCity) {
        if (Object.values(Cities).includes(newCity)) {
            this.state.city = newCity;
        } else {
            console.error(`Tried to change MainPanel's city state to an invalid city: ${newCity}`);
        }
    }

    // Determines what UI content to render based on routing
    renderContent() {
        if (this.routing().isOnOverviewPage()) {
            // Corporation overview Content
            return this.renderOverviewPage();
        } else {
            // Division content

            // First, check if we're at a new division. If so, we need to reset the city to Sector-12
            // Otherwise, just switch the 'city' state
            const currentDivision = this.routing().current();
            if (currentDivision !== this.state.division) {
                this.state.division = currentDivision;
                this.state.city = Cities.Sector12;
            }

            return this.renderDivisionPage();
        }
    }

    renderOverviewPage() {
        return (
            <div id="cmpy-mgmt-panel">
                <Overview {...this.props} />
            </div>
        )
    }

    renderDivisionPage() {
        // Note: Division is the same thing as Industry...I wasn't consistent with naming
        const division = this.routing().currentDivision;
        if (division == null) {
            throw new Error(`Routing does not hold reference to the current Industry`);
        }

        // City tabs
        const onClicks = {};
        for (const cityName in division.offices) {
            if (division.offices[cityName] instanceof OfficeSpace) {
                onClicks[cityName] = () => {
                    this.state.city = cityName;
                    this.corp().rerender();
                }
            }
        }

        const cityTabs = (
            <CityTabs
                {...this.props}
                city={this.state.city}
                onClicks={onClicks}
                cityStateSetter={this.changeCityState.bind(this)}
            />
        )

        // Rest of Industry UI
        const industry = (
            <Industry {...this.props} currentCity={this.state.city} />
        )

        return (
            <div id="cmpy-mgmt-panel">
                {cityTabs}
                {industry}
            </div>
        )
    }

    render() {
        return this.renderContent();
    }
}
