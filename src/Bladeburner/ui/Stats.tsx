import React, { useState, useEffect } from "react";
import {
    formatNumber,
    convertTimeMsToTimeElapsedString,
} from "../../../utils/StringHelperFunctions";
import { BladeburnerConstants } from "../data/Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Money } from "../../ui/React/Money";
import { StatsTable } from "../../ui/React/StatsTable";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../utils/DialogBox";

interface IProps {
    bladeburner: any;
    player: IPlayer;
}

export function Stats(props: IProps): React.ReactElement {
    const setRerender = useState(false)[1];

    useEffect(() => {
        const id = setInterval(() => setRerender(old => !old), 1000);
        return () => clearInterval(id);
    }, []);

    function openStaminaHelp(): void {
      dialogBoxCreate("Performing actions will use up your stamina.<br><br>" +
                        "Your max stamina is determined primarily by your agility stat.<br><br>" +
                        "Your stamina gain rate is determined by both your agility and your " +
                        "max stamina. Higher max stamina leads to a higher gain rate.<br><br>" +
                        "Once your " +
                        "stamina falls below 50% of its max value, it begins to negatively " +
                        "affect the success rate of your contracts/operations. This penalty " +
                        "is shown in the overview panel. If the penalty is 15%, then this means " +
                        "your success rate would be multipled by 85% (100 - 15).<br><br>" +
                        "Your max stamina and stamina gain rate can also be increased by " +
                        "training, or through skills and Augmentation upgrades.");
    }

    function openPopulationHelp(): void {
      dialogBoxCreate("The success rate of your contracts/operations depends on " +
                        "the population of Synthoids in your current city. " +
                        "The success rate that is shown to you is only an estimate, " +
                        "and it is based on your Synthoid population estimate.<br><br>" +
                        "Therefore, it is important that this Synthoid population estimate " +
                        "is accurate so that you have a better idea of your " +
                        "success rate for contracts/operations. Certain " +
                        "actions will increase the accuracy of your population " +
                        "estimate.<br><br>" +
                        "The Synthoid populations of cities can change due to your " +
                        "actions or random events. If random events occur, they will " +
                        "be logged in the Bladeburner Console.");
    }

    return (<p>
        Rank: {formatNumber(props.bladeburner.rank, 2)}<br />
        Stamina: {formatNumber(props.bladeburner.stamina, 3)} / {formatNumber(props.bladeburner.maxStamina, 3)}
        <div className="help-tip" onClick={openStaminaHelp}>?</div><br />
        Est. Synthoid Population: {numeralWrapper.formatPopulation(props.bladeburner.getCurrentCity().popEst)}
        <div className="help-tip" onClick={openPopulationHelp}>?</div><br />
        Est. Synthoid Communities: {formatNumber(props.bladeburner.getCurrentCity().comms, 0)}<br />
        City Chaos: {formatNumber(props.bladeburner.getCurrentCity().chaos)}<br />
        Skill Points: {formatNumber(props.bladeburner.skillPoints, 0)}<br />
        Bonus time: {convertTimeMsToTimeElapsedString(props.bladeburner.storedCycles/BladeburnerConstants.CyclesPerSecond*1000)}<br />
        Stamina Penalty: {formatNumber((1-props.bladeburner.calculateStaminaPenalty())*100, 1)}%<br /><br />
        Team Size: {formatNumber(props.bladeburner.teamSize, 0)}<br />
        Team Members Lost: {formatNumber(props.bladeburner.teamLost, 0)}<br /><br />
        Num Times Hospitalized: {props.bladeburner.numHosp}<br />
        Money Lost From Hospitalizations: {Money(props.bladeburner.moneyLost)}<br /><br />
        Current City: {props.bladeburner.city}<br />
        {StatsTable([
            ["Aug. Success Chance mult: ", formatNumber(props.player.bladeburner_success_chance_mult*100, 1) + "%"],
            ["Aug. Max Stamina mult: ", formatNumber(props.player.bladeburner_max_stamina_mult*100, 1) + "%"],
            ["Aug. Stamina Gain mult: ", formatNumber(props.player.bladeburner_stamina_gain_mult*100, 1) + "%"],
            ["Aug. Field Analysis mult: ", formatNumber(props.player.bladeburner_analysis_mult*100, 1) + "%"],
        ])}
    </p>);
}