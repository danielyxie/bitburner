// Root React Component for the Corporation UI
import React from "react";

import { IPlayer } from "../../PersonObjects/IPlayer";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Reputation } from "./Reputation";

interface IProps {
  player: IPlayer;
}

export function CharacterOverview(props: IProps): React.ReactElement {
  const intelligence = (
    <tr id="character-int-wrapper">
      <td className="character-int-cell">Int:&nbsp;</td>
      <td id="character-int-text" className="character-int-cell character-stat-cell">
        {numeralWrapper.formatSkill(props.player.intelligence)}
      </td>
    </tr>
  );

  const work = (
    <>
      <tr className="character-divider">
        <td colSpan={2}>Work progress:</td>
      </tr>
      <tr>
        <td colSpan={2}>+{Reputation(props.player.workRepGained)} rep</td>
      </tr>
      <tr>
        <td colSpan={2}>
          <button
            onClick={() => props.player.startFocusing()}
            id="character-overview-options-button"
            className="character-overview-btn"
          >
            Focus
          </button>
        </td>
      </tr>
    </>
  );

  return (
    <>
      <table>
        <tbody>
          <tr id="character-hp-wrapper">
            <td className="character-hp-cell">HP:</td>
            <td id="character-hp-text" className="character-hp-cell character-stat-cell">
              {numeralWrapper.formatHp(props.player.hp) + " / " + numeralWrapper.formatHp(props.player.max_hp)}
            </td>
          </tr>
          <tr id="character-money-wrapper">
            <td className="character-money-cell">Money:&nbsp;</td>
            <td id="character-money-text" className="character-money-cell character-stat-cell">
              {numeralWrapper.formatMoney(props.player.money.toNumber())}
            </td>
          </tr>
          <tr id="character-hack-wrapper">
            <td className="character-hack-cell">Hack:&nbsp;</td>
            <td id="character-hack-text" className="character-hack-cell character-stat-cell">
              {numeralWrapper.formatSkill(props.player.hacking_skill)}
            </td>
          </tr>
          <tr id="character-str-wrapper" className="character-divider">
            <td className="character-combat-cell">Str:&nbsp;</td>
            <td id="character-str-text" className="character-combat-cell character-stat-cell">
              {numeralWrapper.formatSkill(props.player.strength)}
            </td>
          </tr>
          <tr id="character-def-wrapper">
            <td className="character-combat-cell">Def:&nbsp;</td>
            <td id="character-def-text" className="character-combat-cell character-stat-cell">
              {numeralWrapper.formatSkill(props.player.defense)}
            </td>
          </tr>
          <tr id="character-dex-wrapper">
            <td className="character-combat-cell">Dex:&nbsp;</td>
            <td id="character-dex-text" className="character-combat-cell character-stat-cell">
              {numeralWrapper.formatSkill(props.player.dexterity)}
            </td>
          </tr>
          <tr id="character-agi-wrapper">
            <td className="character-combat-cell">Agi:&nbsp;</td>
            <td id="character-agi-text" className="character-combat-cell character-stat-cell">
              {numeralWrapper.formatSkill(props.player.agility)}
            </td>
          </tr>
          <tr id="character-cha-wrapper" className="character-divider">
            <td className="character-cha-cell">Cha:&nbsp;</td>
            <td id="character-cha-text" className="character-cha-cell character-stat-cell">
              {numeralWrapper.formatSkill(props.player.charisma)}
            </td>
          </tr>
          {props.player.intelligence >= 1 && intelligence}
          {props.player.isWorking && !props.player.focus && work}
        </tbody>
      </table>
    </>
  );
}
