/**
 * React Subcomponent for displaying a location's UI, when that location is a gym
 *
 * This subcomponent renders all of the buttons for training at the gym
 */
import * as React from "react";

import { Location } from "../Location";

import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { getServer } from "../../Server/ServerHelpers";
import { Server } from "../../Server/Server";
import { SpecialServerIps } from "../../Server/SpecialServerIps";

import { StdButton } from "../../ui/React/StdButton";
import { Money } from "../../ui/React/Money";
import { IRouter } from "../../ui/Router";

type IProps = {
  loc: Location;
  p: IPlayer;
  router: IRouter;
};

export class GymLocation extends React.Component<IProps, any> {
  /**
   * Stores button styling that sets them all to block display
   */
  btnStyle: any;

  constructor(props: IProps) {
    super(props);

    this.btnStyle = { display: "block" };

    this.trainStrength = this.trainStrength.bind(this);
    this.trainDefense = this.trainDefense.bind(this);
    this.trainDexterity = this.trainDexterity.bind(this);
    this.trainAgility = this.trainAgility.bind(this);

    this.calculateCost = this.calculateCost.bind(this);
  }

  calculateCost(): number {
    const ip = SpecialServerIps.getIp(this.props.loc.name);
    const server = getServer(ip);
    if (server == null || !server.hasOwnProperty("backdoorInstalled")) return this.props.loc.costMult;
    const discount = (server as Server).backdoorInstalled ? 0.9 : 1;
    return this.props.loc.costMult * discount;
  }

  train(stat: string): void {
    const loc = this.props.loc;
    this.props.p.startClass(this.props.router, this.calculateCost(), loc.expMult, stat);
  }

  trainStrength(): void {
    this.train(CONSTANTS.ClassGymStrength);
  }

  trainDefense(): void {
    this.train(CONSTANTS.ClassGymDefense);
  }

  trainDexterity(): void {
    this.train(CONSTANTS.ClassGymDexterity);
  }

  trainAgility(): void {
    this.train(CONSTANTS.ClassGymAgility);
  }

  render(): React.ReactNode {
    const cost = CONSTANTS.ClassGymBaseCost * this.calculateCost();

    return (
      <div>
        <StdButton
          onClick={this.trainStrength}
          style={this.btnStyle}
          text={
            <>
              Train Strength (<Money money={cost} player={this.props.p} /> / sec)
            </>
          }
        />
        <StdButton
          onClick={this.trainDefense}
          style={this.btnStyle}
          text={
            <>
              Train Defense (<Money money={cost} player={this.props.p} /> / sec)
            </>
          }
        />
        <StdButton
          onClick={this.trainDexterity}
          style={this.btnStyle}
          text={
            <>
              Train Dexterity (<Money money={cost} player={this.props.p} /> / sec)
            </>
          }
        />
        <StdButton
          onClick={this.trainAgility}
          style={this.btnStyle}
          text={
            <>
              Train Agility (<Money money={cost} player={this.props.p} /> / sec)
            </>
          }
        />
      </div>
    );
  }
}
