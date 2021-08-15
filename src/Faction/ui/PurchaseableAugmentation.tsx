/**
 * React component for displaying a single augmentation for purchase through
 * the faction UI
 */
import * as React from "react";

import {
    getNextNeurofluxLevel,
    hasAugmentationPrereqs,
    purchaseAugmentation,
    purchaseAugmentationBoxCreate,
} from "../FactionHelpers";

import { Augmentation } from "../../Augmentation/Augmentation";
import { Augmentations } from "../../Augmentation/Augmentations";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Faction } from "../../Faction/Faction";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Settings } from "../../Settings/Settings";
import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";
import { IMap } from "../../types";

import { StdButton } from "../../ui/React/StdButton";
import { Augmentation as AugFormat } from "../../ui/React/Augmentation";

type IProps = {
    augName: string;
    faction: Faction;
    p: IPlayer;
    rerender: () => void;
}

const spanStyleMarkup = {
    margin: "4px",
    padding: "4px",
}

const inlineStyleMarkup = {
    display: "inline-block",
}

export class PurchaseableAugmentation extends React.Component<IProps, any> {
    aug: Augmentation;

    constructor(props: IProps) {
        super(props);

        const aug = Augmentations[this.props.augName];
        if(aug == null) throw new Error(`aug ${this.props.augName} does not exists`);
        this.aug = aug;

        this.handleClick = this.handleClick.bind(this);
    }

    getMoneyCost(): number {
        return this.aug.baseCost * this.props.faction.getInfo().augmentationPriceMult;
    }

    getRepCost(): number {
        return this.aug.baseRepRequirement * this.props.faction.getInfo().augmentationRepRequirementMult;
    }

    handleClick(): void {
        if (!Settings.SuppressBuyAugmentationConfirmation) {
            purchaseAugmentationBoxCreate(this.aug, this.props.faction);
        } else {
            purchaseAugmentation(this.aug, this.props.faction);
        }
    }

    // Whether the player has the prerequisite Augmentations
    hasPrereqs(): boolean {
        return hasAugmentationPrereqs(this.aug);
    }

    // Whether the player has enough rep for this Augmentation
    hasReputation(): boolean {
        return this.props.faction.playerReputation >= this.getRepCost();
    }

    // Whether the player has this augmentations (purchased OR installed)
    owned(): boolean {
        let owned = false;
        for (const queuedAug of this.props.p.queuedAugmentations) {
            if (queuedAug.name === this.props.augName) {
                owned = true;
                break;
            }
        }

        for (const installedAug of this.props.p.augmentations) {
            if (installedAug.name === this.props.augName) {
                owned = true;
                break;
            }
        }

        return owned;
    }

    render(): React.ReactNode {
        if (this.aug == null) {
            console.error(`Invalid Augmentation when trying to create PurchaseableAugmentation display element: ${this.props.augName}`);
            return null;
        }

        const moneyCost = this.getMoneyCost();
        const repCost = this.getRepCost();

        // Determine UI properties
        let disabled = false;
        let status: JSX.Element = <></>;
        let color = "";
        if (!this.hasPrereqs()) {
            disabled = true;
            status = <>LOCKED (Requires {this.aug.prereqs.map(aug => AugFormat(aug))} as prerequisite)</>;
            color = "red";
        } else if (this.aug.name !== AugmentationNames.NeuroFluxGovernor && (this.aug.owned || this.owned())) {
            disabled = true;
        } else if (this.hasReputation()) {
            status = <>UNLOCKED (at {Reputation(repCost)} faction reputation) - {Money(moneyCost)}</>;
        } else {
            disabled = true;
            status = <>LOCKED (Requires {Reputation(repCost)} faction reputation - {Money(moneyCost)})</>;
            color = "red";
        }

        const txtStyle: IMap<string> = {
            display: "inline-block",
        }
        if (color !== "") { txtStyle.color = color; }

        // Determine button txt
        let btnTxt = this.aug.name;
        if (this.aug.name === AugmentationNames.NeuroFluxGovernor) {
            btnTxt += ` - Level ${getNextNeurofluxLevel()}`;
        }

        let tooltip = <></>;
        if(typeof this.aug.info === "string")
            tooltip = <><span dangerouslySetInnerHTML={{__html: this.aug.info}} /><br /><br />{this.aug.stats}</>
        else
            tooltip = <>{this.aug.info}<br /><br />{this.aug.stats}</>

        return (
            <li>
                <span style={spanStyleMarkup}>
                    <StdButton
                        disabled={disabled}
                        onClick={this.handleClick}
                        style={inlineStyleMarkup}
                        text={btnTxt}
                        tooltip={tooltip}
                    />
                    <p style={txtStyle}>{status}</p>
                </span>
            </li>
        )
    }
}
