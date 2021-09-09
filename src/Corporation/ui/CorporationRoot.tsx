// React Components for the Corporation UI's navigation tabs
// These are the tabs at the top of the UI that let you switch to different
// divisions, see an overview of your corporation, or create a new industry
import React, { useState, useEffect } from "react";
import { HeaderTab } from "./HeaderTab";
import { IIndustry } from "../IIndustry";
import { NewIndustryPopup } from "./NewIndustryPopup";
import { createPopup } from "../../ui/React/createPopup";
import { ICorporation } from "../ICorporation";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { MainPanel } from "./MainPanel";
import { Industries } from "../IndustryData";

interface IExpandButtonProps {
  corp: ICorporation;
  setDivisionName: (name: string) => void;
}

function ExpandButton(props: IExpandButtonProps): React.ReactElement {
  const allIndustries = Object.keys(Industries).sort();
  const possibleIndustries = allIndustries
    .filter(
      (industryType: string) => props.corp.divisions.find((division: IIndustry) => division.type === industryType) === undefined,
    )
    .sort();
  if (possibleIndustries.length === 0) return <></>;

  function openNewIndustryPopup(): void {
    const popupId = "cmpy-mgmt-expand-industry-popup";
    createPopup(popupId, NewIndustryPopup, {
      corp: props.corp,
      setDivisionName: props.setDivisionName,
      popupId: popupId,
    });
  }

  return <HeaderTab current={false} onClick={openNewIndustryPopup} text={"Expand into new Industry"} />;
}

interface IProps {
  corp: ICorporation;
  player: IPlayer;
}

export function CorporationRoot(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }
  const [divisionName, setDivisionName] = useState("Overview");

  useEffect(() => {
    const id = setInterval(rerender, 150);
    return () => clearInterval(id);
  }, []);

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
        <ExpandButton corp={props.corp} setDivisionName={setDivisionName} />
      </div>
      <MainPanel rerender={rerender} corp={props.corp} divisionName={divisionName} player={props.player} />
    </>
  );
}
