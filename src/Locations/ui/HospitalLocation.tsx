/**
 * React Subcomponent for displaying a location's UI, when that location is a hospital
 *
 * This subcomponent renders all of the buttons for hospital options
 */
import * as React from "react";
import Button from "@mui/material/Button";

import { Player } from "@player";
import { getHospitalizationCost } from "../../Hospital/Hospital";

import { Money } from "../../ui/React/Money";

import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { useState } from "react";

export function HospitalLocation(): React.ReactElement {
  /** Stores button styling that sets them all to block display */
  const btnStyle = { display: "block" };

  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  function getHealed(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }

    if (Player.hp.current < 0) {
      Player.hp.current = 0;
    }
    if (Player.hp.current >= Player.hp.max) {
      return;
    }

    const cost = getHospitalizationCost();
    Player.loseMoney(cost, "hospitalization");
    Player.hp.current = Player.hp.max;

    // This just forces a re-render to update the cost
    rerender();

    dialogBoxCreate(
      <>
        You were healed to full health! The hospital billed you for <Money money={cost} />
      </>,
    );
  }

  return (
    <Button onClick={getHealed} style={btnStyle}>
      Get treatment for wounds - <Money money={getHospitalizationCost()} forPurchase={true} />
    </Button>
  );
}
