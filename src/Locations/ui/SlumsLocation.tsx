/**
 * React Subcomponent for displaying a location's UI, when that location is a slum
 *
 * This subcomponent renders all of the buttons for committing crimes
 */
import * as React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { Crimes } from "../../Crime/Crimes";

import { numeralWrapper } from "../../ui/numeralFormat";
import { Router } from "../../ui/GameRoot";
import { Player } from "@player";
import { Box } from "@mui/material";

export function SlumsLocation(): React.ReactElement {
  function shoplift(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Shoplift.commit();
    Router.toWork();
    Player.focus = true;
  }

  function robStore(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.RobStore.commit();
    Router.toWork();
    Player.focus = true;
  }

  function mug(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Mug.commit();
    Router.toWork();
    Player.focus = true;
  }

  function larceny(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Larceny.commit();
    Router.toWork();
    Player.focus = true;
  }

  function dealDrugs(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.DealDrugs.commit();
    Router.toWork();
    Player.focus = true;
  }

  function bondForgery(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.BondForgery.commit();
    Router.toWork();
    Player.focus = true;
  }

  function traffickArms(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.TraffickArms.commit();
    Router.toWork();
    Player.focus = true;
  }

  function homicide(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Homicide.commit();
    Router.toWork();
    Player.focus = true;
  }

  function grandTheftAuto(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.GrandTheftAuto.commit();
    Router.toWork();
    Player.focus = true;
  }

  function kidnap(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Kidnap.commit();
    Router.toWork();
    Player.focus = true;
  }

  function assassinate(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Assassination.commit();
    Router.toWork();
    Player.focus = true;
  }

  function heist(e: React.MouseEvent<HTMLElement>): void {
    if (!e.isTrusted) {
      return;
    }
    Crimes.Heist.commit();
    Router.toWork();
    Player.focus = true;
  }

  const shopliftChance = Crimes.Shoplift.successRate(Player);
  const robStoreChance = Crimes.RobStore.successRate(Player);
  const mugChance = Crimes.Mug.successRate(Player);
  const larcenyChance = Crimes.Larceny.successRate(Player);
  const drugsChance = Crimes.DealDrugs.successRate(Player);
  const bondChance = Crimes.BondForgery.successRate(Player);
  const armsChance = Crimes.TraffickArms.successRate(Player);
  const homicideChance = Crimes.Homicide.successRate(Player);
  const gtaChance = Crimes.GrandTheftAuto.successRate(Player);
  const kidnapChance = Crimes.Kidnap.successRate(Player);
  const assassinateChance = Crimes.Assassination.successRate(Player);
  const heistChance = Crimes.Heist.successRate(Player);

  return (
    <Box sx={{ display: "grid", width: "fit-content" }}>
      <Tooltip title={<>Attempt to shoplift from a low-end retailer</>}>
        <Button onClick={shoplift}>
          Shoplift ({numeralWrapper.formatPercentage(shopliftChance)} chance of success)
        </Button>
      </Tooltip>
      <Tooltip title={<>Attempt to commit armed robbery on a high-end store</>}>
        <Button onClick={robStore}>
          Rob store ({numeralWrapper.formatPercentage(robStoreChance)} chance of success)
        </Button>
      </Tooltip>
      <Tooltip title={<>Attempt to mug a random person on the street</>}>
        <Button onClick={mug}>Mug someone ({numeralWrapper.formatPercentage(mugChance)} chance of success)</Button>
      </Tooltip>
      <Tooltip title={<>Attempt to rob property from someone's house</>}>
        <Button onClick={larceny}>Larceny ({numeralWrapper.formatPercentage(larcenyChance)} chance of success)</Button>
      </Tooltip>
      <Tooltip title={<>Attempt to deal drugs</>}>
        <Button onClick={dealDrugs}>
          Deal Drugs ({numeralWrapper.formatPercentage(drugsChance)} chance of success)
        </Button>
      </Tooltip>
      <Tooltip title={<>Attempt to forge corporate bonds</>}>
        <Button onClick={bondForgery}>
          Bond Forgery ({numeralWrapper.formatPercentage(bondChance)} chance of success)
        </Button>
      </Tooltip>
      <Tooltip title={<>Attempt to smuggle illegal arms into the city</>}>
        <Button onClick={traffickArms}>
          Traffick illegal Arms ({numeralWrapper.formatPercentage(armsChance)} chance of success)
        </Button>
      </Tooltip>
      <Tooltip title={<>Attempt to murder a random person on the street</>}>
        <Button onClick={homicide}>
          Homicide ({numeralWrapper.formatPercentage(homicideChance)} chance of success)
        </Button>
      </Tooltip>
      <Tooltip title={<>Attempt to commit grand theft auto</>}>
        <Button onClick={grandTheftAuto}>
          Grand theft Auto ({numeralWrapper.formatPercentage(gtaChance)} chance of success)
        </Button>
      </Tooltip>
      <Tooltip title={<>Attempt to kidnap and ransom a high-profile-target</>}>
        <Button onClick={kidnap}>
          Kidnap and Ransom ({numeralWrapper.formatPercentage(kidnapChance)} chance of success)
        </Button>
      </Tooltip>
      <Tooltip title={<>Attempt to assassinate a high-profile target</>}>
        <Button onClick={assassinate}>
          Assassinate ({numeralWrapper.formatPercentage(assassinateChance)} chance of success)
        </Button>
      </Tooltip>
      <Tooltip title={<>Attempt to pull off the ultimate heist</>}>
        <Button onClick={heist}>Heist ({numeralWrapper.formatPercentage(heistChance)} chance of success)</Button>
      </Tooltip>
    </Box>
  );
}
