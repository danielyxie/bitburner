/**
 * React Subcomponent for displaying a location's UI, when that location is a Travel Agency
 *
 * TThis subcomponent renders all of the buttons for traveling to different cities
 */
import * as React from "react";

import { CityName } from "../data/CityNames";
import { TravelConfirmationPopup } from "./TravelConfirmationPopup";

import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Settings } from "../../Settings/Settings";

import { StdButton } from "../../ui/React/StdButton";
import { createPopup } from "../../ui/React/createPopup";
import { Money } from "../../ui/React/Money";
import { WorldMap } from "../../ui/React/WorldMap";

type IProps = {
  p: IPlayer;
  travel: (to: CityName) => void;
};

function createTravelPopup(p: IPlayer, city: string, travel: () => void): void {
  if (Settings.SuppressTravelConfirmation) {
    travel();
    return;
  }
  const popupId = `travel-confirmation`;
  createPopup(popupId, TravelConfirmationPopup, {
    player: p,
    city: city,
    travel: travel,
    popupId: popupId,
  });
}

function ASCIIWorldMap(props: IProps): React.ReactElement {
  return (
    <div className="noselect">
      <p>
        From here, you can travel to any other city! A ticket costs{" "}
        <Money money={CONSTANTS.TravelCost} player={props.p} />.
      </p>
      <WorldMap
        currentCity={props.p.city}
        onTravel={(city: CityName) => createTravelPopup(props.p, city, () => props.travel(city))}
      />
    </div>
  );
}

function ListWorldMap(props: IProps): React.ReactElement {
  return (
    <div>
      <p>
        From here, you can travel to any other city! A ticket costs{" "}
        <Money money={CONSTANTS.TravelCost} player={props.p} />.
      </p>
      {Object.values(CityName)
        .filter((city: string) => city != props.p.city)
        .map((city: string) => {
          const match = Object.entries(CityName).find((entry) => entry[1] === city);
          if (match === undefined) throw new Error(`could not find key for city '${city}'`);
          return (
            <StdButton
              key={city}
              onClick={() => createTravelPopup(props.p, city, () => props.travel(match[1]))}
              style={{ display: "block" }}
              text={`Travel to ${city}`}
            />
          );
        })}
    </div>
  );
}

export function TravelAgencyLocation(props: IProps): React.ReactElement {
  if (Settings.DisableASCIIArt) {
    return <ListWorldMap p={props.p} travel={props.travel} />;
  } else {
    return <ASCIIWorldMap p={props.p} travel={props.travel} />;
  }
}
