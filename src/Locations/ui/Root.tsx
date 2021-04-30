/**
 * Root React Component for displaying overall Location UI
 */
import * as React from "react";

import { LocationCity }     from "./City";
import { GenericLocation }  from "./GenericLocation";

import { Cities }           from "../Cities";
import { Locations }        from "../Locations";
import { LocationType }     from "../LocationTypeEnum";

import { CityName }         from "../data/CityNames";
import { LocationName }     from "../data/LocationNames";

import { CONSTANTS }        from "../../Constants";
import { IEngine }          from "../../IEngine";
import { IPlayer }          from "../../PersonObjects/IPlayer";

import { dialogBoxCreate }  from "../../../utils/DialogBox";

type IProps = {
    initiallyInCity?: boolean;
    engine: IEngine;
    p: IPlayer;
}

type IState = {
    city: CityName;
    inCity: boolean;
    location: LocationName;
}

export class LocationRoot extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            city: props.p.city,
            inCity: props.initiallyInCity == null ? true : props.initiallyInCity,
            location: props.p.location,
        }

        this.enterLocation = this.enterLocation.bind(this);
        this.returnToCity = this.returnToCity.bind(this);
        this.travel = this.travel.bind(this);
    }

    enterLocation(to: LocationName): void {
        this.props.p.gotoLocation(to);
        this.setState({
            inCity: false,
            location: to,
        });
    }

    /**
     * Click listener for a button that lets the player go from a specific location
     * back to the city
     */
    returnToCity(): void {
        this.setState({
            inCity: true,
        });
    }

    /**
     * Render UI for a city
     */
    renderCity(): React.ReactNode {
        const city = Cities[this.state.city];
        if (city == null) {
            throw new Error(`Invalid city when rendering UI: ${this.state.city}`);
        }

        return (
            <div>
                <h2>{this.state.city}</h2>
                <LocationCity city={city} enterLocation={this.enterLocation} />
            </div>
        )
    }

    /**
     * Render UI for a specific location
     */
    renderLocation(): React.ReactNode {
        const loc = Locations[this.state.location];

        if (loc == null) {
            throw new Error(`Invalid location when rendering UI: ${this.state.location}`);
        }

        if (loc.types.includes(LocationType.StockMarket)) {
            this.props.engine.loadStockMarketContent();
        }

        return (
            <GenericLocation
                engine={this.props.engine}
                loc={loc}
                p={this.props.p}
                returnToCity={this.returnToCity}
                travel={this.travel}
            />
        )
    }

    /**
     * Travel to a different city
     * @param {CityName} to - Destination city
     */
    travel(to: CityName): void {
        const p = this.props.p;
        const cost = CONSTANTS.TravelCost;
        if (!p.canAfford(cost)) {
            dialogBoxCreate(`You cannot afford to travel to ${to}`);
            return;
        }

        p.loseMoney(cost);
        p.travel(to);
        dialogBoxCreate(`You are now in ${to}!`);

        // Dynamically update main menu
        if (p.firstTimeTraveled === false) {
            p.firstTimeTraveled = true;
            const travelTab = document.getElementById("travel-tab");
            const worldHeader = document.getElementById("world-menu-header");
            if (travelTab != null && worldHeader !== null) {
                travelTab.style.display = "list-item";
                worldHeader.click(); worldHeader.click();
            }
        }

        if (this.props.p.travel(to)) {
            this.setState({
                inCity: true,
                city: to,
            });
        }
    }

    render() {
        if (this.state.inCity) {
            return this.renderCity();
        } else {
            return this.renderLocation();
        }
    }
}
