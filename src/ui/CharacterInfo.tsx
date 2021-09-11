import React, { useState, useEffect } from "react";

import { numeralWrapper } from "../ui/numeralFormat";
import { BitNodes } from "../BitNode/BitNode";
import { IPlayer } from "../PersonObjects/IPlayer";
import { MoneySourceTracker } from "../utils/MoneySourceTracker";
import { dialogBoxCreate } from "../../utils/DialogBox";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { SourceFileFlags } from "../SourceFile/SourceFileFlags";
import { getPurchaseServerLimit } from "../Server/ServerPurchases";
import { HacknetServerConstants } from "../Hacknet/data/Constants";
import { StatsTable } from "./React/StatsTable";
import { Money } from "./React/Money";

interface IProps {
  player: IPlayer;
}

export function CharacterInfo(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }
  const [divisionName, setDivisionName] = useState("Overview");

  useEffect(() => {
    const id = setInterval(rerender, 20);
    return () => clearInterval(id);
  }, []);

  function LastEmployer(): React.ReactElement {
    if (props.player.companyName) {
      return (
        <>
          <span>Employer at which you last worked: {props.player.companyName}</span>
          <br />
        </>
      );
    }
    return <></>;
  }
  function LastJob(): React.ReactElement {
    if (props.player.companyName !== "") {
      return (
        <>
          <span>Job you last worked: {props.player.jobs[props.player.companyName]}</span>
          <br />
        </>
      );
    }
    return <></>;
  }
  function Employers(): React.ReactElement {
    if (props.player.jobs && Object.keys(props.player.jobs).length !== 0)
      return (
        <>
          <span>All Employers:</span>
          <br />
          <ul>
            {Object.keys(props.player.jobs).map((j) => (
              <li key={j}> * {j}</li>
            ))}
          </ul>
          <br />
          <br />
        </>
      );
    return <></>;
  }

  function Hacknet(): React.ReactElement {
    // Can't import HacknetHelpers for some reason.
    if (!(props.player.bitNodeN === 9 || SourceFileFlags[9] > 0)) {
      return (
        <>
          <span>{`Hacknet Nodes owned: ${props.player.hacknetNodes.length}`}</span>
          <br />
        </>
      );
    } else {
      return (
        <>
          <span>{`Hacknet Servers owned: ${props.player.hacknetNodes.length} / ${HacknetServerConstants.MaxServers}`}</span>
          <br />
        </>
      );
    }
  }

  function convertMoneySourceTrackerToString(src: MoneySourceTracker): React.ReactElement {
    const parts: any[][] = [[`Total:`, <Money money={src.total} />]];
    if (src.bladeburner) {
      parts.push([`Bladeburner:`, <Money money={src.bladeburner} />]);
    }
    if (src.codingcontract) {
      parts.push([`Coding Contracts:`, <Money money={src.codingcontract} />]);
    }
    if (src.work) {
      parts.push([`Company Work:`, <Money money={src.work} />]);
    }
    if (src.class) {
      parts.push([`Class:`, <Money money={src.class} />]);
    }
    if (src.corporation) {
      parts.push([`Corporation:`, <Money money={src.corporation} />]);
    }
    if (src.crime) {
      parts.push([`Crimes:`, <Money money={src.crime} />]);
    }
    if (src.gang) {
      parts.push([`Gang:`, <Money money={src.gang} />]);
    }
    if (src.hacking) {
      parts.push([`Hacking:`, <Money money={src.hacking} />]);
    }
    if (src.hacknetnode) {
      parts.push([`Hacknet Nodes:`, <Money money={src.hacknetnode} />]);
    }
    if (src.hospitalization) {
      parts.push([`Hospitalization:`, <Money money={src.hospitalization} />]);
    }
    if (src.infiltration) {
      parts.push([`Infiltration:`, <Money money={src.infiltration} />]);
    }
    if (src.stock) {
      parts.push([`Stock Market:`, <Money money={src.stock} />]);
    }
    if (src.casino) {
      parts.push([`Casino:`, <Money money={src.casino} />]);
    }
    if (src.sleeves) {
      parts.push([`Sleeves:`, <Money money={src.sleeves} />]);
    }

    return StatsTable(parts);
  }

  function openMoneyModal(): void {
    let content = (
      <>
        <u>Money earned since you last installed Augmentations:</u>
        <br />
        {convertMoneySourceTrackerToString(props.player.moneySourceA)}
      </>
    );
    if (props.player.sourceFiles.length !== 0) {
      content = (
        <>
          {content}
          <br />
          <br />
          <u>Money earned in this BitNode:</u>
          <br />
          {convertMoneySourceTrackerToString(props.player.moneySourceB)}
        </>
      );
    }

    dialogBoxCreate(content, false);
  }

  function Intelligence(): React.ReactElement {
    if (props.player.intelligence > 0 && (props.player.bitNodeN === 5 || SourceFileFlags[5] > 0)) {
      return (
        <tr key="5">
          <td>Intelligence:</td>
          <td style={{ textAlign: "right" }}>{numeralWrapper.formatSkill(props.player.intelligence)}</td>
        </tr>
      );
    }
    return <></>;
  }

  function MultiplierTable(props: any): React.ReactElement {
    function bn5Stat(r: any): JSX.Element {
      if (SourceFileFlags[5] > 0 && r.length > 2 && r[1] != r[2]) {
        return (
          <td key="2" style={{ textAlign: "right" }}>
            {" "}
            ({numeralWrapper.formatPercentage(r[2])})
          </td>
        );
      }
      return <></>;
    }
    return (
      <>
        <table>
          <tbody>
            {props.rows.map((r: any) => (
              <tr key={r[0]}>
                <td key="0">{`${r[0]} multiplier:`}</td>
                <td key="1" style={{ textAlign: "right", paddingLeft: "5px" }}>
                  {numeralWrapper.formatPercentage(r[1])}
                </td>
                {bn5Stat(r)}
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }

  function BladeburnerMults(): React.ReactElement {
    if (!props.player.canAccessBladeburner()) return <></>;
    return (
      <>
        <MultiplierTable
          rows={[
            ["Bladeburner Success Chance", props.player.bladeburner_max_stamina_mult],
            ["Bladeburner Max Stamina", props.player.bladeburner_stamina_gain_mult],
            ["Bladeburner Stamina Gain", props.player.bladeburner_analysis_mult],
            ["Bladeburner Field Analysis", props.player.bladeburner_success_chance_mult],
          ]}
        />
        <br />
      </>
    );
  }

  function CurrentBitNode(): React.ReactElement {
    if (props.player.sourceFiles.length > 0) {
      const index = "BitNode" + props.player.bitNodeN;
      return (
        <>
          <span>
            Current BitNode: {props.player.bitNodeN} ({BitNodes[index].name})
          </span>
          <br />
          <br />
          <div style={{ width: "60%", fontSize: "13px", marginLeft: "4%" }}>
            {BitNodes[index].info.split("<br>").map((t, i) => (
              <div key={i}>
                <span style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>{t}</span>
                <br />
              </div>
            ))}
          </div>
        </>
      );
    }

    return <></>;
  }

  const timeRows = [
    ["Time played since last Augmentation:", convertTimeMsToTimeElapsedString(props.player.playtimeSinceLastAug)],
  ];
  if (props.player.sourceFiles.length > 0) {
    timeRows.push([
      "Time played since last Bitnode destroyed:",
      convertTimeMsToTimeElapsedString(props.player.playtimeSinceLastBitnode),
    ]);
  }
  timeRows.push(["Total Time played:", convertTimeMsToTimeElapsedString(props.player.totalPlaytime)]);

  return (
    <div id="character-container">
      <pre>
        <b>General</b>
        <br />
        <br />
        <span>Current City: {props.player.city}</span>
        <br />
        <LastEmployer />
        <LastJob />
        <Employers />
        <span>
          Money: <Money money={props.player.money.toNumber()} />
        </span>
        <button
          className="popup-box-button"
          style={{ display: "inline-block", float: "none" }}
          onClick={openMoneyModal}
        >
          Money Statistics & Breakdown
        </button>
        <br />
        <br />
        <b>Stats</b>
        <table>
          <tbody>
            <tr key="0">
              <td key="0">Hacking:</td>
              <td key="1" style={{ textAlign: "right" }}>
                {numeralWrapper.formatSkill(props.player.hacking_skill)}
              </td>
              <td key="2" style={{ textAlign: "right" }}>
                ({numeralWrapper.formatExp(props.player.hacking_exp)} exp)
              </td>
            </tr>
            <tr key="1">
              <td key="0">Strength:</td>
              <td key="1" style={{ textAlign: "right" }}>
                {numeralWrapper.formatSkill(props.player.strength)}
              </td>
              <td key="2" style={{ textAlign: "right" }}>
                ({numeralWrapper.formatExp(props.player.strength_exp)} exp)
              </td>
            </tr>
            <tr key="2">
              <td key="0">Defense:</td>
              <td key="1" style={{ textAlign: "right" }}>
                {numeralWrapper.formatSkill(props.player.defense)}
              </td>
              <td key="2" style={{ textAlign: "right" }}>
                ({numeralWrapper.formatExp(props.player.defense_exp)} exp)
              </td>
            </tr>
            <tr key="3">
              <td key="0">Dexterity:</td>
              <td key="1" style={{ textAlign: "right" }}>
                {numeralWrapper.formatSkill(props.player.dexterity)}
              </td>
              <td key="2" style={{ textAlign: "right" }}>
                ({numeralWrapper.formatExp(props.player.dexterity_exp)} exp)
              </td>
            </tr>
            <tr key="4">
              <td key="0">Agility:</td>
              <td key="1" style={{ textAlign: "right" }}>
                {numeralWrapper.formatSkill(props.player.agility)}
              </td>
              <td key="2" style={{ textAlign: "right" }}>
                ({numeralWrapper.formatExp(props.player.agility_exp)} exp)
              </td>
            </tr>
            <tr key="5">
              <td key="0">Charisma:</td>
              <td key="1" style={{ textAlign: "right" }}>
                {numeralWrapper.formatSkill(props.player.charisma)}
              </td>
              <td key="2" style={{ textAlign: "right" }}>
                ({numeralWrapper.formatExp(props.player.charisma_exp)} exp)
              </td>
            </tr>
            <Intelligence />
          </tbody>
        </table>
        <br />
        <MultiplierTable
          rows={[
            ["Hacking Chance", props.player.hacking_chance_mult],
            ["Hacking Speed", props.player.hacking_speed_mult],
            [
              "Hacking Money",
              props.player.hacking_money_mult,
              props.player.hacking_money_mult * BitNodeMultipliers.ScriptHackMoney,
            ],
            [
              "Hacking Growth",
              props.player.hacking_grow_mult,
              props.player.hacking_grow_mult * BitNodeMultipliers.ServerGrowthRate,
            ],
          ]}
        />
        <br />
        <MultiplierTable
          rows={[
            [
              "Hacking Level",
              props.player.hacking_mult,
              props.player.hacking_mult * BitNodeMultipliers.HackingLevelMultiplier,
            ],
            [
              "Hacking Experience",
              props.player.hacking_exp_mult,
              props.player.hacking_exp_mult * BitNodeMultipliers.HackExpGain,
            ],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            [
              "Strength Level",
              props.player.strength_mult,
              props.player.strength_mult * BitNodeMultipliers.StrengthLevelMultiplier,
            ],
            ["Strength Experience", props.player.strength_exp_mult],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            [
              "Defense Level",
              props.player.defense_mult,
              props.player.defense_mult * BitNodeMultipliers.DefenseLevelMultiplier,
            ],
            ["Defense Experience", props.player.defense_exp_mult],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            [
              "Dexterity Level",
              props.player.dexterity_mult,
              props.player.dexterity_mult * BitNodeMultipliers.DexterityLevelMultiplier,
            ],
            ["Dexterity Experience", props.player.dexterity_exp_mult],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            [
              "Agility Level",
              props.player.agility_mult,
              props.player.agility_mult * BitNodeMultipliers.AgilityLevelMultiplier,
            ],
            ["Agility Experience", props.player.agility_exp_mult],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            [
              "Charisma Level",
              props.player.charisma_mult,
              props.player.charisma_mult * BitNodeMultipliers.CharismaLevelMultiplier,
            ],
            ["Charisma Experience", props.player.charisma_exp_mult],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            [
              "Hacknet Node production",
              props.player.hacknet_node_money_mult,
              props.player.hacknet_node_money_mult * BitNodeMultipliers.HacknetNodeMoney,
            ],
            ["Hacknet Node purchase cost", props.player.hacknet_node_purchase_cost_mult],
            ["Hacknet Node RAM upgrade cost", props.player.hacknet_node_ram_cost_mult],
            ["Hacknet Node Core purchase cost", props.player.hacknet_node_core_cost_mult],
            ["Hacknet Node level upgrade cost", props.player.hacknet_node_level_cost_mult],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            ["Company reputation gain", props.player.company_rep_mult],
            [
              "Faction reputation gain",
              props.player.faction_rep_mult,
              props.player.faction_rep_mult * BitNodeMultipliers.FactionWorkRepGain,
            ],
            [
              "Salary",
              props.player.work_money_mult,
              props.player.work_money_mult * BitNodeMultipliers.CompanyWorkMoney,
            ],
          ]}
        />
        <br />

        <MultiplierTable
          rows={[
            ["Crime success", props.player.crime_success_mult],
            [
              "Crime money",
              props.player.crime_money_mult,
              props.player.crime_money_mult * BitNodeMultipliers.CrimeMoney,
            ],
          ]}
        />
        <br />

        <BladeburnerMults />
        <br />

        <b>Misc.</b>
        <br />
        <br />
        <span>{`Servers owned: ${props.player.purchasedServers.length} / ${getPurchaseServerLimit()}`}</span>
        <br />
        <Hacknet />
        <span>{`Augmentations installed: ${props.player.augmentations.length}`}</span>
        <br />
        <br />
        {StatsTable(timeRows)}
        <br />
        <CurrentBitNode />
      </pre>
    </div>
  );
}
