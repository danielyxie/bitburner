/**
 * React Subcomponent for displaying a location's UI, when that location is a Travel Agency
 *
 * TThis subcomponent renders all of the buttons for traveling to different cities
 */
import React, { useState, useEffect } from "react";

import { CityName } from "../data/CityNames";
import { TravelConfirmationModal } from "./TravelConfirmationModal";

import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { IRouter } from "../../ui/Router";
import { Settings } from "../../Settings/Settings";

import { StdButton } from "../../ui/React/StdButton";
import { use } from "../../ui/Context";
import { Money } from "../../ui/React/Money";
import { WorldMap } from "../../ui/React/WorldMap";
import { dialogBoxCreate } from "../../ui/React/DialogBox";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

type IProps = {
  p: IPlayer;
  router: IRouter;
};

function travel(p: IPlayer, router: IRouter, to: CityName): void {
  const cost = CONSTANTS.TravelCost;
  if (!p.canAfford(cost)) {
    return;
  }

  p.loseMoney(cost);
  p.travel(to);
  dialogBoxCreate(<span className="noselect">You are now in {to}!</span>);
  router.toCity();
}

export function TravelAgencyRoot(props: IProps): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
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
    if (!player.canAfford(cost)) {
      return;
    }
    if (Settings.SuppressTravelConfirmation) {
      travel(player, router, city);
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
          <Money money={CONSTANTS.TravelCost} player={props.p} />.
        </Typography>
        {Settings.DisableASCIIArt ? (
          <div>
            {Object.values(CityName)
              .filter((city: string) => city != props.p.city)
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
          </div>
        ) : (
          <WorldMap currentCity={props.p.city} onTravel={(city: CityName) => startTravel(city)} />
        )}
      </Box>
      <TravelConfirmationModal
        city={destination}
        travel={() => travel(player, router, destination)}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
