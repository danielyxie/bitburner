/**
 * React Subcomponent for displaying a location's UI, when that location is a gym
 *
 * This subcomponent renders all of the buttons for training at the gym
 */
import * as React from "react";
import Button from "@mui/material/Button";

import { Location } from "../Location";

import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { getServer } from "../../Server/ServerHelpers";
import { Server } from "../../Server/Server";
import { SpecialServerIps } from "../../Server/SpecialServerIps";

import { Money } from "../../ui/React/Money";
import { IRouter } from "../../ui/Router";

type IProps = {
  loc: Location;
  p: IPlayer;
  router: IRouter;
};

export function GymLocation(props: IProps): React.ReactElement {
  function calculateCost(): number {
    const ip = SpecialServerIps.getIp(props.loc.name);
    const server = getServer(ip);
    if (server == null || !server.hasOwnProperty("backdoorInstalled")) return props.loc.costMult;
    const discount = (server as Server).backdoorInstalled ? 0.9 : 1;
    return props.loc.costMult * discount;
  }

  function train(stat: string): void {
    const loc = props.loc;
    props.p.startClass(props.router, calculateCost(), loc.expMult, stat);
  }

  function trainStrength(): void {
    train(CONSTANTS.ClassGymStrength);
  }

  function trainDefense(): void {
    train(CONSTANTS.ClassGymDefense);
  }

  function trainDexterity(): void {
    train(CONSTANTS.ClassGymDexterity);
  }

  function trainAgility(): void {
    train(CONSTANTS.ClassGymAgility);
  }

  const cost = CONSTANTS.ClassGymBaseCost * calculateCost();

  return (
    <>
      <Button onClick={trainStrength}>
        Train Strength (<Money money={cost} player={props.p} /> / sec)
      </Button>
      <br />
      <Button onClick={trainDefense}>
        Train Defense (<Money money={cost} player={props.p} /> / sec)
      </Button>
      <br />
      <Button onClick={trainDexterity}>
        Train Dexterity (<Money money={cost} player={props.p} /> / sec)
      </Button>
      <br />
      <Button onClick={trainAgility}>
        Train Agility (<Money money={cost} player={props.p} /> / sec)
      </Button>
    </>
  );
}
