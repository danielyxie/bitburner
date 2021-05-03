/**
 * Root React Component for displaying a Faction's UI.
 * This is the component for displaying a single faction's UI, not the list of all
 * accessible factions
 */
import * as React from "react";

import { AugmentationsPage } from "./AugmentationsPage";
import { DonateOption } from "./DonateOption";
import { Info } from "./Info";
import { Option } from "./Option";

import { CONSTANTS } from "../../Constants";
import { IEngine } from "../../IEngine";

import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { Faction } from "../../Faction/Faction";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { createSleevePurchasesFromCovenantPopup } from "../../PersonObjects/Sleeve/SleeveCovenantPurchases";
import { SourceFileFlags } from "../../SourceFile/SourceFileFlags";

import {
    yesNoBoxClose,
    yesNoBoxCreate,
    yesNoBoxGetNoButton,
    yesNoBoxGetYesButton,
} from "../../../utils/YesNoBox";

type IProps = {
    engine: IEngine;
    initiallyOnAugmentationsPage?: boolean;
    faction: Faction;
    p: IPlayer;
    startHackingMissionFn: (faction: Faction) => void;
}

type IState = {
    rerenderFlag: boolean;
    purchasingAugs: boolean;
}

// Info text for all options on the UI
const gangInfo = "Create and manage a gang for this Faction. Gangs will earn you money and " +
                 "faction reputation";
const hackingMissionInfo = "Attempt a hacking mission for your faction. " +
                           "A mission is a mini game that, if won, earns you " +
                           "significant reputation with this faction. (Recommended hacking level: 200+)";
const hackingContractsInfo = "Complete hacking contracts for your faction. " +
                             "Your effectiveness, which determines how much " +
                             "reputation you gain for this faction, is based on your hacking skill. " +
                             "You will gain hacking exp.";
const fieldWorkInfo = "Carry out field missions for your faction. " +
                      "Your effectiveness, which determines how much " +
                      "reputation you gain for this faction, is based on all of your stats. " +
                      "You will gain exp for all stats.";
const securityWorkInfo = "Serve in a security detail for your faction. " +
                         "Your effectiveness, which determines how much " +
                         "reputation you gain for this faction, is based on your combat stats. " +
                         "You will gain exp for all combat stats.";
const augmentationsInfo = "As your reputation with this faction rises, you will " +
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

