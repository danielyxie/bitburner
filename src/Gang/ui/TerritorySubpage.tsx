/**
 * React Component for the territory subpage.
 */
import React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { formatNumber } from "../../../utils/StringHelperFunctions";
import { AllGangs } from "../AllGangs";
import { Gang } from "../Gang";

interface IProps {
  gang: Gang;
}

export function TerritorySubpage(props: IProps): React.ReactElement {
  function openWarfareHelp(): void {
    dialogBoxCreate(
      "This percentage represents the chance you have of " +
        "'clashing' with with another gang. If you do not " +
        "wish to gain/lose territory, then keep this " +
        "percentage at 0% by not engaging in territory warfare.",
    );
  }

  function formatTerritory(n: number): string {
    const v = n * 100;
    if (v <= 0) {
      return formatNumber(0, 2);
    } else if (v >= 100) {
      return formatNumber(100, 2);
    } else {
      return formatNumber(v, 2);
    }
  }

  const playerPower = AllGangs[props.gang.facName].power;
  function otherGangTerritory(name: string): React.ReactElement {
    const power = AllGangs[name].power;
    const clashVictoryChance = playerPower / (power + playerPower);
    return (
      <span key={name}>
        <u>{name}</u>
        <br />
        Power: {formatNumber(power, 6)}
        <br />
        Territory: {formatTerritory(AllGangs[name].territory)}%<br />
        Chance to win clash with this gang:{" "}
        {numeralWrapper.formatPercentage(clashVictoryChance, 3)}
        <br />
        <br />
      </span>
    );
  }

  const gangNames = Object.keys(AllGangs).filter(
    (g) => g != props.gang.facName,
  );

  return (
    <div style={{ width: "70%" }}>
      <p className="noselect">
        This page shows how much territory your Gang controls. This statistic is
        listed as a percentage, which represents how much of the total territory
        you control.
        <br />
        <br />
        Every ~20 seconds, your gang has a chance to 'clash' with other gangs.
        Your chance to win a clash depends on your gang's power, which is listed
        in the display below. Your gang's power slowly accumulates over time.
        The accumulation rate is determined by the stats of all Gang members you
        have assigned to the 'Territory Warfare' task. Gang members that are not
        assigned to this task do not contribute to your gang's power. Your gang
        also loses a small amount of power whenever you lose a clash.
        <br />
        <br />
        NOTE: Gang members assigned to 'Territory Warfare' can be killed during
        clashes. This can happen regardless of whether you win or lose the
        clash. A gang member being killed results in both respect and power loss
        for your gang.
        <br />
        <br />
        The amount of territory you have affects all aspects of your Gang
        members' production, including money, respect, and wanted level. It is
        very beneficial to have high territory control.
        <br />
        <br />
      </p>
      <input
        checked={props.gang.territoryWarfareEngaged}
        id="warfare"
        type="checkbox"
        style={{ display: "inline-block", margin: "2px" }}
        onChange={(event) => (props.gang.territoryWarfareEngaged = event.target.checked)
        }
      />
      <label
        htmlFor="warfare"
        className="tooltip noselect"
        style={{ color: "white", display: "inline-block" }}
      >
        Engage in Territory Warfare
        <span className="tooltiptext" style={{ display: "inline-block" }}>
          Engaging in Territory Warfare sets your clash chance to 100%.
          Disengaging will cause your clash chance to gradually decrease until
          it reaches 0%.
        </span>
      </label>
      <br />
      <p style={{ display: "inline-block" }}>
        Territory Clash Chance:{" "}
        {numeralWrapper.formatPercentage(props.gang.territoryClashChance, 3)}
      </p>
      <div
        className="help-tip noselect"
        style={{ display: "inline-block" }}
        onClick={openWarfareHelp}
      >
        ?
      </div>
      <br />

      <input
        checked={props.gang.notifyMemberDeath}
        id="notify"
        type="checkbox"
        style={{ display: "inline-block", margin: "2px" }}
        onChange={(event) => (props.gang.notifyMemberDeath = event.target.checked)
        }
      />
      <label
        htmlFor="warfare"
        className="tooltip noselect"
        style={{ color: "white", display: "inline-block" }}
      >
        Notify about Gang Member Deaths
        <span className="tooltiptext" style={{ display: "inline-block" }}>
          If this is enabled, then you will receive a pop-up notifying you
          whenever one of your Gang Members dies in a territory clash.
        </span>
      </label>
      <br />
      <fieldset style={{ display: "block", margin: "6px" }}>
        <p>
          <b>
            <u>{props.gang.facName}</u>
          </b>
          <br />
          Power: {formatNumber(AllGangs[props.gang.facName].power, 6)}
          <br />
          Territory: {formatTerritory(AllGangs[props.gang.facName].territory)}%
          <br />
          <br />
          {gangNames.map((name) => otherGangTerritory(name))}
        </p>
      </fieldset>
    </div>
  );
}
