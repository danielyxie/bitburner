/**
 * React Subcomponent for displaying a location's UI, when that location is a hospital
 *
 * This subcomponent renders all of the buttons for hospital options
 */
import * as React from "react";
import Button from "@mui/material/Button";

import { Player } from "../../Player";
import { getHospitalizationCost } from "../../Hospital/Hospital";

import { Money } from "../../ui/React/Money";

import { dialogBoxCreate } from "../../ui/React/DialogBox";

type IState = {
  currHp: number;
};

export class HospitalLocation extends React.Component<Record<string, never>, IState> {
  /**
   * Stores button styling that sets them all to block display
   */
  btnStyle = { display: "block" };

  constructor() {
    super({});

    this.getCost = this.getCost.bind(this);
    this.getHealed = this.getHealed.bind(this);

    this.state = {
      currHp: Player.hp.current,
    };
  }

  getCost(): number {
    return getHospitalizationCost();
  }

  getHealed(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }

    if (Player.hp.current < 0) {
      Player.hp.current = 0;
    }
    if (Player.hp.current >= Player.hp.max) {
      return;
    }

    const cost = this.getCost();
    Player.loseMoney(cost, "hospitalization");
    Player.hp.current = Player.hp.max;

    // This just forces a re-render to update the cost
    this.setState({
      currHp: Player.hp.current,
    });

    dialogBoxCreate(
      <>
        You were healed to full health! The hospital billed you for <Money money={cost} />
      </>,
    );
  }

  render(): React.ReactNode {
    const cost = this.getCost();

    return (
      <Button onClick={this.getHealed} style={this.btnStyle}>
        Get treatment for wounds - <Money money={cost} forPurchase={true} />
      </Button>
    );
  }
}
