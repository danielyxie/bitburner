/**
 * React Subcomponent for displaying a location's UI, when that location is a slum
 *
 * This subcomponent renders all of the buttons for committing crimes
 */
import * as React from "react";

import { Crimes } from "../../Crime/Crimes";

import { numeralWrapper } from "../../ui/numeralFormat";
import { AutoupdatingStdButton } from "../../ui/React/AutoupdatingStdButton";
import { use } from "../../ui/Context";

export function SlumsLocation(): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  function shoplift(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Shoplift.commit(router, player);
  }

  function robStore(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.RobStore.commit(router, player);
  }

  function mug(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Mug.commit(router, player);
  }

  function larceny(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Larceny.commit(router, player);
  }

  function dealDrugs(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.DealDrugs.commit(router, player);
  }

  function bondForgery(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.BondForgery.commit(router, player);
  }

  function traffickArms(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.TraffickArms.commit(router, player);
  }

  function homicide(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Homicide.commit(router, player);
  }

  function grandTheftAuto(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.GrandTheftAuto.commit(router, player);
  }

  function kidnap(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Kidnap.commit(router, player);
  }

  function assassinate(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Assassination.commit(router, player);
  }

  function heist(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Heist.commit(router, player);
  }

  const shopliftChance = Crimes.Shoplift.successRate(player);
  const robStoreChance = Crimes.RobStore.successRate(player);
  const mugChance = Crimes.Mug.successRate(player);
  const larcenyChance = Crimes.Larceny.successRate(player);
  const drugsChance = Crimes.DealDrugs.successRate(player);
  const bondChance = Crimes.BondForgery.successRate(player);
  const armsChance = Crimes.TraffickArms.successRate(player);
  const homicideChance = Crimes.Homicide.successRate(player);
  const gtaChance = Crimes.GrandTheftAuto.successRate(player);
  const kidnapChance = Crimes.Kidnap.successRate(player);
  const assassinateChance = Crimes.Assassination.successRate(player);
  const heistChance = Crimes.Heist.successRate(player);

  return (
    <div>
      <AutoupdatingStdButton
        label={`Shoplift (${numeralWrapper.formatPercentage(shopliftChance)} chance of success)`}
        intervalTime={5e3}
        onClick={shoplift}
        style={{ display: "block" }}
        text={`Shoplift (${numeralWrapper.formatPercentage(shopliftChance)} chance of success)`}
        tooltip={"Attempt to shoplift from a low-end retailer"}
      />
      <AutoupdatingStdButton
        label={`Rob store (${numeralWrapper.formatPercentage(robStoreChance)} chance of success)`}
        intervalTime={5e3}
        onClick={robStore}
        style={{ display: "block" }}
        text={`Rob store (${numeralWrapper.formatPercentage(robStoreChance)} chance of success)`}
        tooltip={"Attempt to commit armed robbery on a high-end store"}
      />
      <AutoupdatingStdButton
        label={`Mug someone (${numeralWrapper.formatPercentage(mugChance)} chance of success)`}
        intervalTime={5e3}
        onClick={mug}
        style={{ display: "block" }}
        text={`Mug someone (${numeralWrapper.formatPercentage(mugChance)} chance of success)`}
        tooltip={"Attempt to mug a random person on the street"}
      />
      <AutoupdatingStdButton
        label={`Larceny (${numeralWrapper.formatPercentage(larcenyChance)} chance of success)`}
        intervalTime={5e3}
        onClick={larceny}
        style={{ display: "block" }}
        text={`Larceny (${numeralWrapper.formatPercentage(larcenyChance)} chance of success)`}
        tooltip={"Attempt to rob property from someone's house"}
      />
      <AutoupdatingStdButton
        label={`Deal Drugs (${numeralWrapper.formatPercentage(drugsChance)} chance of success)`}
        intervalTime={5e3}
        onClick={dealDrugs}
        style={{ display: "block" }}
        text={`Deal Drugs (${numeralWrapper.formatPercentage(drugsChance)} chance of success)`}
        tooltip={"Attempt to deal drugs"}
      />
      <AutoupdatingStdButton
        label={`Bond Forgery (${numeralWrapper.formatPercentage(bondChance)} chance of success)`}
        intervalTime={5e3}
        onClick={bondForgery}
        style={{ display: "block" }}
        text={`Bond Forgery (${numeralWrapper.formatPercentage(bondChance)} chance of success)`}
        tooltip={"Attempt to forge corporate bonds"}
      />
      <AutoupdatingStdButton
        label={`Traffick illegal Arms (${numeralWrapper.formatPercentage(armsChance)} chance of success)`}
        intervalTime={5e3}
        onClick={traffickArms}
        style={{ display: "block" }}
        text={`Traffick illegal Arms (${numeralWrapper.formatPercentage(armsChance)} chance of success)`}
        tooltip={"Attempt to smuggle illegal arms into the city"}
      />
      <AutoupdatingStdButton
        label={`Homicide (${numeralWrapper.formatPercentage(homicideChance)} chance of success)`}
        intervalTime={5e3}
        onClick={homicide}
        style={{ display: "block" }}
        text={`Homicide (${numeralWrapper.formatPercentage(homicideChance)} chance of success)`}
        tooltip={"Attempt to murder a random person on the street"}
      />
      <AutoupdatingStdButton
        label={`Grand theft Auto (${numeralWrapper.formatPercentage(gtaChance)} chance of success)`}
        intervalTime={5e3}
        onClick={grandTheftAuto}
        style={{ display: "block" }}
        text={`Grand theft Auto (${numeralWrapper.formatPercentage(gtaChance)} chance of success)`}
        tooltip={"Attempt to commit grand theft auto"}
      />
      <AutoupdatingStdButton
        label={`Kidnap and Ransom (${numeralWrapper.formatPercentage(kidnapChance)} chance of success)`}
        intervalTime={5e3}
        onClick={kidnap}
        style={{ display: "block" }}
        text={`Kidnap and Ransom (${numeralWrapper.formatPercentage(kidnapChance)} chance of success)`}
        tooltip={"Attempt to kidnap and ransom a high-profile-target"}
      />
      <AutoupdatingStdButton
        label={`Assassinate (${numeralWrapper.formatPercentage(assassinateChance)} chance of success)`}
        intervalTime={5e3}
        onClick={assassinate}
        style={{ display: "block" }}
        text={`Assassinate (${numeralWrapper.formatPercentage(assassinateChance)} chance of success)`}
        tooltip={"Attempt to assassinate a high-profile target"}
      />
      <AutoupdatingStdButton
        label={`Heist (${numeralWrapper.formatPercentage(heistChance)} chance of success)`}
        intervalTime={5e3}
        onClick={heist}
        style={{ display: "block" }}
        text={`Heist (${numeralWrapper.formatPercentage(heistChance)} chance of success)`}
        tooltip={"Attempt to pull off the ultimate heist"}
      />
    </div>
  );
}
