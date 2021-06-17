/**
 * React Component for the content of the popup before the player confirms the
 * ascension of a gang member.
 */
import React from "react";
import { Gang } from "../Gang";
import { GangMember } from "../GangMember";
import { numeralWrapper } from "../../ui/numeralFormat";
import { removePopup } from "../../ui/React/createPopup";

interface IProps {
    member: GangMember;
    gang: Gang;
    popupId: string;
}

export function AscensionPopup(props: IProps): React.ReactElement {
    function confirm(): void {
        props.gang.ascendMember(props.member);
        removePopup(props.popupId);
    }

    function cancel(): void {
        removePopup(props.popupId);
    }

    const ascendBenefits = props.member.getAscensionResults();

    return (<>
        <pre>
Are you sure you want to ascend this member? They will lose all of<br />
their non-Augmentation upgrades and their stats will reset back to 1.<br />
<br />
Furthermore, your gang will lose {numeralWrapper.formatRespect(props.member.earnedRespect)} respect<br />
<br />
In return, they will gain the following permanent boost to stat multipliers:<br />
Hacking:   +{numeralWrapper.formatPercentage(ascendBenefits.hack/100)}<br />
Strength:  +{numeralWrapper.formatPercentage(ascendBenefits.str/100)}<br />
Defense:   +{numeralWrapper.formatPercentage(ascendBenefits.def/100)}<br />
Dexterity: +{numeralWrapper.formatPercentage(ascendBenefits.dex/100)}<br />
Agility:   +{numeralWrapper.formatPercentage(ascendBenefits.agi/100)}<br />
Charisma:  +{numeralWrapper.formatPercentage(ascendBenefits.cha/100)}<br />
        </pre>
        <button className="std-button" onClick={confirm}>Ascend</button>
        <button className="std-button" onClick={cancel}>Cancel</button>
    </>);
}