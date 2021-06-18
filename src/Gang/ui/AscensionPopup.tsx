/**
 * React Component for the content of the popup before the player confirms the
 * ascension of a gang member.
 */
import React, { useState, useEffect } from "react";
import { Gang } from "../Gang";
import { GangMember } from "../GangMember";
import { numeralWrapper } from "../../ui/numeralFormat";
import { removePopup } from "../../ui/React/createPopup";
import { dialogBoxCreate } from "../../../utils/DialogBox";

interface IProps {
    member: GangMember;
    gang: Gang;
    popupId: string;
    onAscend: () => void;
}

export function AscensionPopup(props: IProps): React.ReactElement {
    const setRerender = useState(false)[1];

    useEffect(() => {
        const id = setInterval(() => setRerender(old => !old), 1000);
        return () => clearInterval(id);
    }, []);

    function confirm(): void {
        props.onAscend();
        const res = props.gang.ascendMember(props.member);
        dialogBoxCreate(<p>
            You ascended {props.member.name}!<br />
            <br />
            Your gang lost {numeralWrapper.formatRespect(res.respect)} respect.<br />
            <br />
            {props.member.name} gained the following stat multipliers for ascending:<br />
            Hacking:   x{numeralWrapper.format(res.hack, '0.000')}<br />
            Strength:  x{numeralWrapper.format(res.str, '0.000')}<br />
            Defense:   x{numeralWrapper.format(res.def, '0.000')}<br />
            Dexterity: x{numeralWrapper.format(res.dex, '0.000')}<br />
            Agility:   x{numeralWrapper.format(res.agi, '0.000')}<br />
            Charisma:  x{numeralWrapper.format(res.cha, '0.000')}<br />
        </p>);
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
Hacking:   x{numeralWrapper.format(ascendBenefits.hack, '0.000')}<br />
Strength:  x{numeralWrapper.format(ascendBenefits.str, '0.000')}<br />
Defense:   x{numeralWrapper.format(ascendBenefits.def, '0.000')}<br />
Dexterity: x{numeralWrapper.format(ascendBenefits.dex, '0.000')}<br />
Agility:   x{numeralWrapper.format(ascendBenefits.agi, '0.000')}<br />
Charisma:  x{numeralWrapper.format(ascendBenefits.cha, '0.000')}<br />
        </pre>
        <button className="std-button" onClick={confirm}>Ascend</button>
        <button className="std-button" onClick={cancel}>Cancel</button>
    </>);
}