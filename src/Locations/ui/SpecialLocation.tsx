/**
 * React Subcomponent for displaying a location's UI, when that location has special
 * actions/options/properties
 *
 * Examples:
 *      - Bladeburner @ NSA
 *      - Re-sleeving @ VitaLife
 *      - Create Corporation @ City Hall
 *
 * This subcomponent creates all of the buttons for interacting with those special
 * properties
 */
import * as React from "react";

import { Location } from "../Location";
import { createStartCorporationPopup } from "../LocationsHelpers";
import { LocationName } from "../data/LocationNames";

import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";

import { AutoupdatingStdButton } from "../../ui/React/AutoupdatingStdButton";
import { StdButton } from "../../ui/React/StdButton";

import { dialogBoxCreate } from "../../../utils/DialogBox";

type IProps = {
  engine: IEngine;
  loc: Location;
  p: IPlayer;
};

type IState = {
  inBladeburner: boolean;
};

export class SpecialLocation extends React.Component<IProps, IState> {
  /**
   * Stores button styling that sets them all to block display
   */
  btnStyle: any;

  constructor(props: IProps) {
    super(props);

    this.btnStyle = { display: "block" };

    this.renderNoodleBar = this.renderNoodleBar.bind(this);
    this.createCorporationPopup = this.createCorporationPopup.bind(this);
    this.handleBladeburner = this.handleBladeburner.bind(this);
    this.handleResleeving = this.handleResleeving.bind(this);

    this.state = {
      inBladeburner: this.props.p.inBladeburner(),
    };
  }

  /**
   * Click handler for "Create Corporation" button at Sector-12 City Hall
   */
  createCorporationPopup(): void {
    createStartCorporationPopup(this.props.p);
  }

  /**
   * Click handler for Bladeburner button at Sector-12 NSA
   */
  handleBladeburner(): void {
    const p = this.props.p;
    if (p.inBladeburner()) {
      // Enter Bladeburner division
      this.props.engine.loadBladeburnerContent();
    } else {
      // Apply for Bladeburner division
      if (
        p.strength >= 100 &&
        p.defense >= 100 &&
        p.dexterity >= 100 &&
        p.agility >= 100
      ) {
        p.startBladeburner({ new: true });
        dialogBoxCreate(
          "You have been accepted into the Bladeburner division!",
        );
        this.setState({
          inBladeburner: true,
        });

        const worldHeader = document.getElementById("world-menu-header");
        if (worldHeader instanceof HTMLElement) {
          worldHeader.click();
          worldHeader.click();
        }
      } else {
        dialogBoxCreate(
          "Rejected! Please apply again when you have 100 of each combat stat (str, def, dex, agi)",
        );
      }
    }
  }

  /**
   * Click handler for Resleeving button at New Tokyo VitaLife
   */
  handleResleeving(): void {
    this.props.engine.loadResleevingContent();
  }

  renderBladeburner(): React.ReactNode {
    if (!this.props.p.canAccessBladeburner()) {
      return null;
    }
    const text = this.state.inBladeburner
      ? "Enter Bladeburner Headquarters"
      : "Apply to Bladeburner Division";
    return (
      <StdButton
        onClick={this.handleBladeburner}
        style={this.btnStyle}
        text={text}
      />
    );
  }

  renderNoodleBar(): React.ReactNode {
    function EatNoodles(): void {
      dialogBoxCreate(<>You ate some delicious noodles and feel refreshed.</>);
    }

    return (
      <StdButton
        onClick={EatNoodles}
        style={this.btnStyle}
        text={"Eat noodles"}
      />
    );
  }

  renderCreateCorporation(): React.ReactNode {
    if (!this.props.p.canAccessCorporation()) {
      return (
        <>
          <p>
            <i>
              A business man is yelling at a clerk. You should come back later.
            </i>
          </p>
        </>
      );
    }
    return (
      <AutoupdatingStdButton
        disabled={
          !this.props.p.canAccessCorporation() || this.props.p.hasCorporation()
        }
        onClick={this.createCorporationPopup}
        style={this.btnStyle}
        text={"Create a Corporation"}
      />
    );
  }

  renderResleeving(): React.ReactNode {
    if (!this.props.p.canAccessResleeving()) {
      return null;
    }
    return (
      <StdButton
        onClick={this.handleResleeving}
        style={this.btnStyle}
        text={"Re-Sleeve"}
      />
    );
  }

  render(): React.ReactNode {
    switch (this.props.loc.name) {
      case LocationName.NewTokyoVitaLife: {
        return this.renderResleeving();
      }
      case LocationName.Sector12CityHall: {
        return this.renderCreateCorporation();
      }
      case LocationName.Sector12NSA: {
        return this.renderBladeburner();
      }
      case LocationName.NewTokyoNoodleBar: {
        return this.renderNoodleBar();
      }
      default:
        console.error(
          `Location ${this.props.loc.name} doesn't have any special properties`,
        );
        break;
    }
  }
}
