/**
 * React Component for displaying a location's UI
 *
 * This is a "router" component of sorts, meaning it deduces the type of
 * location that is being rendered and then creates the proper component(s) for that.
 */
import * as React from "react";

import { Location }             from "../Location";
import { Locations }            from "../Locations";
import { LocationType }         from "../LocationTypeEnum";
import { LocationName }         from "../data/LocationNames";

import { IPlayer }              from "../../PersonObjects/IPlayer";

import { StdButton }            from "../../ui/React/StdButton";

type IProps = {
    locName: LocationName;
    p: IPlayer;
    returnToCity: () => void;
}

export class GenericLocation extends React.Component<IProps, any> {
    /**
     * Reference to the Location object that is being rendered
     */
    loc: Location;

    constructor(props: IProps) {
        super(props);

        this.loc = Locations[props.locName];
        if (this.loc == null) {
            throw new Error(`Invalid Location being rendered: ${props.locName}`);
        }
    }

    /**
     * Determine what needs to be rendered for this location based on the locations
     * type. Returns an array of React components that should be rendered
     */
    getLocationSpecificContent(): React.ReactNode[] {
        const content: React.ReactNode[] = [];

        if (this.loc.types.includes(LocationType.Company)) {
            
        }

        if (this.loc.types.includes(LocationType.Gym)) {

        }

        if (this.loc.types.includes(LocationType.Hospital)) {

        }

        if (this.loc.types.includes(LocationType.Slums)) {

        }

        if (this.loc.types.includes(LocationType.Special)) {

        }

        if (this.loc.types.includes(LocationType.StockMarket)) {

        }

        if (this.loc.types.includes(LocationType.TechVendor)) {

        }

        if (this.loc.types.includes(LocationType.TravelAgency)) {

        }

        if (this.loc.types.includes(LocationType.University)) {

        }
    }

    render() {
        const locContent: React.ReactNode[] = this.getLocationSpecificContent();

        return (
            <div>
                <StdButton onClick={this.props.returnToCity} text={"Return to world"} />
                <br />
                <h1>this.loc.name</h1>
                {locContent}
            </div>
        )
    }
}
