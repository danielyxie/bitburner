import * as React from "react";
import { SkillList } from "./SkillList";
import { BladeburnerConstants } from "../data/Constants";
import { formatNumber } from "../../../utils/StringHelperFunctions";

interface IProps {
    bladeburner: any;
}


export function SkillPage(props: IProps): React.ReactElement {
    const mults = props.bladeburner.skillMultipliers;

    function valid(mult: any) {
        return mult && mult !== 1
    }

    return (<>
        <strong>Skill Points: {formatNumber(props.bladeburner.skillPoints, 0)}</strong>
        <p>
            You will gain one skill point every {BladeburnerConstants.RanksPerSkillPoint} ranks.
            <br />
            <br />
            Note that when upgrading a skill, the benefit for that skill is additive. 
            However, the effects of different skills with each other is multiplicative.
            <br />
            <br />
        </p>
        {valid(mults["successChanceAll"]) && <>Total Success Chance: x{formatNumber(mults["successChanceAll"], 3)}<br /></>}
        {valid(mults["successChanceStealth"]) && <>Stealth Success Chance: x{formatNumber(mults["successChanceStealth"], 3)}<br /></>}
        {valid(mults["successChanceKill"]) && <>Retirement Success Chance: x{formatNumber(mults["successChanceKill"], 3)}<br /></>}
        {valid(mults["successChanceContract"]) && <>Contract Success Chance: x{formatNumber(mults["successChanceContract"], 3)}<br /></>}
        {valid(mults["successChanceOperation"]) && <>Operation Success Chance: x{formatNumber(mults["successChanceOperation"], 3)}<br /></>}
        {valid(mults["successChanceEstimate"]) && <>Synthoid Data Estimate: x{formatNumber(mults["successChanceEstimate"], 3)}<br /></>}
        {valid(mults["actionTime"]) && <>Action Time: x{formatNumber(mults["actionTime"], 3)}<br /></>}
        {valid(mults["effHack"]) && <>Hacking Skill: x{formatNumber(mults["effHack"], 3)}<br /></>}
        {valid(mults["effStr"]) && <>Strength: x{formatNumber(mults["effStr"], 3)}<br /></>}
        {valid(mults["effDef"]) && <>Defense: x{formatNumber(mults["effDef"], 3)}<br /></>}
        {valid(mults["effDex"]) && <>Dexterity: x{formatNumber(mults["effDex"], 3)}<br /></>}
        {valid(mults["effAgi"]) && <>Agility: x{formatNumber(mults["effAgi"], 3)}<br /></>}
        {valid(mults["effCha"]) && <>Charisma: x{formatNumber(mults["effCha"], 3)}<br /></>}
        {valid(mults["effInt"]) && <>Intelligence: x{formatNumber(mults["effInt"], 3)}<br /></>}
        {valid(mults["stamina"]) && <>Stamina: x{formatNumber(mults["stamina"], 3)}<br /></>}
        {valid(mults["money"]) && <>Contract Money: x{formatNumber(mults["money"], 3)}<br /></>}
        {valid(mults["expGain"]) && <>Exp Gain: x{formatNumber(mults["expGain"], 3)}<br /></>}
        <br />
        <SkillList bladeburner={props.bladeburner} />
    </>);
}

/*




var multKeys = Object.keys(this.skillMultipliers);
for (var i = 0; i < multKeys.length; ++i) {
    var mult = this.skillMultipliers[multKeys[i]];
    if (mult && mult !== 1) {
        mult = formatNumber(mult, 3);
        switch(multKeys[i]) {
            
        }
    }
}
*/