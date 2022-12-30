/**
 * React Subcomponent for displaying a location's UI, when that location is a Travel Agency
 *
 * TThis subcomponent renders all of the buttons for traveling to different cities
 */
import React, { useState, useEffect } from "react";

import { CityName } from "../../Enums";
import { TravelConfirmationModal } from "./TravelConfirmationModal";

import { CONSTANTS } from "../../Constants";
import { Player } from "@player";
import { Router } from "../../ui/GameRoot";
import { Page } from "../../ui/Router";
import { Settings } from "../../Settings/Settings";

import { Money } from "../../ui/React/Money";
import { WorldMap } from "../../ui/React/WorldMap";
import { dialogBoxCreate } from "../../ui/React/DialogBox";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

function travel(to: CityName): void {
  const cost = CONSTANTS.TravelCost;
  if (!Player.canAfford(cost)) {
    return;
  }

  Player.loseMoney(cost, "other");
  Player.travel(to);
  dialogBoxCreate(`You are now in ${to}!`);
  Router.toPage(Page.City);
}

export function TravelAgencyRoot(): React.ReactElement {
  const setRerender = useState(false)[1];
  const [open, setOpen] = useState(false);
  const [destination, setDestination] = useState(CityName.Sector12);
  function rerender(): void {
    setRerender((o) => !o);
  }

  useEffect(() => {
    const id = setInterval(rerender, 1000);
    return () => clearInterval(id);
  }, []);

  function startTravel(city: CityName): void {
    const cost = CONSTANTS.TravelCost;
    if (!Player.canAfford(cost)) {
      return;
    }
    if (Settings.SuppressTravelConfirmation) {
      travel(city);
      return;
    }
    setOpen(true);
    setDestination(city);
  }

  return (
    <>
      <Typography variant="h4">Travel Agency</Typography>
      <Box mx={2}>
        <Typography>
          From here, you can travel to any other city! A ticket costs{" "}
          <Money money={CONSTANTS.TravelCost} forPurchase={true} />.
        </Typography>
        {Settings.DisableASCIIArt ? (
          <>
            {Object.values(CityName)
              .filter((city: string) => city != Player.city)
              .map((city: string) => {
                const match = Object.entries(CityName).find((entry) => entry[1] === city);
                if (match === undefined) throw new Error(`could not find key for city '${city}'`);
                return (
                  <React.Fragment key={city}>
                    <Button onClick={() => startTravel(city as CityName)} sx={{ m: 2 }}>
                      <Typography>Travel to {city}</Typography>
                    </Button>
                    <br />
                  </React.Fragment>
                );
              })}
          </>
        ) : (
          <WorldMap currentCity={Player.city} onTravel={(city: CityName) => startTravel(city)} />
        )}
      </Box>
      <TravelConfirmationModal
        city={destination}
        travel={() => travel(destination)}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
