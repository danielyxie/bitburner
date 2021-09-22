import React, { useEffect } from "react";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { removePopup } from "../../ui/React/createPopup";
import { IndustryResearchTrees } from "../IndustryData";
import { CorporationConstants } from "../data/Constants";
import { Treant } from "treant-js";
import { IIndustry } from "../IIndustry";
import { Research } from "../Actions";

interface IProps {
  industry: IIndustry;
  popupId: string;
}

// Create the Research Tree UI for this Industry
export function ResearchPopup(props: IProps): React.ReactElement {
  const researchTree = IndustryResearchTrees[props.industry.type];
  if (researchTree === undefined) return <></>;
  useEffect(() => {
    {
      const boxContent = document.getElementById(`${props.popupId}-content`);
      if (boxContent != null) {
        boxContent.style.minHeight = "80vh";
      }
    }

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

      // Get the DOM Element to add a click listener to it
      const sanitizedName = allResearch[i].replace(/\s/g, "");
      const div = document.getElementById(sanitizedName + "-corp-research-click-listener");
      if (div == null) {
        console.warn(`Could not find Research Tree div for ${sanitizedName}`);
        continue;
      }

      div.addEventListener("click", () => {
        try {
          Research(props.industry, allResearch[i]);
        } catch (err) {
          dialogBoxCreate(err + "");
          return;
        }

        dialogBoxCreate(
          `Researched ${allResearch[i]}. It may take a market cycle ` +
            `(~${CorporationConstants.SecsPerMarketCycle} seconds) before the effects of ` +
            `the Research apply.`,
        );
        removePopup(props.popupId);
      });
    }
  });

  return (
    <div id={props.popupId}>
      <div>
        Research points: {props.industry.sciResearch.qty}
        <br />
        Multipliers from research:
        <br />* Advertising Multiplier: x{researchTree.getAdvertisingMultiplier()}
        <br />* Employee Charisma Multiplier: x{researchTree.getEmployeeChaMultiplier()}
        <br />* Employee Creativity Multiplier: x{researchTree.getEmployeeCreMultiplier()}
        <br />* Employee Efficiency Multiplier: x{researchTree.getEmployeeEffMultiplier()}
        <br />* Employee Intelligence Multiplier: x{researchTree.getEmployeeIntMultiplier()}
        <br />* Production Multiplier: x{researchTree.getProductionMultiplier()}
        <br />* Sales Multiplier: x{researchTree.getSalesMultiplier()}
        <br />* Scientific Research Multiplier: x{researchTree.getScientificResearchMultiplier()}
        <br />* Storage Multiplier: x{researchTree.getStorageMultiplier()}
      </div>
    </div>
  );
}
