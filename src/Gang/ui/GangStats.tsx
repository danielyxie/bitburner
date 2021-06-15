import React, { useState, useEffect } from "react";

export function GangStats(props: IProps): React.ReactElement {
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        const id = setInterval(() => setRerender(old => !old), 1000);
        return () => clearInterval(id);
    }, []);


    return (<p id="gang-info" style="width: 70%;">
        <p class=" tooltip" style="display: inline-block;">
            Respect: 108.82214 (0.23534 / sec)
            <span class="tooltiptext">
                Represents the amount of respect your gang has from other gangs and criminal organizations. Your respect affects the amount of money your gang members will earn, and also determines how much reputation you are earning with your gang's corresponding Faction.
            </span>
        </p>
        <br />
        <p class=" tooltip" style="display: inline-block;">
            Wanted Level: 1.37503 (0.00002 / sec)
            <span class="tooltiptext">
                Represents how much the gang is wanted by law enforcement. The higher your gang's wanted level, the harder it will be for your gang members to make money and earn respect. Note that the minimum wanted level is 1.
            </span>
        </p>
        <br />
        <p class=" tooltip" style="display: inline-block;">
            Wanted Level Penalty: -1.25%
            <span class="tooltiptext">
                Penalty for respect and money gain rates due to Wanted Level
            </span>
        </p>
        <br />
        <div>
        <p style="display: inline-block;">
            Money gain rate: 
            <span class="money-gold samefont">
                $2.571k / sec
            </span>
        </p>
        </div>
        <br />
        <p class=" tooltip" style="display: inline-block;">
            Territory: 14.29%
            <span class="tooltiptext">
                The percentage of total territory your Gang controls
            </span>
        </p>
        <br />
        <div>
            <p style="display: inline-block;">
                Faction reputation: 
                <span class="reputation samefont">
                    28.677
                </span>
            </p>
        </div>
        <br />
        <p class=" tooltip" style="display: inline-block;">
            Bonus time: 1 hours 30 minutes 58 seconds
            <span class="tooltiptext">
                You gain bonus time while offline or when the game is inactive (e.g. when the tab is throttled by the browser). Bonus time makes the Gang mechanic progress faster, up to 5x the normal speed
            </span>
        </p>
        <br />
    </p>);
}



/*

var faction = Factions[this.facName];
var rep;
if (!(faction instanceof Faction)) {
    rep = "ERROR";
} else {
    rep = faction.playerReputation;
}
UIElems.gangInfo.appendChild(createElement("p", { 
    display: "inline-block",
    innerText: "Respect: " + numeralWrapper.formatRespect(this.respect) +
               " (" + numeralWrapper.formatRespect(5*this.respectGainRate) + " / sec)",
    tooltip: "Represents the amount of respect your gang has from other gangs and criminal " +
             "organizations. Your respect affects the amount of money " +
             "your gang members will earn, and also determines how much " +
             "reputation you are earning with your gang's corresponding Faction.",
}));
UIElems.gangInfo.appendChild(createElement("br"));

UIElems.gangInfo.appendChild(createElement("p", { 
    display: "inline-block",
    innerText: "Wanted Level: " + numeralWrapper.formatWanted(this.wanted) +
               " (" + numeralWrapper.formatWanted(5*this.wantedGainRate) + " / sec)",
    tooltip: "Represents how much the gang is wanted by law enforcement. The higher " +
             "your gang's wanted level, the harder it will be for your gang members " +
             "to make money and earn respect. Note that the minimum wanted level is 1.",
}));
UIElems.gangInfo.appendChild(createElement("br"));

var wantedPenalty = this.getWantedPenalty();
wantedPenalty = (1 - wantedPenalty) * 100;
UIElems.gangInfo.appendChild(createElement("p", { 
    display: "inline-block",
    innerText: `Wanted Level Penalty: -${formatNumber(wantedPenalty, 2)}%`,
    tooltip: "Penalty for respect and money gain rates due to Wanted Level",
}));
UIElems.gangInfo.appendChild(createElement("br"));

const d0 = createElement("div");
ReactDOM.render(<p style={{'display': 'inline-block'}}>Money gain rate: {MoneyRate(5 * this.moneyGainRate)}</p>, d0);
UIElems.gangInfo.appendChild(d0);
UIElems.gangInfo.appendChild(createElement("br"));

var territoryMult = AllGangs[this.facName].territory * 100;
let displayNumber;
if (territoryMult <= 0) {
    displayNumber = formatNumber(0, 2);
} else if (territoryMult >= 100) {
    displayNumber = formatNumber(100, 2);
} else {
    displayNumber = formatNumber(territoryMult, 2);
}
UIElems.gangInfo.appendChild(createElement("p", {  
    display: "inline-block",
    innerText: `Territory: ${formatNumber(displayNumber, 3)}%`,
    tooltip: "The percentage of total territory your Gang controls",
}));
UIElems.gangInfo.appendChild(createElement("br"));

const d1 = createElement("div");
ReactDOM.render(<p style={{'display': 'inline-block'}}>Faction reputation: {Reputation(rep)}</p>, d1);
UIElems.gangInfo.appendChild(d1);
UIElems.gangInfo.appendChild(createElement("br"));

const CyclesPerSecond = 1000 / Engine._idleSpeed;
if (this.storedCycles / CyclesPerSecond*1000 > 5000) {
    UIElems.gangInfo.appendChild(createElement("p", { 
        innerText: `Bonus time: ${convertTimeMsToTimeElapsedString(this.storedCycles / CyclesPerSecond*1000)}`,
        display: "inline-block",
        tooltip: "You gain bonus time while offline or when the game is inactive (e.g. when the tab is throttled by the browser). " +
                 "Bonus time makes the Gang mechanic progress faster, up to 5x the normal speed",
    }));
    UIElems.gangInfo.appendChild(createElement("br"));
}

const numMembers = this.members.length;
const respectCost = this.getRespectNeededToRecruitMember();

const btn = UIElems.gangRecruitMemberButton;
if (numMembers >= GangConstants.MaximumGangMembers) {
    btn.className = "a-link-button-inactive";
    UIElems.gangRecruitRequirementText.style.display = "inline-block";
    UIElems.gangRecruitRequirementText.innerHTML = "You have reached the maximum amount of gang members";
} else if (this.canRecruitMember()) {
    btn.className = "a-link-button";
    UIElems.gangRecruitRequirementText.style.display = "none";
} else {
    btn.className = "a-link-button-inactive";
    UIElems.gangRecruitRequirementText.style.display = "inline-block";
    UIElems.gangRecruitRequirementText.innerHTML = `${formatNumber(respectCost, 2)} respect needed to recruit next member`;
}

*/