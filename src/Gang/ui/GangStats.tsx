import React, { useState, useEffect } from "react";
import { Factions } from "../../Faction/Factions";

import { 
    formatNumber,
    convertTimeMsToTimeElapsedString,
} from "../../../utils/StringHelperFunctions";
import { numeralWrapper } from "../../ui/numeralFormat";
import { MoneyRate } from "../../ui/React/MoneyRate";
import { Reputation } from "../../ui/React/Reputation";
import { AllGangs } from "../AllGangs";
import { GangConstants } from "../data/Constants";
import { createPopup, removePopup } from "../../ui/React/createPopup";
import { dialogBoxCreate } from "../../../utils/DialogBox";

interface IRecruitPopupProps {
    gang: any;
    popupId: string;
}

function recruitPopup(props: IRecruitPopupProps): React.ReactElement {
    const [name, setName] = useState("");

    function recruit(): void {
        if (name === "") {
            dialogBoxCreate("You must enter a name for your Gang member!");
            return;
        }
        if (!props.gang.canRecruitMember()) {
            dialogBoxCreate("You cannot recruit another Gang member!");
            return;
        }

        // At this point, the only way this can fail is if you already
        // have a gang member with the same name
        if (!props.gang.recruitMember(name)) {
            dialogBoxCreate("You already have a gang member with this name!");
            return;
        }

        removePopup(props.popupId);
    }

    function cancel(): void {
        removePopup(props.popupId);
    }

    function onKeyUp(event: any): void {
        if(event.keyCode === 13) recruit();
        if(event.keyCode === 27) cancel();
    }

    function onChange(event: any): void {
        setName(event.target.value);
    }

    return (<>
        <p>Enter a name for your new Gang member:</p><br />
        <input autoFocus
            onKeyUp={onKeyUp}
            onChange={onChange}
            className="text-input"
            type="text"
            placeholder="unique name" />
        <a className="std-button" onClick={recruit}>Recruit Gang Member</a>
        <a className="std-button" onClick={cancel}>Cancel</a>
    </>);
}

interface IProps {
    gang: any;
}

function Recruitment(props: IProps): React.ReactElement {
    // Toggle the 'Recruit member button' if valid
    const numMembers = props.gang.members.length;
    const respectCost = props.gang.getRespectNeededToRecruitMember();

    if (numMembers >= GangConstants.MaximumGangMembers) {
        return (<></>);
    } else if (props.gang.canRecruitMember()) {
        function onClick() {
            const popupId = "recruit-gang-member-popup";
            createPopup(popupId, recruitPopup, {
                gang: props.gang,
                popupId: popupId,
            });
        }
        return (<>
            <a className="a-link-button"
                onClick={onClick}
                style={{display: 'inline-block', margin: '10px'}}>
                Recruit Gang Member
            </a>
        </>);
    }
    return (<>
        <a className="a-link-button-inactive"
            style={{display: 'inline-block', margin: '10px'}}>
            Recruit Gang Member
        </a>
        <p style={{margin: '10px', color: 'red', display: 'inline-block'}}>
            {formatNumber(respectCost, 2)} respect needed to recruit next member
        </p>
    </>);
}

function BonusTime(props: IProps): React.ReactElement {
    const CyclesPerSecond = 1000 / 200;
    if (props.gang.storedCycles / CyclesPerSecond*1000 <= 5000) return <></>;
    return (<>
        <p className="tooltip" style={{display: "inline-block"}}>
            Bonus time: {convertTimeMsToTimeElapsedString(props.gang.storedCycles / CyclesPerSecond*1000)}
            <span className="tooltiptext">
                You gain bonus time while offline or when the game is inactive (e.g. when the tab is throttled by the browser). Bonus time makes the Gang mechanic progress faster, up to 5x the normal speed
            </span>
        </p>
        <br />
    </>);
}

export function GangStats(props: IProps): React.ReactElement {
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        const id = setInterval(() => setRerender(old => !old), 1000);
        return () => clearInterval(id);
    }, []);

    const territoryMult = AllGangs[props.gang.facName].territory * 100;
    let territoryStr;
    if (territoryMult <= 0) {
        territoryStr = formatNumber(0, 2);
    } else if (territoryMult >= 100) {
        territoryStr = formatNumber(100, 2);
    } else {
        territoryStr = formatNumber(territoryMult, 2);
    }

    return (<>
        <p className="tooltip" style={{display: "inline-block"}}>
            Respect: {numeralWrapper.formatRespect(props.gang.respect)} ({numeralWrapper.formatRespect(5*props.gang.respectGainRate)} / sec)
            <span className="tooltiptext">
                Represents the amount of respect your gang has from other gangs and criminal organizations. Your respect affects the amount of money your gang members will earn, and also determines how much reputation you are earning with your gang's corresponding Faction.
            </span>
        </p>
        <br />
        <p className="tooltip" style={{display: "inline-block"}}>
            Wanted Level: {numeralWrapper.formatWanted(props.gang.wanted)} ({numeralWrapper.formatWanted(5*props.gang.wantedGainRate)} / sec)
            <span className="tooltiptext">
                Represents how much the gang is wanted by law enforcement. The higher your gang's wanted level, the harder it will be for your gang members to make money and earn respect. Note that the minimum wanted level is 1.
            </span>
        </p>
        <br />
        <p className="tooltip" style={{display: "inline-block"}}>
            Wanted Level Penalty: -{formatNumber((1 - props.gang.getWantedPenalty()) * 100, 2)}%
            <span className="tooltiptext">
                Penalty for respect and money gain rates due to Wanted Level
            </span>
        </p>
        <br />
        <div>
        <p style={{display: "inline-block"}}>
            Money gain rate: {MoneyRate(5 * props.gang.moneyGainRate)}
        </p>
        </div>
        <br />
        <p className="tooltip" style={{display: "inline-block"}}>
            Territory: {territoryStr}%
            <span className="tooltiptext">
                The percentage of total territory your Gang controls
            </span>
        </p>
        <br />
        <p style={{display: "inline-block"}}>
            Faction reputation: {Reputation(Factions[props.gang.facName].playerReputation)}
        </p>
        <br />
        <BonusTime gang={props.gang} />
        <br />
        <Recruitment gang={props.gang} />
    </>);
}