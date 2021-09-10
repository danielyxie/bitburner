import { Sleeve } from "../Sleeve";
import { numeralWrapper } from "../../../ui/numeralFormat";
import * as React from "react";

interface IProps {
  sleeve: Sleeve;
}

export function StatsElement(props: IProps): React.ReactElement {
  let style = {};
  style = { textAlign: "right" };
  return (
    <>
      <table>
        <tbody>
          <tr>
            <td className="character-hp-cell">HP: </td>
            <td className="character-hp-cell" style={style}>
              {numeralWrapper.formatHp(props.sleeve.hp)} / {numeralWrapper.formatHp(props.sleeve.max_hp)}
            </td>
          </tr>
          <tr>
            <td>City: </td>
            <td style={style}>{props.sleeve.city}</td>
          </tr>
          <tr>
            <td className="character-hack-cell">Hacking: </td>
            <td className="character-hack-cell" style={style}>
              {numeralWrapper.formatSkill(props.sleeve.hacking_skill)}
            </td>
          </tr>
          <tr>
            <td className="character-combat-cell">Strength: </td>
            <td className="character-combat-cell" style={style}>
              {numeralWrapper.formatSkill(props.sleeve.strength)}
            </td>
          </tr>
          <tr>
            <td className="character-combat-cell">Defense: </td>
            <td className="character-combat-cell" style={style}>
              {numeralWrapper.formatSkill(props.sleeve.defense)}
            </td>
          </tr>
          <tr>
            <td className="character-combat-cell">Dexterity: </td>
            <td className="character-combat-cell" style={style}>
              {numeralWrapper.formatSkill(props.sleeve.dexterity)}
            </td>
          </tr>
          <tr>
            <td className="character-combat-cell">Agility: </td>
            <td className="character-combat-cell" style={style}>
              {numeralWrapper.formatSkill(props.sleeve.agility)}
            </td>
          </tr>
          <tr>
            <td className="character-cha-cell">Charisma: </td>
            <td className="character-cha-cell" style={style}>
              {numeralWrapper.formatSkill(props.sleeve.charisma)}
            </td>
          </tr>
          <tr>
            <td className="character-int-cell">Shock: </td>
            <td className="character-int-cell" style={style}>
              {numeralWrapper.formatSleeveShock(100 - props.sleeve.shock)}
            </td>
          </tr>
          <tr>
            <td className="character-int-cell">Sync: </td>
            <td className="character-int-cell" style={style}>
              {numeralWrapper.formatSleeveSynchro(props.sleeve.sync)}
            </td>
          </tr>
          <tr>
            <td className="character-int-cell">Memory: </td>
            <td className="character-int-cell" style={style}>
              {numeralWrapper.formatSleeveMemory(props.sleeve.memory)}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
