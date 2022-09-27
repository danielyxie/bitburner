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

import { Player } from "../../Player";
import { Router } from "../../ui/GameRoot";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { LocationType } from "../LocationTypeEnum";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";

type IProps = {
  city: City;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    location: {
      color: theme.colors.white,
      whiteSpace: "nowrap",
      margin: "0px",
      padding: "0px",
      cursor: "pointer",
    },
  }),
);

function toLocation(location: Location): void {
  if (location.name === LocationName.TravelAgency) {
    Router.toTravel();
  } else if (location.name === LocationName.WorldStockExchange) {
    Router.toStockMarket();
  } else {
    Router.toLocation(location);
  }
}

function LocationLetter(location: Location, className: string): React.ReactElement {
  let L = "X";
  if (location.types.includes(LocationType.Company)) L = "C";
  if (location.types.includes(LocationType.Gym)) L = "G";
  if (location.types.includes(LocationType.Hospital)) L = "H";
  if (location.types.includes(LocationType.Slums)) L = "S";
  if (location.types.includes(LocationType.StockMarket)) L = "$";
  if (location.types.includes(LocationType.TechVendor)) L = "T";
  if (location.types.includes(LocationType.TravelAgency)) L = "T";
  if (location.types.includes(LocationType.University)) L = "U";
  if (location.types.includes(LocationType.Casino)) L = "¢";
  if (location.types.includes(LocationType.Special)) L = "?";
  if (!location) return <span>*</span>;
  return (
    <span aria-label={location.name} key={location.name} className={className} onClick={() => toLocation(location)}>
      <b>{L}</b>
    </span>
  );
}

function ASCIICity(props: IProps): React.ReactElement {
  const locationLettersRegex = /[A-Z]/g;
  const letterMap: {
    [key: string]: number;
  } = {
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
  const classes = useStyles();

  const lineElems = (s: string): (string | React.ReactElement)[] => {
    const elems: (string | React.ReactElement)[] = [];
    const matches: RegExpExecArray[] = [];
    let match: RegExpExecArray | null = null;
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
      elems.push(LocationLetter(Locations[props.city.locations[locationI]], classes.location));
    }
    elems.push(s.slice(matches[matches.length - 1].index + 1));
    return elems;
  };

  const elems: JSX.Element[] = [];
  const lines = props.city.asciiArt.split("\n");
  let i = 0;
  for (const line of lines) {
    elems.push(
      <Typography key={i} sx={{ lineHeight: "1em", whiteSpace: "pre" }}>
        {lineElems(line)}
      </Typography>,
    );
    i++;
  }

  return <>{elems}</>;
}

function ListCity(props: IProps): React.ReactElement {
  const locationButtons = props.city.locations.map((locName) => {
    return (
      <React.Fragment key={locName}>
        <Button onClick={() => toLocation(Locations[locName])}>{locName}</Button>
        <br />
      </React.Fragment>
    );
  });

  return <>{locationButtons}</>;
}

export function LocationCity(): React.ReactElement {
  const city = Cities[Player.city];
  return (
    <>
      <Typography>{city.name}</Typography>
      {Settings.DisableASCIIArt ? <ListCity city={city} /> : <ASCIICity city={city} />}
    </>
  );
}
