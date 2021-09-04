/**
 * React Component for a panel that lets you purchase upgrades for a single
 * Duplicate Sleeve through The Covenant
 */
import * as React from "react";

import { CovenantSleeveMemoryUpgrade } from "./CovenantSleeveMemoryUpgrade";

import { Sleeve } from "../Sleeve";
import { IPlayer } from "../../IPlayer";

interface IProps {
  index: number;
  p: IPlayer;
  rerender: () => void;
  sleeve: Sleeve;
}

export class CovenantSleeveUpgrades extends React.Component<IProps, any> {
  render(): React.ReactNode {
    return (
      <div className={"bladeburner-action"}>
        <h1>Duplicate Sleeve {this.props.index}</h1>
        <CovenantSleeveMemoryUpgrade {...this.props} />
      </div>
    );
  }
}
