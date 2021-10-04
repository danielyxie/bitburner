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
    <>
      <Tooltip title={<>Attempt to shoplift from a low-end retailer</>}>
        <Button onClick={shoplift}>
          Shoplift ({numeralWrapper.formatPercentage(shopliftChance)} chance of success)
        </Button>
      </Tooltip>
      <br />
      <Tooltip title={<>Attempt to commit armed robbery on a high-end store</>}>
        <Button onClick={robStore}>
          Rob store ({numeralWrapper.formatPercentage(robStoreChance)} chance of success)
        </Button>
      </Tooltip>
      <br />
      <Tooltip title={<>Attempt to mug a random person on the street</>}>
        <Button onClick={mug}>Mug someone ({numeralWrapper.formatPercentage(mugChance)} chance of success)</Button>
      </Tooltip>
      <br />
      <Tooltip title={<>Attempt to rob property from someone's house</>}>
        <Button onClick={larceny}>Larceny ({numeralWrapper.formatPercentage(larcenyChance)} chance of success)</Button>
      </Tooltip>
      <br />
      <Tooltip title={<>Attempt to deal drugs</>}>
        <Button onClick={dealDrugs}>
          Deal Drugs ({numeralWrapper.formatPercentage(drugsChance)} chance of success)
        </Button>
      </Tooltip>
      <br />
      <Tooltip title={<>Attempt to forge corporate bonds</>}>
        <Button onClick={bondForgery}>
          Bond Forgery ({numeralWrapper.formatPercentage(bondChance)} chance of success)
        </Button>
      </Tooltip>
      <br />
      <Tooltip title={<>Attempt to smuggle illegal arms into the city</>}>
        <Button onClick={traffickArms}>
          Traffick illegal Arms ({numeralWrapper.formatPercentage(armsChance)} chance of success)
        </Button>
      </Tooltip>
      <br />
      <Tooltip title={<>Attempt to murder a random person on the street</>}>
        <Button onClick={homicide}>
          Homicide ({numeralWrapper.formatPercentage(homicideChance)} chance of success)
        </Button>
      </Tooltip>
      <br />
      <Tooltip title={<>Attempt to commit grand theft auto</>}>
        <Button onClick={grandTheftAuto}>
          Grand theft Auto ({numeralWrapper.formatPercentage(gtaChance)} chance of success)
        </Button>
      </Tooltip>
      <br />
      <Tooltip title={<>Attempt to kidnap and ransom a high-profile-target</>}>
        <Button onClick={kidnap}>
          Kidnap and Ransom ({numeralWrapper.formatPercentage(kidnapChance)} chance of success)
        </Button>
      </Tooltip>
      <br />
      <Tooltip title={<>Attempt to assassinate a high-profile target</>}>
        <Button onClick={assassinate}>
          Assassinate ({numeralWrapper.formatPercentage(assassinateChance)} chance of success)
        </Button>
      </Tooltip>
      <br />
      <Tooltip title={<>Attempt to pull off the ultimate heist</>}>
        <Button onClick={heist}>Heist ({numeralWrapper.formatPercentage(heistChance)} chance of success)</Button>
      </Tooltip>
      <br />
    </>
  );
}
