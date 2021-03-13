import { BlackOperations } from "../BlackOperations";
/*
if (DomElems.actionsAndSkillsList == null || DomElems.actionsAndSkillsDesc == null) {
    throw new Error("Bladeburner.createBlackOpsContent called with either " +
                    "DomElems.actionsAndSkillsList or DomElems.actionsAndSkillsDesc = null");
}

DomElems.actionsAndSkillsDesc.innerHTML =
    "Black Operations (Black Ops) are special, one-time covert operations. " +
    "Each Black Op must be unlocked successively by completing " +
    "the one before it.<br><br>" +
    "<b>Your ultimate goal to climb through the ranks of Bladeburners is to complete " +
    "all of the Black Ops.</b><br><br>" +
    "Like normal operations, you may use a team for Black Ops. Failing " +
    "a black op will incur heavy HP and rank losses.";

// Put Black Operations in sequence of required rank
var blackops = [];
for (var blackopName in BlackOperations) {
    if (BlackOperations.hasOwnProperty(blackopName)) {
        blackops.push(BlackOperations[blackopName]);
    }
}
blackops.sort(function(a, b) {
    return (a.reqdRank - b.reqdRank);
});

for (var i = blackops.length-1; i >= 0 ; --i) {
  if (this.blackops[[blackops[i].name]] == null && i !== 0 && this.blackops[[blackops[i-1].name]] == null) {continue;} // If this one nor the next are completed then this isn't unlocked yet.
    DomElems.blackops[blackops[i].name] = createElement("div", {
        class:"bladeburner-action", name:blackops[i].name
    });
    DomElems.actionsAndSkillsList.appendChild(DomElems.blackops[blackops[i].name]);
}
*/



import * as React from "react";

export function BlackOperationsPage(inst: any): React.ReactElement {
    // Put Black Operations in sequence of required rank
    const blackops = [];
    for (const name in BlackOperations) {
        if (BlackOperations.hasOwnProperty(name)) {
            blackops.push(BlackOperations[name]);
        }
    }
    blackops.sort(function(a, b) {
        return (a.reqdRank - b.reqdRank);
    });

    return (<div>
        <p>
            Black Operations (Black Ops) are special, one-time covert operations. Each Black Op must be unlocked successively by completing the one before it.<br /><br />
        <b>Your ultimate goal to climb through the ranks of Bladeburners is to complete all of the Black Ops.</b><br /><br />
        Like normal operations, you may use a team for Black Ops. Failing a black op will incur heavy HP and rank losses.</p>
        {blackops.map( op =>
            <div className="bladeburner-action">
            </div>
        )}
    </div>)
}
