/**
 * React Subcomponent for displaying a location's UI, when that location is a Travel Agency
 *
 * TThis subcomponent renders all of the buttons for traveling to different cities
 */
import * as React from "react";

import { CityName } from "../data/CityNames";
import { createTravelPopup } from "../LocationsHelpers";

import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Settings } from "../../Settings/Settings";

import { StdButton } from "../../ui/React/StdButton";
import { Money } from "../../ui/React/Money";
import { WorldMap } from "../../ui/React/WorldMap";

type IProps = {
  p: IPlayer;
  travel: (to: CityName) => void;
};

export class TravelAgencyLocation extends React.Component<IProps, any> {
  /**
   * Stores button styling that sets them all to block display
   */
  btnStyle: any;

  constructor(props: IProps) {
    super(props);

    this.btnStyle = { display: "block" };
  }

  asciiWorldMap(): React.ReactNode {
    // map needs all this whitespace!
    // prettier-ignore
    return (
      <div className="noselect">
        <p>
          From here, you can travel to any other city! A ticket costs{" "}
          <Money money={CONSTANTS.TravelCost} player={this.props.p} />.
        </p>
        <WorldMap currentCity={this.props.p.city} onTravel={(city: CityName) => createTravelPopup(city, this.props.travel)} />
      </div>
    );
  }

  listWorldMap(): React.ReactNode {
    const travelBtns: React.ReactNode[] = [];
    for (const key in CityName) {
      const city: CityName = (CityName as any)[key];

      // Skip current city
      if (city === this.props.p.city) {
        continue;
      }

      travelBtns.push(
        <StdButton
          key={city}
          onClick={createTravelPopup.bind(null, city, this.props.travel)}
          style={this.btnStyle}
          text={`Travel to ${city}`}
        />,
      );
    }

    return (
      <div>
        <p>
          From here, you can travel to any other city! A ticket costs <Money money={CONSTANTS.TravelCost} />.
        </p>
        {travelBtns}
      </div>
    );
  }

  render(): React.ReactNode {
    if (Settings.DisableASCIIArt) {
      return this.listWorldMap();
    } else {
      return this.asciiWorldMap();
    }
  }
}
