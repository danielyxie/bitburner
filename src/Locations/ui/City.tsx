/**
 * React Component for displaying a City's UI.
 * This UI shows all of the available locations in the city, and lets the player
 * visit those locations
 */
import * as React from "react";

import { City } from "../City";
import { Cities } from "../Cities";
import { LocationName } from "../data/LocationNames";
import { Locations } from "../Locations";
import { Location } from "../Location";
import { Settings } from "../../Settings/Settings";

import { StdButton } from "../../ui/React/StdButton";
import { use } from "../../ui/Context";
import { IRouter } from "../../ui/Router";

type IProps = {
  city: City;
};

function toLocation(router: IRouter, location: Location): void {
  if (location.name === LocationName.TravelAgency) {
    router.toTravel();
  } else if (location.name === LocationName.WorldStockExchange) {
    router.toStockMarket();
  } else {
    router.toLocation(location);
  }
}

function LocationLetter(location: Location): React.ReactElement {
  const router = use.Router();
  if (!location) return <span>*</span>;
  return (
    <span
      aria-label={location.name}
      key={location.name}
      style={{
        color: "white",
        whiteSpace: "nowrap",
        margin: "0px",
        padding: "0px",
        cursor: "pointer",
      }}
      onClick={() => toLocation(router, location)}
    >
      <b>X</b>
    </span>
  );
}

function ASCIICity(props: IProps): React.ReactElement {
  const locationLettersRegex = /[A-Z]/g;
  const letterMap: any = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
    G: 6,
    H: 7,
    I: 8,
    J: 9,
    K: 10,
    L: 11,
    M: 12,
    N: 13,
    O: 14,
    P: 15,
    Q: 16,
    R: 17,
    S: 18,
    T: 19,
    U: 20,
    V: 21,
    W: 22,
    X: 23,
    Y: 24,
    Z: 25,
  };

  const lineElems = (s: string): JSX.Element[] => {
    const elems: any[] = [];
    const matches: any[] = [];
    let match: any;
    while ((match = locationLettersRegex.exec(s)) !== null) {
      matches.push(match);
    }
    if (matches.length === 0) {
      elems.push(s);
      return elems;
    }

    for (let i = 0; i < matches.length; i++) {
      const startI = i === 0 ? 0 : matches[i - 1].index + 1;
      const endI = matches[i].index;
      elems.push(s.slice(startI, endI));
      const locationI = letterMap[s[matches[i].index]];
      elems.push(LocationLetter(Locations[props.city.locations[locationI]]));
    }
    elems.push(s.slice(matches[matches.length - 1].index + 1));
    return elems;
  };

  const elems: JSX.Element[] = [];
  const lines = props.city.asciiArt.split("\n");
  for (const i in lines) {
    elems.push(<pre key={i}>{lineElems(lines[i])}</pre>);
  }

  return <div className="noselect">{elems}</div>;
}

function ListCity(props: IProps): React.ReactElement {
  const router = use.Router();
  const locationButtons = props.city.locations.map((locName) => {
    return (
      <li key={locName}>
        <StdButton onClick={() => toLocation(router, Locations[locName])} text={locName} />
      </li>
    );
  });

  return <ul>{locationButtons}</ul>;
}

export function LocationCity(): React.ReactElement {
  const player = use.Player();
  const city = Cities[player.city];
  return (
    <div className="noselect">
      <h2>{city.name}</h2>
      {Settings.DisableASCIIArt ? <ListCity city={city} /> : <ASCIICity city={city} />}
    </div>
  );
}
