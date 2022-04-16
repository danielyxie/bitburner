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
import { CreateCorporationModal } from "../../Corporation/ui/modals/CreateCorporationModal";
import { LocationName } from "../data/LocationNames";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Factions } from "../../Faction/Factions";
import { joinFaction } from "../../Faction/FactionHelpers";

import { use } from "../../ui/Context";

import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { SnackbarEvents, ToastVariant } from "../../ui/React/Snackbar";
import { N00dles } from "../../utils/helpers/N00dles";
import { Exploit } from "../../Exploits/Exploit";
import { applyAugmentation } from "../../Augmentation/AugmentationHelpers";
import { CorruptableText } from "../../ui/React/CorruptableText";
import { HacknetNode } from "../../Hacknet/HacknetNode";
import { HacknetServer } from "../../Hacknet/HacknetServer";
import { GetServer } from "../../Server/AllServers";
import { ArcadeRoot } from "../../Arcade/ui/ArcadeRoot";
import { FactionNames } from "../../Faction/data/FactionNames";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";

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
    } else if (p.strength >= 100 && p.defense >= 100 && p.dexterity >= 100 && p.agility >= 100) {
      // Apply for Bladeburner division
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

  /**
   * Click handler for Resleeving button at New Tokyo VitaLife
   */
  function handleGrafting(): void {
    router.toGrafting();
  }

  function renderBladeburner(): React.ReactElement {
    if (!player.canAccessBladeburner()) {
      return <></>;
    }
    const text = inBladeburner ? "Enter Bladeburner Headquarters" : "Apply to Bladeburner Division";
    return (
      <>
        <br />
        <Button onClick={handleBladeburner}>{text}</Button>
      </>
    );
  }

  function renderNoodleBar(): React.ReactElement {
    function EatNoodles(): void {
      SnackbarEvents.emit("You ate some delicious noodles and feel refreshed", ToastVariant.SUCCESS, 2000);
      N00dles(); // This is the true power of the noodles.
      if (player.sourceFiles.length > 0) player.giveExploit(Exploit.N00dles);
      if (player.sourceFileLvl(5) > 0 || player.bitNodeN === 5) {
        player.intelligence_exp *= 1.0000000000000002;
      }
      player.hacking_exp *= 1.0000000000000002;
      player.strength_exp *= 1.0000000000000002;
      player.defense_exp *= 1.0000000000000002;
      player.agility_exp *= 1.0000000000000002;
      player.dexterity_exp *= 1.0000000000000002;
      player.charisma_exp *= 1.0000000000000002;
      for (const node of player.hacknetNodes) {
        if (node instanceof HacknetNode) {
          player.gainMoney(node.moneyGainRatePerSecond * 0.001, "other");
        } else {
          const server = GetServer(node);
          if (!(server instanceof HacknetServer)) throw new Error(`Server ${node} is not a hacknet server.`);
          player.hashManager.storeHashes(server.hashRate * 0.001);
        }
      }

      if (player.bladeburner) {
        player.bladeburner.rank += 0.00001;
      }

      if (player.corporation) {
        player.corporation.funds += player.corporation.revenue * 0.01;
      }
    }

    return (
      <>
        <br />
        <Button onClick={EatNoodles}>Eat noodles</Button>
      </>
    );
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

  function renderGrafting(): React.ReactElement {
    if (!player.canAccessGrafting()) {
      return <></>;
    }
    return (
      <Button onClick={handleGrafting} sx={{ my: 5 }}>
        Enter the secret lab
      </Button>
    );
  }

  function handleCotMG(): void {
    const faction = Factions[FactionNames.ChurchOfTheMachineGod];
    if (!player.factions.includes(FactionNames.ChurchOfTheMachineGod)) {
      joinFaction(faction);
    }
    if (
      !player.augmentations.some((a) => a.name === AugmentationNames.StaneksGift1) &&
      !player.queuedAugmentations.some((a) => a.name === AugmentationNames.StaneksGift1)
    ) {
      applyAugmentation({ name: AugmentationNames.StaneksGift1, level: 1 });
    }

    router.toStaneksGift();
  }

  function renderCotMG(): React.ReactElement {
    const toStanek = <Button onClick={() => router.toStaneksGift()}>Open Stanek's Gift</Button>;
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
    if (player.hasAugmentation(AugmentationNames.StaneksGift3, true)) {
      return (
        <>
          <Typography>
            <i>
              Allison "Mother" Stanek: ..can ...you hear them too ...? Come now, don't be shy and let me get a closer
              look at you. Yes wonderful, I see my creation has taken root without consquence or much ill effect it
              seems. Curious, Just how much of a machine's soul do you house in that body?
            </i>
          </Typography>
          <br />
          {toStanek}
          <br />
          {symbol}
        </>
      );
    }
    if (player.hasAugmentation(AugmentationNames.StaneksGift2, true)) {
      return (
        <>
          <Typography>
            <i>
              Allison "Mother" Stanek: I see you've taken to my creation. So much so it could hardly be recognized as
              one of my own after your tinkering with it. I see you follow the ways of the Machine God as I do, and your
              mastery of the gift clearly demonstrates that. My hopes are climbing by the day for you.
            </i>
          </Typography>
          <br />
          {toStanek}
          <br />
          {symbol}
        </>
      );
    }
    if (player.factions.includes(FactionNames.ChurchOfTheMachineGod)) {
      return (
        <>
          <Typography>
            <i>Allison "Mother" Stanek: Welcome back my child!</i>
          </Typography>
          <br />
          {toStanek}
          <br />
          {symbol}
        </>
      );
    }

    if (!player.canAccessCotMG()) {
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

    if (
      player.augmentations.filter((a) => a.name !== AugmentationNames.NeuroFluxGovernor).length > 0 ||
      player.queuedAugmentations.filter((a) => a.name !== AugmentationNames.NeuroFluxGovernor).length > 0
    ) {
      return (
        <>
          <Typography>
            <i>
              Allison "Mother" Stanek: Begone you filth! My gift must be the first modification that your body should
              have!
            </i>
          </Typography>
        </>
      );
    }

    return (
      <>
        <Typography>
          <i>
            Allison "Mother" Stanek: Welcome child, I see your body is pure. Are you ready to ascend beyond our human
            form? If you are, accept my gift.
          </i>
        </Typography>
        <Button onClick={handleCotMG}>Accept Stanek's Gift</Button>
        {symbol}
      </>
    );
  }

  function renderGlitch(): React.ReactElement {
    return (
      <>
        <Typography>
          <CorruptableText content={"An eerie aura surrounds this area. You feel you should leave."} />
        </Typography>
      </>
    );
  }

  switch (props.loc.name) {
    case LocationName.NewTokyoVitaLife: {
      return renderGrafting();
    }
    case LocationName.Sector12CityHall: {
      return (BitNodeMultipliers.CorporationSoftCap < 0.15 && <></>) || <CreateCorporation />;
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
    case LocationName.IshimaGlitch: {
      return renderGlitch();
    }
    case LocationName.NewTokyoArcade: {
      return <ArcadeRoot />;
    }
    default:
      console.error(`Location ${props.loc.name} doesn't have any special properties`);
      return <></>;
  }
}
