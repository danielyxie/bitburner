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
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Location } from "../Location";
import { CreateCorporationModal } from "../../Corporation/ui/CreateCorporationModal";
import { LocationName } from "../data/LocationNames";

import { use } from "../../ui/Context";

import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { SnackbarEvents } from "../../ui/React/Snackbar";

type IProps = {
  loc: Location;
};

export function SpecialLocation(props: IProps): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const setRerender = useState(false)[1];
  const inBladeburner = player.inBladeburner();

  /**
   * Click handler for Bladeburner button at Sector-12 NSA
   */
  function handleBladeburner(): void {
    const p = player;
    if (p.inBladeburner()) {
      // Enter Bladeburner division
      router.toBladeburner();
    } else {
      // Apply for Bladeburner division
      if (p.strength >= 100 && p.defense >= 100 && p.dexterity >= 100 && p.agility >= 100) {
        p.startBladeburner({ new: true });
        dialogBoxCreate("You have been accepted into the Bladeburner division!");
        setRerender((old) => !old);

        const worldHeader = document.getElementById("world-menu-header");
        if (worldHeader instanceof HTMLElement) {
          worldHeader.click();
          worldHeader.click();
        }
      } else {
        dialogBoxCreate("Rejected! Please apply again when you have 100 of each combat stat (str, def, dex, agi)");
      }
    }
  }

  /**
   * Click handler for Resleeving button at New Tokyo VitaLife
   */
  function handleResleeving(): void {
    router.toResleeves();
  }

  function renderBladeburner(): React.ReactElement {
    if (!player.canAccessBladeburner()) {
      return <></>;
    }
    const text = inBladeburner ? "Enter Bladeburner Headquarters" : "Apply to Bladeburner Division";
    return <Button onClick={handleBladeburner}>{text}</Button>;
  }

  function renderNoodleBar(): React.ReactElement {
    function EatNoodles(): void {
      SnackbarEvents.emit("You ate some delicious noodles and feel refreshed", "success");
    }

    return <Button onClick={EatNoodles}>Eat noodles</Button>;
  }

  function CreateCorporation(): React.ReactElement {
    const [open, setOpen] = useState(false);
    if (!player.canAccessCorporation()) {
      return (
        <>
          <Typography>
            <i>A business man is yelling at a clerk. You should come back later.</i>
          </Typography>
        </>
      );
    }
    return (
      <>
        <Button disabled={!player.canAccessCorporation() || player.hasCorporation()} onClick={() => setOpen(true)}>
          Create a Corporation
        </Button>
        <CreateCorporationModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  function renderResleeving(): React.ReactElement {
    if (!player.canAccessResleeving()) {
      return <></>;
    }
    return <Button onClick={handleResleeving}>Re-Sleeve</Button>;
  }

  function renderCotMG(): React.ReactElement {
    // prettier-ignore
    const symbol = <Typography sx={{ lineHeight: '1em', whiteSpace: 'pre' }}>
      {"                 ``          "}<br />
      {"             -odmmNmds:      "}<br />
      {"           `hNmo:..-omNh.    "}<br />
      {"           yMd`      `hNh    "}<br />
      {"           mMd        oNm    "}<br />
      {"           oMNo      .mM/    "}<br />
      {"           `dMN+    -mM+     "}<br />
      {"            -mMNo  -mN+      "}<br />
      {"  .+-        :mMNo/mN/       "}<br />
      {":yNMd.        :NMNNN/        "}<br />
      {"-mMMMh.        /NMMh`        "}<br />
      {" .dMMMd.       /NMMMy`       "}<br />
      {"  `yMMMd.     /NNyNMMh`      "}<br />
      {"   `sMMMd.   +Nm: +NMMh.     "}<br />
      {"     oMMMm- oNm:   /NMMd.    "}<br />
      {"      +NMMmsMm-     :mMMd.   "}<br />
      {"       /NMMMm-       -mMMd.  "}<br />
      {"        /MMMm-        -mMMd. "}<br />
      {"       `sMNMMm-        .mMmo "}<br />
      {"      `sMd:hMMm.        ./.  "}<br />
      {"     `yMy` `yNMd`            "}<br />
      {"    `hMs`    oMMy            "}<br />
      {"   `hMh       sMN-           "}<br />
      {"   /MM-       .NMo           "}<br />
      {"   +MM:       :MM+           "}<br />
      {"    sNNo-.`.-omNy`           "}<br />
      {"     -smNNNNmdo-             "}<br />
      {"        `..`                 "}</Typography>

    return (
      <>
        <Typography>
          A decrepit altar stands in the middle of a dilapidated church.
          <br />
          <br />A symbol is carved in the altar.
        </Typography>
        <br />
        {symbol}
      </>
    );
  }

  switch (props.loc.name) {
    case LocationName.NewTokyoVitaLife: {
      return renderResleeving();
    }
    case LocationName.Sector12CityHall: {
      return <CreateCorporation />;
    }
    case LocationName.Sector12NSA: {
      return renderBladeburner();
    }
    case LocationName.NewTokyoNoodleBar: {
      return renderNoodleBar();
    }
    case LocationName.ChongqingChurchOfTheMachineGod: {
      return renderCotMG();
    }
    default:
      console.error(`Location ${props.loc.name} doesn't have any special properties`);
      return <></>;
  }
}
