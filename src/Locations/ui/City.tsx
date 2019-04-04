/**
 * React Component for displaying a City's UI.
 * This UI shows all of the available locations in the city, and lets the player
 * visit those locations
 */
import * as React from "react";

import { City } from "../City";
import { LocationName } from "../data/LocationNames";

import { StdButton } from "../../ui/React/StdButton";

type IProps = {
    city: City;
    enterLocation: (to: LocationName) => void;
}

export class LocationCity extends React.Component<IProps, any> {
    render() {
        const locationButtons = this.props.city.locations.map((locName) => {
            return (
                <li key={locName}>
                    <StdButton onClick={this.props.enterLocation.bind(this, locName)} text={locName} />
                </li>
            )
        });

        return (
            <ul>
                {locationButtons}
            </ul>
        )
    }
}
