import React, { useState, useEffect } from "react";
import {
    formatNumber,
    convertTimeMsToTimeElapsedString,
} from "../../../utils/StringHelperFunctions";
import { BladeburnerConstants } from "../data/Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { IEngine } from "../../IEngine";
import { Money } from "../../ui/React/Money";
import { StatsTable } from "../../ui/React/StatsTable";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { createPopup } from "../../ui/React/createPopup";
import { Factions } from "../../Faction/Factions";
import {
    joinFaction,
    displayFactionContent,
} from "../../Faction/FactionHelpers";
import { IBladeburner } from "../IBladeburner"

import { TravelPopup } from "./TravelPopup";

interface IProps {
    bladeburner: IBladeburner;
    engine: IEngine;
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

    function openTravel(): void {
        const popupId = "bladeburner-travel-popup";
        createPopup(popupId, TravelPopup, {
            bladeburner: props.bladeburner,
            popupId: popupId,
        });
    }

    function openFaction(): void {
        const faction = Factions["Bladeburners"];
        if (faction.isMember) {
            props.engine.loadFactionContent();
            displayFactionContent("Bladeburners");
        } else {
            if (props.bladeburner.rank >= BladeburnerConstants.RankNeededForFaction) {
                joinFaction(faction);
                dialogBoxCreate("Congratulations! You were accepted into the Bladeburners faction");
            } else {
                dialogBoxCreate("You need a rank of 25 to join the Bladeburners Faction!")
            }
        }
    }

    return (<>
        <p className="tooltip" style={{display: 'inline-block'}}>
            Rank: {formatNumber(props.bladeburner.rank, 2)}
            <span className="tooltiptext">Your rank within the Bladeburner division.</span>
        </p><br />
        <p>Stamina: {formatNumber(props.bladeburner.stamina, 3)} / {formatNumber(props.bladeburner.maxStamina, 3)}</p>
        <div className="help-tip" onClick={openStaminaHelp}>?</div><br />
        <p>Stamina Penalty: {formatNumber((1-props.bladeburner.calculateStaminaPenalty())*100, 1)}%</p><br />
        <p>Team Size: {formatNumber(props.bladeburner.teamSize, 0)}</p>
        <p>Team Members Lost: {formatNumber(props.bladeburner.teamLost, 0)}</p><br />
        <p>Num Times Hospitalized: {props.bladeburner.numHosp}</p>
        <p>Money Lost From Hospitalizations: <Money money={props.bladeburner.moneyLost} /></p><br />
        <p>Current City: {props.bladeburner.city}</p>
        <p className="tooltip" style={{display: 'inline-block'}}>
            Est. Synthoid Population: {numeralWrapper.formatPopulation(props.bladeburner.getCurrentCity().popEst)}
            <span className="tooltiptext">This is your Bladeburner division's estimate of how many Synthoids exist in your current city.</span>
        </p>
        <div className="help-tip" onClick={openPopulationHelp}>?</div><br />
        <p className="tooltip" style={{display: 'inline-block'}}>
            Est. Synthoid Communities: {formatNumber(props.bladeburner.getCurrentCity().comms, 0)}
            <span className="tooltiptext">This is your Bladeburner divison's estimate of how many Synthoid communities exist in your current city.</span>
        </p><br />
        <p className="tooltip" style={{display: 'inline-block'}}>
            City Chaos: {formatNumber(props.bladeburner.getCurrentCity().chaos)}
            <span className="tooltiptext">The city's chaos level due to tensions and conflicts between humans and Synthoids. Having too high of a chaos level can make contracts and operations harder.</span>
        </p><br />
        <br />
        <p className="tooltip" style={{display: 'inline-block'}}>
            Bonus time: {convertTimeMsToTimeElapsedString(props.bladeburner.storedCycles/BladeburnerConstants.CyclesPerSecond*1000)}<br />
            <span className="tooltiptext">
                You gain bonus time while offline or when the game is inactive (e.g. when the tab is throttled by browser).
                Bonus time makes the Bladeburner mechanic progress faster, up to 5x the normal speed.
            </span>
        </p>
        <p>Skill Points: {formatNumber(props.bladeburner.skillPoints, 0)}</p><br />
        {StatsTable([
            ["Aug. Success Chance mult: ", formatNumber(props.player.bladeburner_success_chance_mult*100, 1) + "%"],
            ["Aug. Max Stamina mult: ", formatNumber(props.player.bladeburner_max_stamina_mult*100, 1) + "%"],
            ["Aug. Stamina Gain mult: ", formatNumber(props.player.bladeburner_stamina_gain_mult*100, 1) + "%"],
            ["Aug. Field Analysis mult: ", formatNumber(props.player.bladeburner_analysis_mult*100, 1) + "%"],
        ])}
        <br />
        <a onClick={openTravel} className="a-link-button" style={{display:"inline-block"}}>Travel</a>
        <a onClick={openFaction} className="a-link-button tooltip" style={{display:"inline-block"}}>
            <span className="tooltiptext">Apply to the Bladeburner Faction, or go to the faction page if you are already a member</span>
            Faction
        </a>
        <br />
        <br />
    </>);
}
