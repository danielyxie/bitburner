import React, { useEffect } from "react";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { createElement } from "../../../utils/uiHelpers/createElement";
import { removePopup } from "../../ui/React/createPopup";
import { IndustryResearchTrees } from "../IndustryData";
import { CorporationConstants } from "../data/Constants";
import { ResearchMap } from "../ResearchMap";
import { Treant } from "treant-js";
import { IIndustry } from "../IIndustry";

interface IProps {
  industry: IIndustry;
  popupId: string;
}

// Create the Research Tree UI for this Industry
export function ResearchPopup(props: IProps): React.ReactElement {
  useEffect(() => {
    {
      const boxContent = document.getElementById(`${props.popupId}-content`);
      if (boxContent != null) {
        boxContent.style.minHeight = "80vh";
      }
    }
    const researchTree = IndustryResearchTrees[props.industry.type];
    if (researchTree === undefined) return;

    // Get the tree's markup (i.e. config) for Treant
    const markup = researchTree.createTreantMarkup();
    markup.chart.container = "#" + props.popupId + "-content";
    markup.chart.nodeAlign = "BOTTOM";
    markup.chart.rootOrientation = "WEST";
    markup.chart.siblingSeparation = 40;
    markup.chart.connectors = {
      type: "step",
      style: {
        "arrow-end": "block-wide-long",
        stroke: "white",
        "stroke-width": 2,
      },
    };

    Treant(markup);

    // Add Event Listeners for all Nodes
    const allResearch = researchTree.getAllNodes();
    for (let i = 0; i < allResearch.length; ++i) {
      // If this is already Researched, skip it
      if (props.industry.researched[allResearch[i]] === true) {
        continue;
      }

      // Get the Research object
      const research = ResearchMap[allResearch[i]];

      // Get the DOM Element to add a click listener to it
      const sanitizedName = allResearch[i].replace(/\s/g, "");
      const div = document.getElementById(
        sanitizedName + "-corp-research-click-listener",
      );
      if (div == null) {
        console.warn(`Could not find Research Tree div for ${sanitizedName}`);
        continue;
      }

      div.addEventListener("click", () => {
        if (props.industry.sciResearch.qty >= research.cost) {
          props.industry.sciResearch.qty -= research.cost;

          // Get the Node from the Research Tree and set its 'researched' property
          researchTree.research(allResearch[i]);
          props.industry.researched[allResearch[i]] = true;

          dialogBoxCreate(
            `Researched ${allResearch[i]}. It may take a market cycle ` +
              `(~${CorporationConstants.SecsPerMarketCycle} seconds) before the effects of ` +
              `the Research apply.`,
          );
          removePopup(props.popupId);
        } else {
          dialogBoxCreate(
            `You do not have enough Scientific Research for ${research.name}`,
          );
        }
      });
    }

    const boxContent = document.getElementById(`${props.popupId}-content`);
    if (boxContent != null) {
      // Add information about multipliers from research at the bottom of the popup
      //appendLineBreaks(boxContent, 2);
      boxContent.appendChild(
        createElement("pre", {
          display: "block",
          innerText:
            `Multipliers from research:\n` +
            ` * Advertising Multiplier: x${researchTree.getAdvertisingMultiplier()}\n` +
            ` * Employee Charisma Multiplier: x${researchTree.getEmployeeChaMultiplier()}\n` +
            ` * Employee Creativity Multiplier: x${researchTree.getEmployeeCreMultiplier()}\n` +
            ` * Employee Efficiency Multiplier: x${researchTree.getEmployeeEffMultiplier()}\n` +
            ` * Employee Intelligence Multiplier: x${researchTree.getEmployeeIntMultiplier()}\n` +
            ` * Production Multiplier: x${researchTree.getProductionMultiplier()}\n` +
            ` * Sales Multiplier: x${researchTree.getSalesMultiplier()}\n` +
            ` * Scientific Research Multiplier: x${researchTree.getScientificResearchMultiplier()}\n` +
            ` * Storage Multiplier: x${researchTree.getStorageMultiplier()}`,
        }),
      );
    }
  });

  return (
    <div id={props.popupId}>
      <div id={props.popupId + "outer-box"}></div>
    </div>
  );
}
