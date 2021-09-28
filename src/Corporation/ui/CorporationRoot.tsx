// React Components for the Corporation UI's navigation tabs
// These are the tabs at the top of the UI that let you switch to different
// divisions, see an overview of your corporation, or create a new industry
import React, { useState, useEffect } from "react";
import { IIndustry } from "../IIndustry";
import { MainPanel } from "./MainPanel";
import { Industries } from "../IndustryData";
import { ExpandIndustryTab } from "./ExpandIndustryTab";
import { use } from "../../ui/Context";
import { Context } from "./Context";
import { Overview } from "./Overview";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export function CorporationRoot(): React.ReactElement {
  const player = use.Player();
  const corporation = player.corporation;
  if (corporation === null) return <></>;
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }
  const [divisionName, setDivisionName] = useState<string | number>("Overview");
  function handleChange(event: React.SyntheticEvent, tab: string | number): void {
    setDivisionName(tab);
  }
  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);

  const canExpand =
    Object.keys(Industries).filter(
      (industryType: string) =>
        corporation.divisions.find((division: IIndustry) => division.type === industryType) === undefined,
    ).length > 0;

  return (
    <Context.Corporation.Provider value={corporation}>
      <div className="cmpy-mgmt-container">
        <Tabs variant="fullWidth" value={divisionName} onChange={handleChange}>
          <Tab label={corporation.name} value={"Overview"} />
          {corporation.divisions.map((div) => (
            <Tab key={div.name} label={div.name} value={div.name} />
          ))}
          {canExpand && <Tab label={"Expand"} value={-1} />}
        </Tabs>
        {divisionName === "Overview" && <Overview rerender={rerender} />}
        {divisionName === -1 && <ExpandIndustryTab setDivisionName={setDivisionName} />}
        {typeof divisionName === "string" && divisionName !== "Overview" && (
          <MainPanel rerender={rerender} divisionName={divisionName + ""} />
        )}
      </div>
    </Context.Corporation.Provider>
  );
}
