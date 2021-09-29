import React, { useState } from "react";
import { SkillList } from "./SkillList";
import { BladeburnerConstants } from "../data/Constants";
import { formatNumber } from "../../utils/StringHelperFunctions";
import { IBladeburner } from "../IBladeburner";
import Typography from "@mui/material/Typography";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
interface IProps {
  bladeburner: IBladeburner;
}

export function SkillPage(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  const mults = props.bladeburner.skillMultipliers;

  function valid(mult: any): boolean {
    return mult && mult !== 1;
  }

  return (
    <>
      <Typography>
        <strong>Skill Points: {formatNumber(props.bladeburner.skillPoints, 0)}</strong>
      </Typography>
      <Typography>
        You will gain one skill point every{" "}
        {BladeburnerConstants.RanksPerSkillPoint * BitNodeMultipliers.BladeburnerSkillCost} ranks.
        <br />
        <br />
        Note that when upgrading a skill, the benefit for that skill is additive. However, the effects of different
        skills with each other is multiplicative.
        <br />
      </Typography>
      <br />
      {valid(mults["successChanceAll"]) && (
        <Typography>Total Success Chance: x{formatNumber(mults["successChanceAll"], 3)}</Typography>
      )}
      {valid(mults["successChanceStealth"]) && (
        <Typography>Stealth Success Chance: x{formatNumber(mults["successChanceStealth"], 3)}</Typography>
      )}
      {valid(mults["successChanceKill"]) && (
        <Typography>Retirement Success Chance: x{formatNumber(mults["successChanceKill"], 3)}</Typography>
      )}
      {valid(mults["successChanceContract"]) && (
        <Typography>Contract Success Chance: x{formatNumber(mults["successChanceContract"], 3)}</Typography>
      )}
      {valid(mults["successChanceOperation"]) && (
        <Typography>Operation Success Chance: x{formatNumber(mults["successChanceOperation"], 3)}</Typography>
      )}
      {valid(mults["successChanceEstimate"]) && (
        <Typography>Synthoid Data Estimate: x{formatNumber(mults["successChanceEstimate"], 3)}</Typography>
      )}
      {valid(mults["actionTime"]) && <Typography>Action Time: x{formatNumber(mults["actionTime"], 3)}</Typography>}
      {valid(mults["effHack"]) && <Typography>Hacking Skill: x{formatNumber(mults["effHack"], 3)}</Typography>}
      {valid(mults["effStr"]) && <Typography>Strength: x{formatNumber(mults["effStr"], 3)}</Typography>}
      {valid(mults["effDef"]) && <Typography>Defense: x{formatNumber(mults["effDef"], 3)}</Typography>}
      {valid(mults["effDex"]) && <Typography>Dexterity: x{formatNumber(mults["effDex"], 3)}</Typography>}
      {valid(mults["effAgi"]) && <Typography>Agility: x{formatNumber(mults["effAgi"], 3)}</Typography>}
      {valid(mults["effCha"]) && <Typography>Charisma: x{formatNumber(mults["effCha"], 3)}</Typography>}
      {valid(mults["effInt"]) && <Typography>Intelligence: x{formatNumber(mults["effInt"], 3)}</Typography>}
      {valid(mults["stamina"]) && <Typography>Stamina: x{formatNumber(mults["stamina"], 3)}</Typography>}
      {valid(mults["money"]) && <Typography>Contract Money: x{formatNumber(mults["money"], 3)}</Typography>}
      {valid(mults["expGain"]) && <Typography>Exp Gain: x{formatNumber(mults["expGain"], 3)}</Typography>}
      <br />
      <SkillList bladeburner={props.bladeburner} onUpgrade={() => setRerender((old) => !old)} />
    </>
  );
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
