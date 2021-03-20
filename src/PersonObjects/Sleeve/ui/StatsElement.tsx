import { Sleeve } from "../Sleeve";
import { numeralWrapper } from "../../../ui/numeralFormat";
import * as React from "react";

export function StatsElement(sleeve: Sleeve): React.ReactElement {
    let style = {};
    style = { textAlign: "right" };
    return (<>
        <table>
            <tbody>
                <tr>
                    <td className="character-hp-cell">HP: </td>
                    <td className="character-hp-cell" style={style}>{numeralWrapper.format(sleeve.hp, "0,0")} / {numeralWrapper.format(sleeve.max_hp, "0,0")}</td>
                </tr>
                <tr>
                    <td>City: </td>
                    <td style={style}>{sleeve.city}</td>
                </tr>
                <tr>
                    <td className="character-hack-cell">Hacking: </td>
                    <td className="character-hack-cell" style={style}>{numeralWrapper.format(sleeve.hacking_skill, "0,0")}</td>
                </tr>
                <tr>
                    <td className="character-combat-cell">Strength: </td>
                    <td className="character-combat-cell" style={style}>{numeralWrapper.format(sleeve.strength, "0,0")}</td>
                </tr>
                <tr>
                    <td className="character-combat-cell">Defense: </td>
                    <td className="character-combat-cell" style={style}>{numeralWrapper.format(sleeve.defense, "0,0")}</td>
                </tr>
                <tr>
                    <td className="character-combat-cell">Dexterity: </td>
                    <td className="character-combat-cell" style={style}>{numeralWrapper.format(sleeve.dexterity, "0,0")}</td>
                </tr>
                <tr>
                    <td className="character-combat-cell">Agility: </td>
                    <td className="character-combat-cell" style={style}>{numeralWrapper.format(sleeve.agility, "0,0")}</td>
                </tr>
                <tr>
                    <td className="character-cha-cell">Charisma: </td>
                    <td className="character-cha-cell" style={style}>{numeralWrapper.format(sleeve.charisma, "0,0")}</td>
                </tr>
                <tr>
                    <td className="character-int-cell">Shock: </td>
                    <td className="character-int-cell" style={style}>{numeralWrapper.format(100 - sleeve.shock, "0,0.000")}</td>
                </tr>
                <tr>
                    <td className="character-int-cell">Sync: </td>
                    <td className="character-int-cell" style={style}>{numeralWrapper.format(sleeve.sync, "0,0.000")}</td>
                </tr>
                <tr>
                    <td className="character-int-cell">Memory: </td>
                    <td className="character-int-cell" style={style}>{numeralWrapper.format(sleeve.memory, "0")}</td>
                </tr>
            </tbody>
        </table>
    </>)
}
