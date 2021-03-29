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
import { Reputation } from "../../ui/React/Reputation";
import { Favor } from "../../ui/React/Favor";

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
    constructor(props: IProps) {
        super(props);

        this.getFavorGainContent = this.getFavorGainContent.bind(this);
        this.getReputationContent = this.getReputationContent.bind(this);
    }

    getFavorGainContent(): JSX.Element {
        const favorGain = this.props.faction.getFavorGain()[0];
        return <>You will earn {Favor(favorGain)} faction favor upon resetting after installing an Augmentation</>
    }

    getReputationContent(): JSX.Element {
        return <>Reputation: {Reputation(this.props.faction.playerReputation)}</>
    }

    render() {
        const favorTooltip = "Faction favor increases the rate at which you earn reputation for " +
                             "this faction by 1% per favor. Faction favor is gained whenever you " +
                             "reset after installing an Augmentation. The amount of " +
                             "favor you gain depends on how much reputation you have with the faction"

        const infoText: IInnerHTMLMarkup = {
            __html: this.props.factionInfo.infoText,
        }

        return (
            <div>
                <pre>
                    <i className={"text"} dangerouslySetInnerHTML={infoText}></i>
                </pre>
                <p style={blockStyleMarkup}>-------------------------</p>
                <AutoupdatingParagraph
                    intervalTime={5e3}
                    getContent={this.getReputationContent}
                    getTooltip={this.getFavorGainContent}
                />
                <p style={blockStyleMarkup}>-------------------------</p>
                <ParagraphWithTooltip
                    content={<>Faction Favor: {Favor(this.props.faction.favor)}</>}
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
