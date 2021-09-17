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
import { IRouter } from "../../ui/Router";
import { Settings } from "../../Settings/Settings";

import { StdButton } from "../../ui/React/StdButton";
import { createPopup } from "../../ui/React/createPopup";
import { Money } from "../../ui/React/Money";
import { WorldMap } from "../../ui/React/WorldMap";
import { dialogBoxCreate } from "../../../utils/DialogBox";

type IProps = {
  p: IPlayer;
  router: IRouter;
};

function travel(p: IPlayer, router: IRouter, to: CityName): void {
  const cost = CONSTANTS.TravelCost;
  if (!p.canAfford(cost)) {
    dialogBoxCreate(`You cannot afford to travel to ${to}`);
    return;
  }

  p.loseMoney(cost);
  p.travel(to);
  dialogBoxCreate(<span className="noselect">You are now in {to}!</span>);
  router.toCity();
}

function createTravelPopup(p: IPlayer, router: IRouter, city: CityName): void {
  if (Settings.SuppressTravelConfirmation) {
    travel(p, router, city);
    return;
  }
  const popupId = `travel-confirmation`;
  createPopup(popupId, TravelConfirmationPopup, {
    player: p,
    city: city,
    travel: () => travel(p, router, city),
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
        onTravel={(city: CityName) => createTravelPopup(props.p, props.router, city)}
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
              onClick={() => createTravelPopup(props.p, props.router, city as CityName)}
              style={{ display: "block" }}
              text={`Travel to ${city}`}
            />
          );
        })}
    </div>
  );
}

export function TravelAgencyRoot(props: IProps): React.ReactElement {
  return (
    <>
      <h1>Travel Agency</h1>
      {Settings.DisableASCIIArt ? (
        <ListWorldMap p={props.p} router={props.router} />
      ) : (
        <ASCIIWorldMap p={props.p} router={props.router} />
      )}
    </>
  );
}
