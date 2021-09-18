/**
 * React Component for the stats related to the gang, like total respect and
 * money per second.
 */
import React from "react";
import { Factions } from "../../Faction/Factions";
import { Gang } from "../Gang";

import { formatNumber } from "../../../utils/StringHelperFunctions";
import { numeralWrapper } from "../../ui/numeralFormat";
import { MoneyRate } from "../../ui/React/MoneyRate";
import { Reputation } from "../../ui/React/Reputation";
import { AllGangs } from "../AllGangs";
import { BonusTime } from "./BonusTime";

interface IProps {
  gang: Gang;
}

export function GangStats(props: IProps): React.ReactElement {
  const territoryMult = AllGangs[props.gang.facName].territory * 100;
  let territoryStr;
  if (territoryMult <= 0) {
    territoryStr = formatNumber(0, 2);
  } else if (territoryMult >= 100) {
    territoryStr = formatNumber(100, 2);
  } else {
    territoryStr = formatNumber(territoryMult, 2);
  }

  return (
    <>
      <p className="tooltip" style={{ display: "inline-block" }}>
        Respect: {numeralWrapper.formatRespect(props.gang.respect)} (
        {numeralWrapper.formatRespect(5 * props.gang.respectGainRate)} / sec)
        <span className="tooltiptext">
          Represents the amount of respect your gang has from other gangs and criminal organizations. Your respect
          affects the amount of money your gang members will earn, and also determines how much reputation you are
          earning with your gang's corresponding Faction.
        </span>
      </p>
      <br />
      <p className="tooltip" style={{ display: "inline-block" }}>
        Wanted Level: {numeralWrapper.formatWanted(props.gang.wanted)} (
        {numeralWrapper.formatWanted(5 * props.gang.wantedGainRate)} / sec)
        <span className="tooltiptext">
          Represents how much the gang is wanted by law enforcement. The higher your gang's wanted level, the harder it
          will be for your gang members to make money and earn respect. Note that the minimum wanted level is 1.
        </span>
      </p>
      <br />
      <p className="tooltip" style={{ display: "inline-block" }}>
        Wanted Level Penalty: -{formatNumber((1 - props.gang.getWantedPenalty()) * 100, 2)}%
        <span className="tooltiptext">Penalty for respect and money gain rates due to Wanted Level</span>
      </p>
      <br />
      <div>
        <p style={{ display: "inline-block" }}>
          Money gain rate: <MoneyRate money={5 * props.gang.moneyGainRate} />
        </p>
      </div>
      <br />
      <p className="tooltip" style={{ display: "inline-block" }}>
        Territory: {territoryStr}%
        <span className="tooltiptext">The percentage of total territory your Gang controls</span>
      </p>
      <br />
      <p style={{ display: "inline-block" }}>
        Faction reputation: {Reputation(Factions[props.gang.facName].playerReputation)}
      </p>
      <br />
      <BonusTime gang={props.gang} />
    </>
  );
}
