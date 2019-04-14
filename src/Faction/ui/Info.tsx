/**
 * React component for general information about the faction. This includes the
 * factions "motto", reputation, favor, and gameplay instructions
 */
import * as React from "react";

import { Faction } from "../../Faction/Faction";
import { FactionInfo } from "../../Faction/FactionInfo";
import { numeralWrapper } from "../../ui/numeralFormat";

import { AutoupdatingParagraph } from "../../ui/React/AutoupdatingParagraph";
import { ParagraphWithTooltip } from "../../ui/React/ParagraphWithTooltip";

type IProps = {
    faction: Faction;
    factionInfo: FactionInfo;
}

type IInnerHTMLMarkup = {
    __html: string;
}

const blockStyleMarkup = {
    display: "block",
}

const infoStyleMarkup = {
    display: "block",
    width: "70%",
}

export class Info extends React.Component<IProps, any> {
    render() {

        const formattedRep = numeralWrapper.format(this.props.faction.playerReputation, "0.000a");
        const favorGain = this.props.faction.getFavorGain()[0];
        const favorTooltip = "Faction favor increases the rate at which you earn reputation for " +
                             "this faction by 1% per favor. Faction favor is gained whenever you " +
                             "reset after installing an Augmentation. The amount of " +
                             "favor you gain depends on how much reputation you have with the faction"

        const infoText: IInnerHTMLMarkup = {
            __html: this.props.factionInfo.infoText,
        }

        return (
            <div>
                <i className={"text"} style={infoStyleMarkup} dangerouslySetInnerHTML={infoText}></i>
                <p style={blockStyleMarkup}>-------------------------</p>
                <AutoupdatingParagraph
                    intervalTime={5e3}
                    text={`Reputation: ${formattedRep}`}
                    tooltip={`You will earn ${numeralWrapper.format(favorGain, "0,0")} faction favor upon resetting after installing an Augmentation`}
                />
                <p style={blockStyleMarkup}>-------------------------</p>
                <ParagraphWithTooltip
                    text={`Faction Favor: ${numeralWrapper.format(this.props.faction.favor, "0,0")}`}
                    tooltip={favorTooltip}
                />
                <p style={blockStyleMarkup}>-------------------------</p>
                <p style={infoStyleMarkup}>
                    Perform work/carry out assignments for your faction to help further its cause!
                    By doing so you will earn reputation for your faction. You will also gain
                    reputation passively over time, although at a very slow rate. Earning
                    reputation will allow you to purchase Augmentations through this faction, which
                    are powerful upgrades that enhance your abilities. Note that you cannot use your
                    terminal or create scripts when you are performing a task!
                </p>
            </div>
        )
    }
}
