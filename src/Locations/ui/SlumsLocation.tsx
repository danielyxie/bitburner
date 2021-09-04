/**
 * React Subcomponent for displaying a location's UI, when that location is a slum
 *
 * This subcomponent renders all of the buttons for committing crimes
 */
import * as React from "react";

import { Crimes } from "../../Crime/Crimes";
import { IPlayer } from "../../PersonObjects/IPlayer";

import { numeralWrapper } from "../../ui/numeralFormat";
import { AutoupdatingStdButton } from "../../ui/React/AutoupdatingStdButton";

type IProps = {
  p: IPlayer;
};

export class SlumsLocation extends React.Component<IProps, any> {
  /**
   * Stores button styling that sets them all to block display
   */
  btnStyle: any;

  constructor(props: IProps) {
    super(props);

    this.btnStyle = { display: "block" };

    this.shoplift = this.shoplift.bind(this);
    this.robStore = this.robStore.bind(this);
    this.mug = this.mug.bind(this);
    this.larceny = this.larceny.bind(this);
    this.dealDrugs = this.dealDrugs.bind(this);
    this.bondForgery = this.bondForgery.bind(this);
    this.traffickArms = this.traffickArms.bind(this);
    this.homicide = this.homicide.bind(this);
    this.grandTheftAuto = this.grandTheftAuto.bind(this);
    this.kidnap = this.kidnap.bind(this);
    this.assassinate = this.assassinate.bind(this);
    this.heist = this.heist.bind(this);
  }

  shoplift(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Shoplift.commit(this.props.p);
  }

  robStore(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.RobStore.commit(this.props.p);
  }

  mug(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Mug.commit(this.props.p);
  }

  larceny(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Larceny.commit(this.props.p);
  }

  dealDrugs(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.DealDrugs.commit(this.props.p);
  }

  bondForgery(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.BondForgery.commit(this.props.p);
  }

  traffickArms(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.TraffickArms.commit(this.props.p);
  }

  homicide(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Homicide.commit(this.props.p);
  }

  grandTheftAuto(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.GrandTheftAuto.commit(this.props.p);
  }

  kidnap(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Kidnap.commit(this.props.p);
  }

  assassinate(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Assassination.commit(this.props.p);
  }

  heist(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Heist.commit(this.props.p);
  }

  render(): React.ReactNode {
    const shopliftChance = Crimes.Shoplift.successRate(this.props.p);
    const robStoreChance = Crimes.RobStore.successRate(this.props.p);
    const mugChance = Crimes.Mug.successRate(this.props.p);
    const larcenyChance = Crimes.Larceny.successRate(this.props.p);
    const drugsChance = Crimes.DealDrugs.successRate(this.props.p);
    const bondChance = Crimes.BondForgery.successRate(this.props.p);
    const armsChance = Crimes.TraffickArms.successRate(this.props.p);
    const homicideChance = Crimes.Homicide.successRate(this.props.p);
    const gtaChance = Crimes.GrandTheftAuto.successRate(this.props.p);
    const kidnapChance = Crimes.Kidnap.successRate(this.props.p);
    const assassinateChance = Crimes.Assassination.successRate(this.props.p);
    const heistChance = Crimes.Heist.successRate(this.props.p);

    return (
      <div>
        <AutoupdatingStdButton
          intervalTime={5e3}
          onClick={this.shoplift}
          style={this.btnStyle}
          text={`Shoplift (${numeralWrapper.formatPercentage(
            shopliftChance,
          )} chance of success)`}
          tooltip={"Attempt to shoplift from a low-end retailer"}
        />
        <AutoupdatingStdButton
          intervalTime={5e3}
          onClick={this.robStore}
          style={this.btnStyle}
          text={`Rob store (${numeralWrapper.formatPercentage(
            robStoreChance,
          )} chance of success)`}
          tooltip={"Attempt to commit armed robbery on a high-end store"}
        />
        <AutoupdatingStdButton
          intervalTime={5e3}
          onClick={this.mug}
          style={this.btnStyle}
          text={`Mug someone (${numeralWrapper.formatPercentage(
            mugChance,
          )} chance of success)`}
          tooltip={"Attempt to mug a random person on the street"}
        />
        <AutoupdatingStdButton
          intervalTime={5e3}
          onClick={this.larceny}
          style={this.btnStyle}
          text={`Larceny (${numeralWrapper.formatPercentage(
            larcenyChance,
          )} chance of success)`}
          tooltip={"Attempt to rob property from someone's house"}
        />
        <AutoupdatingStdButton
          intervalTime={5e3}
          onClick={this.dealDrugs}
          style={this.btnStyle}
          text={`Deal Drugs (${numeralWrapper.formatPercentage(
            drugsChance,
          )} chance of success)`}
          tooltip={"Attempt to deal drugs"}
        />
        <AutoupdatingStdButton
          intervalTime={5e3}
          onClick={this.bondForgery}
          style={this.btnStyle}
          text={`Bond Forgery (${numeralWrapper.formatPercentage(
            bondChance,
          )} chance of success)`}
          tooltip={"Attempt to forge corporate bonds"}
        />
        <AutoupdatingStdButton
          intervalTime={5e3}
          onClick={this.traffickArms}
          style={this.btnStyle}
          text={`Traffick illegal Arms (${numeralWrapper.formatPercentage(
            armsChance,
          )} chance of success)`}
          tooltip={"Attempt to smuggle illegal arms into the city"}
        />
        <AutoupdatingStdButton
          intervalTime={5e3}
          onClick={this.homicide}
          style={this.btnStyle}
          text={`Homicide (${numeralWrapper.formatPercentage(
            homicideChance,
          )} chance of success)`}
          tooltip={"Attempt to murder a random person on the street"}
        />
        <AutoupdatingStdButton
          intervalTime={5e3}
          onClick={this.grandTheftAuto}
          style={this.btnStyle}
          text={`Grand theft Auto (${numeralWrapper.formatPercentage(
            gtaChance,
          )} chance of success)`}
          tooltip={"Attempt to commit grand theft auto"}
        />
        <AutoupdatingStdButton
          intervalTime={5e3}
          onClick={this.kidnap}
          style={this.btnStyle}
          text={`Kidnap and Ransom (${numeralWrapper.formatPercentage(
            kidnapChance,
          )} chance of success)`}
          tooltip={"Attempt to kidnap and ransom a high-profile-target"}
        />
        <AutoupdatingStdButton
          intervalTime={5e3}
          onClick={this.assassinate}
          style={this.btnStyle}
          text={`Assassinate (${numeralWrapper.formatPercentage(
            assassinateChance,
          )} chance of success)`}
          tooltip={"Attempt to assassinate a high-profile target"}
        />
        <AutoupdatingStdButton
          intervalTime={5e3}
          onClick={this.heist}
          style={this.btnStyle}
          text={`Heist (${numeralWrapper.formatPercentage(
            heistChance,
          )} chance of success)`}
          tooltip={"Attempt to pull off the ultimate heist"}
        />
      </div>
    );
  }
}
