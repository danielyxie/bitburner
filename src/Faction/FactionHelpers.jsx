import React from "react";
import ReactDOM from "react-dom";

import { FactionRoot } from "./ui/Root";

import { Augmentations } from "../Augmentation/Augmentations";
import { isRepeatableAug } from "../Augmentation/AugmentationHelpers";
import { PlayerOwnedAugmentation } from "../Augmentation/PlayerOwnedAugmentation";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../Constants";
import { Engine } from "../engine";
import { Faction } from "./Faction";
import { Factions } from "./Factions";
import { HackingMission, setInMission } from "../Missions";
import { Player } from "../Player";
import { Settings } from "../Settings/Settings";
import { 
    getHackingWorkRepGain,
    getFactionSecurityWorkRepGain,
    getFactionFieldWorkRepGain,
} from "../PersonObjects/formulas/reputation";

import { Page, routing } from "../ui/navigationTracking";
import { dialogBoxCreate } from "../../utils/DialogBox";
import { factionInvitationBoxCreate } from "../../utils/FactionInvitationBox";
import { Money } from "../ui/React/Money";
import {
    yesNoBoxCreate,
    yesNoBoxGetYesButton,
    yesNoBoxGetNoButton,
    yesNoBoxClose,
} from "../../utils/YesNoBox";

export function inviteToFaction(faction) {
    if (Settings.SuppressFactionInvites) {
        faction.alreadyInvited = true;
        Player.factionInvitations.push(faction.name);
        if (routing.isOn(Page.Factions)) {
            Engine.loadFactionsContent();
        }
    } else {
        factionInvitationBoxCreate(faction);
    }
}

export function joinFaction(faction) {
	faction.isMember = true;
    Player.factions.push(faction.name);
    const factionInfo = faction.getInfo();

    //Determine what factions you are banned from now that you have joined this faction
    for(const i in factionInfo.enemies) {
        const enemy = factionInfo.enemies[i];
        if (Factions[enemy] instanceof Faction) {
            Factions[enemy].isBanned = true;
        }
    }
}

export function startHackingMission(faction) {
    const mission = new HackingMission(faction.playerReputation, faction);
    setInMission(true, mission); //Sets inMission flag to true
    mission.init();
}

//Displays the HTML content for a specific faction
export function displayFactionContent(factionName, initiallyOnAugmentationsPage=false) {
    const faction = Factions[factionName];
    if (faction == null) {
        throw new Error(`Invalid factionName passed into displayFactionContent(): ${factionName}`);
    }

    if (!faction.isMember) {
        throw new Error(`Not a member of this faction. Cannot display faction information`);
    }

    ReactDOM.render(
        <FactionRoot
            engine={Engine}
            initiallyOnAugmentationsPage={initiallyOnAugmentationsPage}
            faction={faction}
            p={Player}
            startHackingMissionFn={startHackingMission}
        />,
        Engine.Display.factionContent,
    )
}


export function purchaseAugmentationBoxCreate(aug, fac) {
    const factionInfo = fac.getInfo();

    const yesBtn = yesNoBoxGetYesButton();
    yesBtn.innerHTML = "Purchase";
    yesBtn.addEventListener("click", function() {
        if (!isRepeatableAug(aug) && Player.hasAugmentation(aug)) {
            return;
        }

        purchaseAugmentation(aug, fac);
        yesNoBoxClose();
    });

    const noBtn = yesNoBoxGetNoButton();
    noBtn.innerHTML = "Cancel";
    noBtn.addEventListener("click", function() {
        yesNoBoxClose();
    });

    yesNoBoxCreate(<>
        <h2>{aug.name}</h2><br />
<div dangerouslySetInnerHTML={{__html: aug.info}}></div><br /><br />
<br />Would you like to purchase the {aug.name} Augmentation for&nbsp;
{Money(aug.baseCost * factionInfo.augmentationPriceMult)}?
    </>);
}

//Returns a boolean indicating whether the player has the prerequisites for the
//specified Augmentation
export function hasAugmentationPrereqs(aug) {
    let hasPrereqs = true;
    if (aug.prereqs && aug.prereqs.length > 0) {
        for (let i = 0; i < aug.prereqs.length; ++i) {
            const prereqAug = Augmentations[aug.prereqs[i]];
            if (prereqAug == null) {
                console.error(`Invalid prereq Augmentation ${aug.prereqs[i]}`);
                continue;
            }
            if (prereqAug.owned === false) {
                hasPrereqs = false;

                // Check if the aug is purchased
                for (let j = 0; j < Player.queuedAugmentations.length; ++j) {
                    if (Player.queuedAugmentations[j].name === prereqAug.name) {
                        hasPrereqs = true;
                        break;
                    }
                }
            }
        }
    }

    return hasPrereqs;
}

