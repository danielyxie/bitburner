// React Component for the element that contains the actual info/data
// for the Corporation UI. This panel lies below the header tabs and will
// be filled with whatever is needed based on the routing/navigation
import React from "react";

import { CityTabs } from "./CityTabs";
import { IIndustry } from "../IIndustry";
import { Overview } from "./Overview";

import { CityName } from "../../Locations/data/CityNames";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { ICorporation } from "../ICorporation";

interface IProps {
  corp: ICorporation;
  player: IPlayer;
  divisionName: string;
}

export function MainPanel(props: IProps): React.ReactElement {
  const division =
    props.divisionName !== "Overview"
      ? props.corp.divisions.find(
          (division: IIndustry) => division.name === props.divisionName,
        )
      : undefined; // use undefined because find returns undefined

  if (division === undefined) {
    return (
      <div id="cmpy-mgmt-panel">
        <Overview {...props} />
      </div>
    );
  } else {
    return (
      <div id="cmpy-mgmt-panel">
        <CityTabs
          division={division}
          corp={props.corp}
          city={CityName.Sector12}
          player={props.player}
        />
      </div>
    );
  }
}
