/**
 * Root React Component for displaying a Faction's UI.
 * This is the component for displaying a single faction's UI, not the list of all
 * accessible factions
 */
import React, { useState } from "react";

import { AugmentationsPage } from "./AugmentationsPage";
import { DonateOption } from "./DonateOption";
import { Info } from "./Info";
import { Option } from "./Option";

import { CONSTANTS } from "../../Constants";

import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { Faction } from "../../Faction/Faction";
import { createSleevePurchasesFromCovenantPopup } from "../../PersonObjects/Sleeve/SleeveCovenantPurchases";
import { SourceFileFlags } from "../../SourceFile/SourceFileFlags";

import { createPopup } from "../../ui/React/createPopup";
import { use } from "../../ui/Context";
import { CreateGangPopup } from "./CreateGangPopup";

type IProps = {
  faction: Faction;
};

// Info text for all options on the UI
const gangInfo = "Create and manage a gang for this Faction. Gangs will earn you money and " + "faction reputation";
const hackingMissionInfo =
  "Attempt a hacking mission for your faction. " +
  "A mission is a mini game that, if won, earns you " +
  "significant reputation with this faction. (Recommended hacking level: 200+)";
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

const GangNames = [
  "Slum Snakes",
  "Tetrads",
  "The Syndicate",
  "The Dark Army",
  "Speakers for the Dead",
  "NiteSec",
  "The Black Hand",
];

export function FactionRoot(props: IProps): React.ReactElement {
  const faction = props.faction;

  const player = use.Player();
  const router = use.Router();
  const [, setRerenderFlag] = useState(false);
  const [purchasingAugs, setPurchasingAugs] = useState(false);

  function manageGang(faction: Faction): void {
    // If player already has a gang, just go to the gang UI
    if (player.inGang()) {
      return router.toGang();
    }

    const popupId = "create-gang-popup";
    createPopup(popupId, CreateGangPopup, {
      popupId: popupId,
      facName: faction.name,
      player: player,
      router: router,
    });
  }

  function rerender(): void {
    setRerenderFlag((old) => !old);
  }

  // Route to the main faction page
  function routeToMain(): void {
    setPurchasingAugs(false);
  }

  // Route to the purchase augmentation UI for this faction
  function routeToPurchaseAugs(): void {
    setPurchasingAugs(true);
  }

  function sleevePurchases(): void {
    createSleevePurchasesFromCovenantPopup(player);
  }

  function startFieldWork(faction: Faction): void {
    player.startFactionFieldWork(router, faction);
  }

  function startHackingContracts(faction: Faction): void {
    player.startFactionHackWork(router, faction);
  }

  function startHackingMission(faction: Faction): void {
    player.singularityStopWork();
    router.toHackingMission(faction);
  }

  function startSecurityWork(faction: Faction): void {
    player.startFactionSecurityWork(router, faction);
  }

  function MainPage({ faction }: { faction: Faction }): React.ReactElement {
    const p = player;
    const factionInfo = faction.getInfo();

    // We have a special flag for whether the player this faction is the player's
    // gang faction because if the player has a gang, they cannot do any other action
    const isPlayersGang = p.inGang() && p.getGangName() === faction.name;

    // Flags for whether special options (gang, sleeve purchases, donate, etc.)
    // should be shown
    const favorToDonate = Math.floor(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
    const canDonate = faction.favor >= favorToDonate;

    const canPurchaseSleeves = faction.name === "The Covenant" && p.bitNodeN >= 10 && SourceFileFlags[10];

    let canAccessGang = p.canAccessGang() && GangNames.includes(faction.name);
    if (p.inGang()) {
      if (p.getGangName() !== faction.name) {
        canAccessGang = false;
      } else if (p.getGangName() === faction.name) {
        canAccessGang = true;
      }
    }

    return (
      <div className="faction-container">
        <h1>{faction.name}</h1>
        <Info faction={faction} factionInfo={factionInfo} />
        {canAccessGang && <Option buttonText={"Manage Gang"} infoText={gangInfo} onClick={() => manageGang(faction)} />}
        {!isPlayersGang && factionInfo.offerHackingMission && (
          <Option
            buttonText={"Hacking Mission"}
            infoText={hackingMissionInfo}
            onClick={() => startHackingMission(faction)}
          />
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
        <Option buttonText={"Purchase Augmentations"} infoText={augmentationsInfo} onClick={routeToPurchaseAugs} />
        {canPurchaseSleeves && (
          <Option
            buttonText={"Purchase & Upgrade Duplicate Sleeves"}
            infoText={sleevePurchasesInfo}
            onClick={sleevePurchases}
          />
        )}
      </div>
    );
  }

  return purchasingAugs ? (
    <AugmentationsPage faction={faction} routeToMainPage={routeToMain} />
  ) : (
    <MainPage faction={faction} />
  );
}
