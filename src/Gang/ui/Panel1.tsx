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
Are you sure you want to ascend this member? They will lose all of
their non-Augmentation upgrades and their stats will reset back to 1.

Furthermore, your gang will lose {numeralWrapper.formatRespect(props.member.earnedRespect)} respect

In return, they will gain the following permanent boost to stat multipliers:
Hacking: +{numeralWrapper.formatPercentage(ascendBenefits.hack)}
Strength: +{numeralWrapper.formatPercentage(ascendBenefits.str)}
Defense: +{numeralWrapper.formatPercentage(ascendBenefits.def)}
Dexterity: +{numeralWrapper.formatPercentage(ascendBenefits.dex)}
Agility: +{numeralWrapper.formatPercentage(ascendBenefits.agi)}
Charisma: +{numeralWrapper.formatPercentage(ascendBenefits.cha)}
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

    return (<>
        <pre>
        Hacking: {formatNumber(props.member.hack, 0)} ({numeralWrapper.formatExp(props.member.hack_exp)} exp)<br />
        Strength: {formatNumber(props.member.str, 0)} ({numeralWrapper.formatExp(props.member.str_exp)} exp)<br />
        Defense: {formatNumber(props.member.def, 0)} ({numeralWrapper.formatExp(props.member.def_exp)} exp)<br />
        Dexterity: {formatNumber(props.member.dex, 0)} ({numeralWrapper.formatExp(props.member.dex_exp)} exp)<br />
        Agility: {formatNumber(props.member.agi, 0)} ({numeralWrapper.formatExp(props.member.agi_exp)} exp)<br />
        Charisma: {formatNumber(props.member.cha, 0)} ({numeralWrapper.formatExp(props.member.cha_exp)} exp)<br />
        </pre>
        <br />
        <button className="accordion-button" onClick={ascend}>Ascend</button>
    </>);
}


/*

const ascendButton = createElement("button", {
    class: "accordion-button",
    innerText: "Ascend",
    clickListener: () => {
        const popupId = `gang-management-ascend-member ${memberObj.name}`;
        const ascendBenefits = memberObj.getAscensionResults();
        const txt = createElement("pre", {
           innerText: ["Are you sure you want to ascend this member? They will lose all of",
                       "their non-Augmentation upgrades and their stats will reset back to 1.",
                       "",
                       `Furthermore, your gang will lose ${numeralWrapper.formatRespect(memberObj.earnedRespect)} respect`,
                       "",
                       "In return, they will gain the following permanent boost to stat multipliers:\n",
                       `Hacking: +${numeralWrapper.formatPercentage(ascendBenefits.hack)}`,
                       `Strength: +${numeralWrapper.formatPercentage(ascendBenefits.str)}`,
                       `Defense: +${numeralWrapper.formatPercentage(ascendBenefits.def)}`,
                       `Dexterity: +${numeralWrapper.formatPercentage(ascendBenefits.dex)}`,
                       `Agility: +${numeralWrapper.formatPercentage(ascendBenefits.agi)}`,
                       `Charisma: +${numeralWrapper.formatPercentage(ascendBenefits.cha)}`].join("\n"),
        });
        const confirmBtn = createElement("button", {
            class: "std-button",
            clickListener: () => {
                this.ascendMember(memberObj);
                this.updateGangMemberDisplayElement(memberObj);
                removePopup(popupId);
                return false;
            },
            innerText: "Ascend",
        });
        const cancelBtn = createElement("button", {
            class: "std-button",
            clickListener: () => {
                removePopup(popupId);
                return false;
            },
            innerText: "Cancel",
        });
        createPopup(popupId, [txt, confirmBtn, cancelBtn]);
    },
});


const ascendHelpTip = createElement("div", {
    class: "help-tip",
    clickListener: () => {
        dialogBoxCreate(["Ascending a Gang Member resets the member's progress and stats in exchange",
                         "for a permanent boost to their stat multipliers.",
                         "<br><br>The additional stat multiplier that the Gang Member gains upon ascension",
                         "is based on the amount of multipliers the member has from non-Augmentation Equipment.",
                         "<br><br>Upon ascension, the member will lose all of its non-Augmentation Equipment and your",
                         "gang will lose respect equal to the total respect earned by the member."].join(" "));
    },
    innerText: "?",
    marginTop: "5px",
});

        statsDiv.appendChild(statsP);
    statsDiv.appendChild(brElement);
    statsDiv.appendChild(ascendButton);
    statsDiv.appendChild(ascendHelpTip);

*/