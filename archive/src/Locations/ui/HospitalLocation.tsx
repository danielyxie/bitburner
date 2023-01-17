/**
 * React Subcomponent for displaying a location's UI, when that location is a hospital
 *
 * This subcomponent renders all of the buttons for hospital options
 */
import * as React from "react";
import Button from "@mui/material/Button";

import { IPlayer } from "../../PersonObjects/IPlayer";
import { getHospitalizationCost } from "../../Hospital/Hospital";

import { Money } from "../../ui/React/Money";

import { dialogBoxCreate } from "../../ui/React/DialogBox";

type IProps = {
  p: IPlayer;
};

type IState = {
  currHp: number;
};

export class HospitalLocation extends React.Component<IProps, IState> {
  /**
   * Stores button styling that sets them all to block display
   */
  btnStyle = { display: "block" };

  constructor(props: IProps) {
    super(props);

    this.getCost = this.getCost.bind(this);
    this.getHealed = this.getHealed.bind(this);

    this.state = {
      currHp: this.props.p.hp.current,
    };
  }

  getCost(): number {
    return getHospitalizationCost(this.props.p);
  }

  getHealed(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }

    if (this.props.p.hp.current < 0) {
      this.props.p.hp.current = 0;
    }
    if (this.props.p.hp.current >= this.props.p.hp.max) {
      return;
    }

    const cost = this.getCost();
    this.props.p.loseMoney(cost, "hospitalization");
    this.props.p.hp.current = this.props.p.hp.max;

    // This just forces a re-render to update the cost
    this.setState({
      currHp: this.props.p.hp.current,
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
        Get treatment for wounds - <Money money={cost} player={this.props.p} />
      </Button>
    );
  }
}
