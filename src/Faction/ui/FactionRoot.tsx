/**
 * Root React Component for displaying a Faction's UI.
 * This is the component for displaying a single faction's UI, not the list of all
 * accessible factions
 */
import React, { useState, useEffect } from "react";

import { AugmentationsPage } from "./AugmentationsPage";
import { DonateOption } from "./DonateOption";
import { Info } from "./Info";
import { Option } from "./Option";

import { CONSTANTS } from "../../Constants";

import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { Faction } from "../Faction";

import { use } from "../../ui/Context";
import { CreateGangModal } from "./CreateGangModal";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { CovenantPurchasesRoot } from "../../PersonObjects/Sleeve/ui/CovenantPurchasesRoot";
import { FactionNames } from "../data/FactionNames";
import { GangConstants } from "../../Gang/data/Constants";

type IProps = {
  faction: Faction;
  augPage: boolean;
};

// Info text for all options on the UI
const gangInfo = "Create and manage a gang for this Faction. Gangs will earn you money and faction reputation";
const hackingContractsInfo =
  "Complete hacking contracts for your faction. " +
  "Your effectiveness, which determines how much " +
  "reputation you gain for this faction, is based on your hacking skill. " +
  "You will gain hacking exp.";
const fieldWorkInfo =
  "Carry out field missions for your faction. " +
  "Your effectiveness, which determines how much " +
  "reputation you gain for this faction, is based on all of your stats. " +
  "You will gain exp for all stats.";
const securityWorkInfo =
  "Serve in a security detail for your faction. " +
  "Your effectiveness, which determines how much " +
  "reputation you gain for this faction, is based on your combat stats. " +
  "You will gain exp for all combat stats.";
const augmentationsInfo =
  "As your reputation with this faction rises, you will " +
  "unlock Augmentations, which you can purchase to enhance " +
  "your abilities.";
const sleevePurchasesInfo = "Purchase Duplicate Sleeves and upgrades. These are permanent!";

interface IMainProps {
  faction: Faction;
  rerender: () => void;
  onAugmentations: () => void;
}

function MainPage({ faction, rerender, onAugmentations }: IMainProps): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const [sleevesOpen, setSleevesOpen] = useState(false);
  const [gangOpen, setGangOpen] = useState(false);
  const factionInfo = faction.getInfo();

  function manageGang(): void {
    // If player already has a gang, just go to the gang UI
    if (player.inGang()) {
      return router.toGang();
    }

    setGangOpen(true);
  }

  function startWork(): void {
    player.startFocusing();
    router.toWork();
  }

  function startFieldWork(faction: Faction): void {
    player.startFactionFieldWork(faction);
    startWork();
  }

  function startHackingContracts(faction: Faction): void {
    player.startFactionHackWork(faction);
    startWork();
  }

  function startSecurityWork(faction: Faction): void {
    player.startFactionSecurityWork(faction);
    startWork();
  }

  // We have a special flag for whether the player this faction is the player's
  // gang faction because if the player has a gang, they cannot do any other action
  const isPlayersGang = player.inGang() && player.getGangName() === faction.name;

  // Flags for whether special options (gang, sleeve purchases, donate, etc.)
  // should be shown
  const favorToDonate = Math.floor(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
  const canDonate = faction.favor >= favorToDonate;

  const canPurchaseSleeves = faction.name === FactionNames.TheCovenant && player.bitNodeN === 10;

  let canAccessGang = player.canAccessGang() && GangConstants.Names.includes(faction.name);
  if (player.inGang()) {
    if (player.getGangName() !== faction.name) {
      canAccessGang = false;
    } else if (player.getGangName() === faction.name) {
      canAccessGang = true;
    }
  }

  return (
    <>
      <Button onClick={() => router.toFactions()}>Back</Button>
      <Typography variant="h4" color="primary">
        {faction.name}
      </Typography>
      <Info faction={faction} factionInfo={factionInfo} />
      {canAccessGang && (
        <>
          <Option buttonText={"Manage Gang"} infoText={gangInfo} onClick={manageGang} />
          <CreateGangModal facName={faction.name} open={gangOpen} onClose={() => setGangOpen(false)} />
        </>
      )}
      {!isPlayersGang && factionInfo.offerHackingWork && (
        <Option
          buttonText={"Hacking Contracts"}
          infoText={hackingContractsInfo}
          onClick={() => startHackingContracts(faction)}
        />
      )}
      {!isPlayersGang && factionInfo.offerFieldWork && (
        <Option buttonText={"Field Work"} infoText={fieldWorkInfo} onClick={() => startFieldWork(faction)} />
      )}
      {!isPlayersGang && factionInfo.offerSecurityWork && (
        <Option buttonText={"Security Work"} infoText={securityWorkInfo} onClick={() => startSecurityWork(faction)} />
      )}
      {!isPlayersGang && factionInfo.offersWork() && (
        <DonateOption
          faction={faction}
          p={player}
          rerender={rerender}
          favorToDonate={favorToDonate}
          disabled={!canDonate}
        />
      )}
      <Option buttonText={"Purchase Augmentations"} infoText={augmentationsInfo} onClick={onAugmentations} />
      {canPurchaseSleeves && (
        <>
          <Option
            buttonText={"Purchase & Upgrade Duplicate Sleeves"}
            infoText={sleevePurchasesInfo}
            onClick={() => setSleevesOpen(true)}
          />
          <CovenantPurchasesRoot open={sleevesOpen} onClose={() => setSleevesOpen(false)} />
        </>
      )}
    </>
  );
}

export function FactionRoot(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  const player = use.Player();
  const router = use.Router();
  const [purchasingAugs, setPurchasingAugs] = useState(props.augPage);

  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);

  const faction = props.faction;

  if (player && !player.factions.includes(faction.name)) {
    return (
      <>
        <Typography variant="h4" color="primary">
          You have not joined {faction.name} yet!
        </Typography>
        <Button onClick={() => router.toFactions()}>Back to Factions</Button>
      </>
    );
  }

  return purchasingAugs ? (
    <AugmentationsPage faction={faction} routeToMainPage={() => setPurchasingAugs(false)} />
  ) : (
    <MainPage rerender={rerender} faction={faction} onAugmentations={() => setPurchasingAugs(true)} />
  );
}
