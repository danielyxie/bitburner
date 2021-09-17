/**
 * React Subcomponent for displaying a location's UI, when that location is a university
 *
 * This subcomponent renders all of the buttons for studying/taking courses
 */
import * as React from "react";

import { Location } from "../Location";

import { CONSTANTS } from "../../Constants";
import { getServer } from "../../Server/ServerHelpers";
import { Server } from "../../Server/Server";
import { SpecialServerIps } from "../../Server/SpecialServerIps";

import { StdButton } from "../../ui/React/StdButton";
import { Money } from "../../ui/React/Money";
import { use } from "../../ui/Context";

type IProps = {
  loc: Location;
};

export function UniversityLocation(props: IProps): React.ReactElement {
  const player = use.Player();
  const router = use.Router();

  function calculateCost(): number {
    const ip = SpecialServerIps.getIp(props.loc.name);
    const server = getServer(ip);
    if (server == null || !server.hasOwnProperty("backdoorInstalled")) return props.loc.costMult;
    const discount = (server as Server).backdoorInstalled ? 0.9 : 1;
    return props.loc.costMult * discount;
  }

  function take(stat: string): void {
    const loc = props.loc;
    player.startClass(calculateCost(), loc.expMult, stat);
    router.toWork();
  }

  function study(): void {
    take(CONSTANTS.ClassStudyComputerScience);
  }

  function dataStructures(): void {
    take(CONSTANTS.ClassDataStructures);
  }

  function networks(): void {
    take(CONSTANTS.ClassNetworks);
  }

  function algorithms(): void {
    take(CONSTANTS.ClassAlgorithms);
  }

  function management(): void {
    take(CONSTANTS.ClassManagement);
  }

  function leadership(): void {
    take(CONSTANTS.ClassLeadership);
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
    <div>
      <StdButton
        onClick={study}
        style={{ display: "block" }}
        text={`Study Computer Science (free)`}
        tooltip={earnHackingExpTooltip}
      />
      <StdButton
        onClick={dataStructures}
        style={{ display: "block" }}
        text={
          <>
            Take Data Structures course (
            <Money money={dataStructuresCost} player={player} /> / sec)
          </>
        }
        tooltip={earnHackingExpTooltip}
      />
      <StdButton
        onClick={networks}
        style={{ display: "block" }}
        text={
          <>
            Take Networks course (
            <Money money={networksCost} player={player} /> / sec)
          </>
        }
        tooltip={earnHackingExpTooltip}
      />
      <StdButton
        onClick={algorithms}
        style={{ display: "block" }}
        text={
          <>
            Take Algorithms course (
            <Money money={algorithmsCost} player={player} /> / sec)
          </>
        }
        tooltip={earnHackingExpTooltip}
      />
      <StdButton
        onClick={management}
        style={{ display: "block" }}
        text={
          <>
            Take Management course (
            <Money money={managementCost} player={player} /> / sec)
          </>
        }
        tooltip={earnCharismaExpTooltip}
      />
      <StdButton
        onClick={leadership}
        style={{ display: "block" }}
        text={
          <>
            Take Leadership course (
            <Money money={leadershipCost} player={player} /> / sec)
          </>
        }
        tooltip={earnCharismaExpTooltip}
      />
    </div>
  );
}
