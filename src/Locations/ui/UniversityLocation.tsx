/**
 * React Subcomponent for displaying a location's UI, when that location is a university
 *
 * This subcomponent renders all of the buttons for studying/taking courses
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

type IProps = {
  loc: Location;
  p: IPlayer;
};

export class UniversityLocation extends React.Component<IProps, any> {
  /**
   * Stores button styling that sets them all to block display
   */
  btnStyle: any;

  constructor(props: IProps) {
    super(props);

    this.btnStyle = { display: "block" };

    this.take = this.take.bind(this);
    this.study = this.study.bind(this);
    this.dataStructures = this.dataStructures.bind(this);
    this.networks = this.networks.bind(this);
    this.algorithms = this.algorithms.bind(this);
    this.management = this.management.bind(this);
    this.leadership = this.leadership.bind(this);

    this.calculateCost = this.calculateCost.bind(this);
  }

  calculateCost(): number {
    const ip = SpecialServerIps.getIp(this.props.loc.name);
    const server = getServer(ip);
    if (server == null || !server.hasOwnProperty("backdoorInstalled")) return this.props.loc.costMult;
    const discount = (server as Server).backdoorInstalled ? 0.9 : 1;
    return this.props.loc.costMult * discount;
  }

  take(stat: string): void {
    const loc = this.props.loc;
    this.props.p.startClass(this.calculateCost(), loc.expMult, stat);
  }

  study(): void {
    this.take(CONSTANTS.ClassStudyComputerScience);
  }

  dataStructures(): void {
    this.take(CONSTANTS.ClassDataStructures);
  }

  networks(): void {
    this.take(CONSTANTS.ClassNetworks);
  }

  algorithms(): void {
    this.take(CONSTANTS.ClassAlgorithms);
  }

  management(): void {
    this.take(CONSTANTS.ClassManagement);
  }

  leadership(): void {
    this.take(CONSTANTS.ClassLeadership);
  }

  render(): React.ReactNode {
    const costMult: number = this.calculateCost();

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
          onClick={this.study}
          style={this.btnStyle}
          text={`Study Computer Science (free)`}
          tooltip={earnHackingExpTooltip}
        />
        <StdButton
          onClick={this.dataStructures}
          style={this.btnStyle}
          text={
            <>
              Take Data Structures course (
              <Money money={dataStructuresCost} player={this.props.p} /> / sec)
            </>
          }
          tooltip={earnHackingExpTooltip}
        />
        <StdButton
          onClick={this.networks}
          style={this.btnStyle}
          text={
            <>
              Take Networks course (
              <Money money={networksCost} player={this.props.p} /> / sec)
            </>
          }
          tooltip={earnHackingExpTooltip}
        />
        <StdButton
          onClick={this.algorithms}
          style={this.btnStyle}
          text={
            <>
              Take Algorithms course (
              <Money money={algorithmsCost} player={this.props.p} /> / sec)
            </>
          }
          tooltip={earnHackingExpTooltip}
        />
        <StdButton
          onClick={this.management}
          style={this.btnStyle}
          text={
            <>
              Take Management course (
              <Money money={managementCost} player={this.props.p} /> / sec)
            </>
          }
          tooltip={earnCharismaExpTooltip}
        />
        <StdButton
          onClick={this.leadership}
          style={this.btnStyle}
          text={
            <>
              Take Leadership course (
              <Money money={leadershipCost} player={this.props.p} /> / sec)
            </>
          }
          tooltip={earnCharismaExpTooltip}
        />
      </div>
    );
  }
}
