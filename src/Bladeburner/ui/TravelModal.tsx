import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from "react";

import { CityName } from "../../Locations/data/CityNames";
import { Settings } from "../../Settings/Settings";
import { Modal } from "../../ui/React/Modal";
import { WorldMap } from "../../ui/React/WorldMap";
import type { IBladeburner } from "../IBladeburner";

interface IProps {
  bladeburner: IBladeburner;
  open: boolean;
  onClose: () => void;
}

export function TravelModal(props: IProps): React.ReactElement {
  function travel(city: string): void {
    props.bladeburner.city = city;
    props.onClose();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <>
        <Typography>
          Travel to a different city for your Bladeburner activities. This does not cost any money. The city you are in
          for your Bladeburner duties does not affect your location in the game otherwise.
        </Typography>
        {Settings.DisableASCIIArt ? (
          Object.values(CityName).map((city: CityName) => (
            <Button key={city} onClick={() => travel(city)}>
              {city}
            </Button>
          ))
        ) : (
          <WorldMap currentCity={props.bladeburner.city as CityName} onTravel={(city: CityName) => travel(city)} />
        )}
      </>
    </Modal>
  );
}
