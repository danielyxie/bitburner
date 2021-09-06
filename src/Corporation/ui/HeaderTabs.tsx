// React Components for the Corporation UI's navigation tabs
// These are the tabs at the top of the UI that let you switch to different
// divisions, see an overview of your corporation, or create a new industry
import React, { useState } from "react";
import { HeaderTab } from "./HeaderTab";
import { IIndustry } from "../IIndustry";
import { NewIndustryPopup } from "./NewIndustryPopup";
import { createPopup } from "../../ui/React/createPopup";
import { ICorporation } from "../ICorporation";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { MainPanel } from "./MainPanel";

interface IProps {
  corp: ICorporation;
  player: IPlayer;
}

export function HeaderTabs(props: IProps): React.ReactElement {
  const [divisionName, setDivisionName] = useState("Overview");

  function openNewIndustryPopup(): void {
    const popupId = "cmpy-mgmt-expand-industry-popup";
    createPopup(popupId, NewIndustryPopup, {
      corp: props.corp,
      setDivisionName: setDivisionName,
      popupId: popupId,
    });
  }

  return (
    <>
      <div>
        <HeaderTab
          current={divisionName === "Overview"}
          key={"overview"}
          onClick={() => setDivisionName("Overview")}
          text={props.corp.name}
        />
        {props.corp.divisions.map((division: IIndustry) => (
          <HeaderTab
            current={division.name === divisionName}
            key={division.name}
            onClick={() => setDivisionName(division.name)}
            text={division.name}
          />
        ))}
        <HeaderTab
          current={false}
          onClick={openNewIndustryPopup}
          text={"Expand into new Industry"}
        />
      </div>
      <MainPanel
        corp={props.corp}
        divisionName={divisionName}
        player={props.player}
      />
    </>
  );
}
