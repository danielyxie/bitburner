/**
 * React Component for displaying a location's UI
 *
 * This is a "router" component of sorts, meaning it deduces the type of
 * location that is being rendered and then creates the proper component(s) for that.
 */
import * as React from "react";

import { CompanyLocation }          from "./CompanyLocation";
import { GymLocation }              from "./GymLocation";
import { HospitalLocation }         from "./HospitalLocation";
import { SlumsLocation }            from "./SlumsLocation";
import { SpecialLocation }          from "./SpecialLocation";
import { TechVendorLocation }       from "./TechVendorLocation";
import { TravelAgencyLocation }     from "./TravelAgencyLocation";
import { UniversityLocation }       from "./UniversityLocation";

import { Location }                 from "../Location";
import { LocationType }             from "../LocationTypeEnum";
import { CityName }                 from "../data/CityNames";

import { IEngine }                  from "../../IEngine";
import { IPlayer }                  from "../../PersonObjects/IPlayer";

import { StdButton }                from "../../ui/React/StdButton";

type IProps = {
    engine: IEngine;
    loc: Location;
    p: IPlayer;
    returnToCity: () => void;
    travel: (to: CityName) => void;
}

export class GenericLocation extends React.Component<IProps, any> {
    /**
     * Determine what needs to be rendered for this location based on the locations
     * type. Returns an array of React components that should be rendered
     */
    getLocationSpecificContent(): React.ReactNode[] {
        const content: React.ReactNode[] = [];

        if (this.props.loc.types.includes(LocationType.Company)) {
            content.push(
                <CompanyLocation
                    engine={this.props.engine}
                    locName={this.props.loc.name}
                    p={this.props.p}
                />
            )
        }

        if (this.props.loc.types.includes(LocationType.Gym)) {
            content.push(
                <GymLocation
                    loc={this.props.loc}
                    p={this.props.p}
                />
            )
        }

        if (this.props.loc.types.includes(LocationType.Hospital)) {
            content.push(
                <HospitalLocation
                    p={this.props.p}
                />
            )
        }

        if (this.props.loc.types.includes(LocationType.Slums)) {
            content.push(
                <SlumsLocation
                    p={this.props.p}
                />
            )
        }

        if (this.props.loc.types.includes(LocationType.Special)) {
            content.push(
                <SpecialLocation
                    engine={this.props.engine}
                    loc={this.props.loc}
                    p={this.props.p}
                />
            )
        }

        if (this.props.loc.types.includes(LocationType.TechVendor)) {
            content.push(
                <TechVendorLocation
                    loc={this.props.loc}
                    p={this.props.p}
                />
            )
        }

        if (this.props.loc.types.includes(LocationType.TravelAgency)) {
            content.push(
                <TravelAgencyLocation
                    p={this.props.p}
                    travel={this.props.travel}
                />
            )
        }

        if (this.props.loc.types.includes(LocationType.University)) {
            content.push(
                <UniversityLocation
                    loc={this.props.loc}
                    p={this.props.p}
                />
            )
        }

        return content;
    }

    render() {
        const locContent: React.ReactNode[] = this.getLocationSpecificContent();

        return (
            <div>
                <StdButton onClick={this.props.returnToCity} text={"Return to world"} />
                <br />
                <h1>{this.props.loc.name}</h1>
                {locContent}
            </div>
        )
    }
}
