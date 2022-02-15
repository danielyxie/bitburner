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
import { GetServer } from "../../Server/AllServers";
import { Server } from "../../Server/Server";

import { Money } from "../../ui/React/Money";
import { IRouter } from "../../ui/Router";
import { serverMetadata } from "../../Server/data/servers";
import { Box } from "@mui/material";

type IProps = {
  loc: Location;
  p: IPlayer;
  router: IRouter;
};

export function GymLocation(props: IProps): React.ReactElement {
  function calculateCost(): number {
    const serverMeta = serverMetadata.find((s) => s.specialName === props.loc.name);
    const server = GetServer(serverMeta ? serverMeta.hostname : "");
    if (server == null || !server.hasOwnProperty("backdoorInstalled")) return props.loc.costMult;
    const discount = (server as Server).backdoorInstalled ? 0.9 : 1;
    return props.loc.costMult * discount;
  }

  function train(stat: string): void {
    const loc = props.loc;
    props.p.startClass(calculateCost(), loc.expMult, stat);
    props.p.startFocusing();
    props.router.toWork();
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
    <Box sx={{ display: 'grid', width: 'fit-content' }}>
      <Button onClick={trainStrength}>
        Train Strength (<Money money={cost} player={props.p} /> / sec)
      </Button>
      <Button onClick={trainDefense}>
        Train Defense (<Money money={cost} player={props.p} /> / sec)
      </Button>
      <Button onClick={trainDexterity}>
        Train Dexterity (<Money money={cost} player={props.p} /> / sec)
      </Button>
      <Button onClick={trainAgility}>
        Train Agility (<Money money={cost} player={props.p} /> / sec)
      </Button>
    </Box>
  );
}
