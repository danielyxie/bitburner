// Root React Component for the Corporation UI
import React from "react";

import { Player }         from "../../Player";
import { numeralWrapper } from "../../ui/numeralFormat";

const Component = React.Component;

export class CharacterOverviewComponent extends Component {
    render() {
        const intelligence = (
            <tr id="character-int-wrapper">
                <td className="character-int-cell">Int:&nbsp;</td><td id="character-int-text" className="character-int-cell character-stat-cell">{numeralWrapper.formatSkill(Player.intelligence)}</td>
            </tr>
        );

        return (
            <div id="character-overview-text">
                <table>
                <tbody>
                    <tr id="character-hp-wrapper">
                        <td className="character-hp-cell">Hp:</td><td id="character-hp-text" className="character-hp-cell character-stat-cell">{Player.hp + " / " + Player.max_hp}</td>
                    </tr>
                    <tr id="character-money-wrapper">
                        <td className="character-money-cell">Money:&nbsp;</td><td id="character-money-text" className="character-money-cell character-stat-cell">{numeralWrapper.formatMoney(Player.money.toNumber())}</td>
                    </tr>
                    <tr id="character-hack-wrapper">
                        <td className="character-hack-cell">Hack:&nbsp;</td><td id="character-hack-text" className="character-hack-cell character-stat-cell">{numeralWrapper.formatSkill(Player.hacking_skill)}</td>
                    </tr>
                    <tr id="character-str-wrapper">
                        <td className="character-combat-cell">Str:&nbsp;</td><td id="character-str-text" className="character-combat-cell character-stat-cell">{numeralWrapper.formatSkill(Player.strength)}</td>
                    </tr>
                    <tr id="character-def-wrapper">
                        <td className="character-combat-cell">Def:&nbsp;</td><td id="character-def-text" className="character-combat-cell character-stat-cell">{numeralWrapper.formatSkill(Player.defense)}</td>
                    </tr>
                    <tr id="character-dex-wrapper">
                        <td className="character-combat-cell">Dex:&nbsp;</td><td id="character-dex-text" className="character-combat-cell character-stat-cell">{numeralWrapper.formatSkill(Player.dexterity)}</td>
                    </tr>
                    <tr id="character-agi-wrapper">
                        <td className="character-combat-cell">Agi:&nbsp;</td><td id="character-agi-text" className="character-combat-cell character-stat-cell">{numeralWrapper.formatSkill(Player.agility)}</td>
                    </tr>
                    <tr id="character-cha-wrapper">
                        <td className="character-cha-cell">Cha:&nbsp;</td><td id="character-cha-text" className="character-cha-cell character-stat-cell">{numeralWrapper.formatSkill(Player.charisma)}</td>
                    </tr>
                    {
                        Player.intelligence >= 1 &&
                        intelligence
                    }
                 </tbody>
                </table>
            </div>
        )
    }
}