import * as React from "react";
import { GangMember } from "../GangMember";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { formatNumber } from "../../../utils/StringHelperFunctions";
import { numeralWrapper } from "../../ui/numeralFormat";
import { createPopup, removePopup } from "../../ui/React/createPopup";

interface IAscendProps {
    member: any;
    gang: any;
    popupId: string;
}

function ascendPopup(props: IAscendProps): React.ReactElement {
    function confirm() {
        props.gang.ascendMember(props.member);
        props.gang.updateGangMemberDisplayElement(props.member);
        removePopup(props.popupId);
        return false;
    }

    function cancel() {
        removePopup(props.popupId);
        return false;
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
Hacking:   +{numeralWrapper.formatPercentage(ascendBenefits.hack)}<br />
Strength:  +{numeralWrapper.formatPercentage(ascendBenefits.str)}<br />
Defense:   +{numeralWrapper.formatPercentage(ascendBenefits.def)}<br />
Dexterity: +{numeralWrapper.formatPercentage(ascendBenefits.dex)}<br />
Agility:   +{numeralWrapper.formatPercentage(ascendBenefits.agi)}<br />
Charisma:  +{numeralWrapper.formatPercentage(ascendBenefits.cha)}<br />
        </pre>
        <button className="std-button" onClick={confirm}>Ascend</button>
        <button className="std-button" onClick={cancel}>Cancel</button>
    </>);
}

interface IProps {
    member: any;
    gang: any;
}

export function Panel1(props: IProps): React.ReactElement {
    function ascend() {
        const popupId = `gang-management-ascend-member ${props.member.name}`;
        createPopup(popupId, ascendPopup, {
            member: props.member,
            gang: props.gang,
            popupId: popupId,
        });
    }

    function openAscensionHelp(): void {
        dialogBoxCreate(<>
            Ascending a Gang Member resets the member's progress and stats in
            exchange for a permanent boost to their stat multipliers.
            <br /><br />
            The additional stat multiplier that the Gang Member gains upon
            ascension is based on the amount of multipliers the member has from
            non-Augmentation Equipment.
            <br /><br />
            Upon ascension, the member will lose all of its non-Augmentation
            Equipment and your gang will lose respect equal to the total respect
            earned by the member.
        </>);
    }

    return (<>
        <span className="tooltiptext smallfont">
Hk: x{numeralWrapper.formatMultiplier(props.member.hack_mult * props.member.hack_asc_mult)}(x{numeralWrapper.formatMultiplier(props.member.hack_mult)} Eq, x{numeralWrapper.formatMultiplier(props.member.hack_asc_mult)} Asc)<br />
St: x{numeralWrapper.formatMultiplier(props.member.str_mult * props.member.str_asc_mult)}(x{numeralWrapper.formatMultiplier(props.member.str_mult)} Eq, x{numeralWrapper.formatMultiplier(props.member.str_asc_mult)} Asc)<br />
Df: x{numeralWrapper.formatMultiplier(props.member.def_mult * props.member.def_asc_mult)}(x{numeralWrapper.formatMultiplier(props.member.def_mult)} Eq, x{numeralWrapper.formatMultiplier(props.member.def_asc_mult)} Asc)<br />
Dx: x{numeralWrapper.formatMultiplier(props.member.dex_mult * props.member.dex_asc_mult)}(x{numeralWrapper.formatMultiplier(props.member.dex_mult)} Eq, x{numeralWrapper.formatMultiplier(props.member.dex_asc_mult)} Asc)<br />
Ag: x{numeralWrapper.formatMultiplier(props.member.agi_mult * props.member.agi_asc_mult)}(x{numeralWrapper.formatMultiplier(props.member.agi_mult)} Eq, x{numeralWrapper.formatMultiplier(props.member.agi_asc_mult)} Asc)<br />
Ch: x{numeralWrapper.formatMultiplier(props.member.cha_mult * props.member.cha_asc_mult)}(x{numeralWrapper.formatMultiplier(props.member.cha_mult)} Eq, x{numeralWrapper.formatMultiplier(props.member.cha_asc_mult)} Asc)
        </span>
        <pre id={`${props.member.name}gang-member-stats-text`}>
        Hacking: {formatNumber(props.member.hack, 0)} ({numeralWrapper.formatExp(props.member.hack_exp)} exp)<br />
        Strength: {formatNumber(props.member.str, 0)} ({numeralWrapper.formatExp(props.member.str_exp)} exp)<br />
        Defense: {formatNumber(props.member.def, 0)} ({numeralWrapper.formatExp(props.member.def_exp)} exp)<br />
        Dexterity: {formatNumber(props.member.dex, 0)} ({numeralWrapper.formatExp(props.member.dex_exp)} exp)<br />
        Agility: {formatNumber(props.member.agi, 0)} ({numeralWrapper.formatExp(props.member.agi_exp)} exp)<br />
        Charisma: {formatNumber(props.member.cha, 0)} ({numeralWrapper.formatExp(props.member.cha_exp)} exp)<br />
        </pre>
        <br />
        <button className="accordion-button" onClick={ascend}>Ascend</button>
        <div className="help-tip" style={{marginTop: "5px"}} onClick={openAscensionHelp}>?</div>
    </>);
}
