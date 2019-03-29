/**
 * Root React Component for displaying overall Location UI
 */
import * as React from "react";

import { LocationCity }     from "./City";

import { CityName }         from "../data/CityNames";
import { LocationName }     from "../data/LocationNames";

import { IPlayer }          from "../../PersonObjects/IPlayer";

type IProps = {
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
            inCity: true,
            location: props.p.location,
        }

        this.changeCity = this.changeCity.bind(this);
        this.returnToCity = this.returnToCity.bind(this);
    }

    changeCity(to: CityName): void {
        if (this.props.p.travel(to)) {
            this.setState({
                city: to
            });
        }
    }

    enterLocation(to: LocationName): void {
        this.props.p.location = to;
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
        return (
            <div>
                <h2>{this.state.city}</h2>
                <LocationCity city={this.state.city} enterLocation={this.enterLocation} />
            </div>
        )
    }

    /**
     * Render UI for a specific location
     */
    renderLocation(): React.ReactNode {
        return (
            <GenericLocation />
        )
    }

    render() {
        if (this.state.inCity) {
            return this.renderCity();
        } else {
            return this.renderLocation();
        }
    }
}
