// Root React Component for the Corporation UI
import React from "react";

import { Player }         from "../../Player";
import { numeralWrapper } from "../../ui/numeralFormat";

const Component = React.Component;

export class CharacterOverviewComponent extends Component {
    render() {
        const intelligence = (
            <tr id="character-int-wrapper">
                <td>Int:&nbsp;</td><td id="character-int-text" className="character-stat-cell">{(Player.intelligence).toLocaleString()}</td>
            </tr>
        );

        return (
            <div id="character-overview-text">
                <table>
                <tbody>
                    <tr id="character-hp-wrapper">
                        <td>Hp:</td><td id="character-hp-text" className="character-stat-cell">{Player.hp + " / " + Player.max_hp}</td>
                    </tr>
                    <tr id="character-money-wrapper">
                        <td>Money:&nbsp;</td><td id="character-money-text" className="character-stat-cell">{numeralWrapper.format(Player.money.toNumber(), '$0.000a')}</td>
                    </tr>
                    <tr id="character-hack-wrapper">
                        <td>Hack:&nbsp;</td><td id="character-hack-text" className="character-stat-cell">{(Player.hacking_skill).toLocaleString()}</td>
                    </tr>
                    <tr id="character-str-wrapper">
                        <td>Str:&nbsp;</td><td id="character-str-text" className="character-stat-cell">{(Player.strength).toLocaleString()}</td>
                    </tr>
                    <tr id="character-def-wrapper">
                        <td>Def:&nbsp;</td><td id="character-def-text" className="character-stat-cell">{(Player.defense).toLocaleString()}</td>
                    </tr>
                    <tr id="character-dex-wrapper">
                        <td>Dex:&nbsp;</td><td id="character-dex-text" className="character-stat-cell">{(Player.dexterity).toLocaleString()}</td>
                    </tr>
                    <tr id="character-agi-wrapper">
                        <td>Agi:&nbsp;</td><td id="character-agi-text" className="character-stat-cell">{(Player.agility).toLocaleString()}</td>
                    </tr>
                    <tr id="character-cha-wrapper">
                        <td>Cha:&nbsp;</td><td id="character-cha-text" className="character-stat-cell">{(Player.charisma).toLocaleString()}</td>
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
