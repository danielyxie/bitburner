import React from "react";
import { Sleeve } from "../Sleeve";
import { CONSTANTS } from "../../../Constants";
import { Money } from "../../../ui/React/Money";
import { WorldMap } from "../../../ui/React/WorldMap";
import { CityName } from "../../../Locations/data/CityNames";
import { Settings } from "../../../Settings/Settings";
import { dialogBoxCreate } from "../../../ui/React/DialogBox";
import { use } from "../../../ui/Context";
import { Modal } from "../../../ui/React/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface IProps {
  open: boolean;
  onClose: () => void;
  sleeve: Sleeve;
  rerender: () => void;
}

export function TravelModal(props: IProps): React.ReactElement {
  const player = use.Player();
  function travel(city: string): void {
    if (!player.canAfford(CONSTANTS.TravelCost)) {
      dialogBoxCreate("You cannot afford to have this sleeve travel to another city");
    }
    props.sleeve.city = city as CityName;
    player.loseMoney(CONSTANTS.TravelCost, "sleeve");
    props.sleeve.resetTaskStatus();
    props.rerender();
    props.onClose();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <>
        <Typography>
          Have this sleeve travel to a different city. This affects the gyms and universities at which this sleeve can
          study. Traveling to a different city costs <Money money={CONSTANTS.TravelCost} player={player} />. It will
          also set your current sleeve task to idle.
        </Typography>
        {Settings.DisableASCIIArt ? (
          Object.values(CityName).map((city: CityName) => (
            <Button key={city} onClick={() => travel(city)}>
              {city}
            </Button>
          ))
        ) : (
          <WorldMap currentCity={props.sleeve.city} onTravel={(city: CityName) => travel(city)} />
        )}
      </>
    </Modal>
  );
}
