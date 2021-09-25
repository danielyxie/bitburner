/**
 * React Component for displaying a location's UI
 *
 * This is a "router" component of sorts, meaning it deduces the type of
 * location that is being rendered and then creates the proper component(s) for that.
 */
import * as React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

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

import { Settings } from "../../Settings/Settings";

import { SpecialServerIps } from "../../Server/SpecialServerIps";
import { getServer, isBackdoorInstalled } from "../../Server/ServerHelpers";

import { CorruptableText } from "../../ui/React/CorruptableText";
import { use } from "../../ui/Context";

type IProps = {
  loc: Location;
};

export function GenericLocation({ loc }: IProps): React.ReactElement {
  const router = use.Router();
  const player = use.Player();
  /**
   * Determine what needs to be rendered for this location based on the locations
   * type. Returns an array of React components that should be rendered
   */
  function getLocationSpecificContent(): React.ReactNode[] {
    const content: React.ReactNode[] = [];

    if (loc.types.includes(LocationType.Company)) {
      content.push(<CompanyLocation key={"companylocation"} locName={loc.name} />);
    }

    if (loc.types.includes(LocationType.Gym)) {
      content.push(<GymLocation key={"gymlocation"} router={router} loc={loc} p={player} />);
    }

    if (loc.types.includes(LocationType.Hospital)) {
      content.push(<HospitalLocation key={"hospitallocation"} p={player} />);
    }

    if (loc.types.includes(LocationType.Slums)) {
      content.push(<SlumsLocation key={"slumslocation"} />);
    }

    if (loc.types.includes(LocationType.Special)) {
      content.push(<SpecialLocation key={"speciallocation"} loc={loc} />);
    }

    if (loc.types.includes(LocationType.TechVendor)) {
      content.push(<TechVendorLocation key={"techvendorlocation"} loc={loc} p={player} />);
    }

    if (loc.types.includes(LocationType.TravelAgency)) {
      content.push(<TravelAgencyRoot key={"travelagencylocation"} p={player} router={router} />);
    }

    if (loc.types.includes(LocationType.University)) {
      content.push(<UniversityLocation key={"universitylocation"} loc={loc} />);
    }

    if (loc.types.includes(LocationType.Casino)) {
      content.push(<CasinoLocation key={"casinoLocation"} p={player} />);
    }

    return content;
  }

  const locContent: React.ReactNode[] = getLocationSpecificContent();
  const ip = SpecialServerIps.getIp(loc.name);
  const server = getServer(ip);
  const backdoorInstalled = server !== null && isBackdoorInstalled(server);

  return (
    <>
      <Button onClick={() => router.toCity()}>Return to World</Button>
      <Typography variant="h4" className="noselect">
        {backdoorInstalled && !Settings.DisableTextEffects ? <CorruptableText content={loc.name} /> : loc.name}
      </Typography>
      {locContent}
    </>
  );
}
