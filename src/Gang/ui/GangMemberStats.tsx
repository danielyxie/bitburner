/**
 * React Component for the first part of a gang member details.
 * Contains skills and exp.
 */
import React from "react";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { formatNumber } from "../../../utils/StringHelperFunctions";
import { numeralWrapper } from "../../ui/numeralFormat";
import { createPopup } from "../../ui/React/createPopup";
import { Gang } from "../Gang";
import { GangMember } from "../GangMember";
import { AscensionPopup } from "./AscensionPopup";

interface IProps {
    member: GangMember;
    gang: Gang;
    onAscend: () => void;
}

export function GangMemberStats(props: IProps): React.ReactElement {
    function ascend(): void {
        const popupId = `gang-management-ascend-member ${props.member.name}`;
        createPopup(popupId, AscensionPopup, {
            member: props.member,
            gang: props.gang,
            popupId: popupId,
            onAscend: props.onAscend,
        });
    }

    function openAscensionHelp(): void {
        dialogBoxCreate(<>
            Ascending a Gang Member resets the member's progress and stats in
            exchange for a permanent boost to their stat multipliers.
            <br /><br />
            The additional stat multiplier that the Gang Member gains upon
            ascension is based on the amount of exp they have.
            <br /><br />
            Upon ascension, the member will lose all of its non-Augmentation
            Equipment and your gang will lose respect equal to the total respect
            earned by the member.
        </>);
    }

    const asc = {
        hack: props.member.calculateAscensionMult(props.member.hack_asc_points),
        str: props.member.calculateAscensionMult(props.member.str_asc_points),
        def: props.member.calculateAscensionMult(props.member.def_asc_points),
        dex: props.member.calculateAscensionMult(props.member.dex_asc_points),
        agi: props.member.calculateAscensionMult(props.member.agi_asc_points),
        cha: props.member.calculateAscensionMult(props.member.cha_asc_points),
    };

    return (<>
        <span className="tooltiptext smallfont">
Hk: x{numeralWrapper.formatMultiplier(props.member.hack_mult * asc.hack)}(x{numeralWrapper.formatMultiplier(props.member.hack_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.hack)} Asc)<br />
St: x{numeralWrapper.formatMultiplier(props.member.str_mult * asc.str)}(x{numeralWrapper.formatMultiplier(props.member.str_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.str)} Asc)<br />
Df: x{numeralWrapper.formatMultiplier(props.member.def_mult * asc.def)}(x{numeralWrapper.formatMultiplier(props.member.def_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.def)} Asc)<br />
Dx: x{numeralWrapper.formatMultiplier(props.member.dex_mult * asc.dex)}(x{numeralWrapper.formatMultiplier(props.member.dex_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.dex)} Asc)<br />
Ag: x{numeralWrapper.formatMultiplier(props.member.agi_mult * asc.agi)}(x{numeralWrapper.formatMultiplier(props.member.agi_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.agi)} Asc)<br />
Ch: x{numeralWrapper.formatMultiplier(props.member.cha_mult * asc.cha)}(x{numeralWrapper.formatMultiplier(props.member.cha_mult)} Eq, x{numeralWrapper.formatMultiplier(asc.cha)} Asc)
        </span>
        <pre>
Hacking: {formatNumber(props.member.hack, 0)} ({numeralWrapper.formatExp(props.member.hack_exp)} exp)<br />
Strength: {formatNumber(props.member.str, 0)} ({numeralWrapper.formatExp(props.member.str_exp)} exp)<br />
Defense: {formatNumber(props.member.def, 0)} ({numeralWrapper.formatExp(props.member.def_exp)} exp)<br />
Dexterity: {formatNumber(props.member.dex, 0)} ({numeralWrapper.formatExp(props.member.dex_exp)} exp)<br />
Agility: {formatNumber(props.member.agi, 0)} ({numeralWrapper.formatExp(props.member.agi_exp)} exp)<br />
Charisma: {formatNumber(props.member.cha, 0)} ({numeralWrapper.formatExp(props.member.cha_exp)} exp)<br />
        </pre>
        <br />
        { props.member.canAscend() && <>
        <button className="accordion-button noselect" onClick={ascend}>Ascend</button>
        <div className="help-tip noselect" style={{marginTop: "5px"}} onClick={openAscensionHelp}>?</div>
        </>}
    </>);
}
