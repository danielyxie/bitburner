import React from "react";
import { removePopup } from "../../ui/React/createPopup";
import { BladeburnerConstants } from "../data/Constants";
import { IBladeburner } from "../IBladeburner";

interface IProps {
  bladeburner: IBladeburner;
  popupId: string;
}

export function TravelPopup(props: IProps): React.ReactElement {
  function travel(city: string): void {
    props.bladeburner.city = city;
    removePopup(props.popupId);
  }

  return (
    <>
      <p>
        Travel to a different city for your Bladeburner activities. This does
        not cost any money. The city you are in for your Bladeburner duties does
        not affect your location in the game otherwise.
      </p>
      {BladeburnerConstants.CityNames.map((city) => {
        // Reusing this css class...it adds a border and makes it
        // so that background color changes when you hover
        return (
          <div
            key={city}
            className="cmpy-mgmt-find-employee-option"
            onClick={() => travel(city)}
          >
            {city}
          </div>
        );
      })}
    </>
  );
}