export class FactionRoot extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            rerenderFlag: false,
            purchasingAugs: props.initiallyOnAugmentationsPage ? props.initiallyOnAugmentationsPage : false,
        }

        this.manageGang = this.manageGang.bind(this);
        this.rerender = this.rerender.bind(this);
        this.routeToMain = this.routeToMain.bind(this);
        this.routeToPurchaseAugs = this.routeToPurchaseAugs.bind(this);
        this.sleevePurchases = this.sleevePurchases.bind(this);
        this.startFieldWork = this.startFieldWork.bind(this);
        this.startHackingContracts = this.startHackingContracts.bind(this);
        this.startHackingMission = this.startHackingMission.bind(this);
        this.startSecurityWork = this.startSecurityWork.bind(this);
    }

    manageGang(): void {
        // If player already has a gang, just go to the gang UI
        if (this.props.p.inGang()) {
            return this.props.engine.loadGangContent();
        }

        // Otherwise, we have to create the gang
        const facName = this.props.faction.name;
        let isHacking = false;
        if (facName === "NiteSec" || facName === "The Black Hand") {
            isHacking = true;
        }

        // A Yes/No popup box will allow the player to confirm gang creation
        const yesBtn = yesNoBoxGetYesButton();
        const noBtn = yesNoBoxGetNoButton();
        if (yesBtn == null || noBtn == null) { return; }

        yesBtn.innerHTML = "Create Gang";
        yesBtn.addEventListener("click", () => {
            this.props.p.startGang(facName, isHacking);
            const worldMenuHeader = document.getElementById("world-menu-header");
            if (worldMenuHeader instanceof HTMLElement) {
                worldMenuHeader.click(); worldMenuHeader.click();
            }

            this.props.engine.loadGangContent();
            yesNoBoxClose();
        });

        noBtn.innerHTML = "Cancel";
        noBtn.addEventListener("click", () => {
            yesNoBoxClose();
        });

        // Pop-up text
        let gangTypeText = "";
        if (isHacking) {
            gangTypeText = "This is a HACKING gang. Members in this gang will have different tasks than COMBAT gangs. " +
                           "Compared to combat gangs, progression with hacking gangs is more straightforward as territory warfare " +
                           "is not as important.<br><br>";
        } else {
            gangTypeText = "This is a COMBAT gang. Members in this gang will have different tasks than HACKING gangs. " +
                           "Compared to hacking gangs, progression with combat gangs can be more difficult as territory management " +
                           "is more important. However, well-managed combat gangs can progress faster than hacking ones.<br><br>";
        }
        yesNoBoxCreate(`Would you like to create a new Gang with ${facName}?<br><br>` +
                       "Note that this will prevent you from creating a Gang with any other Faction until " +
                       "this BitNode is destroyed. It also resets your reputation with this faction.<br><br>" +
                       gangTypeText +
                       "Other than hacking vs combat, there are NO differences between the Factions you can " +
                       "create a Gang with, and each of these Factions have all Augmentations available.");
    }

    rerender(): void {
        this.setState((prevState) => {
            return {
                rerenderFlag: !prevState.rerenderFlag,
            }
        });
    }

    // Route to the main faction page
    routeToMain(): void {
        this.setState({ purchasingAugs: false });
    }

    // Route to the purchase augmentation UI for this faction
    routeToPurchaseAugs(): void {
        this.setState({ purchasingAugs: true });
    }

    sleevePurchases(): void {
        createSleevePurchasesFromCovenantPopup(this.props.p);
    }

    startFieldWork(): void {
        this.props.p.startFactionFieldWork(this.props.faction);
    }

    startHackingContracts(): void {
        this.props.p.startFactionHackWork(this.props.faction);
    }

    startHackingMission(): void {
        const fac = this.props.faction;
        this.props.engine.loadMissionContent();
        this.props.startHackingMissionFn(fac);
    }

    startSecurityWork(): void {
        this.props.p.startFactionSecurityWork(this.props.faction);
    }

    render(): React.ReactNode {
        return this.state.purchasingAugs ? this.renderAugmentationsPage() : this.renderMainPage();
    }

    renderMainPage(): React.ReactNode {
        const p = this.props.p;
        const faction = this.props.faction;
        const factionInfo = faction.getInfo();

        // We have a special flag for whether the player this faction is the player's
        // gang faction because if the player has a gang, they cannot do any other action
        const isPlayersGang = p.inGang() && (p.getGangName() === faction.name);


        // Flags for whether special options (gang, sleeve purchases, donate, etc.)
        // should be shown
        const favorToDonate = Math.floor(CONSTANTS.BaseFavorToDonate * BitNodeMultipliers.RepToDonateToFaction);
        const canDonate = faction.favor >= favorToDonate;

        const canPurchaseSleeves = (faction.name === "The Covenant" && p.bitNodeN >= 10 && SourceFileFlags[10]);

        let canAccessGang = (p.canAccessGang() && GangNames.includes(faction.name));
        if (p.inGang()) {
            if (p.getGangName() !== faction.name) {
                canAccessGang = false;
            } else if (p.getGangName() === faction.name) {
                canAccessGang = true;
            }
        }

        return (
            <div>
                <h1>{faction.name}</h1>
                <Info
                    faction={faction}
                    factionInfo={factionInfo}
                />
                {
                    canAccessGang &&
                    <Option
                        buttonText={"Manage Gang"}
                        infoText={gangInfo}
                        onClick={this.manageGang}
                    />
                }
                {
                    (!isPlayersGang && factionInfo.offerHackingMission) &&
                    <Option
                        buttonText={"Hacking Mission"}
                        infoText={hackingMissionInfo}
                        onClick={this.startHackingMission}
                    />
                }
                {
                    (!isPlayersGang && factionInfo.offerHackingWork) &&
                    <Option
                        buttonText={"Hacking Contracts"}
                        infoText={hackingContractsInfo}
                        onClick={this.startHackingContracts}
                    />
                }
                {
                    (!isPlayersGang && factionInfo.offerFieldWork) &&
                    <Option
                        buttonText={"Field Work"}
                        infoText={fieldWorkInfo}
                        onClick={this.startFieldWork}
                    />
                }
                {
                    (!isPlayersGang && factionInfo.offerSecurityWork) &&
                    <Option
                        buttonText={"Security Work"}
                        infoText={securityWorkInfo}
                        onClick={this.startSecurityWork}
                    />
                }
                {
                    !isPlayersGang &&
                    <DonateOption
                        faction={this.props.faction}
                        p={this.props.p}
                        rerender={this.rerender}
                        favorToDonate={favorToDonate}
                        disabled={!canDonate}
                    />
                }
                <Option
                    buttonText={"Purchase Augmentations"}
                    infoText={augmentationsInfo}
                    onClick={this.routeToPurchaseAugs}
                />
                {
                    canPurchaseSleeves &&
                    <Option
                        buttonText={"Purchase & Upgrade Duplicate Sleeves"}
                        infoText={sleevePurchasesInfo}
                        onClick={this.sleevePurchases}
                    />
                }
            </div>
        )
    }

    renderAugmentationsPage(): React.ReactNode {
        return (
            <div>
                <AugmentationsPage
                    faction={this.props.faction}
                    p={this.props.p}
                    routeToMainPage={this.routeToMain}
                />
            </div>
        )
    }
}