export function purchaseAugmentation(aug, fac, sing=false) {
    const factionInfo = fac.getInfo();
    var hasPrereqs = hasAugmentationPrereqs(aug);
    if (!hasPrereqs) {
        var txt = "You must first purchase or install " + aug.prereqs.join(",") + " before you can " +
                  "purchase this one.";
        if (sing) {return txt;} else {dialogBoxCreate(txt);}
    } else if (aug.baseCost !== 0 && Player.money.lt(aug.baseCost * factionInfo.augmentationPriceMult)) {
        let txt = "You don't have enough money to purchase " + aug.name;
        if (sing) {return txt;}
        dialogBoxCreate(txt);
    } else if (fac.playerReputation < aug.baseRepRequirement) {
        let txt = "You don't have enough faction reputation to purchase " + aug.name;
        if (sing) {return txt;}
        dialogBoxCreate(txt);
    } else if (aug.baseCost === 0 || Player.money.gte(aug.baseCost * factionInfo.augmentationPriceMult)) {
        if (Player.firstAugPurchased === false) {
            Player.firstAugPurchased = true;
            document.getElementById("augmentations-tab").style.display = "list-item";
            document.getElementById("character-menu-header").click();
            document.getElementById("character-menu-header").click();
        }

        var queuedAugmentation = new PlayerOwnedAugmentation(aug.name);
        if (aug.name == AugmentationNames.NeuroFluxGovernor) {
            queuedAugmentation.level = getNextNeurofluxLevel();
        }
        Player.queuedAugmentations.push(queuedAugmentation);

        Player.loseMoney((aug.baseCost * factionInfo.augmentationPriceMult));

        // If you just purchased Neuroflux Governor, recalculate the cost
        if (aug.name == AugmentationNames.NeuroFluxGovernor) {
            var nextLevel = getNextNeurofluxLevel();
            --nextLevel;
            var mult = Math.pow(CONSTANTS.NeuroFluxGovernorLevelMult, nextLevel);
            aug.baseRepRequirement = 500 * mult * CONSTANTS.AugmentationRepMultiplier * BitNodeMultipliers.AugmentationRepCost;
            aug.baseCost = 750e3 * mult * CONSTANTS.AugmentationCostMultiplier * BitNodeMultipliers.AugmentationMoneyCost;

            for (var i = 0; i < Player.queuedAugmentations.length-1; ++i) {
                aug.baseCost *= CONSTANTS.MultipleAugMultiplier;
            }
        }

        for (var name in Augmentations) {
            if (Augmentations.hasOwnProperty(name)) {
                Augmentations[name].baseCost *= CONSTANTS.MultipleAugMultiplier;
            }
        }

        if (sing) {
            return "You purchased " + aug.name;
        } else {
            if(!Settings.SuppressBuyAugmentationConfirmation){
                dialogBoxCreate("You purchased "  + aug.name + ". It's enhancements will not take " +
                                "effect until they are installed. To install your augmentations, go to the " +
                                "'Augmentations' tab on the left-hand navigation menu. Purchasing additional " +
                                "augmentations will now be more expensive.");
            }
        }

        // Force a rerender of the Augmentations page
        displayFactionContent(fac.name, true);
    } else {
        dialogBoxCreate("Hmm, something went wrong when trying to purchase an Augmentation. " +
                        "Please report this to the game developer with an explanation of how to " +
                        "reproduce this.");
    }
}

export function getNextNeurofluxLevel() {
    // Get current Neuroflux level based on Player's augmentations
    let currLevel = 0;
    for (var i = 0; i < Player.augmentations.length; ++i) {
        if (Player.augmentations[i].name === AugmentationNames.NeuroFluxGovernor) {
            currLevel = Player.augmentations[i].level;
        }
    }

    // Account for purchased but uninstalled Augmentations
    for (var i = 0; i < Player.queuedAugmentations.length; ++i) {
        if (Player.queuedAugmentations[i].name == AugmentationNames.NeuroFluxGovernor) {
            ++currLevel;
        }
    }
    return currLevel + 1;
}

export function processPassiveFactionRepGain(numCycles) {
    for (const name in Factions) {
        if (name === Player.currentWorkFactionName) continue;
        if (!Factions.hasOwnProperty(name)) continue;
        const faction = Factions[name];
        if (!faction.isMember) continue;
        // No passive rep for special factions
        const info = faction.getInfo();
        if(!info.offersWork()) continue;
        // No passive rep for gangs.
        if(Player.getGangName() === name) continue;
        // 0 favor = 1%/s
        // 50 favor = 6%/s
        // 100 favor = 11%/s
        const favorMult = Math.min(0.1, (faction.favor / 1000) + 0.01);
        // Find the best of all possible favor gain, minimum 1 rep / 2 minute.
        const hRep = getHackingWorkRepGain(Player, faction);
        const sRep = getFactionSecurityWorkRepGain(Player, faction);
        const fRep = getFactionFieldWorkRepGain(Player, faction);
        const rate = Math.max(hRep * favorMult, sRep * favorMult, fRep * favorMult, 1/120);

        faction.playerReputation += rate *
            (numCycles) *
            Player.faction_rep_mult *
            BitNodeMultipliers.FactionPassiveRepGain;
    }
}
