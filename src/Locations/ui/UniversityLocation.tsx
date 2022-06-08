/**
 * React Subcomponent for displaying a location's UI, when that location is a university
 *
 * This subcomponent renders all of the buttons for studying/taking courses
 */
import * as React from "react";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

import { Location } from "../Location";

import { CONSTANTS } from "../../Constants";
import { GetServer } from "../../Server/AllServers";
import { Server } from "../../Server/Server";

import { Money } from "../../ui/React/Money";
import { use } from "../../ui/Context";
import { Box } from "@mui/material";

import { ClassType } from "../../utils/WorkType";
import { serverMetadata } from "../../Server/data/servers";

type IProps = {
  loc: Location;
};

export function UniversityLocation(props: IProps): React.ReactElement {
  const player = use.Player();
  const router = use.Router();

  function calculateCost(): number {
    const serverMeta = serverMetadata.find((s) => s.specialName === props.loc.name);
    const server = GetServer(serverMeta ? serverMeta.hostname : "");
    if (server == null || !server.hasOwnProperty("backdoorInstalled")) return props.loc.costMult;
    const discount = (server as Server).backdoorInstalled ? 0.9 : 1;
    return props.loc.costMult * discount;
  }

  function take(stat: ClassType): void {
    const loc = props.loc;
    player.startClass(calculateCost(), loc.expMult, stat);
    player.startFocusing();
    router.toWork();
  }

  function study(): void {
    take(ClassType.StudyComputerScience);
  }

  function dataStructures(): void {
    take(ClassType.DataStructures);
  }

  function networks(): void {
    take(ClassType.Networks);
  }

  function algorithms(): void {
    take(ClassType.Algorithms);
  }

  function management(): void {
    take(ClassType.Management);
  }

  function leadership(): void {
    take(ClassType.Leadership);
  }

  const costMult: number = calculateCost();

  const dataStructuresCost = CONSTANTS.ClassDataStructuresBaseCost * costMult;
  const networksCost = CONSTANTS.ClassNetworksBaseCost * costMult;
  const algorithmsCost = CONSTANTS.ClassAlgorithmsBaseCost * costMult;
  const managementCost = CONSTANTS.ClassManagementBaseCost * costMult;
  const leadershipCost = CONSTANTS.ClassLeadershipBaseCost * costMult;

  const earnHackingExpTooltip = `Gain hacking experience!`;
  const earnCharismaExpTooltip = `Gain charisma experience!`;

  return (
    <Box sx={{ display: "grid", width: "fit-content" }}>
      <Tooltip title={earnHackingExpTooltip}>
        <Button onClick={study}>Study Computer Science (free)</Button>
      </Tooltip>
      <Tooltip title={earnHackingExpTooltip}>
        <Button onClick={dataStructures}>
          Take Data Structures course (
          <Money money={dataStructuresCost} player={player} /> / sec)
        </Button>
      </Tooltip>
      <Tooltip title={earnHackingExpTooltip}>
        <Button onClick={networks}>
          Take Networks course (
          <Money money={networksCost} player={player} /> / sec)
        </Button>
      </Tooltip>
      <Tooltip title={earnHackingExpTooltip}>
        <Button onClick={algorithms}>
          Take Algorithms course (
          <Money money={algorithmsCost} player={player} /> / sec)
        </Button>
      </Tooltip>
      <Tooltip title={earnCharismaExpTooltip}>
        <Button onClick={management}>
          Take Management course (
          <Money money={managementCost} player={player} /> / sec)
        </Button>
      </Tooltip>
      <Tooltip title={earnCharismaExpTooltip}>
        <Button onClick={leadership}>
          Take Leadership course (
          <Money money={leadershipCost} player={player} /> / sec)
        </Button>
      </Tooltip>
    </Box>
  );
}
