import { Programs }             from "./Programs";

import { CONSTANTS }            from "../Constants";
import { Player }               from "../Player";
import { createElement }        from "../../utils/uiHelpers/createElement";

// this has the same key as 'Programs', not program names
const aLinks = {};

function displayCreateProgramContent() {
    for(const key in aLinks) {
        const p = Programs[key]
        aLinks[key].style.display = "none";
        if(!Player.hasProgram(p.name) && p.create.req(Player)){
            aLinks[key].style.display = "inline-block";
        }
    }
}

//Returns the number of programs that are currently available to be created
function getNumAvailableCreateProgram() {
    var count = 0;
    for (const key in Programs) {
        // Non-creatable program
        if (Programs[key].create == null) {
            continue;
        }

        // Already has program
        if (Player.hasProgram(Programs[key].name)) {
            continue;
        }

        // Does not meet requirements
        if (!Programs[key].create.req(Player)) {
            continue;
        }

        count++;
    }

    if (Player.firstProgramAvailable === false && count > 0) {
        Player.firstProgramAvailable = true;
        document.getElementById("create-program-tab").style.display = "list-item";
        document.getElementById("hacking-menu-header").click();
        document.getElementById("hacking-menu-header").click();
    }
    return count;
}

function initCreateProgramButtons() {
    const createProgramList = document.getElementById("create-program-list");
    for (const key in Programs) {
        if(Programs[key].create === null) {
            continue;
        }
        const elem = createElement("a", {
            class: "a-link-button", id: Programs[key].htmlID(), innerText: Programs[key].name,
            tooltip: Programs[key].create.tooltip,
        });
        aLinks[key] = elem;
        createProgramList.appendChild(elem);
    }

    for (const key in aLinks) {
        const p = Programs[key]
        aLinks[key].addEventListener("click", function() {
            Player.startCreateProgramWork(p.name, p.create.time, p.create.level);
            return false;
        });
    }
}

export {displayCreateProgramContent, getNumAvailableCreateProgram,
        initCreateProgramButtons};
