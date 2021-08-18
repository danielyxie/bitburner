import React, { useState } from "react";
import { SkillList } from "./SkillList";
import { BladeburnerConstants } from "../data/Constants";
import { formatNumber } from "../../../utils/StringHelperFunctions";
import { IBladeburner } from "../IBladeburner";

interface IProps {
    bladeburner: IBladeburner;
}


export function SkillPage(props: IProps): React.ReactElement {
    const setRerender = useState(false)[1];
    const mults = props.bladeburner.skillMultipliers;

    function valid(mult: any) {
        return mult && mult !== 1
    }

    return (<>
        <p>
            <strong>Skill Points: {formatNumber(props.bladeburner.skillPoints, 0)}</strong>
        </p>
        <p>
            You will gain one skill point every {BladeburnerConstants.RanksPerSkillPoint} ranks.
            <br />
            <br />
            Note that when upgrading a skill, the benefit for that skill is additive. 
            However, the effects of different skills with each other is multiplicative.
            <br />
        </p>
        <br />
        {valid(mults["successChanceAll"]) && <p>Total Success Chance: x{formatNumber(mults["successChanceAll"], 3)}</p>}
        {valid(mults["successChanceStealth"]) && <p>Stealth Success Chance: x{formatNumber(mults["successChanceStealth"], 3)}</p>}
        {valid(mults["successChanceKill"]) && <p>Retirement Success Chance: x{formatNumber(mults["successChanceKill"], 3)}</p>}
        {valid(mults["successChanceContract"]) && <p>Contract Success Chance: x{formatNumber(mults["successChanceContract"], 3)}</p>}
        {valid(mults["successChanceOperation"]) && <p>Operation Success Chance: x{formatNumber(mults["successChanceOperation"], 3)}</p>}
        {valid(mults["successChanceEstimate"]) && <p>Synthoid Data Estimate: x{formatNumber(mults["successChanceEstimate"], 3)}</p>}
        {valid(mults["actionTime"]) && <p>Action Time: x{formatNumber(mults["actionTime"], 3)}</p>}
        {valid(mults["effHack"]) && <p>Hacking Skill: x{formatNumber(mults["effHack"], 3)}</p>}
        {valid(mults["effStr"]) && <p>Strength: x{formatNumber(mults["effStr"], 3)}</p>}
        {valid(mults["effDef"]) && <p>Defense: x{formatNumber(mults["effDef"], 3)}</p>}
        {valid(mults["effDex"]) && <p>Dexterity: x{formatNumber(mults["effDex"], 3)}</p>}
        {valid(mults["effAgi"]) && <p>Agility: x{formatNumber(mults["effAgi"], 3)}</p>}
        {valid(mults["effCha"]) && <p>Charisma: x{formatNumber(mults["effCha"], 3)}</p>}
        {valid(mults["effInt"]) && <p>Intelligence: x{formatNumber(mults["effInt"], 3)}</p>}
        {valid(mults["stamina"]) && <p>Stamina: x{formatNumber(mults["stamina"], 3)}</p>}
        {valid(mults["money"]) && <p>Contract Money: x{formatNumber(mults["money"], 3)}</p>}
        {valid(mults["expGain"]) && <p>Exp Gain: x{formatNumber(mults["expGain"], 3)}</p>}
        <br />
        <SkillList bladeburner={props.bladeburner} onUpgrade={() => setRerender(old => !old)} />
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