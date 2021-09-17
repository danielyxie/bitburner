/**
 * React Component for displaying a location's UI
 *
 * This is a "router" component of sorts, meaning it deduces the type of
 * location that is being rendered and then creates the proper component(s) for that.
 */
import * as React from "react";

import { CompanyLocation } from "./CompanyLocation";
import { GymLocation } from "./GymLocation";
import { HospitalLocation } from "./HospitalLocation";
import { SlumsLocation } from "./SlumsLocation";
import { SpecialLocation } from "./SpecialLocation";
import { TechVendorLocation } from "./TechVendorLocation";
import { TravelAgencyRoot } from "./TravelAgencyRoot";
import { UniversityLocation } from "./UniversityLocation";
import { CasinoLocation } from "./CasinoLocation";

import { Location } from "../Location";
import { LocationType } from "../LocationTypeEnum";
import { CityName } from "../data/CityNames";

import { IEngine } from "../../IEngine";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Settings } from "../../Settings/Settings";

import { SpecialServerIps } from "../../Server/SpecialServerIps";
import { getServer, isBackdoorInstalled } from "../../Server/ServerHelpers";

import { StdButton } from "../../ui/React/StdButton";
import { CorruptableText } from "../../ui/React/CorruptableText";

type IProps = {
  engine: IEngine;
  router: IRouter;
  loc: Location;
  p: IPlayer;
  returnToCity: () => void;
  travel: (to: CityName) => void;
};

export class GenericLocation extends React.Component<IProps, any> {
  /**
   * Stores button styling that sets them all to block display
   */
  btnStyle: any;

  constructor(props: IProps) {
    super(props);

    this.btnStyle = { display: "block" };
  }

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
          key={"companylocation"}
          locName={this.props.loc.name}
          p={this.props.p}
        />,
      );
    }

    if (this.props.loc.types.includes(LocationType.Gym)) {
      content.push(<GymLocation key={"gymlocation"} loc={this.props.loc} p={this.props.p} />);
    }

    if (this.props.loc.types.includes(LocationType.Hospital)) {
      content.push(<HospitalLocation key={"hospitallocation"} p={this.props.p} />);
    }

    if (this.props.loc.types.includes(LocationType.Slums)) {
      content.push(<SlumsLocation key={"slumslocation"} p={this.props.p} />);
    }

    if (this.props.loc.types.includes(LocationType.Special)) {
      content.push(
        <SpecialLocation engine={this.props.engine} key={"speciallocation"} loc={this.props.loc} p={this.props.p} />,
      );
    }

    if (this.props.loc.types.includes(LocationType.TechVendor)) {
      content.push(<TechVendorLocation key={"techvendorlocation"} loc={this.props.loc} p={this.props.p} />);
    }

    if (this.props.loc.types.includes(LocationType.TravelAgency)) {
      content.push(<TravelAgencyRoot key={"travelagencylocation"} p={this.props.p} router={this.props.router} />);
    }

    if (this.props.loc.types.includes(LocationType.University)) {
      content.push(<UniversityLocation key={"universitylocation"} loc={this.props.loc} p={this.props.p} />);
    }

    if (this.props.loc.types.includes(LocationType.Casino)) {
      content.push(<CasinoLocation key={"casinoLocation"} p={this.props.p} />);
    }

    return content;
  }

  render(): React.ReactNode {
    const locContent: React.ReactNode[] = this.getLocationSpecificContent();
    const ip = SpecialServerIps.getIp(this.props.loc.name);
    const server = getServer(ip);
    const backdoorInstalled = server !== null && isBackdoorInstalled(server);

    return (
      <div>
        <StdButton onClick={this.props.returnToCity} style={this.btnStyle} text={"Return to World"} />
        <h1 className="noselect">
          {backdoorInstalled && !Settings.DisableTextEffects ? (
            <CorruptableText content={this.props.loc.name} />
          ) : (
            this.props.loc.name
          )}
        </h1>
        {locContent}
      </div>
    );
  }
}
